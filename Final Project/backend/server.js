
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const petRoutes = require('./routes/petRoutes');

const app = express();
const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/lostfoundpets', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.json());

app.use('/api/pets', petRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
