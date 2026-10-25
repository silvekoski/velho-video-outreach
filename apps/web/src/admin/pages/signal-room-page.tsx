import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight, BriefcaseBusiness, CalendarDays, Check, CircleDot, Copy, Globe2, Plus, Radar, Search, Sparkles, Video, WandSparkles } from 'lucide-react'
import { Link } from 'react-router'
import './signal-room.css'

type SignalKind = 'hiring' | 'expansion' | 'handoffs' | 'volume'

const SIGNALS: { id: SignalKind; label: string; detail: string; icon: typeof BriefcaseBusiness; implication: string; wedge: string; question: string }[] = [
  { id: 'hiring', label: 'Hiring for operations', detail: 'A role hints at repeated manual work', icon: BriefcaseBusiness, implication: 'The team is adding capacity around a process that may still depend on people moving information by hand.', wedge: 'Map the handoffs behind the new role. Look for intake, validation and re-entry that can be removed before adding more volume.', question: 'Which part of this role would you most like to make disappear from someone’s weekly workload?' },
  { id: 'expansion', label: 'Expansion or new location', detail: 'Growth adds process complexity', icon: ArrowUpRight, implication: 'A new site or market multiplies the coordination work already holding the operation together.', wedge: 'Trace one cross-site workflow from first request to completion. A small automation can make the second location feel like the first.', question: 'As you expand, which process is hardest to repeat without adding another coordinator?' },
  { id: 'handoffs', label: 'Manual handoffs', detail: 'You have observed a repetitive workflow', icon: ArrowDownRight, implication: 'Repeated handoffs are a useful starting point: they reveal where context is copied, checked or chased between people and tools.', wedge: 'Pick one recurring handoff and prototype the smallest useful fix: capture once, route automatically, keep a human on exceptions.', question: 'Where does work most often pause while someone waits for information from another person or system?' },
  { id: 'volume', label: 'Rising workload', detail: 'More volume, same operating model', icon: CircleDot, implication: 'When volume rises faster than headcount, the team often absorbs the difference through queues, overtime and workarounds.', wedge: 'Find the highest-volume exception path. Automating the predictable 80% can return capacity without asking the team to change everything.', question: 'What is growing faster than your team can comfortably handle right now?' },
]

const EXAMPLES = [
  { name: 'Northstar Components', sector: 'Industrial manufacturing', signal: 'hiring' as const, source: 'Careers page · Operations coordinator', sourceUrl: 'https://example.com/careers', date: 'Added today' },
  { name: 'Harborline Logistics', sector: 'Transport & logistics', signal: 'expansion' as const, source: 'Company news · New depot announced', sourceUrl: 'https://example.com/news', date: 'Added yesterday' },
  { name: 'Fieldnote Foods', sector: 'Food production', signal: 'volume' as const, source: 'Open roles · Production planning', sourceUrl: 'https://example.com/jobs', date: 'Added 2 days ago' },
]

function cleanDomain(value: string) {
  return value.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
}

