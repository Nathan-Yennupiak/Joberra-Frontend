export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  imageUrl: string | null;
  jobUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}
