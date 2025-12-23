import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Slide } from '../types/carousel';

export async function exportToPDF(
  slides: Slide[],
  slideElements: (HTMLDivElement | null)[]
): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [1080, 1080]
  });

  for (let i = 0; i < slides.length; i++) {
    const element = slideElements[i];
    if (!element) {
      console.warn(`Slide element ${i} not found`);
      continue;
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      width: 1080,
      height: 1080,
      useCORS: true,
      allowTaint: true,
      logging: false,
      windowWidth: 1080,
      windowHeight: 1080
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    if (i > 0) {
      pdf.addPage([1080, 1080]);
    }

    pdf.addImage(imgData, 'PNG', 0, 0, 1080, 1080);
  }

  return pdf.output('blob');
}
