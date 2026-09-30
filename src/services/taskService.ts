import type { TaskResponse, TaskRequest, PageResponse } from "../types/task";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://taskboard-api-6aml.onrender.com/api/tasks";

export const taskService = {
  async list(page = 0, size = 10): Promise<PageResponse<TaskResponse>> {
    const response = await fetch(`${API_URL}?page=${page}&size=${size}`);
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    return response.json();
  },

  async getById(id: number): Promise<TaskResponse> {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Task not found");
    }
    return response.json();
  },

  async create(data: TaskRequest): Promise<TaskResponse> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create task");
    }
    return response.json();
  },

  async update(id: number, data: TaskRequest): Promise<TaskResponse> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update task");
    }
    return response.json();
  },

  async remove(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
  },
};
