import { useState, useEffect, useRef, useCallback } from 'react'
import WarmPage from '../components/WarmPage'
import TypedHistoryPanel from '../components/TypedHistoryPanel'
import { getTodayKey, getTypedEntry, saveTypedEntry, wordCount } from '../utils/storage'

const ACCENT = '#c4956a'
const TYPE = 'gratitude'

const PROMPTS = [
  'Something small that made you smile today…',
  'Someone who showed up for you, even in a small way…',
  'Something you appreciated about your own body or mind today…',
  'A moment of beauty or peace you noticed…',
  "One thing about today you'd want to remember…",
]

const S = {
  label: {
    fontSize: '0.62rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: ACCENT,
    marginBottom: 8,
    display: 'block',
    opacity: 0.8,
  },
  prompt: {
    fontSize: '0.82rem',
    lineHeight: 1.65,
    color: 'rgba(44,31,20,0.45)',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  textarea: {
    width: '100%',
    background: 'none',
    border: 'none',
    outline: 'none',
    resize: 'none',
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: '1rem',
    lineHeight: 1.85,
    color: '#2c1f14',
    padding: 0,
    minHeight: 80,
    boxSizing: 'border-box',
  },
  section: {
    marginBottom: 32,
    paddingBottom: 28,
    borderBottom: '1px solid rgba(44,31,20,0.07)',
  },
  sectionLast: {
    marginBottom: 32,
    paddingBottom: 28,
  },
  saveIndicator: {
    fontSize: '0.75rem',
    color: 'rgba(44,31,20,0.35)',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordCount: {
    fontSize: '0.75rem',
    color: 'rgba(44,31,20,0.35)',
  },
}

function autoResize(el) {
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

export default function GratitudeJournal({ onBack }) {
  const todayKey = getTodayKey()
  const [fields, setFields] = useState({ p1: '', p2: '', p3: '', p4: '', p5: '' })
  const [showHistory, setShowHistory] = useState(false)
  const [saving, setSaving] = useState(false)
  const debounceRef = useRef(null)
  const textareaRefs = useRef([])

  useEffect(() => {
    const entry = getTypedEntry(TYPE, todayKey)
    if (entry) {
      setFields({ p1: entry.p1 || '', p2: entry.p2 || '', p3: entry.p3 || '', p4: entry.p4 || '', p5: entry.p5 || '' })
    }
  }, [todayKey])

  useEffect(() => {
    textareaRefs.current.forEach(el => autoResize(el))
  }, [fields])

  const scheduleAutosave = useCallback((nextFields) => {
    setSaving(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      saveTypedEntry(TYPE, todayKey, nextFields)
      setSaving(false)
    }, 900)
  }, [todayKey])

  function handleChange(key, value) {
    const next = { ...fields, [key]: value }
    setFields(next)
    scheduleAutosave(next)
  }

  function handleHistorySelect(dateKey, entry) {
    if (entry) {
      setFields({ p1: entry.p1 || '', p2: entry.p2 || '', p3: entry.p3 || '', p4: entry.p4 || '', p5: entry.p5 || '' })
    }
  }

  const keys = ['p1', 'p2', 'p3', 'p4', 'p5']
  const totalWords = keys.reduce((sum, k) => sum + wordCount(fields[k] || ''), 0)

  const footer = (
    <div style={S.footer}>
      <span style={S.wordCount}>{totalWords} {totalWords === 1 ? 'word' : 'words'}</span>
      <span style={S.saveIndicator}>{saving ? '…saving' : '✓ saved'}</span>
    </div>
  )

  return (
    <>
      <WarmPage
        title="Gratitude Journal"
        tag="gratitude"
        onBack={onBack}
        onHistory={() => setShowHistory(true)}
        footer={footer}
      >
        {PROMPTS.map((prompt, i) => {
          const key = keys[i]
          const isLast = i === PROMPTS.length - 1
          return (
            <div key={key} style={isLast ? S.sectionLast : S.section}>
              <span style={S.label}>Prompt {i + 1}</span>
              <p style={S.prompt}>{prompt}</p>
              <textarea
                ref={el => { textareaRefs.current[i] = el }}
                value={fields[key]}
                onChange={e => {
                  autoResize(e.target)
                  handleChange(key, e.target.value)
                }}
                style={S.textarea}
                rows={1}
                placeholder=""
              />
            </div>
          )
        })}
      </WarmPage>

      {showHistory && (
        <TypedHistoryPanel
          type={TYPE}
          previewFn={entry => entry?.p1 || ''}
          onSelect={handleHistorySelect}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  )
}
