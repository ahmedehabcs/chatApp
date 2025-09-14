import PDFDocument from "pdfkit";

export async function createKeysPdf(publicKey, privateKey, signature) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                margin: 50,
                size: "A4",
                info: {
                    Title: "Mrhoba E2EE - Cryptographic Keys",
                    Author: "Mrhoba Security System",
                    Subject: "End-to-End Encryption Keys",
                    Creator: "Mrhoba Key Generator v2.0",
                    CreationDate: new Date(),
                },
            });

            const buffers = [];
            const pageWidth = 595.28; // A4 width in points
            const contentWidth = pageWidth - 100; // margins: 50 left + 50 right

            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => resolve(Buffer.concat(buffers)));

            //
            // 🔹 Header
            //
            doc.fillColor("#1a365d")
                .fontSize(9)
                .font("Helvetica-Bold")
                .text("CONFIDENTIAL - CRYPTOGRAPHIC MATERIAL", 50, 45, { align: "left" });

            const now = new Date();
            const dateTime = `${now.toLocaleDateString()}  ${now.toLocaleTimeString()}`;
            doc.fillColor("#1a365d")
                .fontSize(9)
                .font("Helvetica")
                .text(dateTime, 50, 45, { width: contentWidth, align: "right" });

            doc.moveTo(50, 70).lineTo(pageWidth - 50, 70).stroke("#2c5282");

            //
            // 🔹 Title
            //
            doc.y = 90;
            doc.fillColor("#2c5282")
                .fontSize(22)
                .font("Helvetica-Bold")
                .text("MRHOBA E2EE ENCRYPTION KEYS", { align: "center" });

            doc.moveDown(0.3);
            doc.fillColor("#4a5568")
                .fontSize(12)
                .font("Helvetica")
                .text("Cryptographic Key Documentation", { align: "center" });

            doc.moveDown(0.5);
            doc.moveTo(50, doc.y).lineTo(pageWidth - 50, doc.y).stroke("#e2e8f0");

            //
            // 🔹 Security Notice
            //
            doc.moveDown(0.5);
            doc.fillColor("#c53030")
                .fontSize(10)
                .font("Helvetica-Bold")
                .text("SECURITY NOTICE:", 50, doc.y);

            doc.fillColor("#4a5568")
                .fontSize(9)
                .font("Helvetica")
                .text(
                    "This document contains sensitive cryptographic material. Store securely and do not share the private key. Unauthorized disclosure may compromise your security.",
                    { width: contentWidth }
                );

            doc.moveDown(0.8);
            doc.moveTo(50, doc.y).lineTo(pageWidth - 50, doc.y).stroke("#e2e8f0");

            //
            // 🔹 Public Key
            //
            doc.moveDown(0.5);
            doc.fillColor("#2d3748")
                .fontSize(11)
                .font("Helvetica-Bold")
                .text("PUBLIC KEY");

            doc.fillColor("#4a5568")
                .fontSize(9)
                .font("Helvetica")
                .text("Used for encryption and verification", 50, doc.y);

            doc.moveDown(0.3);
            doc.fillColor("#2c5282")
                .rect(50, doc.y, contentWidth, 77)
                .fillAndStroke("#f7fafc", "#cbd5e0");

            const publicKeyY = doc.y + 8;
            doc.fillColor("#2d3748")
                .font("Courier")
                .fontSize(7)
                .text(publicKey, 55, publicKeyY, {
                    width: contentWidth - 10,
                    align: "left",
                    lineBreak: true,
                });

            doc.y = publicKeyY + 52;

            //
            // 🔹 Private Key
            //
            doc.moveDown(4);
            doc.fillColor("#c53030")
                .fontSize(11)
                .font("Helvetica-Bold")
                .text("PRIVATE KEY");

            doc.fillColor("#718096")
                .fontSize(9)
                .font("Helvetica")
                .text("Highly sensitive - Keep secure and confidential", 50, doc.y);

            doc.moveDown(0.3);

            const privateKeyOptions = {
                width: contentWidth - 10,
                align: "left",
                lineBreak: true,
            };
            const privateKeyHeight = doc.heightOfString(privateKey, {
                ...privateKeyOptions,
                font: "Courier",
                fontSize: 7,
            });

            doc.fillColor("#fff5f5")
                .rect(50, doc.y, contentWidth, privateKeyHeight - 70)
                .fillAndStroke("#fed7d7", "#feb2b2");

            const privateKeyY = doc.y + 8;
            doc.fillColor("#c53030")
                .font("Courier")
                .fontSize(7)
                .text(privateKey, 55, privateKeyY, privateKeyOptions);

            doc.y = privateKeyY + privateKeyHeight + 8;

            //
            // 🔹 Server Signature
            //
            doc.moveDown(-10);
            doc.fillColor("#2d3748")
                .fontSize(11)
                .font("Helvetica-Bold")
                .text("SERVER SIGNATURE");

            doc.fillColor("#4a5568")
                .fontSize(9)
                .font("Helvetica")
                .text("Used to verify document authenticity", 50, doc.y);

            doc.moveDown(0.3);
            doc.fillColor("#e6fffa")
                .rect(50, doc.y, contentWidth, 25)
                .fillAndStroke("#b2f5ea", "#81e6d9");

            const signatureY = doc.y + 8;
            doc.fillColor("#234e52")
                .font("Courier")
                .fontSize(8)
                .text(signature, 55, signatureY, {
                    width: contentWidth - 10,
                    align: "left",
                });

            doc.y = signatureY + 20;

            //
            // 🔹 Verification Link
            //
            doc.moveDown(1.2);
            doc.fillColor("#1e3a8a")
                .fontSize(9)
                .font("Helvetica-Bold")
                .text("VERIFICATION REQUIRED:", 50, doc.y);

            doc.moveDown(0.5);
            doc.fillColor("#1d4ed8")
                .fontSize(9)
                .font("Helvetica")
                .text(`${process.env.WEBSITE_DOMAIN}/verify`, 50, doc.y, {
                    underline: true,
                    link: `${process.env.WEBSITE_DOMAIN}/verify`,
                });

            //
            // 🔹 Watermark
            //
            doc.save();
            doc.translate(130, 250);
            doc.rotate(45);
            doc.opacity(0.12);
            doc.fillColor("#e53e3e")
                .fontSize(60)
                .font("Helvetica-Bold")
                .text("MRHOBA", 0, 0, { align: "center" });
            doc.restore();

            //
            // 🔹 Border
            //
            doc.rect(25, 25, pageWidth - 50, 832).stroke("#e5e7eb");

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}