import {
  Virtual
} from './types'

import builtinResolvers from './builtin-resolvers'

/**
 * @iconify-json virtual
 */
const iconify: Virtual = {
  source: 'node_modules/@iconify-json/${1}/icons.json',
  match: /^.*?\/(.*?)\/(.*?)$/,
  resolver: builtinResolvers.iconify
}

export default {
  iconify
}
