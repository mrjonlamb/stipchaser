import { Amplify } from "aws-amplify";
import {
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  signUp,
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
  confirmSignIn,
} from "aws-amplify/auth";

// Configure Amplify
const authConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || "",
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || "",
      region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
    },
  },
};

Amplify.configure(authConfig, { ssr: true });

export interface AuthUser {
  userId: string;
  email: string;
  groups: string[];
  role?: string;
  dealershipId?: string;
}

/**
 * Sign in with email and password
 */
export async function authSignIn(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; challengeName?: string }> {
  try {
    const result = await signIn({
      username: email,
      password,
    });

    if (result.isSignedIn) {
      return { success: true };
    }

    // Handle challenges (like NEW_PASSWORD_REQUIRED)
    if (result.nextStep) {
      return {
        success: false,
        challengeName: result.nextStep.signInStep,
      };
    }

    return { success: false, error: "Sign in failed" };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return { success: false, error: error.message || "Sign in failed" };
  }
}

/**
 * Complete new password challenge
 */
export async function completeNewPassword(
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await confirmSignIn({
      challengeResponse: newPassword,
    });

    if (result.isSignedIn) {
      return { success: true };
    }

    return { success: false, error: "Password change failed" };
  } catch (error: any) {
    console.error("Complete new password error:", error);
    return { success: false, error: error.message || "Password change failed" };
  }
}

/**
 * Sign out current user
 */
export async function authSignOut(): Promise<void> {
  try {
    await signOut();
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

/**
 * Get current authenticated user
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const user = await getCurrentUser();
    const session = await fetchAuthSession();

    const idToken = session.tokens?.idToken;
    if (!idToken) {
      return null;
    }

    const payload = idToken.payload;

    return {
      userId: user.userId,
      email: (payload.email as string) || "",
      groups: (payload["cognito:groups"] as string[]) || [],
      role: (payload["custom:role"] as string) || undefined,
      dealershipId: (payload["custom:dealership_id"] as string) || undefined,
    };
  } catch (error) {
    console.error("Get auth user error:", error);
    return null;
  }
}

/**
 * Get access token for API requests
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() || null;
  } catch (error) {
    console.error("Get access token error:", error);
    return null;
  }
}

/**
 * Get ID token for API requests
 */
export async function getIdToken(): Promise<string | null> {
  try {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.toString() || null;
  } catch (error) {
    console.error("Get ID token error:", error);
    return null;
  }
}

/**
 * Sign up new user (not used in our flow, but available)
 */
export async function authSignUp(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Sign up error:", error);
    return { success: false, error: error.message || "Sign up failed" };
  }
}

/**
 * Confirm sign up with code
 */
export async function authConfirmSignUp(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await confirmSignUp({
      username: email,
      confirmationCode: code,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Confirm sign up error:", error);
    return {
      success: false,
      error: error.message || "Confirmation failed",
    };
  }
}

/**
 * Request password reset
 */
export async function authResetPassword(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await resetPassword({ username: email });
    return { success: true };
  } catch (error: any) {
    console.error("Reset password error:", error);
    return {
      success: false,
      error: error.message || "Reset password failed",
    };
  }
}

/**
 * Confirm password reset with code
 */
export async function authConfirmResetPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await confirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword,
    });
    return { success: true };
  } catch (error: any) {
    console.error("Confirm reset password error:", error);
    return {
      success: false,
      error: error.message || "Password reset confirmation failed",
    };
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
}
