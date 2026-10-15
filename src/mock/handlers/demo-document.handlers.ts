import {
  type DocumentDetailDTO,
  DocumentFormat,
  type DocumentListItemDTO,
  DocumentStatus,
  type DocumentVersionDTO,
  type FileManagerItemDTO,
  ProcessingStatus,
  STATUS_BY_VERSION_KIND,
  VersionKind,
} from "@/entities/document/document.entry";
import type { FolderDTO } from "@/entities/folder/folder.entry";
import { UserRole } from "@/entities/user/user.entry";

import { extractDemoContent } from "../demo-extract";
import { getDemoFile, putDemoFile } from "../demo-file-store";
import { getDb } from "../mock-db";
import type { FileRecord, UserRecord } from "../mock-db.types";
import { type MockRequest, type MockResult, mockRoute } from "../mock-router";
import { fail, matchesSearch, nowIso, ok, paginate } from "../mock-utils";
import { createId } from "../seed/random";
import { SEED_DOC_TYPES } from "../seed/seed-documents";

//* Demo sessiya uchun backend'ning /api/v1 fayl, papka va hujjat endpointlari: bir xil shakl, bir xil ko'rinish qoidalari.

const PROCESSING_AFTER_MS = 1500;
const READY_AFTER_MS = 5000;
const SNIPPET_LENGTH = 180;

const TEXTS = {
  folderMissing: { uz: "Papka topilmadi", ru: "Папка не найдена" },
  folderRequired: { uz: "Papkani tanlang", ru: "Выберите папку" },
  folderTaken: { uz: "Bu yerda bunday nomli papka allaqachon bor", ru: "Здесь уже есть папка с таким названием" },
  folderNotEmpty: {
    uz: "Papka bo'sh emas: avval ichidagi fayl va papkalarni ko'chiring",
    ru: "Папка не пуста: сначала перенесите вложенные файлы и папки",
  },
  folderDeleted: { uz: "Papka o'chirildi", ru: "Папка удалена" },
  nameRequired: { uz: "Papka nomini kiriting", ru: "Введите название папки" },
  noFiles: { uz: "Fayl tanlanmagan", ru: "Файлы не выбраны" },
  signedLocked: { uz: "Hujjat imzolangan: yangi versiya qo'shib bo'lmaydi", ru: "Документ подписан: новую версию добавить нельзя" },
  alreadySigned: { uz: "Hujjat allaqachon imzolangan", ru: "Документ уже подписан" },
  versionMissing: { uz: "Bunday versiya yo'q", ru: "Такой версии нет" },
  originalMissing: {
    uz: "Asl fayl bu brauzerda saqlanmagan (demo rejim)",
    ru: "Оригинал не сохранён в этом браузере (демо-режим)",
  },
} as const;

const say = (request: MockRequest, status: number, key: keyof typeof TEXTS): MockResult => ({ status, message: TEXTS[key][request.language] });

const EXTENSION_FORMATS: Record<string, DocumentFormat> = {
  pdf: DocumentFormat.PDF,
  doc: DocumentFormat.DOC,
  docx: DocumentFormat.DOCX,
  xls: DocumentFormat.XLS,
  xlsx: DocumentFormat.XLSX,
  png: DocumentFormat.PNG,
  jpg: DocumentFormat.JPEG,
  jpeg: DocumentFormat.JPEG,
  tif: DocumentFormat.TIFF,
  tiff: DocumentFormat.TIFF,
};

const isLegalRole = (user: UserRecord) => user.role !== UserRole.ADMIN;

/** The document's creator: the uploader of its first version. */
const creatorIdOf = (documentId: string) =>
  getDb()
    .files.filter((file) => file.documentId === documentId)
    .reduce((first, file) => (file.versionNo < first.versionNo ? file : first)).uploadedById;

/** Same rule as the backend: a confidential document only for its creator and the head of department. */
const isVisible = (file: FileRecord, user: UserRecord) =>
  isLegalRole(user) && (!file.confidential || creatorIdOf(file.documentId) === user.id || user.role === UserRole.HEAD);

