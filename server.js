const http = require('http');
const fs = require('fs');
const path = require('path');

const INBOX = path.join(__dirname, 'data', 'feedback-inbox.json');
const FORM  = path.join(__dirname, 'feedback-form.html');
const PORT  = 3000;

function loadInbox() {
  try { return JSON.parse(fs.readFileSync(INBOX, 'utf8')); }
  catch { return []; }
}

function nextId(entries) {
  const nums = entries.map(e => parseInt(e.id.replace('fb_', ''), 10)).filter(Boolean);
  const max  = nums.length ? Math.max(...nums) : 0;
  return `fb_${String(max + 1).padStart(3, '0')}`;
}

const server = http.createServer((req, res) => {
  // Serve the form
  if (req.method === 'GET' && req.url === '/') {
    fs.readFile(FORM, (err, data) => {
      if (err) { res.writeHead(500); res.end('Form not found'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  // Handle submission
  if (req.method === 'POST' && req.url === '/submit') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { name, email, subject, rating, message } = JSON.parse(body);

        if (!name || !email || !message) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Name, email, and message are required.' }));
          return;
        }

        const entries = loadInbox();
        const entry = {
          id:        nextId(entries),
          timestamp: new Date().toISOString(),
          name:      name.trim(),
          email:     email.trim(),
          subject:   subject ? subject.trim() : '',
          rating:    rating ? parseInt(rating, 10) : null,
          message:   message.trim(),
          status:    'pending'
        };

        entries.push(entry);
        fs.writeFileSync(INBOX, JSON.stringify(entries, null, 2));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, id: entry.id }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server error.' }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Feedback form running at http://localhost:${PORT}`);
});
