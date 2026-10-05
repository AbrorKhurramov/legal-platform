import type { TPageableRequestParams } from "@/shared/api/api-types";

import type { KnowledgeCategory } from "./knowledge.const";

export interface KnowledgeArticleDTO {
  id: string;
  question: string;
  answer: string;
  category: KnowledgeCategory;
  tags: string[];
  author: { id: string; fullName: string };
  usageCount: number;
  updatedAt: string;
  sourceMatterNumber: string | null;
}

export interface KnowledgeListRequestParams extends TPageableRequestParams {
  search?: string;
  category?: KnowledgeCategory;
}
