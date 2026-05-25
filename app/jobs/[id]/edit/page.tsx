"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditJob() {
  const router = useRouter();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    category: "General",
    description: "",
    jobUrl: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await api.get(`/jobs/${id}`);
        setFormData({
          title: data.title,
          company: data.company,
          category: data.category || "General",
          description: data.description,
          jobUrl: data.jobUrl,
          imageUrl: data.imageUrl || "",
        });
      } catch (err) {
        console.error("Failed to fetch job:", err);
        setError("Failed to load job details.");
      } finally {
        setIsFetching(false);
      }
    };
    if (id) {
      fetchJob();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        imageUrl: formData.imageUrl.trim() === "" ? null : formData.imageUrl,
      };
      await api.put(`/jobs/${id}`, payload);
      router.push("/dashboard");
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

  if (isFetching) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/dashboard" className="mb-8 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900">
        <ArrowLeft size={16} className="mr-2" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Edit job posting</h1>
        <p className="mt-2 text-slate-600">Update the details of your job opening.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Update the relevant fields below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="rounded-none border-2 border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            
            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                label="Job Title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
              />
              <Input
                label="Company Name"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Category</label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-none border-2 border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-primary-600 focus:ring-0 transition-colors"
                >
                 <option value="Technology">Technology</option>
                 <option value="Design">Design</option>
                 <option value="Marketing">Marketing</option>
                 <option value="Business">Business</option>
                 <option value="Finance">Finance</option>
                 <option value="HR">HR</option>
                 <option value="Healthcare">Healthcare</option>
                 <option value="Legal">Legal</option>
                 <option value="Engineering">Engineering</option>
                 <option value="Logistics">Logistics</option>
                 <option value="Education">Education</option>
                 <option value="Support">Support</option>
                 <option value="Government">Government</option>
                 <option value="Agriculture">Agriculture</option>
                 <option value="Science">Science</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Job Description</label>
              <textarea
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-none border-2 border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-primary-600 focus:outline-none focus:ring-0 transition-colors"
              />
            </div>

            <Input
              label="Application URL"
              name="jobUrl"
              type="url"
              required
              value={formData.jobUrl}
              onChange={handleChange}
            />

            <Input
              label="Company Logo URL (Optional)"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleChange}
            />
            
          </CardContent>
          <CardFooter className="flex justify-end space-x-4 border-t border-slate-100 pt-6">
            <Link href="/dashboard">
              <Button variant="ghost" type="button">Cancel</Button>
            </Link>
            <Button type="submit" isLoading={isLoading}>Save Changes</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
