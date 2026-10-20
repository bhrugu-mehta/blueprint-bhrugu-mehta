// Makes public/resume.pdf from source/Bhrugu_Mehta_Resume.pdf.
//   npm run resume            -> publishes the resume as is, full contact details included
//   npm run resume:redacted   -> removes the phone number and street addresses first
//                                (true redaction: the text is deleted, not just covered)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as mupdf from 'mupdf';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'source', 'Bhrugu_Mehta_Resume.pdf');
const out = path.join(root, 'public', 'resume.pdf');

// Exact strings to remove. Anything matching is deleted wherever it appears.
const REMOVE = [
  '717 University Drive, College Station, TX 77840',
  'Mobile: (425)-900-4584 |',
  '(425)-900-4584',
  '425-900-4584',
  '400 Bizzell St, College Station, TX 77840',
];

if (!process.argv.includes('--redact')) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.copyFileSync(src, out);
  console.log('resume: published with full contact details -> public/resume.pdf');
  process.exit(0);
}

const doc = mupdf.Document.openDocument(fs.readFileSync(src), 'application/pdf');
let hits = 0;
for (let i = 0; i < doc.countPages(); i++) {
  const page = doc.loadPage(i);
  for (const text of REMOVE) {
    for (const quads of page.search(text)) {
      for (const q of quads) {
        const xs = [q[0], q[2], q[4], q[6]], ys = [q[1], q[3], q[5], q[7]];
        const annot = page.createAnnotation('Redact');
        annot.setRect([Math.min(...xs) - 1, Math.min(...ys) - 1, Math.max(...xs) + 1, Math.max(...ys) + 1]);
        hits++;
      }
    }
  }
  page.applyRedactions(false, mupdf.PDFPage.REDACT_IMAGE_NONE);
}

// Verify nothing sensitive survived in the text layer.
const leftovers = [];
for (let i = 0; i < doc.countPages(); i++) {
  const t = doc.loadPage(i).toStructuredText().asText();
  for (const s of ['4584', '900-', 'University Drive', 'Bizzell']) if (t.includes(s)) leftovers.push(s);
}
if (leftovers.length) { console.error('Redaction incomplete, still found:', leftovers); process.exit(1); }

doc.setMetaData?.('info:Title', 'Bhrugu Mehta, Resume');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, doc.saveToBuffer('garbage=4,compress').asUint8Array());
console.log(`resume: ${hits} regions redacted -> public/resume.pdf`);
