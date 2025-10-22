import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
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

    const { id } = event.pathParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Deal ID is required" }),
      };
    }

    const command = new DeleteCommand({
      TableName: tableName,
      Key: { id },
      ReturnValues: "ALL_OLD",
    });

    const response = await docClient.send(command);

    if (!response.Attributes) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Deal not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Deal deleted successfully",
        deal: response.Attributes,
      }),
    };
  } catch (error) {
    console.error("Error deleting deal:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to delete deal",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
