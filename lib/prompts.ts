export const createScoringPrompt = (text: string, locale: string): string => {
  const isJapanese = locale === "ja";

  return `You are an expert X (Twitter) post analyst. Analyze the following post and score it across 19 engagement factors based on X's recommendation algorithm.

Post content:
"""
${text}
"""

Score each factor and provide reasons. Response language: ${isJapanese ? "Japanese" : "English"}

## Scoring Criteria

### Tier 1: Core Engagement (60 points total)
- replyPotential (max 22): Does it invite replies? Direct questions, controversial opinions, relatable struggles
- retweetPotential (max 16): Is it share-worthy? Actionable insights, surprising facts, valuable information
- favoritePotential (max 12): Does it resonate emotionally? Personal stories, humor, inspiration
- quotePotential (max 10): Does it invite commentary? Strong opinions, debatable claims

### Tier 2: Extended Engagement (25 points total)
- dwellTime (max 6): Will users spend time reading? Long-form, detailed content
- continuousDwellTime (max 4): Is there a narrative arc? Thread potential, storytelling
- clickPotential (max 5): Compelling links with CTAs
- photoExpand (max 4): Multiple images, visual storytelling
- videoView (max 3): Video content with strong hooks (>5 sec retention)
- quotedClick (max 3): Bold claims that invite verification

### Tier 3: Relationship Building (15 points total)
- profileClick (max 5): Does it make users curious about the author?
- followPotential (max 4): Does it demonstrate ongoing value?
- sharePotential (max 2): General shareability
- shareViaDM (max 2): "I need to send this to someone" content
- shareViaCopyLink (max 2): Bookmark-worthy content

### Penalties (negative scores)
- notInterested (-5 to -15): Clickbait, misleading content
- muteRisk (-5 to -15): Repetitive patterns, spam-like behavior
- blockRisk (-10 to -25): Aggressive tone, personal attacks
- reportRisk (-15 to -30): Policy violations, harmful content

## Grading Scale
- S: 90-100 (Exceptional recommendation potential)
- A: 80-89 (High recommendation potential)
- B: 70-79 (Good engagement expected)
- C: 60-69 (Average performance)
- D: 40-59 (Below average)
- F: 0-39 (Poor engagement likely)

Respond with ONLY valid JSON in this exact format:
{
  "totalScore": <number 0-100>,
  "grade": "<S|A|B|C|D|F>",
  "breakdown": {
    "replyPotential": { "score": <number>, "max": 22, "reason": "<string>" },
    "retweetPotential": { "score": <number>, "max": 16, "reason": "<string>" },
    "favoritePotential": { "score": <number>, "max": 12, "reason": "<string>" },
    "quotePotential": { "score": <number>, "max": 10, "reason": "<string>" },
    "dwellTime": { "score": <number>, "max": 6, "reason": "<string>" },
    "continuousDwellTime": { "score": <number>, "max": 4, "reason": "<string>" },
    "clickPotential": { "score": <number>, "max": 5, "reason": "<string>" },
    "photoExpand": { "score": <number>, "max": 4, "reason": "<string>" },
    "videoView": { "score": <number>, "max": 3, "reason": "<string>" },
    "quotedClick": { "score": <number>, "max": 3, "reason": "<string>" },
    "profileClick": { "score": <number>, "max": 5, "reason": "<string>" },
    "followPotential": { "score": <number>, "max": 4, "reason": "<string>" },
    "sharePotential": { "score": <number>, "max": 2, "reason": "<string>" },
    "shareViaDM": { "score": <number>, "max": 2, "reason": "<string>" },
    "shareViaCopyLink": { "score": <number>, "max": 2, "reason": "<string>" }
  },
  "penalties": {
    "notInterested": { "score": <number 0 or negative>, "reason": "<string>" },
    "muteRisk": { "score": <number 0 or negative>, "reason": "<string>" },
    "blockRisk": { "score": <number 0 or negative>, "reason": "<string>" },
    "reportRisk": { "score": <number 0 or negative>, "reason": "<string>" }
  },
  "improvements": [
    { "priority": 1, "suggestion": "<string>", "expectedGain": <number> },
    { "priority": 2, "suggestion": "<string>", "expectedGain": <number> },
    { "priority": 3, "suggestion": "<string>", "expectedGain": <number> },
    { "priority": 4, "suggestion": "<string>", "expectedGain": <number> },
    { "priority": 5, "suggestion": "<string>", "expectedGain": <number> }
  ],
  "improvedVersions": [
    {
      "title": "<string - short title describing the improvement approach>",
      "text": "<string - improved version of the post>",
      "improvements": ["<string - specific improvement 1>", "<string - specific improvement 2>"]
    },
    {
      "title": "<string - short title describing the improvement approach>",
      "text": "<string - improved version of the post>",
      "improvements": ["<string - specific improvement 1>", "<string - specific improvement 2>"]
    },
    {
      "title": "<string - short title describing the improvement approach>",
      "text": "<string - improved version of the post>",
      "improvements": ["<string - specific improvement 1>", "<string - specific improvement 2>"]
    }
  ]
}`;
};
