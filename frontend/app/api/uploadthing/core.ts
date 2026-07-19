import { createUploadthing } from "uploadthing/next";
import type { FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  csvUploader: f({ blob: { maxFileSize: "8MB" } })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
