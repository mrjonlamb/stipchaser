import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { randomUUID } from "crypto";
import { queryOne } from "../db.js";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is required" }),
      };
    }

    const dealData = JSON.parse(event.body);

    // Validate required fields
    if (!dealData.customer || !dealData.vehicle) {
      return {
        statusCode: 400,
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
        id, customer_id, customer, vehicle, status, priority, 
        pending_documents, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const params = [
      id,
      dealData.customerId || null,
      JSON.stringify(dealData.customer),
      JSON.stringify(dealData.vehicle),
      status,
      priority,
      pendingDocuments,
      now,
      now,
    ];

    const deal = await queryOne(sql, params);

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Deal created successfully",
        deal,
      }),
    };
  } catch (error) {
    console.error("Error creating deal:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to create deal",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
