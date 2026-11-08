import { build } from 'esbuild'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const { code } = await request.json()
  if (typeof code !== 'string' || code.length > 20000) {
    return Response.json({ error: 'Demo code must be under 20 KB.' }, { status: 400 })
  }

  try {
    const result = await build({
      stdin: {
        contents: `${code}\nimport { createRoot } from 'react-dom/client';\ncreateRoot(document.getElementById('root')!).render(<App />);`,
        sourcefile: 'demo.tsx',
        loader: 'tsx',
      },
      bundle: true,
      write: false,
      format: 'iife',
      minify: true,
      platform: 'browser',
      jsx: 'automatic',
      plugins: [
        {
          name: 'limit-demo-imports',
          setup(plugin) {
            plugin.onResolve({ filter: /.*/ }, ({ path }) => {
              if (['react', 'react-dom/client', 'react/jsx-runtime'].includes(path)) {
                return { path, external: true }
              }
              return { errors: [{ text: `Import '${path}' is unavailable in demos.` }] }
            })
          },
        },
      ],
    })
    return Response.json({ script: result.outputFiles[0].text })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not compile this demo.'
    return Response.json({ error: message }, { status: 400 })
  }
}
