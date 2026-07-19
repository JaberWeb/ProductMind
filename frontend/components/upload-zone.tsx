"use client";

import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

interface UploadZoneProps {
  onUploadComplete: (url: string, fileName: string) => void;
  onUploadError: (error: string) => void;
}

export function UploadZone({ onUploadComplete, onUploadError }: UploadZoneProps) {
  return (
    <UploadDropzone<OurFileRouter, "csvUploader">
      endpoint="csvUploader"
      onClientUploadComplete={(res) => {
        if (res?.[0]) {
          onUploadComplete(res[0].ufsUrl, res[0].name);
        }
      }}
      onUploadError={(err) => {
        onUploadError(err.message);
      }}
      content={{
        label: "Drop your CSV or Excel file here",
        allowedContent: "CSV (.csv) or Excel (.xlsx, .xls)",
      }}
      appearance={{
        container: {
          border: "2px dashed #cbd5e1",
          borderRadius: "12px",
          padding: "48px",
          cursor: "pointer",
        },
        label: { color: "#64748b", fontSize: "14px" },
        allowedContent: { color: "#94a3b8", fontSize: "12px" },
        button: {
          background: "#4f46e5",
          color: "white",
          borderRadius: "8px",
          padding: "8px 16px",
          fontSize: "14px",
        },
      }}
    />
  );
}
