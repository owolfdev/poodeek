import { NextResponse } from "next/server";

import fs from "node:fs";
import path from "node:path";

export async function GET(request: Request) {
  const audioDir = path.join(process.cwd(), "public", "audio", "app");

  const files = fs.readdirSync(audioDir).map((file) => ({ file }));

  const data = {
    message: "GET request received",
    data: files,
  };

  return NextResponse.json(data);
}
