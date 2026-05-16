import { useMemo } from 'react'

const TYPES = [
  {
    id: 'scripting',
    label: 'Scripting',
    tag: 'Manifestation · Morning',
    desc: 'Write as if your desired life has already happened.',
    bg: '#fdf0e8', border: 'rgba(192,57,43,0.18)', color: '#C0392B',
  },
  {
    id: 'gratitude',
    label: 'Gratitude',
    tag: 'Warmth · Awareness',
    desc: 'Five guided moments to notice and name what\'s good today.',
    bg: '#fdf3e6', border: 'rgba(196,149,106,0.22)', color: '#c4956a',
  },
  {
    id: 'ladder',
    label: 'Why Ladder',
    tag: 'Self-inquiry · Root cause',
    desc: 'Ask yourself why you feel this way — eight times — to find what\'s underneath.',
    bg: '#f2eefa', border: 'rgba(155,126,200,0.22)', color: '#9b7ec8',
  },
  {
    id: 'dump',
    label: 'Brain Dump',
    tag: 'Clarity · Release',
    desc: 'No filter, no rules. Just empty your head onto the page.',
    bg: '#eef5f9', border: 'rgba(100,150,180,0.22)', color: '#5a8fa8',
  },
  {
    id: 'reflect',
    label: 'Daily Reflection',
    tag: 'End of day · Processing',
    desc: 'What went well, what drained you, and one thing you\'d do differently.',
    bg: '#eef8f2', border: 'rgba(126,200,155,0.22)', color: '#5a9e78',
  },
  {
    id: 'reframe',
    label: 'Reframe',
    tag: 'Perspective · Shift',
    desc: 'Write what happened honestly — then retell it as someone who has your back.',
    bg: '#fceef4', border: 'rgba(200,126,155,0.22)', color: '#c87e9b',
  },
]

const DAILY_POOL_IDS = ['scripting', 'gratitude', 'reflect']
const STORAGE_KEY = 'stillspace_mirror'

function getDailyPick() {
  const today = new Date().toLocaleDateString('en-AU', { timeZone: 'Australia/Melbourne' })
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  if (saved.date === today) {
    return TYPES.find(t => t.id === saved.id) || TYPES[0]
  }
  const pool = DAILY_POOL_IDS.filter(id => id !== saved.id)
  const picked = pool[Math.floor(Math.random() * pool.length)]
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, id: picked }))
  return TYPES.find(t => t.id === picked)
}

function Card({ t, isToday, onSelect }) {
  const border = isToday
    ? t.border.replace(/[\d.]+\)$/, '0.55)')
    : t.border
  const borderWidth = isToday ? '1.5px' : '1px'
  return (
    <div
      onClick={() => onSelect(t.id)}
      style={{ background: t.bg, border: `${borderWidth} solid ${border}`, borderRadius: 20, padding: '22px 20px 20px', cursor: 'pointer' }}
      onPointerDown={e => e.currentTarget.style.opacity = '0.88'}
      onPointerUp={e => e.currentTarget.style.opacity = '1'}
      onPointerLeave={e => e.currentTarget.style.opacity = '1'}
    >
      <div style={{ fontSize: '1.05rem', color: t.color, marginBottom: 4 }}>{t.label}</div>
      <div style={{ fontSize: '0.63rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: '#a89070', marginBottom: 10 }}>{t.tag}</div>
      <div style={{ fontSize: '0.8rem', lineHeight: 1.65, color: '#a89070' }}>{t.desc}</div>
    </div>
  )
}

function SectionLabel({ text, style }) {
  return (
    <div style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a89070', padding: '0 4px', ...style }}>
      {text}
    </div>
  )
}

export default function JournalMenu({ onSelect }) {
  const todayPick = useMemo(getDailyPick, [])
  const others = TYPES.filter(t => t.id !== todayPick.id)

  return (
    <div style={{ minHeight: '100vh', background: '#faf5ef', color: '#2c1f14', fontFamily: "Georgia, 'Times New Roman', serif", WebkitFontSmoothing: 'antialiased', overflowY: 'auto' }}>
      <header style={{ padding: '22px 20px 16px', display: 'flex', justifyContent: 'flex-end' }}>
        <a href="/" style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(44,31,20,0.3)', textDecoration: 'none' }}>Home</a>
      </header>

      <div style={{ textAlign: 'center', padding: '44px 24px 36px' }}>
        <div style={{ width: 7, height: 7, background: '#c4956a', borderRadius: '50%', margin: '0 auto 20px', opacity: 0.5 }} />
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'normal', letterSpacing: '0.18em', color: '#6b4c2a', marginBottom: 8 }}>Still Space</h1>
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.16em', color: '#a89070', textTransform: 'uppercase' }}>Choose your practice</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px 56px' }}>
        <SectionLabel text="today's practice" />
        <Card t={todayPick} isToday onSelect={onSelect} />
        <SectionLabel text="or choose another" style={{ marginTop: 8 }} />
        {others.map(t => <Card key={t.id} t={t} isToday={false} onSelect={onSelect} />)}
      </div>
    </div>
  )
}
