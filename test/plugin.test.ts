import { assert } from 'chai'

import fs from 'fs'

import { before, describe, it } from 'mocha'

import { build } from 'vite'

import type { RollupOutput } from 'rollup'

import virtualResource, { resolvers, virtuals } from '../src/index'

describe('vite build test', () => {
  const buildArgs: any = {
    build: {
      lib: {
        entry: 'test/example.ts',
        formats: ['es'],
      },
      target: 'esnext',
      write: false,
    },
    logLevel: 'warn',
  }

  let expectedCode = ''

  before(() => {
    // load json and create expected code
    const source = 'node_modules/@iconify-json/mdi/icons.json'
    const icons = JSON.parse(fs.readFileSync(source, 'utf8'))

    const icon = icons.icons['help-circle-outline'].body
    const aliasIcon = icons.icons[icons.aliases['zorro-mask'].parent].body

    expectedCode =
      `const c = '${icon}', n = '${aliasIcon}';\n` +
      `document.getElementById("icon").innerHTML = c;\n` +
      `document.getElementById("aliasIcon").innerHTML = n;\n`
  })

  /**
   * Custom
   */
  describe('custom virtual', () => {
    let buildOutput: RollupOutput[]

    before(async () => {
      buildOutput = <RollupOutput[]>await build({
        ...buildArgs,
        plugins: [
          virtualResource({
            virtuals: {
              '~icons/': {
                source: 'node_modules/@iconify-json/${1}/icons.json',
                match: /^.*?\/(.*?)\/(.*?)$/,
                resolver: resolvers.iconify,
              },
            },
          }),
        ],
      })
    })

    it('should equal', () => {
      const code = buildOutput[0].output[0].code
      assert.equal(code, expectedCode)
    })
  })

  /**
   * Builtin
   */
  describe('builtin virtual', () => {
    let buildOutput: RollupOutput[]

    before(async () => {
      buildOutput = <RollupOutput[]>await build({
        ...buildArgs,
        plugins: [
          virtualResource({
            virtuals: {
              '~icons/': virtuals.iconify,
            },
          }),
        ],
      })
    })

    it('should equal', () => {
      const code = buildOutput[0].output[0].code
      assert.equal(code, expectedCode)
    })
  })

  /**
   * Builtin with custom resolver
   */
  describe('builtin virtual with custom resolver', () => {
    let buildOutput: RollupOutput[]

    before(async () => {
      buildOutput = <RollupOutput[]>await build({
        ...buildArgs,
        plugins: [
          virtualResource({
            virtuals: {
              '~icons/': {
                ...virtuals.iconify,
                resolver: (source, matches) => {
                  return {
                    code:
                      matches[2] === 'zorro-mask' ? "export default 'Hello, Zorro!'" : "export default 'Hello, World!'",
                  }
                },
              },
            },
          }),
        ],
      })
    })

    it('should equal', () => {
      const expectedCode =
        `const n = "Hello, World!", o = "Hello, Zorro!";\n` +
        `document.getElementById("icon").innerHTML = n;\n` +
        `document.getElementById("aliasIcon").innerHTML = o;\n`

      const code = buildOutput[0].output[0].code
      assert.equal(code, expectedCode)
    })
  })

  /**
   * Builtin with custom resolver
   */
  describe('multiple virtuals', () => {
    let buildOutput: RollupOutput[]

    before(async () => {
      buildOutput = <RollupOutput[]>await build({
        build: {
          lib: {
            entry: 'test/example-multiple.ts',
            formats: ['es'],
          },
          target: 'esnext',
          write: false,
        },
        logLevel: 'warn',
        plugins: [
          virtualResource({
            virtuals: {
              '~icons/': {
                ...virtuals.iconify,
                resolver: () => {
                  return 'export default "World!"'
                },
              },
              '~other/': {
                ...virtuals.iconify,
                resolver: () => {
                  return 'export default "Zorro!"'
                },
              },
            },
          }),
        ],
      })
    })

    it('should equal', () => {
      const expectedCode = `const o = "World!", c = "Zorro!";\nconsole.log(o, c);\n`
      const code = buildOutput[0].output[0].code
      assert.equal(code, expectedCode)
    })
  })
})
