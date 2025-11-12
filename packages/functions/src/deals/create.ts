import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { randomUUID } from "crypto";
import { getDb } from "../db";
import {
  verifyToken,
  getUserFromToken,
  unauthorizedResponse,
  isDealerStaff,
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

    // Only Dealer Staff and Managers can create deals
    if (!isDealerStaff(authUser)) {
      return forbiddenResponse(
        "Only Dealer Managers and Staff can create deals"
      );
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

    const dealData = JSON.parse(event.body);

    // Validate required fields
    if (!dealData.customer || !dealData.vehicle) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Missing required fields: customer and vehicle are required",
        }),
      };
    }

    const now = Date.now();
    const id = randomUUID();
    const status = dealData.status || "pending";
    const priority = dealData.priority || "medium";
    const pendingDocuments = dealData.pendingDocuments || 0;

    const sql = `
      INSERT INTO deals (
        id, dealership_id, customer_id, customer, vehicle, status, priority, 
        pending_documents, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const params = [
      id,
      user.dealership_id,
      dealData.customerId || null,
      JSON.stringify(dealData.customer),
      JSON.stringify(dealData.vehicle),
      status,
      priority,
      pendingDocuments,
      now,
      now,
    ];

    const result = await db.query(sql, params);

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Deal created successfully",
        deal: result.rows[0],
      }),
    };
  } catch (error) {
    console.error("Error creating deal:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Failed to create deal",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
}
