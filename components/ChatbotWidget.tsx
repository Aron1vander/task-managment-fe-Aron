"use client";

import { useState } from "react";
import { askChatbot } from "@/lib/api";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

const SUGGESTIONS = [
  "Tampilkan semua task yang statusnya belum selesai",
  "Berapa jumlah task yang sudah selesai?",
  "Tugas apa saja yang deadlinenya hari ini?",
];

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Halo! Tanya apa saja soal task kamu, misalnya jumlah task yang sudah selesai atau siapa assignee-nya.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendQuestion(question: string) {
    if (!question.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const { answer } = await askChatbot(question);
      setMessages((prev) => [...prev, { role: "bot", text: answer }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: `Maaf, gagal mendapat jawaban: ${message}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendQuestion(input);
  }

  return (
    <>
      <button className="chatbot-fab" onClick={() => setOpen((v) => !v)} aria-label="Buka chatbot">
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <span className="eyebrow">AI Assistant</span>
            <h3>Tanya soal task kamu</h3>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-bubble ${m.role}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="chatbot-bubble bot muted">Mengetik...</div>}
          </div>

          {messages.length <= 1 && (
            <div className="chatbot-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => sendQuestion(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="chatbot-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaan..."
              disabled={loading}
            />
            <button type="submit" className="primary" disabled={loading}>
              Kirim
            </button>
          </form>
        </div>
      )}
    </>
  );
}
