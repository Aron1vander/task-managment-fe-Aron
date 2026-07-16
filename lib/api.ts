import { getToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `Request gagal (${res.status})`;
    try {
      const body = await res.json();
      message = body.detail || message;
    } catch {
      // response tidak punya body JSON, biarkan pesan default
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export interface User {
  id_user: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Task {
  id_task: number;
  title: string;
  description: string | null;
  status: "Todo" | "In Progress" | "Done";
  deadline: string | null;
  assignee_id: number | null;
  assignee: User | null;
  created_at: string;
  updated_at: string | null;
}

export interface TaskInput {
  title: string;
  description?: string | null;
  status: string;
  deadline?: string | null;
  assignee_id?: number | null;
}

export async function login(email: string, password: string) {
  return request<{ access_token: string; token_type: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getUsers() {
  return request<User[]>("/users/");
}

export async function getTasks() {
  return request<Task[]>("/tasks/");
}

export async function createTask(payload: TaskInput) {
  return request<Task>("/tasks/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTask(id: number, payload: Partial<TaskInput>) {
  return request<Task>(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(id: number) {
  return request<void>(`/tasks/${id}`, {
    method: "DELETE",
  });
}

export async function askChatbot(question: string) {
  return request<{ answer: string }>("/chatbot/ask", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}
