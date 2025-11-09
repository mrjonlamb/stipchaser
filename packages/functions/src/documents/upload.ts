import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { randomUUID } from "crypto";
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

    // Store document metadata in PostgreSQL
    const now = Date.now();
    const sql = `
      INSERT INTO documents (
        id, deal_id, file_name, file_type, category, s3_key, uploaded_at, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const params = [
      documentId,
      dealId,
      fileName,
      fileType,
      category || "general",
      s3Key,
      now,
      "pending",
    ];

    const document = await queryOne(sql, params);

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
