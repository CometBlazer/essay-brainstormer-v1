import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendPasswordResetEmailProps {
  email: string;
  resetToken: string;
  baseUrl: string;
}

export async function sendPasswordResetEmail({
  email,
  resetToken,
  baseUrl,
}: SendPasswordResetEmailProps) {
  const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Essay Brainstormer <noreply@haloway.co>', // Replace with your domain
      to: [email],
      subject: 'Reset Your Password - Essay Brainstormer',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>You requested to reset your password for your Essay Brainstormer account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            This link will expire in 1 hour. If you didn't request this password reset, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send password reset email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, error };
  }
}
