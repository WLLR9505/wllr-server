#!/usr/bin/env node
var path = require('path'),
    http = require('http');
    
process.title = 'WLLR Server';
var args = process.argv,
    rootFolder = args[2] || path.resolve(process.cwd()),
    port = args[3] || 8000;

var config = require('./config'),
    fileHandler = require('./filehandler'),
    parse = require('url').parse,
    types = config.types,
    defaultIndex = config.defaultIndex,
    webServer = http.createServer();
    
function main () {
    if (args[2] == '-h') {
        help();
    } else {
        try {
            rootFolder = rootFolder.replace(/%20/g, ' ');
            rootFolder = rootFolder.replace(/\\/g , '/');

            webServer.listen(port, () => {
                process.stdout.write('\x1b[01;32mServer started\x1b[0m\n');
                process.stdout.write(`\x1b[01;36mhttp://localhost:${port}/\x1b[0m\n`);
                process.stdout.write('\x1b[01;33mCtrl+C to Shutdown\x1b[0m\n');
            });
        } catch (e) {
            process.stdout.write('\x1b[01;31mOcorreu um erro!\x1b[0m\n');
            process.stdout.write(e);
        }
        webServer.on('request', onRequest);
    }
}


function onRequest (req, res) {
    var filename = parse(req.url).pathname,
        fullPath , extension;

    if(filename === '/') {
        filename = defaultIndex;
    }
    fullPath = rootFolder + filename;
    extension = filename.substr(filename.lastIndexOf('.') + 1);

    fileHandler(fullPath, (data) => {
        res.writeHead(200, {
            'Content-Type': types[extension] || 'text/plain',
            'Content-Lenght': data.length
        });
        res.end(data);
    }, (err) => {
        res.writeHead(404);
        res.end();
    });
}

function help () {
    process.stdout.write('\nwllrserver [1] [2]\n');
    process.stdout.write('[1] : path to root folder with %20 on spaces\n');
    process.stdout.write('[2] : port (default: 8000)\n');
}
//-----------------------------
main();
