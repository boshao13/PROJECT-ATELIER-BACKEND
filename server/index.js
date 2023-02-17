require('dotenv').config();

const express = require('express');
const path = require('path');
const controllers = require('./controllers/reviews');
const router = require('./routes');
const app = express();
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());
app.use('/', router);
const PORT = process.env.PORT || 3000;
app.listen(PORT);
// const express = require('express')
// const bodyParser = require('body-parser')
// const app = express()
// const port = 3001
// app.use(bodyParser.json())
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// )
// app.get('/', (request, response) => {
//   response.json({ info: 'Node.js, Express, and Postgres API' })
// })
// app.listen(port);
console.log(`Server listening at http://localhost:${PORT}`);