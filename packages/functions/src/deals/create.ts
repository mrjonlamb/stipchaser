import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const tableName = process.env.DEALS_TABLE;

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
    const deal = {
      id: randomUUID(),
      ...dealData,
      status: dealData.status || "pending",
      priority: dealData.priority || "medium",
      pendingDocuments: dealData.pendingDocuments || 0,
      createdAt: now,
      updatedAt: now,
    };

    const command = new PutCommand({
      TableName: tableName,
      Item: deal,
    });

    await docClient.send(command);

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
