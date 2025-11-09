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

    const sql = "DELETE FROM deals WHERE id = $1 RETURNING *";
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
        message: "Deal deleted successfully",
        deal,
      }),
    };
  } catch (error) {
    console.error("Error deleting deal:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to delete deal",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
