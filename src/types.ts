import type {
  LoadResult
} from 'rollup'

import type {
  ResolvedConfig
} from 'vite'

export type ResolverFunction = {
  (
    source: string,
    matches: string[],
    config: ResolvedConfig
  ): LoadResult | null
}

export type Virtual = {
  match: RegExp
  resolver: ResolverFunction
  source: string
}

export type VirtualCollection = {
  [key: string]: Virtual
}

export type Options = {
  virtuals: VirtualCollection
}
