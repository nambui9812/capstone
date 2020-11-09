// Require packages
const http = require('http');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Require db
const SourceModel = require('./db/Source');
const HistoryModel = require('./db/History');

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
        SourceModel.find({}, (err, data) => {
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

            const newSource = new SourceModel({
                index,
                onoff: false
            })
            await newSource.save();

            res.writeHead(201, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({
                message: "Create new source successfully",
                data: newSource
            }));
        });
    }

    // Update source
    else if (req.url === '/api/sources' && req.method === 'PUT') {
        let body = '';

        req.on('data', (chunk) => body += chunk.toString());

        req.on('end', async () => {
            const { index, onoff } = JSON.parse(body);

            // Check if source is valid
            const foundSource = await SourceModel.findOne({ index });
            if (!foundSource) {
                res.writeHead(400, { 'Content-type': 'application/json' });
                res.end(JSON.stringify({
                    message: "Source not found"
                }));
                return;
            }

            // Check if new state is the same as old state
            if (foundSource.onoff === onoff) {
                res.writeHead(400, { 'Content-type': 'application/json' });
                res.end(JSON.stringify({
                    message: "Source not changed"
                }));
                return;
            }

            // Change state of source
            foundSource.onoff = onoff;
            await foundSource.save();

            // Create new history
            const newHistory = new HistoryModel({
                index,
                text: `Source ${index} turned ${onoff ? 'on' : 'off'}`
            })
            await createdHistory.save();

            res.writeHead(201, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({
                message: "Update source successfully",
                data: {
                    source: foundSource,
                    history: newHistory
                }
            }));
        });
    }

    // Get history of all sources
    else if (req.url === '/api/history' && req.method === 'GET') {
        HistoryModel.find({}, (err, data) => {
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({
                message: "Get history success",
                data
            }));
        })
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
