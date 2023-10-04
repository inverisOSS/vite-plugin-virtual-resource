import { Virtual } from './types'

import builtinResolvers from './builtin-resolvers'

/**
 * @iconify/json virtual
 */
const iconify: Virtual = {
  source: 'node_modules/@iconify/json/json/${1}.json',
  match: /^.*?\/(.*?)\/(.*?)$/,
  resolver: builtinResolvers.iconify,
}

export default {
  iconify,
}
