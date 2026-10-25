import { Config } from '@remotion/cli/config'

Config.setEntryPoint('src/index.ts')
Config.setRendererPort(3456)
Config.setCachingEnabled(false)
