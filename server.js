// Require packages
const http = require('http');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Require db
const SourceModel = require('./db/Source');
const HistoryModel = require('./db/History');
const Agenda = require('agenda');

// Setup promise
global.Promise = mongoose.Promise;

// Connect database
mongoose
    .connect('mongodb+srv://nambui9812:namdeptrai@cluster0.dz2cy.mongodb.net/<dbname>?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Agenda stuff
const agenda = new Agenda({
    db: {
        address: 'mongodb+srv://nambui9812:namdeptrai@cluster0.dz2cy.mongodb.net/<dbname>?retryWrites=true&w=majority',
        collection: 'agendaJobs'
    }
});

(async function() { // IIFE to give access to async/await
    await agenda.start();
})();

// Server
const server = http.createServer((req, res) => {
    // Test url
    if (req.url === '/api/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({
            message: "Test successfully"
        }));
    }

    // Get detail of all sources
    else if (req.url === '/api/sources' && req.method === 'GET') {
        SourceModel.find({}, (err, data) => {
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({
                message: "Get all sources successfully",
                data
            }));
        });
    }

    // Get detail of a specific source
    else if (req.url.match(/\/api\/sources\/([0-9]+)/) && req.method === 'GET') {
        const index = req.url.split('/')[3];

        SourceModel.findOne({ index }, (err, data) => {
            if (!data) {
                res.writeHead(400, { 'Content-type': 'application/json' });
                res.end(JSON.stringify({
                    message: "Source not found"
                }));
                return;
            }

            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({
                message: "Get source successfully",
                data
            }));
        })
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
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: "Source not found"
                }));
            }

            // Check if new state is the same as old state
            if (foundSource.onoff === onoff) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: "Source not changed"
                }));
            }

            // Change state of source
            foundSource.onoff = onoff;
            await foundSource.save();

            // Create new history
            const newHistory = new HistoryModel({
                index,
                text: `Source ${index} turned ${onoff ? 'on' : 'off'}`
            })
            await newHistory.save();

            res.writeHead(201, { 'Content-Type': 'application/json' });
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
        HistoryModel.find({}).sort({ date: -1 }).exec((err, data) => {
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({
                message: "Get history success",
                data
            }));
        })
    }

    // Get history of a specific source
    else if (req.url.match(/\/api\/history\/([0-9]+)/) && req.method === 'GET') {
        const index = req.url.split('/')[3];

        HistoryModel.find({ index }).sort({ date: -1 }).exec((err, data) => {
            if (!data) {
                res.writeHead(400, { 'Content-type': 'application/json' });
                res.end(JSON.stringify({
                    message: "History of source not found"
                }));
            }

            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({
                message: "Get history of source successfully",
                data
            }));
        })
    }

    // Set jobs
    else if (req.url === '/api/jobs' && req.method === 'POST') {
        let body = '';

        req.on('data', (chunk) => body += chunk.toString());

        req.on('end', async () => {
            const { index, onoff, date } = JSON.parse(body);

            // Check if source is valid
            const foundSource = await SourceModel.findOne({ index });
            if (!foundSource) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: "Source not found"
                }));
            }

            // Check if source need to be changed
            if (foundSource.onoff === onoff) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: "Source not need to be changed"
                }));
            }

            // Set job
            agenda.define('change status', async job => {
                // Change state of source
                foundSource.onoff = onoff;
                await foundSource.save();

                // Create new history
                const newHistory = new HistoryModel({
                    index,
                    text: `Source ${index} turned ${onoff ? 'on' : 'off'}`
                })
                await newHistory.save();
            })
            agenda.schedule(new Date(date), 'change status');

            res.writeHead(201, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({
                message: "Create new job successfully"
            }));
        });
    }

    // Reset
    else if (req.url === '/api/reset' && req.method === 'GET') {
        (async function() {
            // Delete all history
            await HistoryModel.deleteMany({});

            // Delete all sources
            await SourceModel.deleteMany({})

            // Create 2 new source
            const newSource1 = new SourceModel({
                index: 1,
                onoff: false
            });
            
            const newSource2 = new SourceModel({
                index: 2,
                onoff: false
            });

            await Promise.all([newSource1.save(), newSource2.save()]);

            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({
                message: "Reset database successfully"
            }));
        })();
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

    // Other routes
    else {
        /*
        res.writeHead(400, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({
            message: "Route Not Found"
        }));
        */

        // Build the path
        let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

        // Extension of file
        let extName = path.extname(filePath);

        // Initialize content type
        let contentType = "";

        switch(extName) {
            case '.html':
                contentType = 'text/html';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.jpg':
                contentType = 'image/jpg';
                break;
            case '.png':
                contentType = 'image/png';
                break;    
            default:
                contentType = 'text/html';
                break;
        }

        // Read file
        fs.readFile(filePath, (err, content) => {
            // Error
            if (err) {
                res.writeHead(400, { 'Content-Type': 'text/html' });
                res.end("<h1>Not found</h1>");
            }

            res.writeHead(200, { 'Content-Type': contentType })
            res.end(content, 'utf8');
        })
    }
});

// PORT
const PORT = 5000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
