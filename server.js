var path = require('path')
var SVGO = require('svgo')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()

svgo = new SVGO()

app.use(express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())
svgs = []

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './index.html'));
})

app.get('/all', function (req, res) {
  res.sendFile(path.join(__dirname, './svgs.html'));
})

app.get('/svgs', function (req, res) {
  res.send(svgs)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.post('/svg', function (req, res) {
  // svgs.push(req.body.data)
  // res.sendStatus(200)
  svgo.optimize(req.body.data, result => {
      svgs.push(result.data)
      res.sendStatus(200);
  })
})
