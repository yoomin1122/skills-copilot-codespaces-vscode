// Create web server
// Create a web server that listens on port 3000
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

// Load comments from file
let comments = [];
fs.readFile('comments.json', (err, data) => {
  comments = JSON.parse(data);
});

// Create server
http.createServer((req, res) => {
  // Parse request URL
  const parts = url.parse(req.url);
  const path = parts.pathname;
  const query = querystring.parse(parts.query);

  // Handle GET /comments
  if (req.method === 'GET' && path === '/comments') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(comments));
  }

  // Handle POST /comments
  else if (req.method === 'POST' && path === '/comments') {
    // Read request body
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      // Parse request body
      const comment = querystring.parse(body);
      comment.timestamp = new Date().getTime();
      comments.push(comment);
      fs.writeFile('comments.json', JSON.stringify(comments), err => {
        res.end('{"status": "ok"}');
      });
    });
  }

  // Handle other requests
  else {
    res.statusCode = 404;
    res.end('{"error": "Not found"}');
  }
}).listen(3000);

// Print message
console.log('Server running at http://localhost:3000/');
// End of comments.js