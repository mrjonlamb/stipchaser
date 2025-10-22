import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const tableName = process.env.CONVERSATIONS_TABLE;

    if (!tableName) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Table name not configured" }),
      };
    }

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
    const conversation = {
      id: randomUUID(),
      dealId,
      participants,
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
    };

    const command = new PutCommand({
      TableName: tableName,
      Item: conversation,
    });

    await docClient.send(command);

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
