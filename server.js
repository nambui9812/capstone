// Require packages
const http = require('http');
const mongoose = require('mongoose');

// Setup promise
global.Promise = mongoose.Promise;

// Connect database
mongoose
    .connect('mongodb+srv://nambui9812:namdeptrai@cluster0.dz2cy.mongodb.net/<dbname>?retryWrites=true&w=majority', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

const server = http.createServer((req, res) => {
    if (req.url === '/api/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({
            message: "Get success"
        }));
    }
    else if (req.url === '/api/status' && req.method === 'GET') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({
            message: "Get status success"
        }));
    }
    else if (req.url === '/api/history' && req.method === 'GET') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({
            message: "Get history success"
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
