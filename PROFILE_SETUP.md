# Required Package Installation

To complete the profile and password reset implementation, you need to install the Resend package:

```bash
npm install resend
# or
pnpm add resend
# or
yarn add resend
```

## Environment Variables

Add your Resend API key to your `.env.local` file:

```env
RESEND_API_KEY=your_resend_api_key_here
```

## Database Migration

You'll need to run a database migration to add the password reset token table. Create and run this SQL migration:

```sql
CREATE TABLE "PasswordResetToken" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "token" VARCHAR(255) UNIQUE NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT now() NOT NULL,
  "used" BOOLEAN DEFAULT false NOT NULL
);

CREATE INDEX "idx_password_reset_token_token" ON "PasswordResetToken"("token");
CREATE INDEX "idx_password_reset_token_user_id" ON "PasswordResetToken"("userId");
```

Or if you're using Drizzle migrations:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Email Configuration

Update the `from` field in `lib/email.ts` with your verified domain:

```typescript
from: 'Essay Brainstormer <noreply@yourdomain.com>', // Replace with your domain
```

Make sure to verify your domain in Resend dashboard.

## Testing

After setup, test the functionality:

1. **Profile Page**: Navigate to `/profile` when logged in
2. **Email Update**: Change email with current password verification
3. **Password Update**: Change password with current password verification
4. **Forgot Password**: Use `/forgot-password` link from login page
5. **Reset Password**: Click email link to reset password

## Security Notes

- Password reset tokens expire after 1 hour
- Tokens are marked as used after successful reset
- Email enumeration is prevented (always returns success message)
- All password operations require current password verification
- Proper input validation and error handling included
