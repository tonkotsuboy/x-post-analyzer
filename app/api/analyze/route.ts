import { NextResponse } from "next/server";

import { analyzePost } from "../../../lib/gemini";
import { getGraphemeCount, MAX_TWEET_LENGTH } from "../../../lib/utils";

import type { AnalyzeRequest, AnalyzeResponse } from "../../../lib/types";

export async function POST(request: Request): Promise<NextResponse<AnalyzeResponse>> {
  try {
    const body: AnalyzeRequest = await request.json();
    const { text, locale } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Text is required" },
        { status: 400 }
      );
    }

    const charCount = getGraphemeCount(text);
    if (charCount > MAX_TWEET_LENGTH) {
      return NextResponse.json(
        { success: false, error: "Text exceeds 280 characters" },
        { status: 400 }
      );
    }

    const result = await analyzePost(text, locale || "ja");

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Analysis error:", error);

    // エラーコードをそのまま返す（フロントエンドで翻訳される）
    const errorCode = error instanceof Error ? error.message : "ANALYSIS_FAILED";

    return NextResponse.json(
      {
        success: false,
        error: errorCode,
      },
      { status: 500 }
    );
  }
}
