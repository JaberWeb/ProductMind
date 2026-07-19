"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:5000";
      const res = await fetch(`${BACKEND}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="noise flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-indigo-600" />
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Message sent!</h1>
          <p className="mt-2 text-sm text-slate-500">We&apos;ll get back to you within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="noise">
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-900 px-4 py-24 text-center text-white">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Get in touch</h1>
        <p className="mx-auto mt-4 max-w-2xl text-indigo-200">
          Have a question or want to learn more? We&apos;d love to hear from you.
        </p>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Subject</label>
            <input
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="How can we help?"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Tell us more..."
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700"
          >
            <Send size={14} />
            Send message
          </button>
        </form>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
              <Mail className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Email us</p>
              <p className="text-xs text-slate-500">hello@productmind.ai</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
              <MessageSquare className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Live chat</p>
              <p className="text-xs text-slate-500">Available 9am–5pm EST</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
