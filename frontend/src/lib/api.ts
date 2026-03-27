import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface Bookmark {
  id: number;
  title: string;
  url: string;
  description?: string;
  favicon?: string;
  categoryId?: number;
  category_id?: number;
  tags: string;
  created_at: string;
}

export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
  create: (data: Partial<Category>) => api.post<Category>('/categories', data),
  update: (id: number, data: Partial<Category>) => api.put<Category>(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

export const bookmarksApi = {
  getAll: (params?: { category?: number; search?: string }) =>
    api.get<Bookmark[]>('/bookmarks', { params }),
  create: (data: Partial<Bookmark>) => api.post<Bookmark>('/bookmarks', data),
  update: (id: number, data: Partial<Bookmark>) => api.put<Bookmark>(`/bookmarks/${id}`, data),
  delete: (id: number) => api.delete(`/bookmarks/${id}`),
};
