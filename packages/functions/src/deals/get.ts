import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { queryOne } from "../db.js";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const { id } = event.pathParameters || {};

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Deal ID is required" }),
      };
    }

    const sql = "SELECT * FROM deals WHERE id = $1";
    const deal = await queryOne(sql, [id]);

    if (!deal) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Deal not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        deal,
      }),
    };
  } catch (error) {
    console.error("Error fetching deal:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to fetch deal",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
