import html2pdf from 'html2pdf.js'
import { formatDateDisplay } from './storage'

function buildHtml(entries) {
  const pages = entries
    .map(
      ([dateKey, entry]) => `
      <div style="
        page-break-after: always;
        background: #FFF9C4;
        padding: 60px 80px;
        font-family: 'Kalam', cursive;
        color: #C0392B;
        min-height: 100vh;
        position: relative;
      ">
        <div style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">
          ${formatDateDisplay(dateKey)}
        </div>
        <div style="font-size: 13px; opacity: 0.6; margin-bottom: 40px; font-style: italic;">
          Write as if it has already happened…
        </div>
        <div style="font-size: 18px; line-height: 2.2; white-space: pre-wrap;">
          ${entry.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </div>
        ${entry.sealed ? '<div style="position: absolute; bottom: 60px; right: 80px; font-size: 40px; opacity: 0.15;">🔒</div>' : ''}
      </div>
    `
    )
    .join('')

  return `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body style="margin:0; padding:0;">${pages}</body>
    </html>
  `
}

export async function exportEntries(entries, filename = 'manifestation-journal.pdf') {
  const container = document.createElement('div')
  container.innerHTML = buildHtml(entries)
  document.body.appendChild(container)

  const opt = {
    margin: 0,
    filename,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#FFF9C4' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  }

  try {
    await html2pdf().set(opt).from(container).save()
  } finally {
    document.body.removeChild(container)
  }
}
