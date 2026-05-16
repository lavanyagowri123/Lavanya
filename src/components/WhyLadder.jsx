import { useState, useEffect, useRef } from 'react'
import WarmPage from './WarmPage'
import TypedHistoryPanel from './TypedHistoryPanel'
import { getTodayKey, getTypedEntry, saveTypedEntry } from '../utils/storage'

const MAX_STEPS = 8
const TYPE = 'ladder'
const ACCENT = '#9b7ec8'

function stepQuestion(idx) {
  if (idx === 0) return 'What are you feeling right now? Don\'t filter it.'
  if (idx === 1) return 'Why are you feeling that way?'
  return 'And why is that?'
}

function empty() {
  return { feeling: '', answers: Array(MAX_STEPS).fill(''), step: 0, phase: 'input', stoppedAt: null }
}

function loadOrEmpty(dateKey) {
  return getTypedEntry(TYPE, dateKey) || empty()
}

export default function WhyLadder({ onBack }) {
  const dateKey = getTodayKey()
  const [state, setState] = useState(() => loadOrEmpty(dateKey))
  const [showHistory, setShowHistory] = useState(false)
  const taRef = useRef(null)

  const { feeling, answers, step, phase, stoppedAt } = state

  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto'
      taRef.current.style.height = taRef.current.scrollHeight + 'px'
      taRef.current.focus()
    }
  }, [step, phase])

  function save(next) {
    saveTypedEntry(TYPE, dateKey, next)
    setState(next)
  }

  function currentText() {
    return step === 0 ? feeling : answers[step - 1]
  }

  function setCurrentText(val) {
    if (step === 0) {
      save({ ...state, feeling: val })
    } else {
      const a = [...answers]; a[step - 1] = val
      save({ ...state, answers: a })
    }
  }

  function advance() {
    if (!currentText().trim()) return
    if (step >= MAX_STEPS) { finish(step) ; return }
    save({ ...state, step: step + 1, phase: 'asking' })
  }

  function finish(at) {
    save({ ...state, phase: 'done', stoppedAt: at })
  }

  function restart() {
    save(empty())
  }

  function loadHistorical(k, entry) {
    setState(entry)
  }

  const canAdvance = currentText().trim().length > 0
  const isLastStep = step === MAX_STEPS

  // Chain of answers so far (for display in 'asking' phase)
  const chain = []
  if (phase === 'asking' || phase === 'done') {
    chain.push(feeling)
    for (let i = 0; i < (phase === 'done' ? (stoppedAt ?? step) : step - 1); i++) {
      if (answers[i]) chain.push(answers[i])
    }
  }

  const footer = phase !== 'done' ? (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.7rem', color: 'rgba(44,31,20,0.35)', letterSpacing: '0.04em' }}>
        {phase === 'input' ? 'Start here' : `Step ${step} of ${MAX_STEPS}`}
      </span>
      <div style={{ display: 'flex', gap: 10 }}>
        {phase === 'asking' && step > 1 && (
          <button onClick={() => finish(step - 1)}
            style={{ background: 'none', border: '1px solid rgba(44,31,20,0.15)', color: 'rgba(44,31,20,0.5)', borderRadius: 40, padding: '9px 18px', fontFamily: 'inherit', fontSize: '0.75rem', letterSpacing: '0.06em', cursor: 'pointer', WebkitAppearance: 'none' }}>
            Found the root ✓
          </button>
        )}
        <button onClick={advance} disabled={!canAdvance}
          style={{ background: canAdvance ? ACCENT : 'none', border: `1px solid ${canAdvance ? ACCENT : 'rgba(44,31,20,0.12)'}`, color: canAdvance ? '#fff' : 'rgba(44,31,20,0.3)', borderRadius: 40, padding: '9px 22px', fontFamily: 'inherit', fontSize: '0.8rem', letterSpacing: '0.06em', cursor: canAdvance ? 'pointer' : 'default', WebkitAppearance: 'none', transition: 'background 0.2s' }}>
          {isLastStep ? 'Done ✓' : 'Keep going →'}
        </button>
      </div>
    </div>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <button onClick={restart}
        style={{ background: 'none', border: '1px solid rgba(44,31,20,0.18)', color: 'rgba(44,31,20,0.5)', borderRadius: 40, padding: '9px 20px', fontFamily: 'inherit', fontSize: '0.75rem', letterSpacing: '0.08em', cursor: 'pointer', WebkitAppearance: 'none' }}>
        Start fresh
      </button>
    </div>
  )

  return (
    <WarmPage title="Why Ladder" tag="Self-inquiry · Root cause" onBack={onBack}
      onHistory={() => setShowHistory(true)} footer={footer}>

      {/* Input phase — first question */}
      {phase === 'input' && (
        <div>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16, opacity: 0.8 }}>Step 0</p>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: '#2c1f14', marginBottom: 24 }}>{stepQuestion(0)}</p>
          <textarea ref={taRef} value={feeling}
            onChange={e => { setCurrentText(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }}
            placeholder="I'm feeling…"
            style={{ width: '100%', background: 'none', border: 'none', outline: 'none', resize: 'none', fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '1rem', lineHeight: 1.85, color: '#2c1f14', padding: 0, minHeight: 120 }} />
        </div>
      )}

      {/* Asking phase — show chain + current question */}
      {phase === 'asking' && (
        <div>
          {/* Chain so far */}
          <div style={{ marginBottom: 28 }}>
            {chain.map((c, i) => (
              <div key={i}>
                <div style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'rgba(44,31,20,0.35)', fontStyle: 'italic', paddingLeft: i * 8 }}>{c}</div>
                {i < chain.length - 1 && (
                  <div style={{ fontSize: '0.65rem', color: ACCENT, opacity: 0.5, margin: '4px 0', paddingLeft: i * 8 + 8 }}>↓ because…</div>
                )}
              </div>
            ))}
            {chain.length > 0 && (
              <div style={{ fontSize: '0.65rem', color: ACCENT, opacity: 0.5, margin: '4px 0', paddingLeft: (chain.length - 1) * 8 + 8 }}>↓ because…</div>
            )}
          </div>

          {/* Current question */}
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12, opacity: 0.8 }}>Step {step} of {MAX_STEPS}</p>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.65, color: '#2c1f14', marginBottom: 20 }}>{stepQuestion(step)}</p>
          <textarea ref={taRef} value={answers[step - 1]}
            onChange={e => { setCurrentText(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }}
            placeholder="Because…"
            style={{ width: '100%', background: 'none', border: 'none', outline: 'none', resize: 'none', fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '1rem', lineHeight: 1.85, color: '#2c1f14', padding: 0, minHeight: 100 }} />
        </div>
      )}

      {/* Done — show full chain */}
      {phase === 'done' && (
        <div>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: ACCENT, marginBottom: 20, opacity: 0.8 }}>Here's what you uncovered</p>
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#a89070', marginBottom: 6 }}>Feeling</div>
            <div style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#2c1f14', marginBottom: 8 }}>{feeling}</div>
            {answers.slice(0, stoppedAt ?? MAX_STEPS).filter(Boolean).map((a, i) => (
              <div key={i}>
                <div style={{ fontSize: '0.65rem', color: ACCENT, opacity: 0.55, margin: '6px 0 6px 16px' }}>↓ because…</div>
                <div style={{ fontSize: i === (stoppedAt ?? MAX_STEPS) - 1 ? '1.05rem' : '0.9rem', lineHeight: 1.7, color: i === (stoppedAt ?? MAX_STEPS) - 1 ? '#2c1f14' : 'rgba(44,31,20,0.6)', fontWeight: i === (stoppedAt ?? MAX_STEPS) - 1 ? 'normal' : 'normal', marginLeft: (i + 1) * 6 }}>{a}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, padding: '16px 18px', background: 'rgba(155,126,200,0.07)', borderRadius: 12, borderLeft: `3px solid ${ACCENT}` }}>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.8, color: 'rgba(44,31,20,0.6)', fontStyle: 'italic', margin: 0 }}>
              Now you know where it actually comes from. You don't have to fix it right now — just knowing is enough.
            </p>
          </div>
        </div>
      )}

      {showHistory && (
        <TypedHistoryPanel type={TYPE}
          previewFn={e => e?.feeling || ''}
          onSelect={loadHistorical}
          onClose={() => setShowHistory(false)} />
      )}
    </WarmPage>
  )
}
