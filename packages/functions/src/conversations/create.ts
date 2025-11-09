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

    const { dealId, participants } = JSON.parse(event.body);

    if (!dealId || !participants) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing required fields: dealId and participants",
        }),
      };
    }

    const now = Date.now();
    const id = randomUUID();

    const sql = `
      INSERT INTO conversations (
        id, deal_id, participants, created_at, updated_at, message_count
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const params = [id, dealId, JSON.stringify(participants), now, now, 0];

    const conversation = await queryOne(sql, params);

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Conversation created successfully",
        conversation,
      }),
    };
  } catch (error) {
    console.error("Error creating conversation:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to create conversation",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
