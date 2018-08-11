var express = require('express')
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')
var path = require('path')

var PORT = process.env.PORT || 3000

var app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

require('./controllers/articleController.js')(app)

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});