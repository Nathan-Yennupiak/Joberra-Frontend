"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Job } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPin, Building2, Clock, ExternalLink, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [jobs, setJobs] =  useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await api.get('/jobs');
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
          Find your next <br/> <span className="text-primary-600">dream role</span>.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Discover the best opportunities from top tech companies. Professional, vetted, and waiting for you.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-none border-2 border-dashed border-slate-300 bg-slate-50 py-24 text-center">
          <Building2 size={48} className="mb-4 text-slate-400" />
          <h3 className="mb-1 text-xl font-semibold text-slate-900">No jobs posted yet</h3>
          <p className="text-slate-500">Check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.id} className="group flex flex-col transition-all hover:border-primary-600 hover:shadow-none border-2">
              <CardHeader className="pb-4">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-none bg-slate-100 p-2 overflow-hidden border border-slate-200">
                  {job.imageUrl ? (
                    <img src={job.imageUrl} alt={job.company} className="h-full w-full object-cover" />
                  ) : (
                    <Building2 className="text-slate-400" size={24} />
                  )}
                </div>
                <CardTitle className="line-clamp-1 text-lg">{job.title}</CardTitle>
                <CardDescription className="flex items-center text-sm font-medium text-slate-700">
                  {job.company}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <p className="line-clamp-3 text-sm text-slate-500">
                  {job.description}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="flex items-center text-xs text-slate-500">
                  <Clock size={14} className="mr-1" />
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <Link href={`/jobs/${job.id}`}>
                  <Button variant="ghost" size="sm" className="group/btn text-primary-600 hover:bg-primary-50 hover:text-primary-700">
                    View Details
                    <ChevronRight size={16} className="ml-1 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
