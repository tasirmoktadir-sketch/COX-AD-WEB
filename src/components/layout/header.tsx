"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Blocks, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useUser, useAuth } from "@/firebase"
import { signOut } from 'firebase/auth';

const baseNavLinks = [
  { href: "/", label: "Billboards" },
  { href: "/ai-suggester", label: "AI Suggester" },
  { href: "/contact", label: "Contact" },
]

export function Header() {
  const pathname = usePathname()
  const { user, isUserLoading } = useUser()
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const navLinks = [...baseNavLinks];
  if (user) {
    navLinks.push({ href: "/admin", label: "Admin" });
  }

  const NavLinksComponent = ({ className }: { className?: string }) => (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === href ? "text-primary font-semibold" : "text-muted-foreground"
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Blocks className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold text-primary">Cox's Ad</span>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <NavLinksComponent />
          <ThemeToggle />
          {!isUserLoading && (
            user ? (
              <div className="flex items-center gap-4">
                <div className="text-right text-xs">
                  <p className="font-semibold">{user.email}</p>
                  <p className="text-muted-foreground font-mono">{user.uid}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <span className="text-xs text-muted-foreground">(Admins Only)</span>
              </div>
            )
          )}
        </div>

        <div className="flex items-center md:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 pt-8">
                <NavLinksComponent className="flex-col !space-x-0 space-y-2" />
                <div className="pt-4">
                  {!isUserLoading && (
                    user ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="text-center text-xs">
                          <p className="font-semibold">{user.email}</p>
                          <p className="text-muted-foreground font-mono">{user.uid}</p>
                        </div>
                        <Button onClick={handleLogout} className="w-full">
                          <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center gap-2">
                        <Button asChild className="w-full">
                          <Link href="/login">Login</Link>
                        </Button>
                         <p className="text-xs text-muted-foreground">(Admins Only)</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