/** Processing is simulated on read: pending, then processing, then done at {@code readyAt}. */
const advance = (file: FileRecord) => {
  if (!file.readyAt || file.status === ProcessingStatus.DONE || file.status === ProcessingStatus.FAILED) return file;
  const now = Date.now();
  const ready = new Date(file.readyAt).getTime();
  if (now >= ready) {
    file.status = ProcessingStatus.DONE;
    file.processedAt = file.readyAt;
    file.readyAt = null;
  } else if (now >= ready - READY_AFTER_MS + PROCESSING_AFTER_MS) {
    file.status = ProcessingStatus.PROCESSING;
  }
  return file;
};

const userRef = (id: string) => {
  const user = getDb().users.find((item) => item.id === id);
  return { id, fullName: user?.fullName ?? "—" };
};

const folderRef = (id: string | null) => {
  const folder = id ? getDb().folders.find((item) => item.id === id) : undefined;
  return folder ? { id: folder.id, name: folder.name } : null;
};

const fullText = (file: FileRecord) => file.pages.map((page) => page.text).join("\n");

const versionsOf = (documentId: string) =>
  getDb()
    .files.filter((file) => file.documentId === documentId)
    .map(advance)
    .sort((a, b) => b.versionNo - a.versionNo);

const latestOf = (documentId: string) => versionsOf(documentId)[0];

/** The list shows the newest finished version, so a document stays listed while its next version is processing. */
const shownOf = (documentId: string) => versionsOf(documentId).find((file) => file.status === ProcessingStatus.DONE);

const documentStatusOf = (documentId: string): DocumentStatus => STATUS_BY_VERSION_KIND[latestOf(documentId).versionKind];

const documentFacts = (documentId: string) => {
  const versions = versionsOf(documentId);
  const latest = versions[0];
  const first = versions[versions.length - 1];
  const edited = latest.versionNo > 1;
  return {
    documentStatus: documentStatusOf(documentId),
    latestVersionNo: latest.versionNo,
    documentCreatedBy: userRef(first.uploadedById),
    documentCreatedAt: first.createdAt,
    lastEditedBy: edited ? userRef(latest.uploadedById) : null,
    lastEditedAt: edited ? latest.createdAt : null,
  };
};

/** One entry per document: its latest version, or the newest finished one for the documents list. */
const documentsOf = (pick: (documentId: string) => FileRecord | undefined) =>
  [...new Set(getDb().files.map((file) => file.documentId))].map(pick).filter((file): file is FileRecord => !!file);

const snippetOf = (file: FileRecord, search?: string) => {
  const text = fullText(file).replace(/\s+/g, " ").trim();
  const at = search ? text.toLowerCase().indexOf(search.trim().toLowerCase()) : -1;
  const start = at > SNIPPET_LENGTH / 3 ? at - SNIPPET_LENGTH / 3 : 0;
  return text.slice(start, start + SNIPPET_LENGTH) || null;
};

const toFileManagerItem = (file: FileRecord): FileManagerItemDTO => ({
  id: file.id,
  documentId: file.documentId,
  versionNo: file.versionNo,
  documentStatus: documentStatusOf(file.documentId),
  originalName: file.originalName,
  format: file.format,
  sizeBytes: file.sizeBytes,
  confidential: file.confidential,
  folder: folderRef(file.folderId),
  uploadedBy: userRef(file.uploadedById),
  createdAt: file.createdAt,
  status: file.status,
  source: file.source,
  attempts: file.attempts,
  docType: file.docType,
  needsReview: file.needsReview,
  errorMessage: file.errorMessage,
  processedAt: file.processedAt,
});

const toListItem = (file: FileRecord, search?: string): DocumentListItemDTO => {
  const facts = documentFacts(file.documentId);
  return {
    id: file.id,
    documentId: file.documentId,
    versionNo: file.versionNo,
    documentStatus: facts.documentStatus,
    lastEditedBy: facts.lastEditedBy,
    lastEditedAt: facts.lastEditedAt,
    originalName: file.originalName,
    format: file.format,
    source: file.source,
    docType: file.docType,
    language: file.language,
    pageCount: file.pageCount,
    needsReview: file.needsReview,
    confidential: file.confidential,
    folder: folderRef(file.folderId),
    uploadedBy: facts.documentCreatedBy,
    createdAt: file.createdAt,
    processedAt: file.processedAt,
    snippet: snippetOf(file, search),
  };
};

