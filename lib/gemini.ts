import { GoogleGenerativeAI } from "@google/generative-ai";

import { createScoringPrompt } from "./prompts";

import type { AnalysisResult, SSEEvent } from "./types";

const apiKey = process.env.GEMINI_API_KEY;

if (apiKey === undefined || apiKey === "") {
  console.warn("GEMINI_API_KEY is not set");
}

const defaultGenAI =
  apiKey !== undefined && apiKey !== "" ? new GoogleGenerativeAI(apiKey) : null;

export async function analyzePost(
  text: string,
  locale: string,
  customApiKey?: string
): Promise<AnalysisResult> {
  let genAI: GoogleGenerativeAI | null;

  if (customApiKey !== undefined && customApiKey !== "") {
    try {
      genAI = new GoogleGenerativeAI(customApiKey);
    } catch {
      throw new Error("CUSTOM_API_KEY_INVALID");
    }
  } else {
    genAI = defaultGenAI;
  }

  if (!genAI) {
    throw new Error("API_KEY_NOT_CONFIGURED");
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const prompt = createScoringPrompt(text, locale);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    const analysis: AnalysisResult = JSON.parse(responseText);

    return analysis;
  } catch (error) {
    // Gemini APIのエラーを適切なエラーコードに変換
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("API_KEY_INVALID");
      }
      if (error.message.includes("quota") || error.message.includes("rate limit")) {
        throw new Error("RATE_LIMIT_EXCEEDED");
      }
      if (error.message.includes("network") || error.message.includes("fetch")) {
        throw new Error("NETWORK_ERROR");
      }
    }
    // その他のエラーは汎用エラーとして扱う
    throw new Error("ANALYSIS_FAILED");
  }
}

export async function* analyzePostStream(
  text: string,
  locale: string,
  customApiKey?: string
): AsyncGenerator<SSEEvent> {
  let genAI: GoogleGenerativeAI | null;

  yield { phase: 'start', progress: 0 };

  if (customApiKey !== undefined && customApiKey !== "") {
    try {
      genAI = new GoogleGenerativeAI(customApiKey);
    } catch {
      yield { phase: 'error', progress: 0, error: "CUSTOM_API_KEY_INVALID" };
      return;
    }
  } else {
    genAI = defaultGenAI;
  }

  if (!genAI) {
    yield { phase: 'error', progress: 0, error: "API_KEY_NOT_CONFIGURED" };
    return;
  }

  try {
    yield { phase: 'parsing', progress: 15 };

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const prompt = createScoringPrompt(text, locale);

    yield { phase: 'calculating', progress: 30 };

    const result = await model.generateContentStream(prompt);

    let accumulatedText = "";
    let chunkCount = 0;

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      accumulatedText += chunkText;
      chunkCount++;

      // チャンク数に応じて進捗を更新 (30% から 85% の範囲)
      const streamProgress = Math.min(30 + chunkCount * 10, 85);

      if (chunkCount <= 3) {
        yield { phase: 'calculating', progress: streamProgress };
      } else {
        yield { phase: 'generating', progress: streamProgress };
      }
    }

    yield { phase: 'generating', progress: 90 };

    const analysis: AnalysisResult = JSON.parse(accumulatedText);

    yield { phase: 'complete', progress: 100, data: analysis };
  } catch (error) {
    let errorCode = "ANALYSIS_FAILED";

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorCode = "API_KEY_INVALID";
      } else if (error.message.includes("quota") || error.message.includes("rate limit")) {
        errorCode = "RATE_LIMIT_EXCEEDED";
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        errorCode = "NETWORK_ERROR";
      }
    }

    yield { phase: 'error', progress: 0, error: errorCode };
  }
}
