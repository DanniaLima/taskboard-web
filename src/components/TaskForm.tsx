import { useState } from "react"
import { taskService } from "../services/taskService"
import type { TaskPriority, TaskRequest, TaskResponse, TaskStatus } from "../types/task"

interface TaskFormProps {
  onSuccess: () => void
  onCancel: () => void
  initialTask?: TaskResponse | null
}

const EMPTY_FORM: TaskRequest = {
  title: "",
  description: "",
  status: "PENDING",
  priority: "MEDIUM",
  dueDate: "",
}

function TaskForm({ onSuccess, onCancel, initialTask }: TaskFormProps) {
  const isEditing = Boolean(initialTask)

  const [form, setForm] = useState<TaskRequest>(() => {
    if (!initialTask) return EMPTY_FORM
    return {
      title: initialTask.title,
      description: initialTask.description,
      status: initialTask.status,
      priority: initialTask.priority,
      dueDate: initialTask.dueDate.slice(0, 16),
    }
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const payload: TaskRequest = {
        ...form,
        dueDate: form.dueDate.length === 16 ? `${form.dueDate}:00` : form.dueDate,
      }

      if (isEditing && initialTask) {
        await taskService.update(initialTask.id, payload)
      } else {
        await taskService.create(payload)
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4"
    >
      <h2 className="text-2xl font-bold mb-2">
        {isEditing ? "Edit Task" : "New Task"}
      </h2>

      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded p-3 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-1" htmlFor="title">
          Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={3}
          maxLength={100}
          value={form.title}
          onChange={handleChange}
          className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          placeholder="e.g. Finish portfolio README"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          maxLength={500}
          rows={3}
          value={form.description}
          onChange={handleChange}
          className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          placeholder="Optional details..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="status">
            Status *
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            {(["PENDING", "IN_PROGRESS", "DONE"] as TaskStatus[]).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="priority">
            Priority *
          </label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            {(["LOW", "MEDIUM", "HIGH"] as TaskPriority[]).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="dueDate">
            Due date *
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="datetime-local"
            required
            value={form.dueDate}
            onChange={handleChange}
            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 px-5 py-2 rounded-lg font-semibold transition"
        >
          {submitting
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
              ? "Save Changes"
              : "Create Task"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-slate-600 hover:bg-slate-500 px-5 py-2 rounded-lg font-semibold transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default TaskForm