const toDetail = (file: FileRecord): DocumentDetailDTO => {
  const { folderId, uploadedById, attempts, originalUrl, readyAt, latest, ...rest } = file;
  void attempts;
  void originalUrl;
  void readyAt;
  void latest;
  return { ...rest, ...documentFacts(file.documentId), folder: folderRef(folderId), uploadedBy: userRef(uploadedById) };
};

const toVersion = (file: FileRecord): DocumentVersionDTO => ({
  id: file.id,
  versionNo: file.versionNo,
  versionKind: file.versionKind,
  comment: file.versionComment,
  originalName: file.originalName,
  format: file.format,
  sizeBytes: file.sizeBytes,
  uploadedBy: userRef(file.uploadedById),
  createdAt: file.createdAt,
  status: file.status,
  latest: file.latest,
});

const descendantsOf = (folderId: string): string[] => [
  folderId,
  ...getDb()
    .folders.filter((folder) => folder.parentId === folderId)
    .flatMap((folder) => descendantsOf(folder.id)),
];

const sha256 = async (body: Blob) =>
  [...new Uint8Array(await crypto.subtle.digest("SHA-256", await body.arrayBuffer()))].map((byte) => byte.toString(16).padStart(2, "0")).join("");

interface IVersionPlace {
  documentId: string | null;
  versionNo: number;
  versionKind: VersionKind;
  versionComment: string | null;
  folderId: string;
  confidential: boolean;
}

/** Extraction runs at upload time in the browser; the record only turns DONE at {@code readyAt}. */
const buildFileRecord = async (upload: File, uploadedById: string, place: IVersionPlace): Promise<FileRecord> => {
  const extension = upload.name.split(".").pop()?.toLowerCase() ?? "";
  const format = EXTENSION_FORMATS[extension] ?? DocumentFormat.PDF;
  const id = createId("file");
  const extraction = await extractDemoContent(format, upload);
  await putDemoFile(id, upload);
  return {
    id,
    documentId: place.documentId ?? id,
    versionNo: place.versionNo,
    versionKind: place.versionKind,
    versionComment: place.versionComment,
    latest: true,
    originalName: upload.name,
    format,
    contentType: upload.type || "application/octet-stream",
    sizeBytes: upload.size,
    sha256: await sha256(upload),
    confidential: place.confidential,
    folderId: place.folderId,
    uploadedById,
    createdAt: nowIso(),
    status: ProcessingStatus.PENDING,
    attempts: 0,
    source: extraction.source,
    docType: null,
    language: null,
    confidence: 1,
    needsReview: false,
    pageCount: extraction.pages.length,
    processedAt: null,
    errorMessage: null,
    pages: extraction.pages,
    fields: [],
    stamps: [],
    warnings: extraction.warnings,
    originalUrl: null,
    readyAt: new Date(Date.now() + READY_AFTER_MS).toISOString(),
  };
};

const guard = (request: MockRequest, needsFileManager = false): MockResult | null => {
  const user = request.user!;
  if (!isLegalRole(user)) return fail(request, 403, "forbidden");
  if (needsFileManager && !user.fileManagerAccess) return fail(request, 403, "actionForbidden");
  return null;
};

const findVisible = (request: MockRequest, id: string) => {
  const file = getDb().files.find((item) => item.id === id);
  if (!file) return { error: fail(request, 404, "notFound") };
  if (!isVisible(file, request.user!)) return { error: fail(request, 403, "forbidden") };
  return { file: advance(file) };
};

const isNameTaken = (name: string, parentId: string | null, exceptId?: string) =>
  getDb().folders.some((folder) => folder.parentId === parentId && folder.id !== exceptId && folder.name.toLowerCase() === name.toLowerCase());

