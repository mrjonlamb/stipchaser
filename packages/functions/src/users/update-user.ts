import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
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
  console.log("Update user event:", JSON.stringify(event, null, 2));

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

    // Only Dealer Managers can update users
    if (!isDealerManager(authUser)) {
      return forbiddenResponse("Only Dealer Managers can update users");
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

    // Parse request body
    const body = JSON.parse(event.body || "{}");
    const { status, role } = body;

    // Get the user to update
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
      return forbiddenResponse("Cannot update users from other dealerships");
    }

    const now = Date.now();
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Update status
    if (status) {
      updates.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;

      // Update Cognito user status
      try {
        if (status === "active") {
          const enableCommand = new AdminEnableUserCommand({
            UserPoolId: USER_POOL_ID,
            Username: targetUser.cognito_user_id,
          });
          await cognitoClient.send(enableCommand);
        } else if (status === "inactive") {
          const disableCommand = new AdminDisableUserCommand({
            UserPoolId: USER_POOL_ID,
            Username: targetUser.cognito_user_id,
          });
          await cognitoClient.send(disableCommand);
        }
      } catch (cognitoError) {
        console.error("Error updating Cognito user status:", cognitoError);
      }
    }

    // Update role (if provided)
    if (role && role !== targetUser.role) {
      updates.push(`role = $${paramIndex}`);
      params.push(role);
      paramIndex++;

      // Update custom attribute in Cognito
      try {
        const updateAttributesCommand = new AdminUpdateUserAttributesCommand({
          UserPoolId: USER_POOL_ID,
          Username: targetUser.cognito_user_id,
          UserAttributes: [{ Name: "custom:role", Value: role }],
        });
        await cognitoClient.send(updateAttributesCommand);
      } catch (cognitoError) {
        console.error("Error updating Cognito user attributes:", cognitoError);
      }
    }

    if (updates.length === 0) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "No valid updates provided" }),
      };
    }

    // Add updated_at timestamp
    updates.push(`updated_at = $${paramIndex}`);
    params.push(now);
    paramIndex++;

    // Add userId to params for WHERE clause
    params.push(userId);

    // Update database
    const query = `
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query(query, params);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "User updated successfully",
        user: {
          id: result.rows[0].id,
          email: result.rows[0].email,
          role: result.rows[0].role,
          status: result.rows[0].status,
          updatedAt: result.rows[0].updated_at,
        },
      }),
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Failed to update user" }),
    };
  }
}
