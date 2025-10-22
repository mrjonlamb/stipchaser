import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { randomUUID } from "crypto";

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

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body is required" }),
      };
    }

    const { dealId, fileName, fileType, category } = JSON.parse(event.body);

    if (!dealId || !fileName || !fileType) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing required fields: dealId, fileName, and fileType",
        }),
      };
    }

    const documentId = randomUUID();
    const s3Key = `${dealId}/${documentId}/${fileName}`;

    // Generate presigned URL for upload
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, putCommand, {
      expiresIn: 3600,
    });

    // Store document metadata in DynamoDB
    const now = Date.now();
    const document = {
      id: documentId,
      dealId,
      fileName,
      fileType,
      category: category || "general",
      s3Key,
      uploadedAt: now,
      status: "pending",
    };

    const command = new PutCommand({
      TableName: tableName,
      Item: document,
    });

    await docClient.send(command);

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Document upload initiated",
        document,
        uploadUrl,
      }),
    };
  } catch (error) {
    console.error("Error initiating document upload:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to initiate document upload",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
