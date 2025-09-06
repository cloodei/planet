"use client";

import { GithubIcon } from "lucide-react";
import { ComponentProps } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/sitecf";
import { ThemeToggler } from "./toggler";

type LinkProps = ComponentProps<typeof Button> & {
  href: string;
  activeClass?: string;
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  function Link({ activeClass, href, className, ...props }: LinkProps) {
    return (
      <Button
        className={cn(className, pathname === href ? activeClass : "")}
        onMouseDown={e => {
          e.preventDefault();
          router.push(href);
        }}
        onMouseEnter={() => router.prefetch(href)}
        {...props}
      />
    );
  }

  return (
    <nav className="">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary">
              {siteConfig.name}
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/"
                className="text-sm transition-colors text-primary font-medium"
                activeClass="text-muted-foreground hover:text-foreground"
              >
                Home
              </Link>
              <Link
                href="/examples"
                className="text-sm transition-colors text-primary font-medium"
                activeClass="text-muted-foreground hover:text-foreground"
              >
                Examples
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            </Button>
            <ThemeToggler />
          </div>
        </div>
      </div>
    </nav>
  );
};
