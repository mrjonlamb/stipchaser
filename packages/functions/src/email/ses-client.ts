/**
 * AWS SES Client for sending emails
 */

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import {
  getInvitationEmailSubject,
  getInvitationEmailHtml,
  getInvitationEmailText,
} from "./invitation-template";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const SENDER_EMAIL = process.env.SES_SENDER_EMAIL || "noreply@stipchaser.com";

interface SendInvitationEmailParams {
  recipientEmail: string;
  firstName?: string;
  lastName?: string;
  role: string;
  invitedByName: string;
  temporaryPassword: string;
  loginUrl: string;
}

export async function sendInvitationEmail(
  params: SendInvitationEmailParams
): Promise<void> {
  const emailData = {
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.recipientEmail,
    role: params.role,
    invitedBy: params.invitedByName,
    temporaryPassword: params.temporaryPassword,
    loginUrl: params.loginUrl,
  };

  const subject = getInvitationEmailSubject(params.role);
  const htmlBody = getInvitationEmailHtml(emailData);
  const textBody = getInvitationEmailText(emailData);

  const command = new SendEmailCommand({
    Source: SENDER_EMAIL,
    Destination: {
      ToAddresses: [params.recipientEmail],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: "UTF-8",
        },
        Text: {
          Data: textBody,
          Charset: "UTF-8",
        },
      },
    },
  });

  try {
    const response = await sesClient.send(command);
    console.log("Email sent successfully:", {
      messageId: response.MessageId,
      recipient: params.recipientEmail,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error(`Failed to send invitation email: ${error}`);
  }
}

export { sesClient };

