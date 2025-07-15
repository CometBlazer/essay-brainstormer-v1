import Link from 'next/link';
import { Button } from './ui/button';
import { HomeIcon } from './icons';

export function AuthNavbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Dan - Essay Coach
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link href="/" className="flex items-center gap-2">
              <HomeIcon size={16} />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
