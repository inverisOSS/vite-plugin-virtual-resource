import type {
  Plugin,
  ResolvedConfig
} from 'vite'

import type {
  Options
} from './types'

import virtuals from './builtin-virtuals'

export { default as resolvers } from './builtin-resolvers'
export { default as virtuals } from './builtin-virtuals'

export function virtualResource(options?: Options): Plugin {
  let config: ResolvedConfig

  // default options
  options = {
    virtuals: {
      '~icon/': virtuals.iconify
    },
    ...options
  }
  const virtualAliases = Object.keys(options.virtuals)

  return {
    name: 'virtual:virtual-resource',
    enforce: 'pre',

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    resolveId(id: string) {
      for (const alias of virtualAliases) {
        if (id.startsWith(alias)) {
          return id
        }
      }
    },

    async load(id: string) {
      for (const alias of virtualAliases) {
        if (id.startsWith(alias)) {
          const virtual = options.virtuals[alias]
          let source = virtual.source

          // replace source placeholder `${1}, ${2}, ...` with matched values
          const matches = id.match(virtual.match)
          for (let index = 1; index < matches.length; index++) {
            source = source.replace('${' + index + '}', matches[index])
          }

          return virtual.resolver(source, matches, config)
        }
      }
      return null
    }
  }
}

export default virtualResource
