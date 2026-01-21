/**
 * Intl.Segmenterを使用して正確な文字数（書記素クラスタ）をカウント
 * 絵文字や結合文字を正しく1文字として扱う
 */
export function getGraphemeCount(text: string): number {
  if (!text) return 0;

  const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
  const segments = segmenter.segment(text);
  return Array.from(segments).length;
}

/**
 * 文字数制限の最大値
 */
export const MAX_TWEET_LENGTH = 280;
