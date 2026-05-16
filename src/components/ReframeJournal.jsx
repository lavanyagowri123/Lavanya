import { useState, useEffect, useRef, useCallback } from 'react'
import WarmPage from '../components/WarmPage'
import TypedHistoryPanel from '../components/TypedHistoryPanel'
import { getTodayKey, getTypedEntry, saveTypedEntry } from '../utils/storage'

const ACCENT = '#c87e9b'
const TYPE = 'reframe'

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
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '4px 0 36px',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: 'rgba(44,31,20,0.08)',
  },
  dividerText: {
    fontSize: '0.58rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(44,31,20,0.3)',
    whiteSpace: 'nowrap',
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

export default function ReframeJournal({ onBack }) {
  const todayKey = getTodayKey()
  const [fields, setFields] = useState({ situation: '', reframe: '' })
  const [showHistory, setShowHistory] = useState(false)
  const [saving, setSaving] = useState(false)
  const debounceRef = useRef(null)
  const situationRef = useRef(null)
  const reframeRef = useRef(null)

  useEffect(() => {
    const entry = getTypedEntry(TYPE, todayKey)
    if (entry) {
      setFields({ situation: entry.situation || '', reframe: entry.reframe || '' })
    }
  }, [todayKey])

  useEffect(() => {
    autoResize(situationRef.current)
    autoResize(reframeRef.current)
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
      setFields({ situation: entry.situation || '', reframe: entry.reframe || '' })
    }
  }

  const footer = (
    <div style={S.saveIndicator}>{saving ? '…saving' : '✓ saved'}</div>
  )

  return (
    <>
      <WarmPage
        title="Reframe Journal"
        tag="reframe"
        onBack={onBack}
        onHistory={() => setShowHistory(true)}
        footer={footer}
      >
        <div style={S.section}>
          <span style={S.label}>What happened</span>
          <p style={S.prompt}>Write it honestly. Don't soften it.</p>
          <textarea
            ref={situationRef}
            value={fields.situation}
            onChange={e => {
              autoResize(e.target)
              handleChange('situation', e.target.value)
            }}
            style={S.textarea}
            rows={1}
            placeholder=""
          />
        </div>

        <div style={S.divider}>
          <div style={S.dividerLine} />
          <span style={S.dividerText}>— now tell it differently —</span>
          <div style={S.dividerLine} />
        </div>

        <div style={S.sectionLast}>
          <span style={S.label}>The reframe</span>
          <p style={S.prompt}>Tell the same story as someone who genuinely has your back would.</p>
          <textarea
            ref={reframeRef}
            value={fields.reframe}
            onChange={e => {
              autoResize(e.target)
              handleChange('reframe', e.target.value)
            }}
            style={S.textarea}
            rows={1}
            placeholder=""
          />
        </div>
      </WarmPage>

      {showHistory && (
        <TypedHistoryPanel
          type={TYPE}
          previewFn={entry => entry?.situation || ''}
          onSelect={handleHistorySelect}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  )
}
