import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const conversationsTable = process.env.CONVERSATIONS_TABLE;
    const messagesTable = process.env.MESSAGES_TABLE;

    if (!conversationsTable || !messagesTable) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Configuration missing" }),
      };
    }

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
    const message = {
      id: randomUUID(),
      conversationId: id,
      content,
      senderId,
      senderName,
      senderRole: senderRole || "user",
      timestamp: now,
      read: false,
    };

    // Save message to messages table
    const putCommand = new PutCommand({
      TableName: messagesTable,
      Item: message,
    });

    await docClient.send(putCommand);

    // Update conversation's updatedAt and increment messageCount
    const updateCommand = new UpdateCommand({
      TableName: conversationsTable,
      Key: { id },
      UpdateExpression:
        "SET updatedAt = :updatedAt, messageCount = messageCount + :inc",
      ExpressionAttributeValues: {
        ":updatedAt": now,
        ":inc": 1,
      },
    });

    await docClient.send(updateCommand);

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
