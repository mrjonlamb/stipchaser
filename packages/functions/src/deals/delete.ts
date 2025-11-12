import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getDb } from "../db";
import {
  verifyToken,
  getUserFromToken,
  unauthorizedResponse,
  isDealerManager,
  forbiddenResponse,
  verifyDealershipAccess,
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

    // Only Dealer Managers can delete deals
    if (!isDealerManager(authUser)) {
      return forbiddenResponse("Only Dealer Managers can delete deals");
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

    // First check if deal exists and belongs to same dealership
    const checkResult = await db.query(
      "SELECT dealership_id FROM deals WHERE id = $1",
      [id]
    );
    if (checkResult.rows.length === 0) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Deal not found" }),
      };
    }

    if (!verifyDealershipAccess(authUser, checkResult.rows[0].dealership_id)) {
      return forbiddenResponse("Cannot delete deals from other dealerships");
    }

    const sql = "DELETE FROM deals WHERE id = $1 RETURNING *";
    const result = await db.query(sql, [id]);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Deal deleted successfully",
        deal: result.rows[0],
      }),
    };
  } catch (error) {
    console.error("Error deleting deal:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Failed to delete deal",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
}
