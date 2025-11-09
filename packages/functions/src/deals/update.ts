import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { queryOne } from "../db.js";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Deal ID is required" }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is required" }),
      };
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

    const deal = await queryOne(sql, params);

    if (!deal) {
      return {
        statusCode: 404,
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
        deal,
      }),
    };
  } catch (error) {
    console.error("Error updating deal:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to update deal",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
