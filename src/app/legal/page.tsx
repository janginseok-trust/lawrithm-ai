// src/app/legal/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const COUNTRY_LIST = [
  { code: 'AU', name: '호주' },
  { code: 'CA', name: '캐나다' },
  { code: 'DE', name: '독일' },
  { code: 'GB', name: '영국' },
  { code: 'KR', name: '한국' },
  { code: 'NZ', name: '뉴질랜드' },
  { code: 'SG', name: '싱가포르' },
  { code: 'US', name: '미국' },
]

export default function LegalPage() {
  const [country, setCountry] = useState('')
  const [categoryList, setCategoryList] = useState<string[]>([])
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  // 국가 선택 시 카테고리 불러오기
  useEffect(() => {
    if (!country) {
      setCategoryList([])
      setCategory('')
      setContent('')
      return
    }
    async function fetchCategories() {
      setLoading(true)
      const colRef = collection(db, `law_db/${country}/laws`)
      const snap = await getDocs(colRef)
      const cats = snap.docs.map(doc => doc.id)
      setCategoryList(cats)
      setCategory('')
      setContent('')
      setLoading(false)
    }
    fetchCategories()
  }, [country])

  // 카테고리 선택 시 법률 내용 불러오기
  useEffect(() => {
    if (!country || !category) {
      setContent('')
      return
    }
    async function fetchContent() {
      setLoading(true)
      const colRef = collection(db, `law_db/${country}/laws`)
      const snap = await getDocs(colRef)
      const doc = snap.docs.find(d => d.id === category)
      setContent(doc?.data().content || '')
      setLoading(false)
    }
    fetchContent()
  }, [country, category])

  return (
    <div style={{ maxWidth: 500, margin: '60px auto' }}>
      <h1 style={{ fontWeight: 'bold', fontSize: 28 }}>AI Legal 법령 검색</h1>
      <div style={{ margin: '24px 0 12px 0' }}>국가</div>
      <select
        style={{ width: '100%', height: 36, fontSize: 16 }}
        value={country}
        onChange={e => setCountry(e.target.value)}
      >
        <option value="">국가를 선택하세요</option>
        {COUNTRY_LIST.map(c => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>
      <div style={{ margin: '24px 0 12px 0' }}>법 카테고리</div>
      <select
        style={{ width: '100%', height: 36, fontSize: 16 }}
        value={category}
        onChange={e => setCategory(e.target.value)}
        disabled={!categoryList.length}
      >
        <option value="">법 카테고리를 선택하세요</option>
        {categoryList.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      {loading && <div style={{ color: '#0070f3', marginTop: 20 }}>로딩 중...</div>}
      {content && (
        <div
          style={{
            marginTop: 28,
            padding: 20,
            border: '1px solid #ddd',
            borderRadius: 8,
            whiteSpace: 'pre-line',
            background: '#fafbff'
          }}
        >
          {content}
        </div>
      )}
    </div>
  )
}
