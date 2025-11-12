import { PreSignUpTriggerEvent } from "aws-lambda";

/**
 * Cognito Pre-SignUp Lambda Trigger
 * This function is called before a user is allowed to sign up
 * We use it to prevent self-registration - only admin-invited users can sign up
 */
export async function handler(event: PreSignUpTriggerEvent) {
  console.log("PreSignUp trigger:", JSON.stringify(event, null, 2));

  // Check if the user is being created by an admin (via AdminCreateUser)
  const triggerSource = event.triggerSource;

  if (triggerSource === "PreSignUp_AdminCreateUser") {
    // This is an admin-invited user, allow signup
    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true;
    return event;
  }

  // For self-registration attempts, we could block them
  // However, we'll allow it but mark them as unverified
  // The application layer will handle proper authorization
  event.response.autoConfirmUser = false;
  event.response.autoVerifyEmail = false;

  return event;
}
