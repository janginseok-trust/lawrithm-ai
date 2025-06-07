'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// KR(한국) 제거, 국가명 영어로만
const COUNTRY_LIST = [
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'SG', name: 'Singapore' },
  { code: 'US', name: 'United States' },
]

export default function LegalPage() {
  const [country, setCountry] = useState('')
  const [categoryList, setCategoryList] = useState<string[]>([])
  const [category, setCategory] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch categories on country change
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

  // Fetch law content on category change
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
      <h1 style={{ fontWeight: 'bold', fontSize: 28 }}>AI Legal Statute Search</h1>
      <div style={{ margin: '24px 0 12px 0' }}>Country</div>
      <select
        style={{ width: '100%', height: 36, fontSize: 16 }}
        value={country}
        onChange={e => setCountry(e.target.value)}
      >
        <option value="">Select a country</option>
        {COUNTRY_LIST.map(c => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>
      <div style={{ margin: '24px 0 12px 0' }}>Law Category</div>
      <select
        style={{ width: '100%', height: 36, fontSize: 16 }}
        value={category}
        onChange={e => setCategory(e.target.value)}
        disabled={!categoryList.length}
      >
        <option value="">Select a law category</option>
        {categoryList.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      {loading && <div style={{ color: '#0070f3', marginTop: 20 }}>Loading...</div>}
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
