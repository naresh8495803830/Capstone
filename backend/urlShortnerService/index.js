const express = require('express');
const shortId = require('shortid');
const cors = require('cors');
require('dotenv').config()


const app = express();
app.use(express.json())
const crossOrigin = process.env.CROSS_ORIGIN

app.use(
  cors({
    origin: crossOrigin,
    credentials: true,
  })
);
// app.use(cors())
const urls = {};

// app.get('/url/shorten', (req, res) => {
//   const url = req.query.url;
//   const id = shortId.generate();

//   urls[id] = url;

//   res.send(`${process.env.HOST}/${id}`);
// });

// app.get('/:id', (req, res) => {
//   const id = req.params.id;
//   const url = urls[id];

//   if (url) {
//     res.redirect(url);
//   } else {
//     res.sendStatus(404);
//   }
// });


app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});