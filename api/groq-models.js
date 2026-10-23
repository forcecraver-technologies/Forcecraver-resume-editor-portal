const https = require('https');

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const apiKey = (process.env.GROQ_API_KEY || GROQ_API_KEY || '').trim();
    if (!apiKey) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'No GROQ_API_KEY set' }));
    }

    const groqReq = https.request('https://api.groq.com/openai/v1/models', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        timeout: 10000
    }, (gRes) => {
        let data = '';
        gRes.on('data', chunk => data += chunk);
        gRes.on('end', () => {
            res.writeHead(gRes.statusCode, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    });

    groqReq.on('error', (err) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    });
    groqReq.end();
};
