"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/Button";
import { LogOut, Briefcase, Menu, X, Plus, User as UserIcon, LayoutDashboard, UserCircle } from "lucide-react";
import { api } from "@/lib/api";
import { IUser } from "@/lib/types";

export function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Fetch user details for the avatar
      api.get<{ user: IUser }>('/auth/me')
        .then(res => {
          if (res && res.user) {
            setUser(res.user);
          }
        })
        .catch(err => console.error("Failed to fetch user:", err));
    } else {
      setIsLoggedIn(false);
    }
    
    // Close mobile menu and dropdown on route change
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const getInitial = () => {
    if (user && user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return <UserIcon size={18} />;
  };

  return (
    <nav className="sticky top-0 z-50 w-full shadow-sm border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-18 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-none bg-primary-600 text-white">
            <Briefcase size={18} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">JobBoard</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" className="text-sm font-medium">Home</Button>
          </Link>
          <Link href="/jobs">
            <Button variant="ghost" className="text-sm font-medium">Jobs</Button>
          </Link>
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <Link href="/jobs/new">
                <Button variant="primary" size="sm" className="text-sm font-medium">
                  <Plus size={16} className="mr-1" />
                  Post a Job
                </Button>
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none group"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-primary-600 border border-slate-200 font-semibold group-hover:bg-slate-300 transition-colors">
                    {getInitial()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                    {user?.name || "User"}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-lg rounded-none py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-sm font-medium text-slate-900 truncate">{user?.name || "User"}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email || ""}</p>
                    </div>
                    <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600">
                      <LayoutDashboard size={16} className="mr-2" />
                      Dashboard
                    </Link>
                    <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600">
                      <UserCircle size={16} className="mr-2" />
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} className="mr-2" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
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
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-sm font-medium">Home</Button>
          </Link>
          <Link href="/jobs" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-sm font-medium">Jobs</Button>
          </Link>
          
          {isLoggedIn ? (
            <div className="flex flex-col space-y-2 pt-2 border-t border-slate-100">
              <Link href="/jobs/new" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full justify-start text-sm font-medium">
                  <Plus size={16} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-sm font-medium">
                  <LayoutDashboard size={16} className="mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-sm font-medium">
                  <UserCircle size={16} className="mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="w-full justify-start text-red-600 hover:text-red-700 hover:border-red-200 hover:bg-red-50">
                <LogOut size={16} className="mr-2" />
                Log out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 pt-2 border-t border-slate-100">
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
