import { Composition, Still } from 'remotion'
import { Explainer, FPS, Thumbnail, totalFrames } from './Explainer'

export const Root = () => (
  <>
    <Composition id="Explainer" component={Explainer} durationInFrames={totalFrames} fps={FPS} width={1920} height={1080} />
    <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} />
  </>
)
