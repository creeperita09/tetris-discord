const express = require('express');
const path = require('path');
const runTetrisBot = require('./game');
const morgan = require('morgan');

const app = express();
const PORT = 7373;

app.use(morgan('dev'));

app.use('/static', express.static(path.join(__dirname, 'static')));

const serveStaticImage = (res) => {
  const imgPath = path.join(__dirname, 'static', 'i.webp');
  res.sendFile(imgPath);
};

app.get('/favicon.ico', (req, res) => {
  serveStaticImage(res);
});

app.get('/i.webp', async (req, res) => {
  try {
    const host = req.hostname.toLowerCase();
    const domainSuffix = 'is.jcjenson.net';

    // Only match if hostname ends with is.jcjenson.net
    if (!host.endsWith(domainSuffix)) {
      console.log('Invalid domain:', host);
      return res.status(400).send('Invalid domain');
    }

    const subdomain = host.slice(0, -domainSuffix.length);
    const match = subdomain.match(/^tetr([a-z]+)$/);

    if (!match || !match[1]) {
      console.log('No match in subdomain:', subdomain);
      return serveStaticImage(res);
    }

    const commandRaw = match[1].replace(/[^wasdzx]/g, '');
    if (!commandRaw) {
      console.log('No valid commands in subdomain:', match[1]);
      return serveStaticImage(res);
    }

    const commands = commandRaw.split('').reverse();
    console.log(`Received commands: ${commands.join('')}`);

    const buffer = await runTetrisBot(commands);

    res.setHeader('Content-Type', 'image/webp');
    res.send(buffer);
  } catch (err) {
    console.error('Error processing request:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
