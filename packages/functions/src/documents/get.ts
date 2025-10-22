import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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

    // Get document metadata from DynamoDB
    const command = new GetCommand({
      TableName: tableName,
      Key: { id },
    });

    const response = await docClient.send(command);

    if (!response.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Document not found" }),
      };
    }

    const document = response.Item;

    // Generate presigned URL for download
    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: document.s3Key,
    });

    const downloadUrl = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 3600,
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        document,
        downloadUrl,
      }),
    };
  } catch (error) {
    console.error("Error fetching document:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to fetch document",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
