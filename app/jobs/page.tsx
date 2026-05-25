"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { IJob } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MapPin, Building2, Clock, Search, ChevronRight } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["All", "Engineering", "Design", "Marketing", "Product", "Sales", "General"];

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearchQuery) params.append("search", debouncedSearchQuery);
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      
      const data = await api.get(`/jobs?${params.toString()}`);
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchQuery, selectedCategory]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Browse All <span className="text-primary-600">Jobs</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Search for roles by title or company, and filter by your specialized category.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-10 flex flex-col items-center space-y-6">
        <div className="relative w-full max-w-2xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="flex h-14 w-full rounded-none border-2 border-slate-200 bg-white pl-12 pr-4 text-lg focus:border-primary-600 focus:outline-none focus:ring-0 transition-colors shadow-sm"
            placeholder="Search by job title or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm font-medium border-2 transition-colors rounded-none focus:outline-none ${
                selectedCategory === cat
                  ? "bg-primary-600 border-primary-600 text-white"
                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Job Grid */}
      {isLoading ? (
        <div className="flex h-[30vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-none border-2 border-dashed border-slate-300 bg-slate-50 py-24 text-center">
          <Search size={48} className="mb-4 text-slate-400" />
          <h3 className="mb-1 text-xl font-semibold text-slate-900">No jobs found</h3>
          <p className="text-slate-500">Try adjusting your search query or category filter.</p>
          {(searchQuery || selectedCategory !== "All") && (
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.id} className="group flex flex-col transition-all hover:border-primary-600 hover:shadow-none border-2">
              <CardHeader className="pb-4">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-none bg-slate-100 overflow-hidden border border-slate-200">
                  {job.imageUrl ? (
                    <img src={job.imageUrl} alt={job.company} className="h-full w-full object-fill" />
                  ) : (
                    <Building2 className="text-slate-400" size={24} />
                  )}
                </div>
                <CardTitle className="line-clamp-1 text-lg">{job.title}</CardTitle>
                <CardDescription className="flex items-center text-sm font-medium text-slate-700">
                  {job.company}
                  <span className="ml-2 inline-flex items-center rounded-none bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800 border border-slate-200">
                    {job.category || "General"}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <p className="line-clamp-3 text-sm text-slate-700">
                  {job.description}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="flex items-center text-xs text-slate-700">
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
