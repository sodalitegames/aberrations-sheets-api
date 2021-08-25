const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: './config.env' });

mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log(`db connection successful`));

const port = process.env.PORT || 2341;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
