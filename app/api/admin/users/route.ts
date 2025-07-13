import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { user } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

// Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // Add your admin check logic here
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Add admin email check (customize this)
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    if (!adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Initialize database connection
    // biome-ignore lint: Forbidden non-null assertion.
    const client = postgres(process.env.POSTGRES_URL!);
    const db = drizzle(client);

    const users = await db
      .select({
        id: user.id,
        email: user.email,
      })
      .from(user)
      .orderBy(desc(user.email));

    // Filter out guest users for cleaner view
    const regularUsers = users.filter(
      (u: any) => !u.email.startsWith('guest-'),
    );
    const guestUsers = users.filter((u: any) => u.email.startsWith('guest-'));

    return NextResponse.json({
      regularUsers,
      guestUsers,
      total: users.length,
      stats: {
        regular: regularUsers.length,
        guests: guestUsers.length,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