const registerFolderRoutes = () => {
  mockRoute("get", "/api/v1/folders", (request) => {
    const denied = guard(request);
    if (denied) return denied;
    const counts = new Map<string, number>();
    documentsOf(shownOf)
      .filter((file) => file.folderId && isVisible(file, request.user!))
      .forEach((file) => counts.set(file.folderId!, (counts.get(file.folderId!) ?? 0) + 1));
    const folders: FolderDTO[] = getDb()
      .folders.map((folder) => ({ ...folder, documentCount: counts.get(folder.id) ?? 0 }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return ok(folders);
  });

  mockRoute("post", "/api/v1/folders", (request) => {
    const denied = guard(request, true);
    if (denied) return denied;
    const name = String(request.body.name ?? "").trim();
    const parentId = (request.body.parentId as string | null | undefined) ?? null;
    if (!name) return say(request, 400, "nameRequired");
    if (parentId && !getDb().folders.some((folder) => folder.id === parentId)) return say(request, 404, "folderMissing");
    if (isNameTaken(name, parentId)) return say(request, 409, "folderTaken");
    const folder = { id: createId("f"), name, parentId };
    getDb().folders.push(folder);
    return { status: 201, data: { ...folder, documentCount: 0 } };
  });

  mockRoute("put", "/api/v1/folders/:id", (request) => {
    const denied = guard(request, true);
    if (denied) return denied;
    const folder = getDb().folders.find((item) => item.id === request.params.id);
    if (!folder) return say(request, 404, "folderMissing");
    const name = String(request.body.name ?? "").trim();
    if (!name) return say(request, 400, "nameRequired");
    if (isNameTaken(name, folder.parentId, folder.id)) return say(request, 409, "folderTaken");
    folder.name = name;
    const documentCount = documentsOf(shownOf).filter((file) => file.folderId === folder.id && isVisible(file, request.user!)).length;
    return ok({ ...folder, documentCount });
  });

  mockRoute("delete", "/api/v1/folders/:id", (request) => {
    const denied = guard(request, true);
    if (denied) return denied;
    const db = getDb();
    const folder = db.folders.find((item) => item.id === request.params.id);
    if (!folder) return say(request, 404, "folderMissing");
    // Any file counts, also ones this user cannot see — exactly like the backend.
    if (db.folders.some((item) => item.parentId === folder.id) || db.files.some((file) => file.folderId === folder.id)) {
      return say(request, 409, "folderNotEmpty");
    }
    db.folders = db.folders.filter((item) => item.id !== folder.id);
    return ok(null, TEXTS.folderDeleted[request.language]);
  });
};

const registerFileRoutes = () => {
  mockRoute("post", "/api/v1/files", async (request) => {
    const denied = guard(request, true);
    if (denied) return denied;
    const folderId = request.query.folderId;
    if (!folderId) return say(request, 400, "folderRequired");
    if (!getDb().folders.some((folder) => folder.id === folderId)) return say(request, 404, "folderMissing");
    const form = request.config.data instanceof FormData ? request.config.data : null;
    const uploads = (form?.getAll("files") ?? []).filter((item): item is File => item instanceof File);
    if (!uploads.length) return say(request, 400, "noFiles");

    const created: FileRecord[] = [];
    for (const upload of uploads) {
      created.push(
        await buildFileRecord(upload, request.user!.id, {
          documentId: null,
          versionNo: 1,
          versionKind: VersionKind.ORIGINAL,
          versionComment: null,
          folderId,
          confidential: request.query.confidential === "true",
        }),
      );
    }
    getDb().files.unshift(...created);
    return { status: 201, data: created.map(toFileManagerItem) };
  });

  mockRoute("get", "/api/v1/files", (request) => {
    const denied = guard(request, true);
    if (denied) return denied;
    const { search, status, mineOnly } = request.query;
    const files = documentsOf(latestOf)
      .filter((file) => isVisible(file, request.user!))
      .filter((file) => !status || file.status === status)
      .filter((file) => mineOnly !== "true" || file.uploadedById === request.user!.id)
      .filter((file) => matchesSearch(search, file.originalName))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const page = paginate(files, request.query);
    return ok({ data: page.data.map(toFileManagerItem), totalCount: page.totalCount });
  });

  mockRoute("post", "/api/v1/files/:id/reprocess", (request) => {
    const denied = guard(request, true);
    if (denied) return denied;
    const { file, error } = findVisible(request, request.params.id);
    if (error) return error;
    Object.assign(file, {
      status: ProcessingStatus.PENDING,
      attempts: file.attempts + 1,
      processedAt: null,
      readyAt: new Date(Date.now() + READY_AFTER_MS).toISOString(),
    });
    return ok(toFileManagerItem(file));
  });

  mockRoute("patch", "/api/v1/files/:id/folder", (request) => {
    const denied = guard(request, true);
    if (denied) return denied;
    const { file, error } = findVisible(request, request.params.id);
    if (error) return error;
    const folderId = String(request.body.folderId ?? "");
    if (!getDb().folders.some((folder) => folder.id === folderId)) return say(request, 404, "folderMissing");
    getDb()
      .files.filter((item) => item.documentId === file.documentId)
      .forEach((item) => (item.folderId = folderId));
    return ok(toFileManagerItem(latestOf(file.documentId)));
  });

  const addVersion =
    (kind: VersionKind) =>
    async (request: MockRequest): Promise<MockResult> => {
      const denied = guard(request, true);
      if (denied) return denied;
      const { file, error } = findVisible(request, request.params.id);
      if (error) return error;
      const latest = latestOf(file.documentId);
      if (latest.versionKind === VersionKind.SIGNED) return say(request, 409, kind === VersionKind.SIGNED ? "alreadySigned" : "signedLocked");
      const form = request.config.data instanceof FormData ? request.config.data : null;
      const upload = form?.get("file");
      if (!(upload instanceof File)) return say(request, 400, "noFiles");
      const record = await buildFileRecord(upload, request.user!.id, {
        documentId: file.documentId,
        versionNo: latest.versionNo + 1,
        versionKind: kind,
        versionComment: request.query.comment?.trim() || null,
        folderId: latest.folderId ?? "",
        confidential: latest.confidential,
      });
      latest.latest = false;
      getDb().files.unshift(record);
      return { status: 201, data: toFileManagerItem(record) };
    };

  mockRoute("post", "/api/v1/files/:id/versions", addVersion(VersionKind.EDIT));
  mockRoute("post", "/api/v1/files/:id/signed", addVersion(VersionKind.SIGNED));

  mockRoute("get", "/api/v1/files/:id/content", async (request) => {
    const { file, error } = findVisible(request, request.params.id);
    if (error) return error;
    const body = file.originalUrl ? await fetch(file.originalUrl).then((response) => response.blob()) : await getDemoFile(file.id);
    if (!body) return say(request, 404, "originalMissing");
    return { file: { body: new Blob([body], { type: file.contentType }), name: file.originalName } };
  });
};

const registerDocumentRoutes = () => {
  mockRoute("get", "/api/v1/documents", (request) => {
    const denied = guard(request);
    if (denied) return denied;
    const { search, docType, source, needsReview, folderId, status } = request.query;
    const inFolders = folderId ? new Set(descendantsOf(folderId)) : null;
    const files = documentsOf(shownOf)
      .filter((file) => isVisible(file, request.user!))
      .filter((file) => !status || documentStatusOf(file.documentId) === status)
      .filter((file) => !inFolders || (file.folderId !== null && inFolders.has(file.folderId)))
      .filter((file) => !docType || file.docType === docType)
      .filter((file) => !source || file.source === source)
      .filter((file) => needsReview !== "true" || file.needsReview)
      .filter((file) => matchesSearch(search, file.originalName, fullText(file)))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const page = paginate(files, request.query);
    return ok({ data: page.data.map((file) => toListItem(file, search)), totalCount: page.totalCount });
  });

  mockRoute("get", "/api/v1/documents/:fileId", (request) => {
    const denied = guard(request);
    if (denied) return denied;
    const { file, error } = findVisible(request, request.params.fileId);
    if (error) return error;
    const wanted = request.query.version ? Number(request.query.version) : null;
    const version = wanted ? versionsOf(file.documentId).find((item) => item.versionNo === wanted) : latestOf(file.documentId);
    return version ? ok(toDetail(version)) : say(request, 404, "versionMissing");
  });

  mockRoute("get", "/api/v1/documents/:fileId/versions", (request) => {
    const denied = guard(request);
    if (denied) return denied;
    const { file, error } = findVisible(request, request.params.fileId);
    return error ?? ok(versionsOf(file.documentId).map(toVersion));
  });

  mockRoute("get", "/api/v1/ocr/doc-types", () => ok(SEED_DOC_TYPES));
};

export const registerDemoDocumentHandlers = () => {
  registerFolderRoutes();
  registerFileRoutes();
  registerDocumentRoutes();
};
