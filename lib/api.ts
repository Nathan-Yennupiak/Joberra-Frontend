const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithAuth<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.message || 'An error occurred');
  }

  // Handle empty responses (like 204 No Content)
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) => 
    fetchWithAuth<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T = any>(endpoint: string, data: any, options?: RequestInit) => 
    fetchWithAuth<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  
  put: <T = any>(endpoint: string, data: any, options?: RequestInit) => 
    fetchWithAuth<T>(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  
  delete: <T = any>(endpoint: string, options?: RequestInit) => 
    fetchWithAuth<T>(endpoint, { ...options, method: 'DELETE' }),
};
