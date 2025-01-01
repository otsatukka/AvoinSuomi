const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const https = require('https'); 
const app = express();

app.use(cors());

// Serve static files from the Vue 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/proxy', async (req, res) => {
    try {
      const targetUrl = req.query.url; // Get the URL from query parameters
      if (!targetUrl) {
        return res.status(400).send('URL parameter is required');
      }
  
      const agent = new https.Agent({  
        rejectUnauthorized: false
      });
      const response = await axios.get(targetUrl, {
        httpsAgent: agent,
        responseType: 'arraybuffer' // For handling binary data like CSV
      });
  
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(new Uint8Array(response.data));

      res.set('Content-Type', response.headers['content-type']); // Preserve the content type
      res.send(text);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send(error.message);
    }
});

// Catch-all route to serve Vue's index.html file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));