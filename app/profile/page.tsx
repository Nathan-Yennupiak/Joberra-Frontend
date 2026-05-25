"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { User as UserIcon, Building2, Clock, ChevronRight, Bookmark } from "lucide-react";
import { IJob } from "@/lib/types";
import toast from "react-hot-toast";
import Link from "next/link";

interface UserProfile {
  name: string | null;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "saved">("details");
  const [savedJobs, setSavedJobs] = useState<IJob[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get<{ user: UserProfile }>("/auth/me");
        setFormData({
          name: data.user.name || "",
          email: data.user.email,
        });
      } catch (err: any) {
        if (err.message === "Unauthorized") {
          router.push("/login");
        } else {
          setError(err.message || "Failed to load profile");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSavedJobs = async () => {
      try {
        const jobs = await api.get("/saved-jobs");
        setSavedJobs(jobs);
        setSavedJobIds(new Set(jobs.map((j: IJob) => j.id)));
      } catch (err) {
        console.error("Failed to fetch saved jobs:", err);
      }
    };

    fetchProfile();
    fetchSavedJobs();
  }, [router]);

  const toggleSaveJob = async (jobId: string) => {
    try {
      const res = await api.post(`/saved-jobs/${jobId}`, {});
      if (res.saved) {
        setSavedJobIds((prev) => new Set(prev).add(jobId));
        toast.success("Job saved!");
      } else {
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
        setSavedJobs((prev) => prev.filter(j => j.id !== jobId));
        toast.success("Job removed from saved!");
      }
    } catch (error) {
      toast.error("Failed to update saved job.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      await api.put<{ user: UserProfile }>("/auth/me", formData);
      setSuccess("Profile updated successfully!");
      setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-none bg-primary-600 text-white shadow-none">
          <UserIcon size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Profile</h1>
          <p className="text-slate-500">Manage your personal information</p>
        </div>
      </div>

      <div className="mb-6 flex space-x-6 border-b-2 border-slate-200">
        <button
          onClick={() => setActiveTab("details")}
          className={`pb-2 text-sm font-medium transition-colors ${activeTab === "details" ? "border-b-2 border-primary-600 text-primary-600" : "text-slate-500 hover:text-slate-700"}`}
        >
          Personal Details
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`pb-2 text-sm font-medium transition-colors ${activeTab === "saved" ? "border-b-2 border-primary-600 text-primary-600" : "text-slate-500 hover:text-slate-700"}`}
        >
          Saved Jobs
        </button>
      </div>

      {activeTab === "details" ? (
        <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
          <CardDescription>Update your name and contact email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-none border-2 border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            
            {success && (
              <div className="rounded-none border-2 border-green-200 bg-green-50 p-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div className="border-t-2 border-slate-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Update Password</h3>
              <p className="text-sm text-slate-500 mb-6">Leave blank if you don't want to change your password.</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="text-sm font-medium text-slate-700">
                    Current Password
                  </label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
                    New Password
                  </label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" isLoading={isSaving} className="w-full sm:w-auto">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      ) : (
        <div className="space-y-6">
          {savedJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-none border-2 border-dashed border-slate-300 bg-slate-50 py-16 text-center">
              <Bookmark size={48} className="mb-4 text-slate-400" />
              <h3 className="mb-1 text-lg font-semibold text-slate-900">No saved jobs</h3>
              <p className="text-sm text-slate-500">Jobs you bookmark will appear here.</p>
              <Link href="/jobs" className="mt-4">
                <Button variant="outline">Browse Jobs</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {savedJobs.map((job) => (
                <Card key={job.id} className="group flex flex-col transition-all hover:border-primary-600 hover:shadow-none border-2">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start w-full">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-none bg-slate-100 overflow-hidden border border-slate-200">
                        {job.imageUrl ? (
                          <img src={job.imageUrl} alt={job.company} className="h-full w-full object-fill" />
                        ) : (
                          <Building2 className="text-slate-400" size={20} />
                        )}
                      </div>
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="p-1 text-primary-600 focus:outline-none"
                      >
                        <Bookmark className="fill-primary-600 text-primary-600" size={20} />
                      </button>
                    </div>
                    <CardTitle className="line-clamp-1 text-base">{job.title}</CardTitle>
                    <CardDescription className="flex items-center text-sm font-medium text-slate-700">
                      {job.company}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between border-t border-slate-200 pt-4 mt-auto">
                    <span className="flex items-center text-xs text-slate-700">
                      <Clock size={14} className="mr-1" />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <Link href={`/jobs/${job.id}`}>
                      <Button variant="ghost" size="sm" className="group/btn text-primary-600 hover:bg-primary-50 hover:text-primary-700">
                        View Details
                        <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
