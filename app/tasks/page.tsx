"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Task,
  TaskInput,
  User,
  createTask,
  deleteTask,
  getTasks,
  getUsers,
  updateTask,
} from "@/lib/api";
import { clearToken, isLoggedIn } from "@/lib/auth";
import TaskModal from "@/components/TaskModal";
import ChatbotWidget from "@/components/ChatbotWidget";

const STATUSES: Task["status"][] = ["Todo", "In Progress", "Done"];

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [taskData, userData] = await Promise.all([getTasks(), getUsers()]);
      setTasks(taskData);
      setUsers(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }
    loadData();
  }, [router, loadData]);

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  function openCreateModal() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  async function handleStatusChange(task: Task, status: Task["status"]) {
    try {
      const updated = await updateTask(task.id_task, { status });
      setTasks((prev) => prev.map((t) => (t.id_task === updated.id_task ? updated : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal update status");
    }
  }

  async function handleDelete(task: Task) {
    if (!confirm(`Hapus task "${task.title}"?`)) return;
    try {
      await deleteTask(task.id_task);
      setTasks((prev) => prev.filter((t) => t.id_task !== task.id_task));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus task");
    }
  }

  async function handleSave(payload: TaskInput) {
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id_task, payload);
        setTasks((prev) => prev.map((t) => (t.id_task === updated.id_task ? updated : t)));
      } else {
        const created = await createTask(payload);
        setTasks((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan task");
    }
  }

  return (
    <main className="board-screen">
      <header className="board-header">
        <div>
          <span className="eyebrow">Task Board</span>
          <h1>Daftar Task</h1>
        </div>
        <div className="board-actions">
          <button className="primary" onClick={openCreateModal}>
            + Tambah Task
          </button>
          <button className="ghost" onClick={handleLogout}>
            Keluar
          </button>
        </div>
      </header>

      {error && <p className="error-text">{error}</p>}
      {loading && <p className="muted">Memuat task...</p>}

      {!loading && (
        <div className="board-columns">
          {STATUSES.map((status) => (
            <section key={status} className="board-column">
              <h2 className={`column-title status-${status.replace(/\s+/g, "-").toLowerCase()}`}>
                {status}
                <span className="count">{tasks.filter((t) => t.status === status).length}</span>
              </h2>

              <div className="column-cards">
                {tasks
                  .filter((t) => t.status === status)
                  .map((task) => (
                    <article key={task.id_task} className="task-card">
                      <h3>{task.title}</h3>
                      {task.description && <p className="task-desc">{task.description}</p>}

                      <dl className="task-meta">
                        <div>
                          <dt>Assignee</dt>
                          <dd>{task.assignee ? task.assignee.name : "Belum ditugaskan"}</dd>
                        </div>
                        <div>
                          <dt>Deadline</dt>
                          <dd>
                            {task.deadline
                              ? new Date(task.deadline).toLocaleDateString("id-ID")
                              : "-"}
                          </dd>
                        </div>
                      </dl>

                      <div className="task-controls">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task, e.target.value as Task["status"])
                          }
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <button className="link" onClick={() => openEditModal(task)}>
                          Edit
                        </button>
                        <button className="link danger" onClick={() => handleDelete(task)}>
                          Hapus
                        </button>
                      </div>
                    </article>
                  ))}

                {tasks.filter((t) => t.status === status).length === 0 && (
                  <p className="empty-column">Belum ada task.</p>
                )}
              </div>
            </section>
          ))}
        </div>
      )}

      {modalOpen && (
        <TaskModal
          task={editingTask}
          users={users}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      <ChatbotWidget />
    </main>
  );
}
