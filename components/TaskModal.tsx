"use client";

import { useState } from "react";
import { Task, TaskInput, User } from "@/lib/api";

interface Props {
  task: Task | null;
  users: User[];
  onClose: () => void;
  onSave: (payload: TaskInput) => void;
}

export default function TaskModal({ task, users, onClose, onSave }: Props) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<Task["status"]>(task?.status ?? "Todo");
  const [deadline, setDeadline] = useState(task?.deadline ? task.deadline.slice(0, 10) : "");
  const [assigneeId, setAssigneeId] = useState<string>(
    task?.assignee_id ? String(task.assignee_id) : ""
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      title,
      description,
      status,
      deadline: deadline ? new Date(deadline).toISOString() : null,
      assignee_id: assigneeId ? Number(assigneeId) : null,
    });
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{task ? "Edit Task" : "Tambah Task"}</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Judul
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>

          <label>
            Deskripsi
            <textarea
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </label>

          <div className="modal-row">
            <label>
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Task["status"])}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </label>

            <label>
              Deadline
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </label>
          </div>

          <label>
            Assignee
            <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
              <option value="">Belum ditugaskan</option>
              {users.map((u) => (
                <option key={u.id_user} value={u.id_user}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" className="ghost" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="primary">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
