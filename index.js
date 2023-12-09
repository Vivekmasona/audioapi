const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/download', async (req, res) => {
  const ytUrl = req.query.url;
  if (!ytUrl) {
    return res.status(400).send('Error: YouTube URL is missing in the query parameter.');
  }

  const apiUrl = `https://youtube-mp36.p.rapidapi.com/dl?id=${encodeURIComponent(ytUrl)}`;
  const rapidApiKey = '11939ea42cmsh9be181f6708fc39p162794jsn9e46f87d898b';

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': rapidApiKey,
      'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(apiUrl, options);
    const result = await response.text();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

