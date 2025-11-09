import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { queryOne } from "../db.js";

const s3Client = new S3Client({});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const bucketName = process.env.DOCUMENTS_BUCKET;

    if (!bucketName) {
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

    // Get document metadata from PostgreSQL
    const sql = "SELECT * FROM documents WHERE id = $1";
    const document = await queryOne(sql, [id]);

    if (!document) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Document not found" }),
      };
    }

    // Generate presigned URL for download
    const getCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: document.s3_key,
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
