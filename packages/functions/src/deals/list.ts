import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

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

    const { status, customerId } = event.queryStringParameters || {};

    let command;

    if (status) {
      // Query by status using GSI
      command = new QueryCommand({
        TableName: tableName,
        IndexName: "statusIndex",
        KeyConditionExpression: "#status = :status",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": status,
        },
        ScanIndexForward: false, // Sort by createdAt descending
      });
    } else if (customerId) {
      // Query by customerId using GSI
      command = new QueryCommand({
        TableName: tableName,
        IndexName: "customerIndex",
        KeyConditionExpression: "customerId = :customerId",
        ExpressionAttributeValues: {
          ":customerId": customerId,
        },
        ScanIndexForward: false,
      });
    } else {
      // Scan all deals
      command = new ScanCommand({
        TableName: tableName,
      });
    }

    const response = await docClient.send(command);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        deals: response.Items || [],
        count: response.Count || 0,
      }),
    };
  } catch (error) {
    console.error("Error fetching deals:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to fetch deals",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
