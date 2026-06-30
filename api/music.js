const https = require('https')

module.exports = function handler(req, res) {
  const q = req.query && req.query.q
  if (!q) {
    res.status(400).json({ error: 'Missing query' })
    return
  }

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=12`

  https.get(url, (apiRes) => {
    let raw = ''
    apiRes.on('data', chunk => { raw += chunk })
    apiRes.on('end', () => {
      try {
        const data = JSON.parse(raw)
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).json(data)
      } catch {
        res.status(500).json({ results: [] })
      }
    })
  }).on('error', () => {
    res.status(500).json({ results: [] })
  })
}
