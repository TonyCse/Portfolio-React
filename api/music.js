export default async function handler(req, res) {
  const { q } = req.query
  if (!q) return res.status(400).json({ error: 'Missing query' })

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=12`
    const response = await fetch(url)
    const data = await response.json()

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed', results: [] })
  }
}
