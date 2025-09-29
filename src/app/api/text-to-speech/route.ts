import { speakText } from "@/utils/text-to-speech";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

type ResponseData = {
  message: string;
  status: string;
  error?: string;
};

//await speakText(text);

export async function POST(request: Request) {
  let phrase = "Bonjour le Monde";

  try {
    const { text } = await request.json();
    await speakText(text);
    phrase = text;
  } catch (error) {
    console.error(error);
  }

  return NextResponse.json({
    message: `Text to speech: ${phrase}`,
    status: "success",
    error: null,
  });
}
