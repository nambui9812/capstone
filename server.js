const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/api/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({
            message: "Get success"
        }));
    }
    else if (req.url === '/api/history' && req.method === 'POST') {
        let body = '';

        req.on('data', (chunk) => body += chunk.toString());

        req.on('end', () => {
            const { text } = JSON.parse(body);

            res.writeHead(201, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({
                message: "Create history",
                text
            }));
        });
    }
    else {
        res.writeHead(400, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({
            message: "Route Not Found"
        }));
    }
});

const PORT = 5000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
