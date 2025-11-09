import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { query } from "../db.js";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Conversation ID is required" }),
      };
    }

    // Query messages by conversation_id
    const sql = `
      SELECT * FROM messages 
      WHERE conversation_id = $1 
      ORDER BY timestamp ASC
    `;

    const messages = await query(sql, [id]);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        messages,
        count: messages.length,
      }),
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to fetch messages",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
