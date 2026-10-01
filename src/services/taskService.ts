import type { TaskResponse, TaskRequest, PageResponse } from "../types/task";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://taskboard-api-6aml.onrender.com/api/tasks";

export type SortOption = "createdAt,desc" | "dueDate,asc";
export type StatusFilter = "ALL" | "PENDING" | "IN_PROGRESS" | "DONE";

export const taskService = {
  async list(
    page = 0,
    size = 10,
    sort: SortOption = "createdAt,desc",
    status: StatusFilter = "ALL",
  ): Promise<PageResponse<TaskResponse>> {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
      sort,
    });

    if (status !== "ALL") {
      params.append("status", status);
    }

    const response = await fetch(`${API_URL}?${params}`);
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
