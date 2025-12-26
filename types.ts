export interface ShortenedLink {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: number;
  clicks: number;
  tags?: string[];
  aiSummary?: string;
  category?: string;
}

export interface GeminiAnalysisResult {
  tags: string[];
  summary: string;
  category: string;
}
