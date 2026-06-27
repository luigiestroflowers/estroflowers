import { getStore } from '@netlify/blobs'

export default async (req) => {
  const url = new URL(req.url)
  const key = url.searchParams.get('key')

  if (!key) {
    return new Response('Chiave non fornita', { status: 400 })
  }

  const store = getStore('gallery-images')
  const meta = await store.getMetadata(key)

  if (!meta) {
    return new Response('Immagine non trovata', { status: 404 })
  }

  const contentType = meta.metadata?.contentType || 'image/jpeg'
  const stream = await store.get(key, { type: 'stream' })

  return new Response(stream, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

export const config = {
  path: '/api/get-image',
  method: 'GET',
}
