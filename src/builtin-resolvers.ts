import fs from 'fs'

import { ResolverFunction } from './types'

const cache: any = {
  iconify: {},
}

/**
 * @iconify/json resolver
 */
const iconify: ResolverFunction = (source, matches, config) => {
  const pack = matches[1]
  const name = matches[2]

  if (!cache.iconify[pack]) {
    cache.iconify[pack] = JSON.parse(fs.readFileSync(source, 'utf8'))
  }

  const iconData = cache.iconify[pack]

  let icon = iconData.icons[name]
  if (!icon) {
    // check alias icons
    icon = iconData.aliases[name]
    if (icon) {
      icon = iconData.icons[icon.parent]
    }
  }

  if (icon) {
    return {
      code: "export default '" + icon.body + "'",
    }
  } else {
    config.logger.warn(`[vite-plugin-virtual-resource] Icon '${name}' not found in '${source}'`)
  }
}

export default {
  iconify,
}
