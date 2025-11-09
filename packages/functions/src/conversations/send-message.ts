import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { randomUUID } from "crypto";
import { queryOne, getClient } from "../db.js";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Conversation ID is required" }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is required" }),
      };
    }

    const { content, senderId, senderName, senderRole } = JSON.parse(
      event.body
    );

    if (!content || !senderId || !senderName) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing required fields: content, senderId, and senderName",
        }),
      };
    }

    const now = Date.now();
    const messageId = randomUUID();

    // Use a transaction to insert message and update conversation atomically
    const client = await getClient();

    try {
      await client.query("BEGIN");

      // Insert message
      const insertMessageSql = `
        INSERT INTO messages (
          id, conversation_id, content, sender_id, sender_name, sender_role, timestamp, read
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

      const messageResult = await client.query(insertMessageSql, [
        messageId,
        id,
        content,
        senderId,
        senderName,
        senderRole || "user",
        now,
        false,
      ]);

      const message = messageResult.rows[0];

      // Update conversation's updated_at and increment message_count
      const updateConversationSql = `
        UPDATE conversations 
        SET updated_at = $1, message_count = message_count + 1
        WHERE id = $2
      `;

      await client.query(updateConversationSql, [now, id]);

      await client.query("COMMIT");

      return {
        statusCode: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Message sent successfully",
          data: message,
        }),
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to send message",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
