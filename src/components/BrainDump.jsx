import { useState, useEffect, useRef, useCallback } from 'react'
import WarmPage from '../components/WarmPage'
import TypedHistoryPanel from '../components/TypedHistoryPanel'
import { getTodayKey, getTypedEntry, saveTypedEntry, wordCount } from '../utils/storage'

const ACCENT = '#5a8fa8'
const TYPE = 'dump'

const S = {
  promptLine: {
    fontSize: '0.78rem',
    lineHeight: 1.65,
    color: 'rgba(44,31,20,0.28)',
    fontStyle: 'italic',
    marginBottom: 20,
    letterSpacing: '0.02em',
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
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wordCount: {
    fontSize: '0.75rem',
    color: 'rgba(44,31,20,0.35)',
  },
  saveIndicator: {
    fontSize: '0.75rem',
    color: 'rgba(44,31,20,0.35)',
  },
}

function autoResize(el) {
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

export default function BrainDump({ onBack }) {
  const todayKey = getTodayKey()
  const [text, setText] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [saving, setSaving] = useState(false)
  const debounceRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    const entry = getTypedEntry(TYPE, todayKey)
    if (entry) setText(entry.text || '')
  }, [todayKey])

  useEffect(() => {
    autoResize(textareaRef.current)
  }, [text])

  const scheduleAutosave = useCallback((value) => {
    setSaving(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      saveTypedEntry(TYPE, todayKey, { text: value })
      setSaving(false)
    }, 900)
  }, [todayKey])

  function handleChange(e) {
    const value = e.target.value
    autoResize(e.target)
    setText(value)
    scheduleAutosave(value)
  }

  function handleHistorySelect(dateKey, entry) {
    if (entry) setText(entry.text || '')
  }

  const words = wordCount(text)

  const footer = (
    <div style={S.footer}>
      <span style={S.wordCount}>{words} {words === 1 ? 'word' : 'words'}</span>
      <span style={S.saveIndicator}>{saving ? '…saving' : '✓ saved'}</span>
    </div>
  )

  return (
    <>
      <WarmPage
        title="Brain Dump"
        tag="brain dump"
        onBack={onBack}
        onHistory={() => setShowHistory(true)}
        footer={footer}
      >
        <p style={S.promptLine}>No filter. No rules. Just write.</p>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          style={S.textarea}
          rows={1}
          placeholder=""
        />
      </WarmPage>

      {showHistory && (
        <TypedHistoryPanel
          type={TYPE}
          previewFn={entry => (entry?.text || '').slice(0, 80)}
          onSelect={handleHistorySelect}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  )
}
