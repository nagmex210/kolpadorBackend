const { app, server } = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 3001;
const uri = "";


const start = async () => {
  if (!process.env.MONGO_URI) {
     throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

start();
