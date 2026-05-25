"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { JOB_CATEGORIES, JOB_TYPES } from "@/lib/constants";

export default function CreateJob() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    category: "Engineering",
    location: "",
    jobType: "Full-time",
    description: "",
    jobUrl: "",
    imageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.company) {
      toast.error("Please enter a Job Title and Company Name first.");
      return;
    }
    
    setIsGenerating(true);
    const toastId = toast.loading("AI is writing the job description...");
    try {
      const response = await api.post("/ai/generate-description", {
        title: formData.title,
        company: formData.company,
        category: formData.category,
        location: formData.location,
        jobType: formData.jobType,
      });
      setFormData((prev) => ({ ...prev, description: response.description }));
      toast.success("Description generated successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to generate description", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const toastId = toast.loading("Uploading image...");
    try {
      const res = await api.upload("/upload", formData);
      setFormData((prev) => ({ ...prev, imageUrl: res.url }));
      toast.success("Image uploaded successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to upload image", { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // imageUrl can be undefined if empty string to satisfy Zod
      const payload = {
        ...formData,
        imageUrl: formData.imageUrl.trim() === "" ? undefined : formData.imageUrl,
      };
      await api.post("/jobs", payload);
      toast.success("Job posted successfully!");
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/dashboard" className="mb-8 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900">
        <ArrowLeft size={16} className="mr-2" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Post a new job</h1>
        <p className="mt-2 text-slate-600">Fill out the details below to publish a new opening.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>All fields except the logo URL are required.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Input
                label="Job Title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Engineer"
              />
              <Input
                label="Company Name"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
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
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Remote, New York, NY"
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Job Type</label>
                <select
                  name="jobType"
                  required
                  value={formData.jobType}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-none border-2 border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-primary-600 focus:ring-0 transition-colors"
                >
                  {JOB_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">Job Description</label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                  className="h-8 text-xs bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-800"
                >
                  <Sparkles size={14} className="mr-1.5" />
                  {isGenerating ? "Generating..." : "Auto-generate"}
                </Button>
              </div>
              <div className="mt-2">
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  placeholder="Describe the role, responsibilities, and requirements..."
                  className="flex w-full rounded-none border-2 border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-primary-600 focus:ring-0 transition-colors"
                />
              </div>
            </div>

            <Input
              label="Application URL"
              name="jobUrl"
              type="url"
              required
              value={formData.jobUrl}
              onChange={handleChange}
              placeholder="https://yourcompany.com/careers/apply"
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Company Logo (Optional)</label>
              <div className="flex items-center gap-4">
                {formData.imageUrl && (
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-none border border-slate-200 bg-slate-50 flex items-center justify-center">
                    <img src={formData.imageUrl} alt="Logo preview" className="h-full w-full object-contain p-1" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-colors"
                />
              </div>
            </div>
            
          </CardContent>
          <CardFooter className="flex justify-end space-x-4 border-t border-slate-100 pt-6">
            <Link href="/dashboard">
              <Button variant="ghost" type="button">Cancel</Button>
            </Link>
            <Button type="submit" isLoading={isLoading}>Publish Job</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
