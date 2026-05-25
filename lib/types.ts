export interface IUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface IJob {
  id: string;
  title: string;
  description: string;
  company: string;
  category: string;
  imageUrl: string | null;
  jobUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: IUser;
}
