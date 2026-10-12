import { ContentSource, type DocumentBlockDTO, DocumentFormat, type DocumentPageDTO } from "@/entities/document/document.entry";

//* Demo rejimida backend yo'q: Word va Excel matni brauzerning o'zida, frontend'dagi ko'rgich kutubxonalari bilan ajratiladi.
//* PDF va rasmlarda OCR kerak — u faqat haqiqiy tizimda; bu yerda tushuntirish matni qo'yiladi.

export interface DemoExtraction {
  source: ContentSource;
  pages: DocumentPageDTO[];
  warnings: string[];
}

const page = (number: number, source: string, blocks: DocumentBlockDTO[], title: string | null = null): DocumentPageDTO => ({
  number,
  source,
  title,
  language: null,
  confidence: 1,
  blocks,
  text: blocks.map((block) => block.text).join("\n"),
});

const paragraph = (text: string): DocumentBlockDTO => ({ type: "paragraph", text, level: null, rows: null, headerRows: null, spans: null });

const table = (rows: string[][]): DocumentBlockDTO => ({
  type: "table",
  text: rows.map((row) => row.join(" | ")).join("\n"),
  level: null,
  rows,
  headerRows: 1,
  spans: null,
});

const extractWord = async (body: Blob): Promise<DocumentBlockDTO[]> => {
  const { renderAsync } = await import("docx-preview");
  const container = document.createElement("div");
  await renderAsync(await body.arrayBuffer(), container, undefined, { renderAltChunks: false, renderHeaders: false, renderFooters: false });
  const blocks: DocumentBlockDTO[] = [];
  container.querySelectorAll("article > p, article > table").forEach((element) => {
    if (element instanceof HTMLTableElement) {
      const rows = [...element.rows].map((row) => [...row.cells].map((cell) => cell.textContent?.trim() ?? ""));
      if (rows.length) blocks.push(table(rows));
      return;
    }
    const text = element.textContent?.trim();
    if (text) blocks.push(paragraph(text));
  });
  return blocks;
};

const extractExcel = async (body: Blob): Promise<DocumentPageDTO[]> => {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await body.arrayBuffer());
  return workbook.worksheets
    .filter((sheet) => sheet.state === "visible")
    .map((sheet, index) => {
      const rows: string[][] = [];
      sheet.eachRow((row) => {
        rows.push(Array.from({ length: sheet.columnCount }, (_, column) => row.getCell(column + 1).text.trim()));
      });
      return page(index + 1, "excel", rows.length ? [table(rows)] : [], sheet.name);
    });
};

const OCR_NOTE =
  "Demo rejim: PDF va rasmlardan matnni OCR-servis ajratadi, u faqat bankning ichki tarmog'idagi haqiqiy tizimda ishlaydi. " +
  "Asl hujjat chap tomonda ko'rinadi; namunaviy OCR natijasini «Ishonchnomalar» papkasidagi hujjatda ko'ring.";

export const extractDemoContent = async (format: DocumentFormat, body: Blob): Promise<DemoExtraction> => {
  try {
    if (format === DocumentFormat.DOCX) return { source: ContentSource.WORD, pages: [page(1, "word", await extractWord(body))], warnings: [] };
    if (format === DocumentFormat.XLSX) return { source: ContentSource.EXCEL, pages: await extractExcel(body), warnings: [] };
  } catch {
    //* buzilgan fayl — quyidagi tushuntirishga tushadi
  }
  const isOffice = format === DocumentFormat.DOC || format === DocumentFormat.XLS || format === DocumentFormat.DOCX || format === DocumentFormat.XLSX;
  const note = isOffice ? "Demo rejim: eski DOC/XLS formatidan matn faqat haqiqiy tizimda (backend) ajratiladi." : OCR_NOTE;
  return {
    source:
      format === DocumentFormat.DOC || format === DocumentFormat.DOCX
        ? ContentSource.WORD
        : format === DocumentFormat.XLS || format === DocumentFormat.XLSX
          ? ContentSource.EXCEL
          : ContentSource.OCR,
    pages: [page(1, "demo", [paragraph(note)])],
    warnings: [],
  };
};
