import { Briefcase } from "lucide-react";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center space-x-2 text-primary-600 hover:opacity-80 transition-opacity mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-none bg-primary-600 text-white">
            <Briefcase size={18} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Joberra</span>
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">Terms and Conditions</h1>
        <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-slate max-w-none text-slate-700">
        <p>
          Welcome to Joberra!
        </p>
        <p>
          These terms and conditions outline the rules and regulations for the use of Joberra's Website.
        </p>
        <p>
          By accessing this website we assume you accept these terms and conditions. Do not continue to use Joberra if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Cookies</h2>
        <p>
          We employ the use of cookies. By accessing Joberra, you agreed to use cookies in agreement with the Joberra's Privacy Policy.
        </p>
        <p>
          Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">License</h2>
        <p>
          Unless otherwise stated, Joberra and/or its licensors own the intellectual property rights for all material on Joberra. All intellectual property rights are reserved. You may access this from Joberra for your own personal use subjected to restrictions set in these terms and conditions.
        </p>
        <p>You must not:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Republish material from Joberra</li>
          <li>Sell, rent or sub-license material from Joberra</li>
          <li>Reproduce, duplicate or copy material from Joberra</li>
          <li>Redistribute content from Joberra</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">User Accounts</h2>
        <p>
          When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
        </p>
        <p>
          You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Job Postings</h2>
        <p>
          Employers are solely responsible for their postings on Joberra. Joberra is not to be considered to be an employer with respect to your use of any Joberra Site and Joberra shall not be responsible for any employment decisions, for whatever reason, made by any entity posting jobs on any Joberra Site.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Termination</h2>
        <p>
          We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
        <p>
          All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
        </p>
      </div>
    </div>
  );
}
