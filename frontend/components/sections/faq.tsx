"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What file formats are supported for import?",
    a: "We support CSV and XLSX files. Our smart column mapper automatically detects and maps your columns to our product fields, so you can import data from Shopify, Amazon, and other platforms with zero configuration.",
  },
  {
    q: "How does the AI content generation work?",
    a: "Select any product and choose the content type (title, description, SEO, or social). Our AI analyzes your product data and generates optimized content in your preferred tone and length. You can regenerate as many times as you like.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We use encryption at rest and in transit. Your data is stored in secure, SOC 2 compliant data centers. We never share your data with third parties, and you retain full ownership of all your content.",
  },
  {
    q: "Can I try before I buy?",
    a: "Yes! Sign up for a free account and get started immediately. No credit card required. You'll have access to all Professional features during your trial period.",
  },
  {
    q: "Do you offer custom integrations?",
    a: "Enterprise plans include custom integration support. Our API allows you to connect ProductMind with your existing tools and workflows. Contact our sales team to discuss your needs.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-slate-50 px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-14 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Everything you need to know about ProductMind.
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-xl border bg-white transition-all ${
                  isOpen ? "border-indigo-200 shadow-sm" : "border-slate-200"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-medium text-slate-900">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? "max-h-60" : "max-h-0"
                  }`}
                >
                  <p className="px-6 pb-4 text-sm leading-relaxed text-slate-500">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
