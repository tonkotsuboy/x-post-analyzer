import { analyzePostStream } from "../../../../lib/gemini";
import { getGraphemeCount, MAX_TWEET_LENGTH } from "../../../../lib/utils";

import type { AnalyzeRequest, SSEEvent } from "../../../../lib/types";

function createSSEMessage(event: SSEEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(request: Request): Promise<Response> {
  // HTTPSチェック（本番環境のみ）
  let customApiKey: string | undefined;
  let text: string;
  let locale: string;

  try {
    const body: AnalyzeRequest = await request.json();
    text = body.text;
    locale = body.locale;
    customApiKey = body.customApiKey;
  } catch {
    const errorEvent: SSEEvent = { phase: 'error', progress: 0, error: 'INVALID_REQUEST' };
    return new Response(createSSEMessage(errorEvent), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }

  // HTTPSチェック（本番環境のみ）
  if (customApiKey != null && customApiKey !== '' && process.env.NODE_ENV === 'production') {
    const protocol = request.headers.get('x-forwarded-proto') ?? 'http';
    if (protocol !== 'https') {
      const errorEvent: SSEEvent = { phase: 'error', progress: 0, error: 'CUSTOM_API_KEY_REQUIRES_HTTPS' };
      return new Response(createSSEMessage(errorEvent), {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }
  }

  if (!text || text.trim().length === 0) {
    const errorEvent: SSEEvent = { phase: 'error', progress: 0, error: 'TEXT_REQUIRED' };
    return new Response(createSSEMessage(errorEvent), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }

  const charCount = getGraphemeCount(text);
  if (charCount > MAX_TWEET_LENGTH) {
    const errorEvent: SSEEvent = { phase: 'error', progress: 0, error: 'TEXT_TOO_LONG' };
    return new Response(createSSEMessage(errorEvent), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        for await (const event of analyzePostStream(text, locale, customApiKey)) {
          controller.enqueue(encoder.encode(createSSEMessage(event)));
        }
      } catch (error) {
        console.error("Stream error:", error);
        const errorEvent: SSEEvent = { phase: 'error', progress: 0, error: 'ANALYSIS_FAILED' };
        controller.enqueue(encoder.encode(createSSEMessage(errorEvent)));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
