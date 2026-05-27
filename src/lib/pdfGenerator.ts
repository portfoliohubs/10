import jsPDF from 'jspdf';
import CONFIG from '../config';

export interface CvData {
  fullName: string;
  title: string;
  graduationYear: string;
  university: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  profilePhoto: string | null;
  skills: { clinical: string[]; digital: string[]; soft: string[] };
  timeline: Array<{ year: string; event: string }>;
  cases: Array<{ category: string; title: string; photo: string | null }>;
}

const PRIMARY   = CONFIG.pdf.primaryColor;  // teal #0e7490
const DARK      = CONFIG.pdf.accentColor;   // dark #164e63
const TEXT      = '#1e293b';
const LIGHTBG   = '#f0f9ff';
const LIGHTLINE = '#bae6fd';

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function setFill(doc: jsPDF, hex: string) {
  const [r, g, b] = hexToRgb(hex);
  doc.setFillColor(r, g, b);
}

function setDraw(doc: jsPDF, hex: string) {
  const [r, g, b] = hexToRgb(hex);
  doc.setDrawColor(r, g, b);
}

function setTextColor(doc: jsPDF, hex: string) {
  const [r, g, b] = hexToRgb(hex);
  doc.setTextColor(r, g, b);
}

export function generateCvPdf(data: CvData): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W  = 210;
  const ML = 18;
  const MR = 18;
  const CW = W - ML - MR;

  let y = 0;

  // ── PAGE 1: HEADER ──────────────────────────────────────────────────────────
  // Teal header bar
  setFill(doc, PRIMARY);
  doc.rect(0, 0, W, 48, 'F');

  // Profile photo (if any)
  let nameX = ML;
  if (data.profilePhoto && data.profilePhoto.startsWith('data:image')) {
    try {
      doc.addImage(data.profilePhoto, 'WEBP', ML, 6, 36, 36, undefined, 'FAST');
      nameX = ML + 42;
    } catch {
      // skip bad image
    }
  }

  // Name + title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text(data.fullName || 'Your Name', nameX, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(186, 230, 253);
  doc.text(data.title || 'Professional', nameX, 28);

  if (data.graduationYear || data.university) {
    doc.setFontSize(9);
    doc.setTextColor(224, 242, 254);
    const gradLine = [data.graduationYear && `Graduated ${data.graduationYear}`, data.university].filter(Boolean).join(' — ');
    doc.text(gradLine, nameX, 35);
  }

  y = 54;

  // ── CONTACT ROW ─────────────────────────────────────────────────────────────
  setFill(doc, LIGHTBG);
  doc.rect(0, y - 2, W, 16, 'F');
  setDraw(doc, LIGHTLINE);
  doc.setLineWidth(0.3);
  doc.line(0, y - 2, W, y - 2);
  doc.line(0, y + 14, W, y + 14);

  doc.setFontSize(8.5);
  const contacts = [
    data.phone    && { label: 'Phone:',    val: data.phone,    link: null },
    data.whatsapp && { label: 'WhatsApp:', val: data.whatsapp, link: `https://wa.me/${data.whatsapp.replace(/[^0-9]/g, '')}` },
    data.email    && { label: 'Email:',    val: data.email,    link: `mailto:${data.email}` },
    data.website  && { label: 'Website:',  val: data.website,  link: data.website },
  ].filter(Boolean) as Array<{ label: string; val: string; link: string | null }>;

  const colWidth = CW / Math.max(contacts.length, 1);
  contacts.forEach((c, i) => {
    const cx = ML + i * colWidth;
    setTextColor(doc, DARK);
    doc.setFont('helvetica', 'bold');
    doc.text(c.label, cx, y + 5);
    setTextColor(doc, c.link ? PRIMARY : TEXT);
    doc.setFont('helvetica', 'normal');
    const labelW = doc.getTextWidth(c.label) + 1;
    const valText = c.val.length > 28 ? c.val.substring(0, 26) + '…' : c.val;
    doc.text(valText, cx + labelW, y + 5);
    if (c.link) {
      const valW = doc.getTextWidth(valText);
      doc.link(cx + labelW, y + 1, valW, 5, { url: c.link });
    }
  });

  y += 20;

  // ── SKILLS SECTION ──────────────────────────────────────────────────────────
  if (data.skills.clinical.length || data.skills.digital.length || data.skills.soft.length) {
    // Section title
    setFill(doc, PRIMARY);
    doc.rect(ML, y, CW, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('PROFESSIONAL SKILLS', ML + 3, y + 5);
    y += 11;

    const skillCols = [
      { label: 'Clinical Skills',  items: data.skills.clinical },
      { label: 'Digital Skills',   items: data.skills.digital },
      { label: 'Soft Skills',      items: data.skills.soft },
    ].filter(c => c.items.length > 0);

    const sColW = CW / skillCols.length;
    skillCols.forEach((col, ci) => {
      const sx = ML + ci * sColW;
      setTextColor(doc, DARK);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(col.label, sx, y + 4);
      setTextColor(doc, TEXT);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      col.items.forEach((item, ii) => {
        doc.text(`• ${item}`, sx, y + 10 + ii * 5.5);
      });
    });

    const maxItems = Math.max(...skillCols.map(c => c.items.length));
    y += 14 + maxItems * 5.5 + 4;
  }

  // ── EDUCATION & CAREER TIMELINE ─────────────────────────────────────────────
  if (data.timeline.length > 0) {
    checkNewPage();

    setFill(doc, PRIMARY);
    doc.rect(ML, y, CW, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('EDUCATION & CAREER', ML + 3, y + 5);
    y += 11;

    const sorted = [...data.timeline].sort((a, b) => Number(a.year) - Number(b.year));
    sorted.forEach(item => {
      checkNewPage();
      setFill(doc, PRIMARY);
      doc.circle(ML + 3, y + 3, 2, 'F');
      setTextColor(doc, DARK);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(item.year, ML + 8, y + 5);
      setTextColor(doc, TEXT);
      doc.setFont('helvetica', 'normal');
      doc.text(item.event, ML + 24, y + 5);
      y += 8;
    });
    y += 4;
  }

  // ── CLINICAL CASES ──────────────────────────────────────────────────────────
  if (CONFIG.pdf.showCasesInPdf && data.cases.length > 0) {
    checkNewPage();

    setFill(doc, PRIMARY);
    doc.rect(ML, y, CW, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('CLINICAL CASES PORTFOLIO', ML + 3, y + 5);
    y += 11;

    // Group by category
    const grouped: Record<string, typeof data.cases> = {};
    data.cases.forEach(c => {
      const k = c.category || 'Uncategorized';
      if (!grouped[k]) grouped[k] = [];
      grouped[k].push(c);
    });

    const perRow  = CONFIG.pdf.maxCasePhotosPerRow;
    const imgW    = perRow === 1 ? CW : (CW - 6) / 2;
    const imgH    = imgW * 0.65;

    Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([category, cats]) => {
        checkNewPage();

        // Category header
        setFill(doc, LIGHTBG);
        doc.rect(ML, y, CW, 6, 'F');
        setDraw(doc, LIGHTLINE);
        doc.setLineWidth(0.2);
        doc.rect(ML, y, CW, 6);
        setTextColor(doc, DARK);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(category, ML + 3, y + 4.5);
        y += 9;

        // Photos in rows
        let rowX = ML;
        let colIdx = 0;
        cats.forEach((c) => {
          checkNewPage(imgH + 14);
          if (c.photo && c.photo.startsWith('data:image')) {
            try {
              doc.addImage(c.photo, 'WEBP', rowX, y, imgW, imgH, undefined, 'FAST');
            } catch { }
          } else {
            // placeholder rect
            setFill(doc, LIGHTBG);
            doc.rect(rowX, y, imgW, imgH, 'F');
            setTextColor(doc, '#94a3b8');
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8);
            doc.text('No photo', rowX + imgW / 2, y + imgH / 2, { align: 'center' });
          }

          // Caption
          setTextColor(doc, TEXT);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          const caption = c.title || category;
          doc.text(caption, rowX, y + imgH + 4, { maxWidth: imgW });

          colIdx++;
          if (colIdx % perRow === 0) {
            rowX = ML;
            y += imgH + 14;
          } else {
            rowX += imgW + 6;
          }
        });
        if (colIdx % perRow !== 0) {
          y += imgH + 14;
        }
        y += 4;
      });
  }

  // ── FOOTER: COMPLETE PORTFOLIO NOTE ─────────────────────────────────────────
  checkNewPage(20);
  setFill(doc, LIGHTBG);
  doc.rect(ML, y, CW, 18, 'F');
  setDraw(doc, LIGHTLINE);
  doc.rect(ML, y, CW, 18);
  setTextColor(doc, DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('COMPLETE PORTFOLIO', ML + 4, y + 6);
  setTextColor(doc, TEXT);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('For more cases and complete portfolio, visit:', ML + 4, y + 11);
  if (data.website) {
    setTextColor(doc, PRIMARY);
    doc.text(data.website, ML + 4, y + 16);
    doc.link(ML + 4, y + 12, doc.getTextWidth(data.website), 5, { url: data.website });
  }

  // Page footers
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    setTextColor(doc, '#94a3b8');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`${CONFIG.pdf.footerText} ${data.fullName || 'PortfolioHubs'}`, ML, 293);
    doc.text(`Page ${p} of ${pageCount}`, W - MR, 293, { align: 'right' });
  }

  const safeName = (data.fullName || 'cv').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`${safeName}_cv.pdf`);

  // ── HELPERS ─────────────────────────────────────────────────────────────────
  function checkNewPage(needed = 25) {
    if (y + needed > 280) {
      doc.addPage();
      y = 16;
    }
  }
}
