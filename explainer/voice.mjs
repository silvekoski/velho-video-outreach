// Makes one ElevenLabs mp3 per scene and writes src/durations.json (seconds).
// Delete public/voice/<id>.mp3 to regenerate a scene after editing its text.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const key = process.env.ELEVENLABS_API_KEY
if (!key) throw new Error('ELEVENLABS_API_KEY is not set')
const voice = process.env.EXPLAINER_VOICE_ID ?? 'JBFqnCBsd6RMkjVDRZzb' // premade "George"
const scenes = JSON.parse(readFileSync('src/scenes.json', 'utf8'))
mkdirSync('public/voice', { recursive: true })

const durations = {}
for (const scene of scenes) {
  const file = `public/voice/${scene.id}.mp3`
  if (!existsSync(file)) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'content-type': 'application/json', accept: 'audio/mpeg' },
      body: JSON.stringify({ text: scene.text, model_id: 'eleven_multilingual_v2' }),
    })
    if (!res.ok) throw new Error(`${scene.id}: ElevenLabs ${res.status} ${await res.text()}`)
    writeFileSync(file, Buffer.from(await res.arrayBuffer()))
  }
  const out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' })
  durations[scene.id] = Number(out.trim())
  console.log(scene.id, durations[scene.id].toFixed(1), 's')
}
writeFileSync('src/durations.json', JSON.stringify(durations, null, 2))
console.log('total', Object.values(durations).reduce((a, b) => a + b, 0).toFixed(1), 's')
