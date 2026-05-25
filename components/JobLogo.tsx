import { useState } from "react";
import { Building2 } from "lucide-react";

interface JobLogoProps {
  imageUrl?: string | null;
  company: string;
}

export function JobLogo({ imageUrl, company }: JobLogoProps) {
  const [hasError, setHasError] = useState(false);

  if (!imageUrl || hasError) {
    return <Building2 className="text-slate-400" size={24} />;
  }

  return (
    <img
      src={imageUrl}
      alt={company}
      className="h-full w-full object-contain p-1"
      onError={() => setHasError(true)}
    />
  );
}
