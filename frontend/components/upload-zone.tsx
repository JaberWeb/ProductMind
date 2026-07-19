"use client";

import { useCallback, useRef, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { Upload, Loader2 } from "lucide-react";

interface UploadZoneProps {
  onUploadComplete: (url: string, fileName: string) => void;
  onUploadError: (error: string) => void;
}

export function UploadZone({ onUploadComplete, onUploadError }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const { startUpload, isUploading } = useUploadThing("csvUploader", {
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        onUploadComplete(res[0].ufsUrl, res[0].name);
      }
    },
    onUploadError: (err) => {
      onUploadError(err.message);
    },
  });

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;
      startUpload(Array.from(files));
    },
    [startUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      className={`relative flex cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-dashed p-12 transition-colors duration-200 ${
        isDragOver
          ? "border-indigo-400 bg-indigo-50"
          : "border-slate-300 bg-white hover:border-slate-400"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          handleFileSelect(e.target.files);
          e.target.value = "";
        }}
      />

      {isUploading ? (
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
          <Upload className="h-6 w-6 text-indigo-600" />
        </div>
      )}

      <div className="text-center">
        <p className="text-sm font-medium text-slate-700">
          {isUploading
            ? "Uploading..."
            : isDragOver
              ? "Drop your file here"
              : "Drop your CSV or Excel file here"}
        </p>
        <p className="mt-1 text-xs text-slate-400">CSV (.csv) or Excel (.xlsx, .xls)</p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
        className="btn btn-primary btn-sm cursor-pointer"
      >
        {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
        Choose File
      </button>
    </div>
  );
}
