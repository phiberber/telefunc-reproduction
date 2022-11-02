import type { Plugin } from 'vite'
import type { InputOption } from 'rollup'
import { assert, isObject } from '../utils'
import { telefuncFilesGlobFileNameBase } from './telefuncFilesGlobFileNameBase'
import { telefuncFilesGlobFilePath } from './telefuncFilesGlobPath'
import { viteIsSSR, determineOutDir } from './utils'

export { build }

function build(): Plugin {
  return {
    name: 'telefunc:build',
    apply: 'build',
    config: (config) => {
      const outDir = determineOutDir(config)
      if (!viteIsSSR(config)) {
        config = config ?? {}
        config.build = config.build ?? {}
        config.build.outDir = outDir
      } else {
        config.build = config.build ?? {}
        config.build.rollupOptions = config.build.rollupOptions ?? {}
        
        const viteEntry = getViteEntry()
        let input = config.build.rollupOptions.input

        if(Array.isArray(input)) {
          input = [...input, ...Object.values(viteEntry)]
        } else {
          input = {
            ...viteEntry,
            ...normalizeRollupInput(config.build?.rollupOptions?.input)  
          }
        }

        config.build.rollupOptions.input = input
        config.build.outDir = outDir
      }
      console.log('Output:', config.build.outDir)
      console.log('Rollup build:', config.build.rollupOptions)
    }
  }
}

function normalizeRollupInput(input?: InputOption): Record<string, string> {
  if (!input) {
    return {}
  }
  /*
  if (typeof input === "string") {
    return { [input]: input };
  }
  if (Array.isArray(input)) {
    return Object.fromEntries(input.map((i) => [i, i]));
  }
  */
  assert(isObject(input))
  return input
}

function getViteEntry() {
  const viteEntry = {
    [telefuncFilesGlobFileNameBase]: telefuncFilesGlobFilePath
  }
  return viteEntry
}
