// api/letterBoxed.js

import axios from 'axios';

export default async (req, res) => {
  try {
    const response = await axios.get('https://www.nytimes.com/puzzles/letter-boxed');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
};
