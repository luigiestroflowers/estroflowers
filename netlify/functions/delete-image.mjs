import { getStore } from '@netlify/blobs'

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const adminPassword = Netlify.env.get('ADMIN_PASSWORD') || 'estroflowers'

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Formato richiesta non valido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { key, password } = body

  if (password !== adminPassword) {
    return new Response(JSON.stringify({ error: 'Password non valida' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!key) {
    return new Response(JSON.stringify({ error: 'Chiave non fornita' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const store = getStore('gallery-images')
  await store.delete(key)

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = {
  path: '/api/delete-image',
  method: 'POST',
}
