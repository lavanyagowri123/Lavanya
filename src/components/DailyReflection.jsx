import { useState, useEffect, useRef, useCallback } from 'react'
import WarmPage from '../components/WarmPage'
import TypedHistoryPanel from '../components/TypedHistoryPanel'
import { getTodayKey, getTypedEntry, saveTypedEntry } from '../utils/storage'

const ACCENT = '#5a9e78'
const TYPE = 'reflect'

const SECTIONS = [
  { key: 'q1', label: 'Went Well', prompt: 'What went well today?' },
  { key: 'q2', label: 'Was Hard',  prompt: 'What drained you or felt hard?' },
  { key: 'q3', label: 'Redo',      prompt: 'If I could redo one moment today, I would…' },
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
    textAlign: 'right',
  },
}

function autoResize(el) {
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

export default function DailyReflection({ onBack }) {
  const todayKey = getTodayKey()
  const [fields, setFields] = useState({ q1: '', q2: '', q3: '' })
  const [showHistory, setShowHistory] = useState(false)
  const [saving, setSaving] = useState(false)
  const debounceRef = useRef(null)
  const textareaRefs = useRef([])

  useEffect(() => {
    const entry = getTypedEntry(TYPE, todayKey)
    if (entry) {
      setFields({ q1: entry.q1 || '', q2: entry.q2 || '', q3: entry.q3 || '' })
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
      setFields({ q1: entry.q1 || '', q2: entry.q2 || '', q3: entry.q3 || '' })
    }
  }

  const footer = (
    <div style={S.saveIndicator}>{saving ? '…saving' : '✓ saved'}</div>
  )

  return (
    <>
      <WarmPage
        title="Daily Reflection"
        tag="reflection"
        onBack={onBack}
        onHistory={() => setShowHistory(true)}
        footer={footer}
      >
        {SECTIONS.map((section, i) => {
          const isLast = i === SECTIONS.length - 1
          return (
            <div key={section.key} style={isLast ? S.sectionLast : S.section}>
              <span style={S.label}>{section.label}</span>
              <p style={S.prompt}>{section.prompt}</p>
              <textarea
                ref={el => { textareaRefs.current[i] = el }}
                value={fields[section.key]}
                onChange={e => {
                  autoResize(e.target)
                  handleChange(section.key, e.target.value)
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
          previewFn={entry => entry?.q1 || ''}
          onSelect={handleHistorySelect}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  )
}
