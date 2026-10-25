import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import durations from './durations.json'
import scenes from './scenes.json'

export const FPS = 30
const LEAD = 0.4 // seconds of silence before the voice starts
const TAIL = 0.8 // seconds after the voice ends
const BLUE = '#2563EB'
const INK = '#0B0F1E'
const FONT = '"Poppins", "Helvetica Neue", Arial, sans-serif'

type Scene = (typeof scenes)[number]
const SHOTS: Record<string, string> = { pipeline: 'deal.png', review: 'review.png', page: 'page.png', crm: 'deals.png', brief: 'metrics.png' }
const lengths = scenes.map((s) => Math.ceil((durations[s.id as keyof typeof durations] + LEAD + TAIL) * FPS))
const starts = lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0))
export const totalFrames = lengths.reduce((a, b) => a + b, 0)

export const Explainer = () => {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: INK, fontFamily: FONT, color: 'white' }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 85% 15%, ${BLUE}55, transparent 55%)` }} />
      {scenes.map((scene, i) => (
        <Sequence key={scene.id} from={starts[i]} durationInFrames={lengths[i]}>
          <Audio src={staticFile(`voice/${scene.id}.mp3`)} startFrom={0} delayRenderTimeoutInMilliseconds={60000} />
          <Slide scene={scene} length={lengths[i]} index={i} />
        </Sequence>
      ))}
      <div style={{ position: 'absolute', left: 0, bottom: 0, height: 8, background: BLUE, width: `${(frame / totalFrames) * 100}%` }} />
    </AbsoluteFill>
  )
}

const Slide = ({ scene, length, index }: { scene: Scene; length: number; index: number }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const opacity = interpolate(frame, [0, 12, length - 12, length], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const rise = spring({ frame, fps, config: { damping: 200 } })
  const bookend = scene.items.length === 0
  // Reveal the items evenly across the narration, leaving the last third of each step on screen.
  const voiceFrames = length - (LEAD + TAIL) * FPS
  const itemAt = (i: number) => LEAD * FPS + 20 + (i * voiceFrames * 0.85) / scene.items.length

  if (bookend) {
    return (
      <AbsoluteFill style={{ opacity, alignItems: 'center', justifyContent: 'center', gap: 56, padding: 160, textAlign: 'center' }}>
        <Img src={staticFile('logo.svg')} style={{ width: 340, transform: `scale(${0.9 + rise * 0.1})` }} />
        <div style={{ fontSize: 30, letterSpacing: 8, textTransform: 'uppercase', color: '#8FA2FF' }}>{scene.kicker}</div>
        <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.1, maxWidth: 1400, transform: `translateY(${(1 - rise) * 40}px)` }}>{scene.title}</div>
      </AbsoluteFill>
    )
  }

  const stages = scene.id === 'crm'
  const shot = SHOTS[scene.id]
  const phone = shot === 'page.png'
  const shotIn = spring({ frame: frame - 8, fps, config: { damping: 200 } })
  return (
    <AbsoluteFill style={{ opacity, padding: '120px 160px', justifyContent: 'center' }}>
      <Img src={staticFile('logo.svg')} style={{ position: 'absolute', right: 120, top: 70, width: 150, opacity: 0.7 }} />
      <div style={{ maxWidth: shot ? (phone ? 1050 : 620) : undefined }}>
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: 'uppercase', color: '#8FA2FF' }}>
          {String(index).padStart(2, '0')} · {scene.kicker}
        </div>
        <div style={{ fontSize: shot ? 60 : 76, fontWeight: 700, lineHeight: 1.1, marginTop: 24, maxWidth: 1350, transform: `translateY(${(1 - rise) * 40}px)` }}>
          {scene.title}
        </div>
        <div style={{ width: 120, height: 8, background: BLUE, margin: '44px 0 56px', transform: `scaleX(${rise})`, transformOrigin: 'left' }} />
        <div style={stages ? { display: 'flex', gap: 14, flexWrap: shot ? 'wrap' : 'nowrap' } : { display: 'flex', flexDirection: 'column', gap: shot ? 24 : 30 }}>
          {scene.items.map((item, i) => {
            const p = spring({ frame: frame - itemAt(i), fps, config: { damping: 200 } })
            return stages ? (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: 0.25 + p * 0.75 }}>
                <div style={{ fontSize: shot ? 26 : 30, fontWeight: 600, whiteSpace: 'nowrap', padding: '18px 24px', borderRadius: 18, background: p > 0.5 ? BLUE : '#1C2238' }}>{item}</div>
                {i < scene.items.length - 1 && <div style={{ fontSize: 28, color: '#8FA2FF' }}>→</div>}
              </div>
            ) : (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 28, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: BLUE, display: 'grid', placeItems: 'center', fontSize: 26, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: shot ? 34 : 44, color: '#E6E9F5' }}>{item}</div>
              </div>
            )
          })}
        </div>
      </div>
      {shot && (
        <Img
          src={staticFile(`shots/${shot}`)}
          style={{
            position: 'absolute',
            right: phone ? 240 : 80,
            top: phone ? 150 : 250,
            ...(phone ? { height: 820, borderRadius: 40, border: '10px solid #1C2238' } : { width: 940, borderRadius: 16 }),
            boxShadow: '0 40px 100px rgba(0,0,0,0.55)',
            opacity: shotIn,
            transform: `translateY(${(1 - shotIn) * 60}px) scale(${0.96 + shotIn * 0.04 + (frame / length) * 0.03})`,
          }}
        />
      )}
    </AbsoluteFill>
  )
}

export const Thumbnail = () => (
  <AbsoluteFill style={{ background: INK, fontFamily: FONT, color: 'white', padding: '0 70px', justifyContent: 'center' }}>
    <AbsoluteFill style={{ background: `radial-gradient(circle at 80% 30%, ${BLUE}66, transparent 60%)` }} />
    <Img src={staticFile('shots/metrics.png')} style={{ position: 'absolute', right: -170, top: 120, width: 640, borderRadius: 14, boxShadow: '0 30px 80px rgba(0,0,0,0.6)', transform: 'rotate(-4deg)' }} />
    <Img src={staticFile('shots/page.png')} style={{ position: 'absolute', right: 250, top: 70, height: 600, borderRadius: 32, border: '8px solid #1C2238', boxShadow: '0 30px 80px rgba(0,0,0,0.6)', transform: 'rotate(3deg)' }} />
    <div style={{ position: 'relative', maxWidth: 560 }}>
      <Img src={staticFile('logo.svg')} style={{ width: 170 }} />
      <div style={{ fontSize: 22, letterSpacing: 5, textTransform: 'uppercase', color: '#8FA2FF', marginTop: 40 }}>Velho hackathon challenge</div>
      <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.02, marginTop: 14 }}>VideoOutreachOS</div>
      <div style={{ width: 100, height: 8, background: BLUE, margin: '28px 0' }} />
      <div style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.15, color: '#E6E9F5' }}>Personal videos that book meetings</div>
    </div>
  </AbsoluteFill>
)
