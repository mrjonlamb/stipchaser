import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getDb } from "../db";
import {
  verifyToken,
  getUserFromToken,
  unauthorizedResponse,
  verifyDealershipAccess,
  forbiddenResponse,
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

    const { id } = event.pathParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Deal ID is required" }),
      };
    }

    const sql = "SELECT * FROM deals WHERE id = $1";
    const result = await db.query(sql, [id]);

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Deal not found" }),
      };
    }

    const deal = result.rows[0];

    // Verify dealership access
    if (!verifyDealershipAccess(authUser, deal.dealership_id)) {
      return forbiddenResponse("Cannot access deals from other dealerships");
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        deal,
      }),
    };
  } catch (error) {
    console.error("Error fetching deal:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Failed to fetch deal",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
}
