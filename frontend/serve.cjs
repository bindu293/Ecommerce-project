const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const server = http.createServer((req, res) => {
  // Get requested file (default to index.html)
  let filename = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(__dirname, 'public', filename);
  
  // Get file extension for content type
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
  };
  const contentType = contentTypes[ext] || 'text/html';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found: ' + filename);
      } else {
        res.writeHead(500);
        res.end('Error loading page: ' + err.message);
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n✨ Demo page running at: http://localhost:${PORT}`);
  console.log('🌐 Open in browser: http://localhost:${PORT}');
  console.log('📍 Make sure backend is running on port 5000\n');
});
