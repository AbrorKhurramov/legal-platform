import { ProcessingStatus } from "@/entities/document/document.entry";

import type { FileRecord, FolderRecord } from "../mock-db.types";
import { SEED_DOCUMENTS } from "./seed-documents";

//* Flesh kartadagi «Tasdiqlangan ichki hujjatlar» bo'limlari, backend seed'i bilan bir xil
const ROOT_FOLDERS = [
  "HR",
  "АГРОСАНОАТ",
  "АХБОРОТ ТЕХНОЛОГИЯ",
  "АХБОРОТ ХАВФСИЗЛИГИ",
  "БАНК АППАРАТИ",
  "БИЗНЕС",
  "Газна",
  "ИЧКИ АУДИТ",
  "КОМПЛАЕНС",
  "КОРПОРАТИВ БИЗНЕС",
  "КОРПОРАТИВ БОШКАРУВ",
  "КОРРУПЦИЯ",
  "КРЕДИТЛАРНИ БОШКАРИШ",
  "МАХАЛЛАБАЙ",
  "МИЖОЗЛАР БИЛАН АЛОКАЛАР МАРКАЗИ",
  "МОЛИЯВИЙ БЛОК",
  "МУАММОЛИ КРЕДИТЛАР",
  "РИСК",
  "СТРАТЕГИЯ",
  "ХОРИЖИЙ",
  "ЮРИДИК",
];

const folderId = (name: string) => `f-${ROOT_FOLDERS.indexOf(name) + 1}`;

const POWERS_OF_ATTORNEY_ID = "f-yur-ishonchnoma";

export const buildFolders = (): FolderRecord[] => [
  ...ROOT_FOLDERS.map((name) => ({ id: folderId(name), name, parentId: null })),
  { id: POWERS_OF_ATTORNEY_ID, name: "Ishonchnomalar", parentId: folderId("ЮРИДИК") },
];

const PLACEMENT: Record<string, { folderId: string; uploadedById: string; daysAgo: number }> = {
  ishonchnoma: { folderId: POWERS_OF_ATTORNEY_ID, uploadedById: "u-law-1", daysAgo: 2 },
  shartnoma: { folderId: folderId("КРЕДИТЛАРНИ БОШКАРИШ"), uploadedById: "u-law-1", daysAgo: 5 },
  hisobot: { folderId: folderId("МУАММОЛИ КРЕДИТЛАР"), uploadedById: "u-head-1", daysAgo: 9 },
};

const daysAgoIso = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();

export const buildFiles = (): FileRecord[] =>
  SEED_DOCUMENTS.map(({ key, url, ...document }) => {
    const placement = PLACEMENT[key];
    const createdAt = daysAgoIso(placement.daysAgo);
    return {
      ...document,
      id: `file-${key}`,
      confidential: false,
      folderId: placement.folderId,
      uploadedById: placement.uploadedById,
      createdAt,
      status: ProcessingStatus.DONE,
      attempts: 1,
      processedAt: createdAt,
      errorMessage: null,
      originalUrl: url,
      readyAt: null,
    };
  });
