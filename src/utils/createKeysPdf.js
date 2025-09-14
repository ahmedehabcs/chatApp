import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import URL from "../components/URL";

export async function createKeysPdf(publicKey, privateKey, signature) {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a page
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width } = page.getSize();
    const margin = 50;
    const contentWidth = width - margin * 2;

    // Load fonts
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const courier = await pdfDoc.embedFont(StandardFonts.Courier);

    let y = 841.89 - margin;

    // 🔹 Header
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateTime = `${date}  ${time}`;

    const headerText = "CONFIDENTIAL - CRYPTOGRAPHIC MATERIAL";

    // Draw left-side text
    page.drawText(headerText, {
        x: margin,
        y: y,
        size: 9,
        font: helveticaBold,
        color: rgb(0.102, 0.212, 0.365),
    });

    // Measure date/time text width
    const dateTimeWidth = helvetica.widthOfTextAtSize(dateTime, 9);

    // Draw right-side text
    page.drawText(dateTime, {
        x: page.getWidth() - margin - dateTimeWidth,
        y: y,
        size: 9,
        font: helvetica,
        color: rgb(0.102, 0.212, 0.365),
    });

    y -= 25;



    // Draw line
    page.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness: 1,
        color: rgb(0.173, 0.322, 0.510),
    });

    y -= 20;

    // 🔹 Title
    page.drawText("MRHOBA E2EE ENCRYPTION KEYS", {
        x: margin,
        y,
        size: 22,
        font: helveticaBold,
        color: rgb(0.173, 0.322, 0.510),
        maxWidth: contentWidth,
        align: "center",
    });

    y -= 30;

    page.drawText("Cryptographic Key Documentation", {
        x: margin,
        y,
        size: 12,
        font: helvetica,
        color: rgb(0.290, 0.341, 0.424),
        maxWidth: contentWidth,
        align: "center",
    });

    y -= 20;

    page.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness: 1,
        color: rgb(0.886, 0.909, 0.941),
    });

    y -= 20;

    // 🔹 Security Notice
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

    // 🔹 Public Key
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

    page.drawRectangle({
        x: margin,
        y: y - 77,
        width: contentWidth,
        height: 77,
        color: rgb(0.973, 0.980, 0.992),
        borderColor: rgb(0.741, 0.835, 0.878),
        borderWidth: 1,
    });

    page.drawText(publicKey, {
        x: margin + 5,
        y: y - 8,
        size: 7,
        font: courier,
        color: rgb(0.176, 0.212, 0.282),
        maxWidth: contentWidth - 10,
        lineHeight: 8,
    });

    y -= 100;

    // 🔹 Private Key
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

    // Estimate height of private key text
    const lines = privateKey.split("\n");
    const lineHeight = 8;
    const height = lines.length * lineHeight + 15;

    page.drawRectangle({
        x: margin,
        y: y - height + 10,
        width: contentWidth,
        height,
        color: rgb(0.996, 0.843, 0.843),
        borderColor: rgb(0.996, 0.694, 0.694),
        borderWidth: 1,
    });

    page.drawText(privateKey, {
        x: margin + 5,
        y: y - 8,
        size: 7,
        font: courier,
        color: rgb(0.773, 0.188, 0.188),
        maxWidth: contentWidth - 15,
        lineHeight,
    });

    y -= height + 10;

    // 🔹 Server Signature
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

    // 🔹 Verification Link
    page.drawText("VERIFICATION REQUIRED:", {
        x: margin,
        y,
        size: 9,
        font: helveticaBold,
        color: rgb(0.118, 0.231, 0.541),
    });

    y -= 15;

    page.drawText(`${URL}/verify`, {
        x: margin,
        y,
        size: 9,
        font: helvetica,
        color: rgb(0.114, 0.302, 0.592),
        underline: true,
    });

    const watermarkImageBytes = await fetch("/watermark.png").then(res => res.arrayBuffer());
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

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: "application/pdf" });
}