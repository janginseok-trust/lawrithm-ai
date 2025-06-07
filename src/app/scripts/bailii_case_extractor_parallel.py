import json
import os
import requests
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import random

# 경로 설정
input_path = "src/lib/gbCases.ts"
output_path = "output/uk_cases_2020_2025.json"

# ts 파일에서 JSON 부분만 파싱
with open(input_path, "r", encoding="utf-8") as f:
    text = f.read()
start = text.find("[")
end = text.rfind("]") + 1
cases = json.loads(text[start:end])

# 결과 저장용
results = []

# 단일 URL 처리
def fetch_case(case):
    url = case["url"]
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    }
    try:
        res = requests.get(url, headers=headers, timeout=20)
        soup = BeautifulSoup(res.text, "html.parser")
        body = soup.get_text(separator="\n").strip()
        # 1~1.5초 랜덤 sleep (중요)
        time.sleep(random.uniform(1, 1.5))
        return {
            "title": case["title"],
            "url": case["url"],
            "year": case["year"],
            "date": "",  # 나중에 날짜 추출하면 업데이트
            "plain_text": body[:50000],  # 너무 긴 본문은 잘라냄
        }
    except Exception as e:
        print(f"⚠️ 실패: {url} - {e}")
        return None

# 병렬 수집
with ThreadPoolExecutor(max_workers=16) as executor:
    futures = [executor.submit(fetch_case, case) for case in cases]
    for i, future in enumerate(as_completed(futures), 1):
        result = future.result()
        if result:
            results.append(result)
        if i % 100 == 0:
            print(f"✅ {i}건 완료...")

# JSON 저장
os.makedirs("output", exist_ok=True)
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\n✅ 병렬 수집 완료: 총 {len(results)}건 저장 → {output_path}")
