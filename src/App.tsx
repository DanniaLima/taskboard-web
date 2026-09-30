import { useCallback, useEffect, useState } from "react";
import { taskService } from "./services/taskService";
import type { TaskPriority, TaskResponse, TaskStatus } from "./types/task";
import TaskForm from "./components/TaskForm";

function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30";
    case "IN_PROGRESS":
      return "bg-blue-500/15 text-blue-300 border border-blue-500/30";
    case "DONE":
      return "bg-green-500/15 text-green-300 border border-green-500/30";
  }
}

function getPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case "LOW":
      return "bg-slate-500/15 text-slate-300 border border-slate-500/30";
    case "MEDIUM":
      return "bg-orange-500/15 text-orange-300 border border-orange-500/30";
    case "HIGH":
      return "bg-red-500/15 text-red-300 border border-red-500/30";
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function App() {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      const data = await taskService.list();
      setTasks(data.content);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleFormSuccess = () => {
    setIsCreateFormOpen(false);
    setEditingTask(null);
    setLoading(true);
    loadTasks();
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsCreateFormOpen(true);
  };

  const handleOpenEdit = (task: TaskResponse) => {
    setIsCreateFormOpen(false);
    setEditingTask(task);
  };

  const handleCancelForm = () => {
    setIsCreateFormOpen(false);
    setEditingTask(null);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Delete this task? This cannot be undone.",
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await taskService.remove(id);
      setLoading(true);
      loadTasks();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkAsDone = async (task: TaskResponse) => {
    setUpdatingId(task.id);
    try {
      await taskService.update(task.id, {
        title: task.title,
        description: task.description,
        status: "DONE",
        priority: task.priority,
        dueDate: task.dueDate,
      });
      setLoading(true);
      loadTasks();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setUpdatingId(null);
    }
  };

  const doneCount = tasks.filter((t) => t.status === "DONE").length;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              TaskBoard Web <span className="text-blue-400">🚀</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
              {doneCount > 0 && (
                <span className="ml-2 text-green-500">· {doneCount} done</span>
              )}
            </p>
          </div>
          {!isCreateFormOpen && !editingTask && (
            <button
              onClick={handleOpenCreate}
              className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              + New Task
            </button>
          )}
        </header>

        {isCreateFormOpen && (
          <div className="mb-6">
            <TaskForm
              onSuccess={handleFormSuccess}
              onCancel={handleCancelForm}
            />
          </div>
        )}

        {loading && (
          <p className="text-center text-slate-400">Loading tasks...</p>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-center">
            <p className="font-bold mb-2">Error loading tasks</p>
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {!loading && !error && tasks.length === 0 && (
          <p className="text-center text-slate-400">No tasks found.</p>
        )}

        {!loading && !error && tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task) => {
              const isEditingThis = editingTask?.id === task.id;

              if (isEditingThis) {
                return (
                  <TaskForm
                    key={task.id}
                    onSuccess={handleFormSuccess}
                    onCancel={handleCancelForm}
                    initialTask={editingTask}
                  />
                );
              }

              return (
                <div
                  key={task.id}
                  className="group bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 transition-all duration-200 hover:border-slate-600 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-950/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2
                        className={`text-xl font-semibold tracking-tight ${
                          task.status === "DONE"
                            ? "line-through text-slate-500"
                            : ""
                        }`}
                      >
                        {task.title}
                      </h2>
                      {task.description && (
                        <p className="text-slate-400 text-sm mt-1.5">
                          {task.description}
                        </p>
                      )}
                      <p className="text-slate-500 text-xs mt-2.5">
                        Due: {formatDate(task.dueDate)}
                      </p>
                      <div className="flex gap-2 mt-3 text-xs font-medium">
                        <span
                          className={`px-2.5 py-1 rounded-md ${getStatusColor(task.status)}`}
                        >
                          {task.status}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-md ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1.5 flex-wrap justify-end shrink-0">
                      {task.status !== "DONE" && (
                        <button
                          onClick={() => handleMarkAsDone(task)}
                          disabled={updatingId === task.id}
                          className="bg-green-600/90 hover:bg-green-500 disabled:bg-slate-700 disabled:cursor-not-allowed px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 hover:-translate-y-0.5"
                          title="Mark as done"
                        >
                          {updatingId === task.id ? "..." : "✓ Done"}
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEdit(task)}
                        className="bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 hover:-translate-y-0.5"
                        title="Edit task"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        disabled={deletingId === task.id}
                        className="bg-red-600/80 hover:bg-red-500 disabled:bg-slate-700 disabled:cursor-not-allowed px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 hover:-translate-y-0.5"
                        title="Delete task"
                      >
                        {deletingId === task.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