export function SignalRoomPage() {
  const [query, setQuery] = useState('')
  const [company, setCompany] = useState('')
  const [domain, setDomain] = useState('')
  const [sector, setSector] = useState('')
  const [signalId, setSignalId] = useState<SignalKind>('hiring')
  const [evidence, setEvidence] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [proofReady, setProofReady] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [copyFailed, setCopyFailed] = useState(false)
  const [active, setActive] = useState('today')
  const searchRef = useRef<HTMLInputElement>(null)
  const companyRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (proofReady) document.getElementById('playbook')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [proofReady])

  const selectedSignal = SIGNALS.find((signal) => signal.id === signalId) ?? SIGNALS[0]!
  const filteredExamples = useMemo(() => EXAMPLES.filter((item) => `${item.name} ${item.sector} ${item.source}`.toLowerCase().includes(query.toLowerCase())), [query])
  const Icon = selectedSignal.icon

  function pickExample(item: typeof EXAMPLES[number]) {
    setCompany(item.name)
    setDomain(item.sourceUrl.replace('https://', ''))
    setSector(item.sector)
    setSignalId(item.signal)
    setEvidence(item.source)
    setSourceUrl(item.sourceUrl)
    setProofReady(true)
    setError('')
    setActive('playbook')
  }

  function generateProof() {
    if (!company.trim()) return setError('Add a company name to build its proof brief.')
    if (!evidence.trim()) return setError('Add one observable signal so the brief stays grounded in evidence.')
    setError('')
    setProofReady(true)
    setActive('playbook')
  }

  const draftText = `Hi, I noticed ${evidence.trim()} at ${company.trim()}. When teams grow, the manual handoffs behind a process can quietly absorb the capacity growth was meant to create. Velho helps established teams find one such workflow, build a practical fix, and make sure people use it. Would a 20-minute working session on one handoff be useful?`

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draftText)
      setCopyFailed(false)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopyFailed(true)
    }
  }

  function goTo(id: string) {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const counts = SIGNALS.map((signal) => ({ ...signal, count: EXAMPLES.filter((item) => item.signal === signal.id).length }))
  const nav = [
    { id: 'today', label: 'Signal desk', icon: Radar, count: EXAMPLES.length },
    { id: 'proof', label: 'Proof lab', icon: WandSparkles },
    { id: 'playbook', label: 'Meeting playbook', icon: BriefcaseBusiness, disabled: !proofReady },
  ]

  return (
    <div className="sr-app">
      <aside className="sr-side">
        <a className="sr-brand" href="/" aria-label="Signal Room home"><span className="sr-glyph"><Radar size={16} /></span>Signal Room</a>
        <nav className="sr-nav" aria-label="Main">
          {nav.map((item) => (
            <button key={item.id} type="button" className={`sr-nav-link ${active === item.id ? 'active' : ''}`} disabled={item.disabled} title={item.disabled ? 'Build a proof brief first' : undefined} onClick={() => goTo(item.id)}>
              <item.icon size={16} />{item.label}{item.count ? <span className="sr-count">{item.count}</span> : null}
            </button>
          ))}
          <Link to="/" className="sr-nav-link"><Video size={16} />Deals &amp; videos</Link>
        </nav>
        <div className="sr-promo">
          <span className="sr-promo-icon"><Sparkles size={14} /></span>
          <strong>Turn a signal into a meeting</strong>
          <p>Pick a company, add what you observed, and get a question worth asking.</p>
          <button type="button" onClick={() => { goTo('proof'); companyRef.current?.focus() }}>Start a proof brief</button>
        </div>
      </aside>

      <div className="sr-body">
        <header className="sr-top">
          <label className="sr-search"><Search size={15} /><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search companies or signals…" aria-label="Search companies or signals" /><kbd>⌘K</kbd></label>
          <span className="sr-region"><Globe2 size={14} /> Finland · Nordics</span>
        </header>

        <main className="sr-main">
          <div className="sr-title" id="today">
            <div><h1>Signal desk</h1><p>A public signal gets you to the right company. A useful point of view gets you into the room.</p></div>
            <div className="sr-actions">
              <span className="sr-chip"><CalendarDays size={14} /> Sun, 25 Oct 2026</span>
              <button type="button" className="sr-primary" onClick={() => { goTo('proof'); companyRef.current?.focus() }}><Plus size={15} /> New proof brief</button>
            </div>
          </div>

          <section className="sr-kpis" aria-label="Signals by type">
            {counts.map((signal) => (
              <button type="button" key={signal.id} className={`sr-card sr-kpi ${signalId === signal.id ? 'selected' : ''}`} onClick={() => { setSignalId(signal.id); setProofReady(false) }}>
                <span className="sr-kpi-head">{signal.label}<signal.icon size={16} /></span>
                <strong>{signal.count}</strong>
                <small>{signal.detail}</small>
              </button>
            ))}
          </section>

          <section className="sr-grid">
            <div className="sr-card sr-feed">
              <div className="sr-card-head"><h2>Signals worth a closer look</h2><span className="sr-muted">{filteredExamples.length} of {EXAMPLES.length}</span></div>
              <div className="sr-table">
                <div className="sr-tr sr-th"><span>Company</span><span>Signal</span><span>Evidence</span><span>Added</span><span /></div>
                {filteredExamples.map((item) => {
                  const signal = SIGNALS.find((entry) => entry.id === item.signal)!
                  return (
                    <button type="button" key={item.name} className={`sr-tr ${company === item.name ? 'selected' : ''}`} onClick={() => pickExample(item)}>
                      <span className="sr-company"><span className="sr-avatar"><signal.icon size={15} /></span><span><strong>{item.name}</strong><small>{item.sector}</small></span></span>
                      <span><span className="sr-tag">{signal.label}</span></span>
                      <span className="sr-evidence">{item.source}</span>
                      <span className="sr-muted">{item.date}</span>
                      <span className="sr-go"><ArrowRight size={15} /></span>
                    </button>
                  )
                })}
                {filteredExamples.length === 0 && <p className="sr-empty">No matches for “{query}”. <button type="button" onClick={() => setQuery('')}>Clear search</button></p>}
              </div>
              <p className="sr-note">Examples are fictional demo records. A hiring post is never proof of a problem, only a specific reason to ask. Click a row to build its brief.</p>
            </div>

            <section className="sr-card sr-proof" id="proof">
              <div className="sr-card-head"><h2>Proof lab</h2><span className="sr-glyph soft"><Sparkles size={15} /></span></div>
              <p className="sr-muted">Turn one public signal into a point of view worth replying to. No send button.</p>
              <form className="sr-form" onSubmit={(event) => { event.preventDefault(); generateProof() }}>
                <label>Company<input ref={companyRef} value={company} onChange={(event) => { setCompany(event.target.value); setProofReady(false) }} placeholder="e.g. Northstar Components" /></label>
                <div className="sr-split"><label>Website<input value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="company.fi" /></label><label>Industry<input value={sector} onChange={(event) => setSector(event.target.value)} placeholder="Manufacturing" /></label></div>
                <label>Why now<select value={signalId} onChange={(event) => { setSignalId(event.target.value as SignalKind); setProofReady(false) }}>{SIGNALS.map((signal) => <option key={signal.id} value={signal.id}>{signal.label}</option>)}</select></label>
                <label>Public evidence<input value={evidence} onChange={(event) => { setEvidence(event.target.value); setProofReady(false) }} placeholder="What did you actually observe?" /></label>
                <label>Source link <span className="sr-muted">optional</span><input value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="https://…" /></label>
                {error && <p className="sr-error" role="alert">{error}</p>}
                <button type="submit" className="sr-primary wide">Build their proof brief <ArrowRight size={15} /></button>
                <p className="sr-note center">Inputs stay in this browser. Nothing is sent to the company.</p>
              </form>
            </section>
          </section>

          {proofReady && <section className="sr-brief" id="playbook" aria-live="polite">
            <div className="sr-card-head"><h2>A reason to talk to {company}</h2><span className="sr-pill-good">Ready to review</span></div>
            <div className="sr-brief-grid">
              <article className="sr-card"><span className="sr-label">The signal</span><span className="sr-tag">{selectedSignal.label}</span><h3>{evidence}</h3>{sourceUrl && <a className="sr-link" href={sourceUrl.startsWith('http') ? sourceUrl : `https://${sourceUrl}`} target="_blank" rel="noreferrer">Open public source <ArrowUpRight size={13} /></a>}<p className="sr-note">A conversation starter, not a claim about how this company works.</p></article>
              <article className="sr-card"><span className="sr-label">Operational hypothesis</span><span className="sr-glyph soft"><Icon size={15} /></span><p>{selectedSignal.implication}</p><small className="sr-muted">{sector || 'This company'} · hypothesis to validate</small></article>
              <article className="sr-card"><span className="sr-label">A small first proof</span><div className="sr-flow"><span>Request</span><i /><span>Check</span><i /><span>Re-key</span><i /><span className="fix">Done</span></div><p>{selectedSignal.wedge}</p><small className="sr-muted">Vehicle: 20-minute working session</small></article>
              <article className="sr-card sr-meeting">
                <span className="sr-label">The question that earns the room</span>
                <blockquote>“{selectedSignal.question}”</blockquote>
                <div className="sr-card-head"><span className="sr-label">Follow-up draft</span><button type="button" className="sr-ghost" onClick={() => void copyDraft()}>{copied ? <Check size={13} /> : <Copy size={13} />}{copied ? 'Copied' : copyFailed ? 'Copy failed, select the text' : 'Copy draft'}</button></div>
                <p className="sr-draft">{draftText}</p>
                <small className="sr-muted">Draft only · nothing sent · review before use</small>
              </article>
            </div>
          </section>}
        </main>
      </div>
    </div>
  )
}
