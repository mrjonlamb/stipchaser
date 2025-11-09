import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { query } from "../db.js";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const { dealId } = event.queryStringParameters || {};

    let sql: string;
    let params: any[] = [];

    if (dealId) {
      // Query documents by dealId
      sql = `
        SELECT * FROM documents 
        WHERE deal_id = $1 
        ORDER BY uploaded_at DESC
      `;
      params = [dealId];
    } else {
      // Get all documents
      sql = `
        SELECT * FROM documents 
        ORDER BY uploaded_at DESC
      `;
    }

    const documents = await query(sql, params);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        documents,
        count: documents.length,
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
