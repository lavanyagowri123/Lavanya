export default function InfoModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-dark/20 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto
                      bg-paper border-2 border-ink/20 rounded-2xl shadow-2xl
                      paper-texture animate-fade-in">
        <div className="sticky top-0 bg-paper/95 backdrop-blur-sm flex items-center
                        justify-between px-6 pt-6 pb-3 border-b border-ink/10">
          <h2 className="font-journal text-xl font-bold text-ink">Why this design?</h2>
          <button onClick={onClose} className="text-ink/40 hover:text-ink text-2xl leading-none">×</button>
        </div>

        <div className="px-6 py-5 space-y-6 font-journal text-ink">

          <section>
            <h3 className="font-bold text-base mb-2">🟡 Yellow paper</h3>
            <p className="text-sm leading-relaxed text-ink/80">
              Yellow sits at the peak of the visible light spectrum for human perception — the
              eye processes it faster than any other colour. Research in environmental psychology
              (Küller et al., 2006) links warm yellow environments to elevated mood and reduced
              cortisol. It also mimics natural parchment and candlelight, cues the brain associates
              with safety and calm focus — the same state optimal for reflective writing.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">🔴 Red ink</h3>
            <p className="text-sm leading-relaxed text-ink/80">
              Red activates the brain's reticular activating system (RAS) — the filter that decides
              what deserves attention. Studies in cognitive psychology (Mehta & Zhu, 2009) show red
              increases precision and commitment when used in goal-related tasks. Writing your
              intentions in red signals to the brain: <em>this matters</em>. It also creates a
              deliberate visual contrast to everyday black-on-white text, making the journaling
              space feel distinct and intentional.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">✍️ Handwriting-style font</h3>
            <p className="text-sm leading-relaxed text-ink/80">
              fMRI studies (James & Engelhardt, 2012) show handwriting activates Broca's area and
              the motor cortex simultaneously — regions linked to language production and embodied
              memory. Even a cursive-style digital font primes a similar cognitive mode, slowing
              reading pace and deepening emotional engagement compared to sans-serif type. It's why
              a letter from a friend feels different to a text message.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">✦ Writing as if it has already happened</h3>
            <p className="text-sm leading-relaxed text-ink/80">
              This technique — sometimes called <em>scripting</em> — is grounded in mental
              contrasting and implementation intention research (Oettingen, 2014). Writing in the
              past tense about a desired future activates the same neural reward circuits as
              recalling a real memory. The RAS then begins filtering your environment for evidence
              that confirms what you've written, a documented cognitive bias that works in your
              favour when directed deliberately.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-base mb-2">🔒 The Seal ritual</h3>
            <p className="text-sm leading-relaxed text-ink/80">
              Completion rituals reduce the Zeigarnik effect — the brain's tendency to keep
              rehearsing unfinished tasks. Sealing an entry signals cognitive closure, letting the
              subconscious process the intention without conscious rumination. Studies on
              expressive writing (Pennebaker, 1997) show that a clear endpoint to a writing session
              improves mood outcomes compared to open-ended journaling.
            </p>
          </section>

          <p className="text-xs text-ink/40 border-t border-ink/10 pt-4">
            Küller et al. (2006) · Mehta & Zhu (2009) · James & Engelhardt (2012) ·
            Oettingen (2014) · Pennebaker (1997)
          </p>
        </div>
      </div>
    </div>
  )
}
