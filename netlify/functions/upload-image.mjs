import { getStore } from '@netlify/blobs'

const VALID_CATEGORIES = ['bouquet', 'eventi', 'decorhome']

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const adminPassword = Netlify.env.get('ADMIN_PASSWORD') || 'estroflowers'

  let formData
  try {
    formData = await req.formData()
  } catch {
    return new Response(JSON.stringify({ error: 'Formato richiesta non valido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const password = formData.get('password')
  const category = formData.get('category')
  const image = formData.get('image')

  if (password !== adminPassword) {
    return new Response(JSON.stringify({ error: 'Password non valida' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    return new Response(JSON.stringify({ error: 'Categoria non valida' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!image || typeof image.arrayBuffer !== 'function') {
    return new Response(JSON.stringify({ error: 'Immagine non valida' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const contentType = image.type || 'image/jpeg'
  const safeName = (image.name || 'photo.jpg').replace(/[^a-zA-Z0-9._-]/g, '_')
  const key = `${category}/${Date.now()}-${safeName}`

  const arrayBuffer = await image.arrayBuffer()

  const store = getStore('gallery-images')
  await store.set(key, arrayBuffer, {
    metadata: { contentType },
  })

  return new Response(JSON.stringify({ success: true, key }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = {
  path: '/api/upload-image',
  method: 'POST',
}
