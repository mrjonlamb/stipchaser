/**
 * Email templates for user invitations
 */

interface InvitationEmailData {
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  invitedBy: string;
  dealershipName?: string;
  temporaryPassword: string;
  loginUrl: string;
}

export function getInvitationEmailSubject(role: string): string {
  const roleNames: Record<string, string> = {
    DealerManager: "Dealer Manager",
    DealerStaff: "Dealer Staff",
    Consumer: "Customer",
  };

  return `Welcome to StipChaser - Your ${roleNames[role] || "User"} Account`;
}

export function getInvitationEmailHtml(data: InvitationEmailData): string {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const greeting = fullName ? `Hi ${fullName}` : `Hi there`;

  const roleDescriptions: Record<string, string> = {
    DealerManager:
      "As a Dealer Manager, you have full access to manage your dealership, including inviting staff and managing customer deals.",
    DealerStaff:
      "As Dealer Staff, you can help manage customer deals and assist with document processing.",
    Consumer:
      "As a customer, you can track your deal progress, upload required documents, and communicate with your dealership.",
  };

  const roleDescription =
    roleDescriptions[data.role] || "You now have access to StipChaser.";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to StipChaser</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">StipChaser</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                ${greeting}! 👋
              </h2>
              
              <p style="margin: 0 0 16px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                ${data.invitedBy} has invited you to join StipChaser. ${roleDescription}
              </p>

              <!-- Credentials Box -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 24px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 12px; color: #1a1a1a; font-size: 16px; font-weight: 600;">
                  Your Login Credentials
                </h3>
                <p style="margin: 0 0 8px; color: #4a4a4a; font-size: 14px;">
                  <strong>Email:</strong> ${data.email}
                </p>
                <p style="margin: 0; color: #4a4a4a; font-size: 14px;">
                  <strong>Temporary Password:</strong> <code style="background-color: #ffffff; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${data.temporaryPassword}</code>
                </p>
              </div>

              <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                For security reasons, you'll be required to change your password when you first log in.
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${data.loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                  Log In to StipChaser
                </a>
              </div>

              <!-- Instructions -->
              <div style="background-color: #f8f9fa; padding: 20px; margin: 24px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 12px; color: #1a1a1a; font-size: 14px; font-weight: 600;">
                  Getting Started:
                </h3>
                <ol style="margin: 0; padding-left: 20px; color: #4a4a4a; font-size: 14px; line-height: 1.8;">
                  <li>Click the "Log In to StipChaser" button above</li>
                  <li>Enter your email and temporary password</li>
                  <li>Create a new secure password</li>
                  <li>Start using StipChaser!</li>
                </ol>
              </div>

              <p style="margin: 24px 0 0; color: #6b6b6b; font-size: 14px; line-height: 1.6;">
                If you have any questions or need assistance, please don't hesitate to reach out to your dealership or our support team.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 8px; color: #6b6b6b; font-size: 12px; text-align: center;">
                This is an automated email from StipChaser. Please do not reply to this email.
              </p>
              <p style="margin: 0; color: #6b6b6b; font-size: 12px; text-align: center;">
                If you didn't expect this invitation, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getInvitationEmailText(data: InvitationEmailData): string {
  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const greeting = fullName ? `Hi ${fullName}` : `Hi there`;

  return `
${greeting}!

${data.invitedBy} has invited you to join StipChaser.

Your Login Credentials:
- Email: ${data.email}
- Temporary Password: ${data.temporaryPassword}

For security reasons, you'll be required to change your password when you first log in.

Log in here: ${data.loginUrl}

Getting Started:
1. Visit the login URL above
2. Enter your email and temporary password
3. Create a new secure password
4. Start using StipChaser!

If you have any questions or need assistance, please reach out to your dealership or our support team.

---
This is an automated email from StipChaser. Please do not reply to this email.
If you didn't expect this invitation, you can safely ignore this email.
  `.trim();
}

