import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { query } from "../db.js";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const { dealId } = event.queryStringParameters || {};

    let sql: string;
    let params: any[] = [];

    if (dealId) {
      // Query conversations by dealId
      sql = `
        SELECT * FROM conversations 
        WHERE deal_id = $1 
        ORDER BY updated_at DESC
      `;
      params = [dealId];
    } else {
      // Get all conversations
      sql = `
        SELECT * FROM conversations 
        ORDER BY updated_at DESC
      `;
    }

    const conversations = await query(sql, params);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        conversations,
        count: conversations.length,
      }),
    };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to fetch conversations",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
