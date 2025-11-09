import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { query } from "../db.js";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const { status, customerId } = event.queryStringParameters || {};

    let sql: string;
    let params: any[] = [];

    if (status) {
      // Query by status
      sql = `
        SELECT * FROM deals 
        WHERE status = $1 
        ORDER BY created_at DESC
      `;
      params = [status];
    } else if (customerId) {
      // Query by customerId
      sql = `
        SELECT * FROM deals 
        WHERE customer_id = $1 
        ORDER BY created_at DESC
      `;
      params = [customerId];
    } else {
      // Get all deals
      sql = `
        SELECT * FROM deals 
        ORDER BY created_at DESC
      `;
    }

    const deals = await query(sql, params);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        deals,
        count: deals.length,
      }),
    };
  } catch (error) {
    console.error("Error fetching deals:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to fetch deals",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
