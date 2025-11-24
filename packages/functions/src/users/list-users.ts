import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getDb } from "../db";
import {
  verifyToken,
  getUserFromToken,
  unauthorizedResponse,
  getDealershipFilter,
} from "../auth/auth";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  console.log("List users event:", JSON.stringify(event, null, 2));

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

    // Get query parameters for filtering
    const roleFilter = event.queryStringParameters?.role;
    const statusFilter = event.queryStringParameters?.status;

    // Build query with dealership filter
    let query = `
      SELECT 
        u.id,
        u.cognito_user_id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone_number,
        u.role,
        u.status,
        u.created_at,
        u.updated_at,
        inviter.email as invited_by_email
      FROM users u
      LEFT JOIN users inviter ON u.invited_by = inviter.id
      WHERE u.dealership_id = $1
    `;

    const params: any[] = [user.dealership_id];
    let paramIndex = 2;

    if (roleFilter) {
      query += ` AND u.role = $${paramIndex}`;
      params.push(roleFilter);
      paramIndex++;
    }

    if (statusFilter) {
      query += ` AND u.status = $${paramIndex}`;
      params.push(statusFilter);
      paramIndex++;
    }

    query += ` ORDER BY u.created_at DESC`;

    const result = await db.query(query, params);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        users: result.rows.map((row) => ({
          id: row.id,
          email: row.email,
          firstName: row.first_name,
          lastName: row.last_name,
          phoneNumber: row.phone_number,
          role: row.role,
          status: row.status,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          invitedBy: row.invited_by_email,
        })),
        count: result.rows.length,
      }),
    };
  } catch (error) {
    console.error("Error listing users:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Failed to list users" }),
    };
  }
}
