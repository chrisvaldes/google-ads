// Proxy pour contourner CORS - À déployer sur Vercel/Netlify
export default async function handler(req, res) {
  // Activer CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, developer-token');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { endpoint, method = 'GET', headers = {}, body, params } = req.query;
    
    // Construire l'URL Google Ads API
    let url = `https://googleads.googleapis.com/v17/${endpoint}`;
    
    // Ajouter les paramètres
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    // Préparer les headers pour Google Ads
    const googleHeaders = {
      'Authorization': headers.authorization || '',
      'developer-token': headers['developer-token'] || '',
      'Content-Type': 'application/json'
    };

    let response;
    
    if (method === 'GET') {
      response = await fetch(url, {
        method: 'GET',
        headers: googleHeaders
      });
    } else if (method === 'POST') {
      response = await fetch(url, {
        method: 'POST',
        headers: googleHeaders,
        body: body ? JSON.parse(body) : {}
      });
    }

    const data = await response.json();
    
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy error' });
  }
}
