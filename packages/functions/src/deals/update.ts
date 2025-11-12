import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getDb } from "../db";
import {
  verifyToken,
  getUserFromToken,
  unauthorizedResponse,
  isDealerStaff,
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

    // Only Dealer Staff and Managers can update deals
    if (!isDealerStaff(authUser)) {
      return forbiddenResponse(
        "Only Dealer Managers and Staff can update deals"
      );
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

    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Request body is required" }),
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
      return forbiddenResponse("Cannot update deals from other dealerships");
    }

    const updates = JSON.parse(event.body);

    // Build update query dynamically
    const setClauses: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Mapping of JSON keys to database columns
    const columnMapping: Record<string, string> = {
      customerId: "customer_id",
      pendingDocuments: "pending_documents",
      updatedAt: "updated_at",
    };

    Object.keys(updates).forEach((key) => {
      if (key !== "id") {
        // Don't allow updating the id
        const columnName = columnMapping[key] || key;

        // Handle JSON fields
        if (key === "customer" || key === "vehicle") {
          setClauses.push(`${columnName} = $${paramIndex}::jsonb`);
          params.push(JSON.stringify(updates[key]));
        } else {
          setClauses.push(`${columnName} = $${paramIndex}`);
          params.push(updates[key]);
        }
        paramIndex++;
      }
    });

    // Always update the updated_at timestamp
    setClauses.push(`updated_at = $${paramIndex}`);
    params.push(Date.now());
    paramIndex++;

    // Add id parameter for WHERE clause
    params.push(id);

    const sql = `
      UPDATE deals 
      SET ${setClauses.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query(sql, params);

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

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Deal updated successfully",
        deal: result.rows[0],
      }),
    };
  } catch (error) {
    console.error("Error updating deal:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Failed to update deal",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
}
