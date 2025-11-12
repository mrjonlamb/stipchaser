import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { getDb } from "../db";
import {
  verifyToken,
  getUserFromToken,
  isDealerManager,
  isDealerStaff,
  unauthorizedResponse,
  forbiddenResponse,
} from "../auth/auth";
import { randomUUID } from "crypto";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const USER_POOL_ID = process.env.USER_POOL_ID!;

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  console.log("Invite user event:", JSON.stringify(event, null, 2));

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

    // Parse request body
    const body = JSON.parse(event.body || "{}");
    const { email, role, firstName, lastName } = body;

    if (!email || !role) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Email and role are required" }),
      };
    }

    // Check permissions
    // Dealer Managers can invite Staff and Consumers
    // Dealer Staff can only invite Consumers
    if (role === "DealerManager") {
      if (!isDealerManager(authUser)) {
        return forbiddenResponse(
          "Only Dealer Managers can invite other Managers"
        );
      }
    } else if (role === "DealerStaff") {
      if (!isDealerManager(authUser)) {
        return forbiddenResponse("Only Dealer Managers can invite Staff");
      }
    } else if (role === "Consumer") {
      if (!isDealerStaff(authUser) && !isDealerManager(authUser)) {
        return forbiddenResponse(
          "Only Dealer Managers and Staff can invite Consumers"
        );
      }
    } else {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error:
            "Invalid role. Must be DealerManager, DealerStaff, or Consumer",
        }),
      };
    }

    // Check if user already exists in database
    const existingUserResult = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUserResult.rows.length > 0) {
      return {
        statusCode: 409,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "User with this email already exists" }),
      };
    }

    // Create user in Cognito
    const username = email;
    const fullName = `${firstName || ""} ${lastName || ""}`.trim();

    try {
      // Create user with temporary password
      const createUserCommand = new AdminCreateUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: username,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "email_verified", Value: "true" },
          { Name: "custom:role", Value: role },
          { Name: "custom:dealership_id", Value: user.dealership_id },
          ...(fullName ? [{ Name: "name", Value: fullName }] : []),
        ],
        DesiredDeliveryMediums: ["EMAIL"],
        MessageAction: "SUPPRESS", // We'll send our own invitation email
      });

      const createUserResponse = await cognitoClient.send(createUserCommand);
      const cognitoUserId = createUserResponse.User?.Username;

      if (!cognitoUserId) {
        throw new Error("Failed to create user in Cognito");
      }

      // Add user to appropriate group
      const addToGroupCommand = new AdminAddUserToGroupCommand({
        UserPoolId: USER_POOL_ID,
        Username: cognitoUserId,
        GroupName: role,
      });

      await cognitoClient.send(addToGroupCommand);

      // Create user record in database
      const userId = randomUUID();
      const now = Date.now();

      await db.query(
        `INSERT INTO users (id, cognito_user_id, email, role, dealership_id, invited_by, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          userId,
          cognitoUserId,
          email,
          role,
          user.dealership_id,
          user.id,
          "pending",
          now,
          now,
        ]
      );

      // TODO: Send invitation email with link to set password
      // For now, Cognito will send the temporary password email

      return {
        statusCode: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "User invited successfully",
          user: {
            id: userId,
            email,
            role,
            status: "pending",
          },
        }),
      };
    } catch (cognitoError: any) {
      console.error("Cognito error:", cognitoError);

      if (cognitoError.name === "UsernameExistsException") {
        return {
          statusCode: 409,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            error: "User with this email already exists in Cognito",
          }),
        };
      }

      throw cognitoError;
    }
  } catch (error) {
    console.error("Error inviting user:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Failed to invite user" }),
    };
  }
}
