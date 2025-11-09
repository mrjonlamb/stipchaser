import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
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

    // Get document metadata to retrieve S3 key
    const selectSql = "SELECT * FROM documents WHERE id = $1";
    const document = await queryOne(selectSql, [id]);

    if (!document) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Document not found" }),
      };
    }

    // Delete from S3
    const deleteS3Command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: document.s3_key,
    });

    await s3Client.send(deleteS3Command);

    // Delete from PostgreSQL
    const deleteSql = "DELETE FROM documents WHERE id = $1";
    await queryOne(deleteSql, [id]);

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
