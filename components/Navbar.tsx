"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { LogOut, Briefcase, Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-none bg-primary-600 text-white">
            <Briefcase size={18} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">JobBoard</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-sm font-medium">Dashboard</Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" className="text-sm font-medium">Profile</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-slate-600">
                <LogOut size={16} className="mr-2" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-sm font-medium">Log in</Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            type="button"
            className="text-slate-600 hover:text-slate-900 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 shadow-lg">
          {isLoggedIn ? (
            <div className="flex flex-col space-y-2">
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-sm font-medium">Dashboard</Button>
              </Link>
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-sm font-medium">Profile</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="w-full justify-start text-slate-600">
                <LogOut size={16} className="mr-2" />
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-sm font-medium">Log in</Button>
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full justify-start text-sm font-medium">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
