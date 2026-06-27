import { getStore } from '@netlify/blobs'

const VALID_CATEGORIES = ['bouquet', 'eventi', 'decorhome']

export default async (req) => {
  const url = new URL(req.url)
  const category = url.searchParams.get('category')

  if (!category || !VALID_CATEGORIES.includes(category)) {
    return new Response(JSON.stringify({ error: 'Categoria non valida' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const store = getStore('gallery-images')
  const { blobs } = await store.list({ prefix: `${category}/` })

  const images = blobs.map((blob) => ({
    key: blob.key,
    url: `/api/get-image?key=${encodeURIComponent(blob.key)}`,
  }))

  return new Response(JSON.stringify({ images }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = {
  path: '/api/list-images',
  method: 'GET',
}
