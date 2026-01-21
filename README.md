# X Post Analyzer

A web application that analyzes X (Twitter) posts, providing scoring based on the recommendation algorithm and improvement suggestions.

🔗 **Live Demo**: [https://x.kano.codes/](https://x.kano.codes/)

## Features

- **Post Analysis**: Detailed scoring based on X's actual recommendation algorithm
- **Improvement Suggestions**: AI-powered specific improvement suggestions and optimized post examples
- **Multi-language Support**: Supports both Japanese and English
- **Sample Images**: Gallery feature to view actual post examples
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## Scoring Metrics

### Tier 1 (Engagement)
- Reply, Retweet, Like, and Quote potential

### Tier 2 (Dwell Time)
- Dwell time, Clicks, Image expansion, Video playback, etc.

### Tier 3 (Profile Engagement)
- Profile clicks, Follow, Share, etc.

### Penalties
- Not interested, Mute, Block, Report risk

## Tech Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **Language**: TypeScript
- **UI Library**: Mantine UI 8.3
- **AI**: Google Generative AI (Gemini)
- **Internationalization**: next-intl
- **Styling**: CSS Modules + PostCSS
- **Code Quality**: ESLint + knip

## Setup

### Requirements

- Node.js 20 or higher
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file and set the following environment variables:

```bash
# Gemini API Key
GEMINI_API_KEY=your_api_key_here

# Base URL (Production)
NEXT_PUBLIC_BASE_URL=https://x.kano.codes
```

Refer to `.env.example` for reference.

### Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

```bash
# Start development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Detect unused code
npm run knip
```

## Project Structure

```
.
├── app/              # Next.js App Router
│   └── [locale]/     # Multi-language pages
├── components/       # React components
├── lib/              # Utility functions & type definitions
├── messages/         # Internationalization messages
├── public/           # Static files
│   └── samples/      # Sample images
└── i18n/             # Internationalization config
```

## License

MIT

## Author

Takeshi Kano ([@tonkotsuboy_com](https://x.com/tonkotsuboy_com))
