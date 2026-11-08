import { build } from 'esbuild'
import { writeFileSync } from 'node:fs'

const result = await build({
  stdin: {
    contents: `
      import * as React from 'react'
      import * as ReactDOMClient from 'react-dom/client'
      import * as JSXRuntime from 'react/jsx-runtime'

      const modules = {
        react: React,
        'react-dom/client': ReactDOMClient,
        'react/jsx-runtime': JSXRuntime,
      }

      window.require = (name) => {
        if (Object.prototype.hasOwnProperty.call(modules, name)) return modules[name]
        throw new Error('Import unavailable in demos: ' + name)
      }
    `,
    resolveDir: process.cwd(),
    sourcefile: 'demo-runtime.ts',
    loader: 'ts',
  },
  bundle: true,
  format: 'iife',
  platform: 'browser',
  minify: true,
  write: false,
})

writeFileSync('lib/demo-runtime.generated.json', JSON.stringify(result.outputFiles[0].text))
