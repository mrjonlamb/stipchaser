import { CognitoJwtVerifier } from "aws-jwt-verify";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Pool } from "pg";

const USER_POOL_ID = process.env.USER_POOL_ID!;
const AWS_REGION = process.env.AWS_REGION || "us-east-1";

// Create JWT verifier for Cognito tokens
const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  tokenUse: "access",
  clientId: null, // Allow any client
});

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
  dealershipId: string;
  groups: string[];
}

/**
 * Verify and decode JWT token from Authorization header
 */
export async function verifyToken(
  event: APIGatewayProxyEvent
): Promise<AuthUser | null> {
  try {
    const authHeader =
      event.headers?.Authorization || event.headers?.authorization;
    if (!authHeader) {
      console.error("No Authorization header found");
      return null;
    }

    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      console.error("No token found in Authorization header");
      return null;
    }

    // Verify the token
    const payload = await verifier.verify(token);

    // Extract user information
    const userId = payload.sub;
    const email = payload.email as string;
    const groups = (payload["cognito:groups"] as string[]) || [];
    const role = (payload["custom:role"] as string) || "";
    const dealershipId = (payload["custom:dealership_id"] as string) || "";

    return {
      userId,
      email,
      role,
      dealershipId,
      groups,
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Get user details from database by Cognito user ID
 */
export async function getUserFromToken(
  authUser: AuthUser,
  db: Pool
): Promise<any | null> {
  try {
    const result = await db.query(
      `SELECT id, cognito_user_id, email, role, dealership_id, status
       FROM users
       WHERE cognito_user_id = $1`,
      [authUser.userId]
    );

    if (result.rows.length === 0) {
      console.error("User not found in database:", authUser.userId);
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error("Error fetching user from database:", error);
    return null;
  }
}

/**
 * Check if user has required role
 */
export function hasRole(authUser: AuthUser, allowedRoles: string[]): boolean {
  return (
    allowedRoles.includes(authUser.role) ||
    authUser.groups.some((group) => allowedRoles.includes(group))
  );
}

/**
 * Check if user is a Dealer Manager
 */
export function isDealerManager(authUser: AuthUser): boolean {
  return (
    authUser.role === "DealerManager" ||
    authUser.groups.includes("DealerManager")
  );
}

/**
 * Check if user is Dealer Staff or Manager
 */
export function isDealerStaff(authUser: AuthUser): boolean {
  return (
    authUser.role === "DealerStaff" ||
    authUser.groups.includes("DealerStaff") ||
    isDealerManager(authUser)
  );
}

/**
 * Check if user is a Consumer
 */
export function isConsumer(authUser: AuthUser): boolean {
  return authUser.role === "Consumer" || authUser.groups.includes("Consumer");
}

/**
 * Middleware to check user permissions
 */
export function checkPermissions(
  authUser: AuthUser,
  requiredRoles: string[]
): boolean {
  if (requiredRoles.length === 0) {
    return true; // No specific roles required
  }

  return hasRole(authUser, requiredRoles);
}

/**
 * Create standard error response
 */
export function unauthorizedResponse(message: string = "Unauthorized") {
  return {
    statusCode: 401,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ error: message }),
  };
}

/**
 * Create standard forbidden response
 */
export function forbiddenResponse(
  message: string = "Forbidden: Insufficient permissions"
) {
  return {
    statusCode: 403,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ error: message }),
  };
}

/**
 * Verify user belongs to the same dealership as the resource
 */
export function verifyDealershipAccess(
  authUser: AuthUser,
  resourceDealershipId: string
): boolean {
  return authUser.dealershipId === resourceDealershipId;
}

/**
 * Get dealership filter for SQL queries
 */
export function getDealershipFilter(authUser: AuthUser): {
  field: string;
  value: string;
} {
  return {
    field: "dealership_id",
    value: authUser.dealershipId,
  };
}
