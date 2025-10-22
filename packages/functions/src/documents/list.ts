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
    const tableName = process.env.DOCUMENTS_TABLE;

    if (!tableName) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Table name not configured" }),
      };
    }

    const { dealId } = event.queryStringParameters || {};

    let command;

    if (dealId) {
      // Query documents by dealId
      command = new QueryCommand({
        TableName: tableName,
        IndexName: "dealIndex",
        KeyConditionExpression: "dealId = :dealId",
        ExpressionAttributeValues: {
          ":dealId": dealId,
        },
        ScanIndexForward: false, // Sort by uploadedAt descending
      });
    } else {
      // Scan all documents
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
        documents: response.Items || [],
        count: response.Count || 0,
      }),
    };
  } catch (error) {
    console.error("Error fetching documents:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to fetch documents",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
