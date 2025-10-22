import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  DeleteCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const s3Client = new S3Client({});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const tableName = process.env.DOCUMENTS_TABLE;
    const bucketName = process.env.DOCUMENTS_BUCKET;

    if (!tableName || !bucketName) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Configuration missing" }),
      };
    }

    const { id } = event.pathParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Document ID is required" }),
      };
    }

    // Get document metadata to retrieve S3 key
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: { id },
    });

    const getResponse = await docClient.send(getCommand);

    if (!getResponse.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Document not found" }),
      };
    }

    const document = getResponse.Item;

    // Delete from S3
    const deleteS3Command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: document.s3Key,
    });

    await s3Client.send(deleteS3Command);

    // Delete from DynamoDB
    const deleteDynamoCommand = new DeleteCommand({
      TableName: tableName,
      Key: { id },
    });

    await docClient.send(deleteDynamoCommand);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Document deleted successfully",
        document,
      }),
    };
  } catch (error) {
    console.error("Error deleting document:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to delete document",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
