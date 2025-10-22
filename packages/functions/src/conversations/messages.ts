import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const messagesTable = process.env.MESSAGES_TABLE;

    if (!messagesTable) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Table name not configured" }),
      };
    }

    const { id } = event.pathParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Conversation ID is required" }),
      };
    }

    // Query messages by conversationId
    const command = new QueryCommand({
      TableName: messagesTable,
      IndexName: "conversationIndex",
      KeyConditionExpression: "conversationId = :conversationId",
      ExpressionAttributeValues: {
        ":conversationId": id,
      },
      ScanIndexForward: true, // Sort by timestamp ascending (oldest first)
    });

    const response = await docClient.send(command);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        messages: response.Items || [],
        count: response.Count || 0,
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
