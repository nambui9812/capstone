// Require packages
const http = require('http');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Require db
const Source = require('./db/Source');

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
    // Test url
    if (req.url === '/api/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({
            message: "Get success"
        }));
    }

    // Get detail of all sources
    else if (req.url === '/api/sources' && req.method === 'GET') {
        const sources = Source.find({}, (err, data) => {
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({
                message: "Get all sources success",
                data
        }));
        });
    }

    // Create source - Use one time
    else if (req.url === '/api/sources' && req.method === 'POST') {
        let body = '';

        req.on('data', (chunk) => body += chunk.toString());

        req.on('end', async () => {
            const { index } = JSON.parse(body);

            const newSource = {
                index,
                onoff: false
            };

            const createdSource = await Source.create(newSource);

            res.writeHead(201, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({
                message: "Create new source successfully",
                data: createdSource
            }));
        });
    }

    // Get history of all sources
    else if (req.url === '/api/history' && req.method === 'GET') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({
            message: "Get history success"
        }));
    }

    // Make history
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

    // Main page
    else if (req.url === '/' && req.method === 'GET') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            // Check error
            if (err) throw err;

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content)
        })
    }

    // Route not found
    else {
        res.writeHead(400, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({
            message: "Route Not Found"
        }));
    }
});

const PORT = 5000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
