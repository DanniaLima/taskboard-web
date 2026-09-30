import { useEffect, useState } from "react";
import { taskService } from "./services/taskService";
import type { TaskPriority, TaskResponse, TaskStatus } from "./types/task";
import TaskForm from "./components/TaskForm";

function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-yellow-600 text-yellow-50";
    case "IN_PROGRESS":
      return "bg-blue-600 text-blue-50";
    case "DONE":
      return "bg-green-600 text-green-50";
  }
}

function getPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case "LOW":
      return "bg-slate-600 text-slate-50";
    case "MEDIUM":
      return "bg-orange-600 text-orange-50";
    case "HIGH":
      return "bg-red-600 text-red-50";
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

  const loadTasks = () => {
    setLoading(true);
    taskService
      .list()
      .then((data) => {
        setTasks(data.content);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleFormSuccess = () => {
    setIsCreateFormOpen(false);
    setEditingTask(null);
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
      loadTasks();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            TaskBoard Web <span className="text-blue-400">🚀</span>
          </h1>
          {!isCreateFormOpen && !editingTask && (
            <button
              onClick={handleOpenCreate}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition"
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
                  className="bg-slate-800 border border-slate-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2
                        className={`text-xl font-semibold tracking-tight ${
                          task.status === "DONE"
                            ? "line-through text-slate-500"
                            : ""
                        }`}
                      >
                        {task.title}
                      </h2>
                      <p className="text-slate-400 text-sm mt-1">
                        {task.description}
                      </p>
                      <p className="text-slate-500 text-xs mt-2">
                        Due: {formatDate(task.dueDate)}
                      </p>
                      <div className="flex gap-2 mt-3 text-xs font-semibold">
                        <span
                          className={`px-2 py-1 rounded ${getStatusColor(task.status)}`}
                        >
                          {task.status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap justify-end">
                      {task.status !== "DONE" && (
                        <button
                          onClick={() => handleMarkAsDone(task)}
                          disabled={updatingId === task.id}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 px-3 py-1.5 rounded text-sm font-semibold transition"
                        >
                          {updatingId === task.id ? "..." : "✓ Done"}
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEdit(task)}
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-sm font-semibold transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        disabled={deletingId === task.id}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-slate-600 px-3 py-1.5 rounded text-sm font-semibold transition"
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
