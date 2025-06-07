import fs from "fs";
import PDFDocument from "pdfkit";

const doc = new PDFDocument();
const path = "./test/data/05-versions-space.pdf";

fs.mkdirSync("./test/data", { recursive: true });

doc.pipe(fs.createWriteStream(path));
doc.text("Blank PDF file.");
doc.end();

console.log("Blank PDF created:", path);
