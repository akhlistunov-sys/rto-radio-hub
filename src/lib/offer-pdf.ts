import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function downloadElementPdf(el: HTMLElement, filename: string) {
  const bg = getComputedStyle(document.body).backgroundColor;
  const canvas = await html2canvas(el, { scale: 2, backgroundColor: bg, useCORS: true });
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const pw = pdf.internal.pageSize.getWidth();
  const ph = pdf.internal.pageSize.getHeight();
  const margin = 8;
  let w = pw - margin * 2;
  let h = (canvas.height * w) / canvas.width;
  if (h > ph - margin * 2) {
    h = ph - margin * 2;
    w = (canvas.width * h) / canvas.height;
  }
  pdf.setFillColor(bg);
  pdf.rect(0, 0, pw, ph, "F");
  pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", (pw - w) / 2, margin, w, h);
  pdf.save(filename);
}

export async function shareLink(url: string, title: string) {
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return "shared";
    } catch {
      /* fall through to copy */
    }
  }
  await navigator.clipboard.writeText(url);
  return "copied";
}
