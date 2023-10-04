# vite-plugin-virtual-resource

A vite plugin loader for virtual paths with resolvers.

Use `import name from '~virtual/source'` to include a non existant content that is loaded and transformed with a resolver.

V2 supports vite 4+. For previous vite version use vite-plugin-virtual-resource@1.0.1

##### Example

You need to include a svg icon from [iconify icons framework](https://iconify.design/).
In your application you use your own component for output rendering (Icon-component) and you need only the raw svg-data.
The raw-data comes from [@iconify-json](https://github.com/iconify/collections-json). The virtual-resource plugin resolves the svg-data (json). View exemples below.

It can resolve any resource, not only icons.

## Install

```sh
npm install --save-dev @inveris/vite-plugin-virtual-resource
```

## Usage

```js
// vite.js
import { virtualResource } from '@inveris/vite-plugin-virtual-resource'

export default defineConfig({
  // ... vite config

  plugins: [
    virtualResource(),

    // ... other plugins
  ]
})
```

Without any options, virtual-resource uses a builtin resolver to include [@iconify-json](https://github.com/iconify/collections-json) icon files and let you use it with `import SomeIcon from '~/icon/PACKAGE/ICON_NAME'`.

##### Example with default resolver (works with any framework: react, vue, svelte, ...)

```js
import CloseIcon from '~icon/mdi/close-circle-outline'

<Icon src={CloseIcon} />
```

### With virtual and custom resolver

```js
// vite.js
import { virtualResource, resolver, virtuals } from '@inveris/vite-plugin-virtual-resource'

export default defineConfig({
  // ... vite config

  plugins: [
    virtualResource({
      virtuals: {
        // builtin
        '~icon/': virtuals.iconify,

        // builtin (long form)
        '~otherIconPackage/': {
          source: 'node_modules/@iconify/json/json/${1}.json',
          match: /^.*?\/(.*?)\/(.*?)$/,
          resolver: resolver.iconify
        }

        // custom
        '~myicon/': {
          source: 'my-icon-dir/all-icons.json',
          match: /^.*?\/(.*?)$/,
          resolver: (source, matches, config) => {
            const name = matches[1]
            const allIcons = JSON.parse(fs.readFileSync(source, 'utf8'))
            return {
              code: 'export default \'' + allIcons[name] + '\''
            }
          }
        }
      }
    }),

    // ... other plugins
  ]
})
```

You can use your own resolver, view [builtin-resolvers.ts](src/builtin-resolvers.ts) for a complete example.

##### Example

```js
import CloseIcon from '~icon/mdi/close-circle-outline'
import HelpIcon from '~otherIconPackage/mdi/help-circle-outline'
import MyIcon from '~myicon/loading'

<Icon src={CloseIcon} />
<Icon src={HelpIcon} />
<Icon src={MyIcon} />
```

## FAQ

> Why not use vite to include resources?

  That's a part of the job of vite. But in some cases you need to load and resolve complex data, that is not direct possible in vite without a plugin.

> Why not use [unplugin-icons](https://github.com/antfu/unplugin-icons)?

  unplugin-icons is a great plugin to include (only?) icons as a component.
  But for each icon it generates a component. So each component increases the code size unnecessary.
  If you use your own Icon-component for output rendering, you need only the raw svg-data.
