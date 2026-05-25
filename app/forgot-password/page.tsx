"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { Briefcase, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const data = await api.post("/auth/forgot-password", { email });
      setSuccess(data.message);
      setEmail("");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-none bg-primary-600 text-white shadow-none">
            <Briefcase size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset your password</h1>
          <p className="text-sm text-slate-500">We'll send you an email with reset instructions</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Forgot password</CardTitle>
              <CardDescription>Enter the email address associated with your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-none border-2 border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-none bg-green-50 p-3 text-sm text-green-700 border-2 border-green-200">
                  {success}
                </div>
              )}
              <Input
                label="Email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Send reset link
              </Button>
              <div className="text-center text-sm">
                <Link href="/login" className="inline-flex items-center font-medium text-slate-600 hover:text-slate-900">
                  <ArrowLeft size={16} className="mr-1" />
                  Back to log in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
