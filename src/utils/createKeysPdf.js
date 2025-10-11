import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import URL from "../components/URL";

function wrapTextToLines(text, font, fontSize, maxWidth) {
  // Returns an array of lines that fit within maxWidth.
  // For PEM-like text (no spaces), we break by characters.
  const lines = [];
  const paragraphs = text.split("\n");

  for (const paragraph of paragraphs) {
    if (paragraph.length === 0) {
      lines.push(""); // preserve blank lines
      continue;
    }

    let idx = 0;
    while (idx < paragraph.length) {
      // Greedy expand until exceeding maxWidth
      let end = paragraph.length;
      // Binary search best end index for performance
      let lo = idx + 1;
      let hi = paragraph.length;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const substr = paragraph.slice(idx, mid);
        const w = font.widthOfTextAtSize(substr, fontSize);
        if (w <= maxWidth) {
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      // hi is the largest index that fit (or idx if none)
      const fitEnd = Math.max(idx + 1, hi);
      lines.push(paragraph.slice(idx, fitEnd));
      idx = fitEnd;
    }
  }

  return lines;
}

export async function createKeysPdf(publicKey, privateKey, signature) {
  const pdfDoc = await PDFDocument.create();

  // Add a page
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  const margin = 50;
  const contentWidth = width - margin * 2;

  // Fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const courier = await pdfDoc.embedFont(StandardFonts.Courier); // monospaced

  let y = height - margin;

  // Header
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateTime = `${date}  ${time}`;

  const headerText = "CONFIDENTIAL - CRYPTOGRAPHIC MATERIAL";
  page.drawText(headerText, {
    x: margin,
    y,
    size: 9,
    font: helveticaBold,
    color: rgb(0.102, 0.212, 0.365),
  });

  const dateTimeWidth = helvetica.widthOfTextAtSize(dateTime, 9);
  page.drawText(dateTime, {
    x: width - margin - dateTimeWidth,
    y,
    size: 9,
    font: helvetica,
    color: rgb(0.102, 0.212, 0.365),
  });

  y -= 25;

  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: rgb(0.173, 0.322, 0.510),
  });

  y -= 20;

  // Title
  // center the title: measure and compute x
  const title = "MRHOBA E2EE ENCRYPTION KEYS";
  const titleWidth = helveticaBold.widthOfTextAtSize(title, 22);
  page.drawText(title, {
    x: (width - titleWidth) / 2,
    y,
    size: 22,
    font: helveticaBold,
    color: rgb(0.173, 0.322, 0.510),
  });

  y -= 30;

  page.drawText("Cryptographic Key Documentation", {
    x: margin,
    y,
    size: 12,
    font: helvetica,
    color: rgb(0.290, 0.341, 0.424),
  });

  y -= 20;

  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: rgb(0.886, 0.909, 0.941),
  });

  y -= 20;

  // Security Notice
  page.drawText("SECURITY NOTICE:", {
    x: margin,
    y,
    size: 10,
    font: helveticaBold,
    color: rgb(0.773, 0.188, 0.188),
  });

  y -= 15;

  page.drawText(
    "This document contains sensitive cryptographic material. Store securely and do not share the private key. Unauthorized disclosure may compromise your security.",
    {
      x: margin,
      y,
      size: 9,
      font: helvetica,
      color: rgb(0.290, 0.341, 0.424),
      maxWidth: contentWidth,
      lineHeight: 12,
    }
  );

  y -= 40;

  page.drawLine({
    start: { x: margin, y },
    end: { x: width - margin, y },
    thickness: 1,
    color: rgb(0.886, 0.909, 0.941),
  });

  y -= 30;

  // PUBLIC KEY block - use manual wrapping so copy works cleanly
  page.drawText("PUBLIC KEY", {
    x: margin,
    y,
    size: 11,
    font: helveticaBold,
    color: rgb(0.176, 0.212, 0.282),
  });

  y -= 15;

  page.drawText("Used for encryption and verification", {
    x: margin,
    y,
    size: 9,
    font: helvetica,
    color: rgb(0.290, 0.341, 0.424),
  });

  y -= 15;

  const pubBoxHeight = 77;
  page.drawRectangle({
    x: margin,
    y: y - pubBoxHeight,
    width: contentWidth,
    height: pubBoxHeight,
    color: rgb(0.973, 0.980, 0.992),
    borderColor: rgb(0.741, 0.835, 0.878),
    borderWidth: 1,
  });

  // Wrap publicKey into lines that fit contentWidth - small padding
  const textPadding = 5;
  const pubLines = wrapTextToLines(publicKey, courier, 7, contentWidth - textPadding * 2);

  // Draw pub lines at fixed x and controlled line height
  let lineY = y - 8;
  const pubLineHeight = 8;
  for (const line of pubLines) {
    // ensure no trailing spaces
    const trimmed = line.replace(/\s+$/, "");
    page.drawText(trimmed, {
      x: margin + textPadding,
      y: lineY,
      size: 7,
      font: courier,
      color: rgb(0.176, 0.212, 0.282),
    });
    lineY -= pubLineHeight;
  }

  y -= pubBoxHeight + 10;

  // PRIVATE KEY block
  page.drawText("PRIVATE KEY", {
    x: margin,
    y,
    size: 11,
    font: helveticaBold,
    color: rgb(0.773, 0.188, 0.188),
  });

  y -= 15;

  page.drawText("Highly sensitive - Keep secure and confidential", {
    x: margin,
    y,
    size: 9,
    font: helvetica,
    color: rgb(0.447, 0.529, 0.592),
  });

  y -= 15;

  // Prepare private key lines and compute height
  const privLines = wrapTextToLines(privateKey, courier, 7, contentWidth - textPadding * 2);
  const privLineHeight = 8;
  const privHeight = privLines.length * privLineHeight + 15;

  page.drawRectangle({
    x: margin,
    y: y - privHeight + 10,
    width: contentWidth,
    height: privHeight,
    color: rgb(0.996, 0.843, 0.843),
    borderColor: rgb(0.996, 0.694, 0.694),
    borderWidth: 1,
  });

  // Draw private key lines with same fixed x
  lineY = y - 8;
  for (const line of privLines) {
    const trimmed = line.replace(/\s+$/, "");
    page.drawText(trimmed, {
      x: margin + textPadding,
      y: lineY,
      size: 7,
      font: courier,
      color: rgb(0.773, 0.188, 0.188),
    });
    lineY -= privLineHeight;
  }

  y -= privHeight + 10;

  // Server signature
  page.drawText("SERVER SIGNATURE", {
    x: margin,
    y,
    size: 11,
    font: helveticaBold,
    color: rgb(0.176, 0.212, 0.282),
  });

  y -= 15;

  page.drawText("Used to verify document authenticity", {
    x: margin,
    y,
    size: 9,
    font: helvetica,
    color: rgb(0.290, 0.341, 0.424),
  });

  y -= 15;

  page.drawRectangle({
    x: margin,
    y: y - 25,
    width: contentWidth,
    height: 25,
    color: rgb(0.698, 0.961, 0.918),
    borderColor: rgb(0.506, 0.902, 0.851),
    borderWidth: 1,
  });

  page.drawText(signature, {
    x: margin + 5,
    y: y - 15,
    size: 8,
    font: courier,
    color: rgb(0.137, 0.310, 0.322),
    maxWidth: contentWidth - 10,
  });

  y -= 40;

  // Verification link
  page.drawText("VERIFICATION REQUIRED:", {
    x: margin,
    y,
    size: 9,
    font: helveticaBold,
    color: rgb(0.118, 0.231, 0.541),
  });

  y -= 15;

  page.drawText(`${URL}/#/verify`, {
    x: margin,
    y,
    size: 9,
    font: helvetica,
    color: rgb(0.114, 0.302, 0.592),
    underline: true,
  });

  // Watermark (if present)
  try {
    const watermarkImageBytes = await fetch("/watermark.png").then((res) => res.arrayBuffer());
    const watermarkImage = await pdfDoc.embedPng(watermarkImageBytes);
    const { width: wmWidth, height: wmHeight } = watermarkImage.scale(1);
    const wmX = (page.getWidth() - wmWidth) / 2;
    const wmY = (page.getHeight() - wmHeight) / 2;
    page.drawImage(watermarkImage, {
      x: wmX,
      y: wmY,
      width: wmWidth,
      height: wmHeight,
      opacity: 0.3,
    });
  } catch (e) {
    // If watermark not found, ignore silently
    // console.warn("watermark not embedded", e);
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}
