"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { IJob } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { MapPin, Building2, Clock, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function JobDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<IJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (error) {
        console.error("Failed to fetch job:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchJob();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-24 text-center">
        <h2 className="mb-4 text-3xl font-bold text-slate-900">Job Not Found</h2>
        <p className="mb-8 text-slate-500">The job you are looking for does not exist or has been removed.</p>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            Back to Job Board
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900">
        <ArrowLeft size={16} className="mr-2" />
        Back to all jobs
      </Link>

      <div className="overflow-hidden rounded-none border-2 border-slate-200 bg-white shadow-none">
        <div className="border-b-2 border-slate-200 bg-slate-50/50 p-6 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-none border-2 border-slate-200 bg-white p-1 shadow-none">
                {job.imageUrl ? (
                  <img src={job.imageUrl} alt={job.company} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="text-slate-400" size={32} />
                )}
              </div>
              <div>
                <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center font-medium text-slate-900">
                    <Building2 size={16} className="mr-1.5 text-slate-400" />
                    {job.company}
                  </span>
                  <span className="flex items-center">
                    <MapPin size={16} className="mr-1.5 text-slate-400" />
                    {job.location || "Remote"}
                  </span>
                  <span className="inline-flex items-center rounded-none bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-800 border border-primary-200">
                    {job.jobType || "Full-time"}
                  </span>
                  <span className="flex items-center">
                    <Clock size={16} className="mr-1.5 text-slate-400" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <h3 className="mb-6 text-lg font-semibold text-slate-900">About the role</h3>
          <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap w-full overflow-hidden">
            {job.description}
          </div>
          <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
              <Button size="lg" className="w-full sm:w-auto mt-5">
                Apply Now
                <ExternalLink size={18} className="ml-2" />
              </Button>
            </a>
        </div>
      </div>
    </div>
  );
}
