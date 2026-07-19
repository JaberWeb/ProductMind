"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, CheckCircle2, AlertCircle, Loader2, FlaskConical } from "lucide-react";
import { UploadZone } from "@/components/upload-zone";
import { PreviewTable } from "@/components/preview-table";
import { ColumnMapper } from "@/components/column-mapper";
import { fetchPreview, confirmUpload, type PreviewResponse } from "@/services/upload";

type Step = "upload" | "loading" | "preview" | "error";

export default function AddItemsPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [error, setError] = useState("");
  const [data, setData] = useState<PreviewResponse | null>(null);
  const [mapping, setMapping] = useState<{ sourceColumn: string; targetField: string | null }[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [confirmResult, setConfirmResult] = useState<{ count: number; fileName: string } | null>(null);
  const [fileInfo, setFileInfo] = useState({ url: "", name: "" });

  const handleUploadComplete = async (url: string, fileName: string) => {
    setStep("loading");
    setError("");
    setFileInfo({ url, name: fileName });

    try {
      const result = await fetchPreview(url, fileName);
      setData(result);
      setMapping(result.mapping);
      setStep("preview");
    } catch (err: any) {
      setError(err.message);
      setStep("error");
    }
  };

  const handleSampleData = async (fileName: string) => {
    setStep("loading");
    setError("");
    const url = `${window.location.origin}/sample-data/${fileName}`;
    setFileInfo({ url, name: fileName });

    try {
      const result = await fetchPreview(url, fileName);
      setData(result);
      setMapping(result.mapping);
      setStep("preview");
    } catch (err: any) {
      setError(err.message);
      setStep("error");
    }
  };

  const handleUploadError = (err: string) => {
    setError(err);
    setStep("error");
  };

  const handleConfirm = async () => {
    if (!data) return;
    setConfirming(true);

    try {
      const result = await confirmUpload(fileInfo.url, fileInfo.name, mapping);
      setConfirmResult({ count: result.insertedCount, fileName: fileInfo.name });
      setTimeout(() => router.push("/manage-items"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setConfirming(false);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setError("");
    setData(null);
    setMapping([]);
    setConfirmResult(null);
    setFileInfo({ url: "", name: "" });
  };

  const confidence = data?.confidence ?? 0;
  const needsMapping = data && confidence < 80 && data.unmappedColumns.length > 0;

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
          <PlusCircle className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Items</h1>
          <p className="text-sm text-slate-500">Upload a CSV or Excel file to import your data.</p>
        </div>
      </div>

      {step === "upload" && (
        <>
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <UploadZone onUploadComplete={handleUploadComplete} onUploadError={handleUploadError} />
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                <FlaskConical className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-700">Try with sample data</p>
                <p className="text-xs text-slate-500">
                  No file handy? Preview real-looking data from different platforms.
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <button
                onClick={() => handleSampleData("sales-sample.csv")}
                className="btn btn-outline btn-sm"
              >
                Easy CSV
              </button>
              <button
                onClick={() => handleSampleData("shopify-orders.xlsx")}
                className="btn btn-outline btn-sm"
              >
                Shopify (XLSX)
              </button>
              <button
                onClick={() => handleSampleData("shopify-orders.csv")}
                className="btn btn-outline btn-sm"
              >
                Shopify (CSV)
              </button>
              <button
                onClick={() => handleSampleData("woocommerce-orders.csv")}
                className="btn btn-outline btn-sm"
              >
                WooCommerce
              </button>
            </div>
          </div>
        </>
      )}

      {step === "loading" && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-16 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-600">Processing your file...</p>
        </div>
      )}

      {step === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-red-800">Upload failed</p>
              <p className="mt-1 text-sm text-red-600">{error}</p>
              <button onClick={handleReset} className="btn btn-ghost btn-sm mt-3 text-red-700 hover:bg-red-100">
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "preview" && data && (
        <>
          {confirmResult ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">Success!</p>
                  <p className="mt-1 text-sm text-emerald-600">
                    {confirmResult.count} rows from <strong>{confirmResult.fileName}</strong> saved. Redirecting...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{data.fileName}</h2>
                    <p className="text-sm text-slate-500">{data.totalRows} rows detected</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        confidence >= 80
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {confidence}% confidence
                    </span>
                    {data.usedAi && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                        AI-assisted
                      </span>
                    )}
                  </div>
                </div>
                <PreviewTable headers={Object.keys(data.preview[0] || {})} rows={data.preview} />
              </div>

              {needsMapping && (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <ColumnMapper mapping={mapping} onChange={setMapping} />
                </div>
              )}

              {data.missingFields.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Missing optional fields</p>
                      <p className="text-sm text-amber-600">
                        {data.missingFields.join(", ")} — these will be empty.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleConfirm}
                  disabled={confirming}
                  className="btn btn-primary"
                >
                  {confirming && <Loader2 className="h-4 w-4 animate-spin" />}
                  Confirm & Save
                </button>
                <button onClick={handleReset} className="btn btn-ghost" disabled={confirming}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
