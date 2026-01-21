import { GoogleGenerativeAI } from "@google/generative-ai";

import { createScoringPrompt } from "./prompts";

import type { AnalysisResult } from "./types";

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

  if (customApiKey) {
    try {
      genAI = new GoogleGenerativeAI(customApiKey);
    } catch (error) {
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
