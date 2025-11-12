import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getDb } from "../db";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  console.log("Accept invitation event:", JSON.stringify(event, null, 2));

  try {
    // Parse request body
    const body = JSON.parse(event.body || "{}");
    const { email, cognitoUserId } = body;

    if (!email || !cognitoUserId) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Email and Cognito user ID are required",
        }),
      };
    }

    const db = getDb();

    // Update user status to active
    const result = await db.query(
      `UPDATE users
       SET status = $1, updated_at = $2
       WHERE email = $3 AND cognito_user_id = $4
       RETURNING *`,
      ["active", Date.now(), email, cognitoUserId]
    );

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    const user = result.rows[0];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Invitation accepted successfully",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      }),
    };
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Failed to accept invitation" }),
    };
  }
}
