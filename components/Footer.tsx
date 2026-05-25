import Link from "next/link";
import { Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-slate-200 bg-white">
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
              <div className="flex h-8 w-8 items-center justify-center rounded-none bg-primary-600 text-white">
                <Briefcase size={18} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">JobBoard</span>
            </Link>
            <p className="mt-4 text-sm text-slate-500">
              The premier destination for professional career opportunities.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-slate-600 hover:text-primary-600 transition-colors">Find Jobs</Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-slate-600 hover:text-primary-600 transition-colors">Employer Dashboard</Link>
              </li>
              <li>
                <Link href="/jobs/new" className="text-sm text-slate-600 hover:text-primary-600 transition-colors">Post a Job</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-primary-600 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-primary-600 transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-primary-600 transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-primary-600 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-primary-600 transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t-2 border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} JobBoard Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
