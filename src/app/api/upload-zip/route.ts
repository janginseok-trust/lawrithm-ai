import { NextRequest, NextResponse } from "next/server";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import os from "os";
import { verifyToken } from "@/lib/verifyToken";

const TMP_PATH = path.join(os.tmpdir(), "laws_zip_upload");
const CSV_PATH = path.join(os.tmpdir(), "laws_merge.csv");
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";
const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 100; // 최대 100개

export async function POST(req: NextRequest) {
  // 관리자만 허용 (x-user-email 헤더 또는 토큰 인증)
  const adminHeader = req.headers.get("x-user-email");
  if (adminHeader !== ADMIN_EMAIL) {
    // 토큰 인증 추가
    const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
    const decoded = await verifyToken(idToken);
    if (!decoded?.email || decoded.email !== ADMIN_EMAIL) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ ok: false, error: "No file provided." });

    // 크기 제한
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ ok: false, error: "File too large." });
    }

    // Clean up temp folder if exists
    if (fs.existsSync(TMP_PATH)) fs.rmSync(TMP_PATH, { recursive: true, force: true });
    fs.mkdirSync(TMP_PATH, { recursive: true });

    // Extract buffer from uploaded zip file
    const buffer = Buffer.from(await file.arrayBuffer());
    const zip = new AdmZip(buffer);
    zip.extractAllTo(TMP_PATH, true);

    // Filter for .txt files only + 개수 제한
    const allFiles = fs.readdirSync(TMP_PATH).filter(f => f.endsWith(".txt"));
    if (allFiles.length === 0)
      return NextResponse.json({ ok: false, error: "No .txt files found in zip." });
    if (allFiles.length > MAX_FILES)
      return NextResponse.json({ ok: false, error: "Too many .txt files (limit 100)." });

    // Convert to CSV rows
    let rows = [["filename", "content"]];
    for (const filename of allFiles) {
      const fullpath = path.join(TMP_PATH, filename);
      const content = fs.readFileSync(fullpath, "utf-8").replace(/\r?\n/g, "⏎"); // Preserve line breaks
      rows.push([filename, content]);
    }
    // Save as CSV (utf-8 BOM)
    const csvContent = rows.map(r => r.join(",")).join("\n");
    fs.writeFileSync(CSV_PATH, "\uFEFF" + csvContent, "utf-8");

    return NextResponse.json({ ok: true, files: allFiles.length });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message });
  }
}
