import fs from "fs";
import readline from "readline";
import path from "path";

// 입력 JSON
const inputPath = path.join("output", "uk_cases_2020_2025.json");
const outputPath = path.join("src", "lib", "gbCases.ts");

const stream = fs.createReadStream(inputPath, { encoding: "utf8" });
const rl = readline.createInterface({ input: stream });

let buffer = "";
let results: any[] = [];

rl.on("line", (line) => {
  buffer += line;
});

rl.on("close", () => {
  try {
    const parsed = JSON.parse(buffer);

    results = parsed.map((item: any) => ({
      title: item.title || "",
      url: item.url,
      year: item.year,
      date: item.date || "",
      plain_text: item.content || "",
    }));

    const tsContent = `const gbCases = ${JSON.stringify(results, null, 2)};\n\nexport default gbCases;\n`;

    fs.writeFileSync(outputPath, tsContent, "utf8");
    console.log(`✅ gbCases.ts 생성 완료 (${results.length}건) → ${outputPath}`);
  } catch (err) {
    console.error("❌ JSON 파싱 오류:", err);
  }
});
