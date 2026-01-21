export type Grade = "S" | "A" | "B" | "C" | "D" | "F";

export interface ScoreItem {
  score: number;
  max: number;
  reason: string;
}

export interface PenaltyItem {
  score: number;
  reason: string;
}

export interface Improvement {
  priority: number;
  suggestion: string;
  expectedGain: number;
}

export interface ImprovedVersion {
  title: string;
  text: string;
  improvements: string[];
}

export interface ScoreBreakdown {
  // Tier 1: Core Engagement (60 points)
  replyPotential: ScoreItem;
  retweetPotential: ScoreItem;
  favoritePotential: ScoreItem;
  quotePotential: ScoreItem;

  // Tier 2: Extended Engagement (25 points)
  dwellTime: ScoreItem;
  continuousDwellTime: ScoreItem;
  clickPotential: ScoreItem;
  photoExpand: ScoreItem;
  videoView: ScoreItem;
  quotedClick: ScoreItem;

  // Tier 3: Relationship Building (15 points)
  profileClick: ScoreItem;
  followPotential: ScoreItem;
  sharePotential: ScoreItem;
  shareViaDM: ScoreItem;
  shareViaCopyLink: ScoreItem;
}

export interface Penalties {
  notInterested: PenaltyItem;
  muteRisk: PenaltyItem;
  blockRisk: PenaltyItem;
  reportRisk: PenaltyItem;
}

export interface AnalysisResult {
  totalScore: number;
  grade: Grade;
  breakdown: ScoreBreakdown;
  penalties: Penalties;
  improvements: Improvement[];
  improvedVersions: ImprovedVersion[];
}

export interface AnalyzeRequest {
  text: string;
  locale: string;
  customApiKey?: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}
