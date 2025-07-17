import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { HomeIcon } from './icons';
import { ExternalLink } from 'lucide-react';

export function AuthNavbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Button asChild variant="ghost" size="sm">
            <Link href="/" className="text-xl font-bold">
              <Image
                src="https://res.cloudinary.com/dqdasxxho/image/upload/v1752602678/dan-essay-coach-profile_r5spkl.png"
                alt="Dan by Haloway Logo"
                width={20}
                height={20}
                className="hover:opacity-80 transition-opacity"
              />
              Dan by Haloway
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" className="flex items-center gap-2">
                <HomeIcon size={16} />
                Home
              </Link>
            </Button>
            <Button
              asChild
              variant={'ghost'}
              size="sm"
              className="flex items-center"
            >
              <Link
                href="https://haloway.co"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="https://res.cloudinary.com/dqdasxxho/image/upload/v1752779476/favicon_mq7v9g.png"
                  alt="Haloway Logo"
                  width={20}
                  height={20}
                  className="hover:opacity-80 transition-opacity"
                />
                Haloway
                <ExternalLink size={16} className="ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
