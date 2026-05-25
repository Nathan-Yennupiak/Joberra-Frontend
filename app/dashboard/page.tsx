"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { IJob } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Trash2, Building2, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { JobLogo } from "@/components/JobLogo";

export default function Dashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    // Basic auth check
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchJobs = async () => {
      try {
        const data = await api.get('/jobs');
        // Decode token to get userId to filter jobs (In a real app, we'd have a specific endpoint for /api/users/me/jobs)
        // Since we don't have that endpoint, we parse the JWT token
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const myJobs = data.filter((j: IJob) => j.userId === payload.userId);
          setJobs(myJobs);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    
    setIsDeleting(id);
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter(j => j.id !== id));
    } catch (error) {
      console.error("Failed to delete job", error);
      alert("Failed to delete job");
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-2 text-slate-600">Manage your job postings.</p>
        </div>
        <Link href="/jobs/new">
          <Button>
            <Plus size={16} className="mr-2" />
            Post a Job
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-none border-2 border-dashed border-slate-300 bg-slate-50 py-24 text-center">
          <Building2 size={48} className="mb-4 text-slate-400" />
          <h3 className="mb-1 text-xl font-semibold text-slate-900">No jobs posted</h3>
          <p className="mb-6 text-slate-500">You haven't posted any jobs yet.</p>
          <Link href="/jobs/new">
            <Button variant="outline">Create your first job</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6">
              <div className="flex items-start gap-4 mb-4 sm:mb-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none border-2 border-slate-200 bg-slate-50 p-1">
                  <JobLogo imageUrl={job.imageUrl} company={job.company} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                    <Link href={`/jobs/${job.id}`} className="hover:text-primary-600 hover:underline">
                      {job.title}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                    <span className="font-medium text-slate-700">{job.company}</span>
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:shrink-0">
                <Link href={`/jobs/${job.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit2 size={14} className="mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => handleDelete(job.id)}
                  isLoading={isDeleting === job.id}
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
