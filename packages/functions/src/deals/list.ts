import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getDb } from "../db";
import {
  verifyToken,
  getUserFromToken,
  unauthorizedResponse,
} from "../auth/auth";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
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

    const { status, customerId } = event.queryStringParameters || {};

    let sql: string;
    let params: any[] = [user.dealership_id];
    let paramIndex = 2;

    // Base query with dealership filter
    sql = `SELECT * FROM deals WHERE dealership_id = $1`;

    if (status) {
      sql += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (customerId) {
      sql += ` AND customer_id = $${paramIndex}`;
      params.push(customerId);
      paramIndex++;
    }

    sql += ` ORDER BY created_at DESC`;

    const result = await db.query(sql, params);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        deals: result.rows,
        count: result.rows.length,
      }),
    };
  } catch (error) {
    console.error("Error fetching deals:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Failed to fetch deals",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
}
