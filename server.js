const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function() {
  console.log('Connected to MongoDB');
}).catch(function(err) {
  console.log('Connection failed: ' + err);
});

app.get('/', function(req, res) {
  res.json({ message: 'Blog API is working!' });
});

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log('Server is running on port ' + PORT);
});