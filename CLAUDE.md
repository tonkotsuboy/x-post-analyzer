# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

X Post Analyzer - A web application that analyzes X (Twitter) posts using X's official recommendation algorithm, providing:

- Detailed scoring based on the algorithm
- Specific improvement suggestions
- Optimized post examples

Live demo: https://x.kano.codes/

## Development Commands

```bash
# Start development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint check
npm run lint

# Detect unused code
npm run knip
```

## Environment Setup

Required environment variables in `.env.local`:

```bash
GEMINI_API_KEY=your_api_key_here
NEXT_PUBLIC_BASE_URL=https://x.kano.codes
```

## Architecture

### Core Analysis Flow

1. **Client Input** → `app/[locale]/page.tsx` - Main page component
2. **API Route** → `app/api/analyze/route.ts` - Validates input, handles custom API keys with HTTPS enforcement
3. **AI Processing** → `lib/gemini.ts` - Gemini 2.5 Flash with JSON response mode
4. **Prompt Generation** → `lib/prompts.ts` - Creates scoring prompts based on X's algorithm
5. **Response** → Typed `AnalysisResult` with scoring breakdown, penalties, improvements

### Scoring System

The algorithm scores posts across three tiers (defined in `lib/types.ts`):

- **Tier 1 (60 pts)**: Reply/Retweet/Like/Quote potential
- **Tier 2 (25 pts)**: Dwell time, clicks, media expansion
- **Tier 3 (15 pts)**: Profile clicks, follows, shares
- **Penalties**: Not interested, mute, block, report risks

### Internationalization

- Uses `next-intl` for i18n
- Supported locales: `ja`, `en`
- Translation files: `messages/ja.json`, `messages/en.json`
- Route structure: `/[locale]/*`

### Custom API Key Support

Users can provide their own Gemini API key. Security requirements:

- HTTPS enforced in production (`app/api/analyze/route.ts:14-22`)
- Falls back to server-side key if not provided
- Error codes returned for invalid keys: `API_KEY_INVALID`, `CUSTOM_API_KEY_INVALID`

### Error Handling

API errors are returned as error codes (not messages) for client-side translation:

- `API_KEY_NOT_CONFIGURED`
- `API_KEY_INVALID`
- `CUSTOM_API_KEY_REQUIRES_HTTPS`
- `RATE_LIMIT_EXCEEDED`
- `NETWORK_ERROR`
- `ANALYSIS_FAILED`
