import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { getDb } from "../db";
import {
  verifyToken,
  getUserFromToken,
  isDealerManager,
  unauthorizedResponse,
  forbiddenResponse,
  verifyDealershipAccess,
} from "../auth/auth";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const USER_POOL_ID = process.env.USER_POOL_ID!;

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  console.log("Delete user event:", JSON.stringify(event, null, 2));

  try {
    // Verify authentication
    const authUser = await verifyToken(event);
    if (!authUser) {
      return unauthorizedResponse("Authentication required");
    }

    const db = getDb();
    const user = await getUserFromToken(authUser, db);
    if (!user) {
      return unauthorizedResponse("User not found in database");
    }

    // Only Dealer Managers can delete users
    if (!isDealerManager(authUser)) {
      return forbiddenResponse("Only Dealer Managers can delete users");
    }

    const userId = event.pathParameters?.id;
    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "User ID is required" }),
      };
    }

    // Get the user to delete
    const targetUserResult = await db.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    if (targetUserResult.rows.length === 0) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    const targetUser = targetUserResult.rows[0];

    // Verify dealership access
    if (!verifyDealershipAccess(authUser, targetUser.dealership_id)) {
      return forbiddenResponse("Cannot delete users from other dealerships");
    }

    // Prevent deleting yourself
    if (targetUser.cognito_user_id === authUser.userId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Cannot delete your own account" }),
      };
    }

    // Delete from Cognito first
    try {
      const deleteCommand = new AdminDeleteUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: targetUser.cognito_user_id,
      });
      await cognitoClient.send(deleteCommand);
    } catch (cognitoError: any) {
      console.error("Error deleting user from Cognito:", cognitoError);
      // Continue with database deletion even if Cognito fails
      if (cognitoError.name !== "UserNotFoundException") {
        console.error("Cognito deletion failed, but continuing...");
      }
    }

    // Delete from database
    await db.query("DELETE FROM users WHERE id = $1", [userId]);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "User deleted successfully",
      }),
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Failed to delete user" }),
    };
  }
}
