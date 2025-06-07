import json

with open("output/uk_cases_2020_2025.json", "r", encoding="utf-8") as f:
    data = json.load(f)

formatted = [
    {
        "title": item.get("title", ""),
        "url": item["url"],
        "year": item["year"],
        "date": item.get("date", ""),
        "plain_text": item.get("content", ""),
    }
    for item in data
]

output = f"const gbCases = {json.dumps(formatted, indent=2, ensure_ascii=False)};\n\nexport default gbCases;\n"

with open("src/lib/gbCases.ts", "w", encoding="utf-8") as f:
    f.write(output)

print(f"✅ gbCases.ts 파일 생성 완료 ({len(formatted)}건)")
