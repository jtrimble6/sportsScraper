var express = require('express')
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cheerio = require('cheerio')
var request = require('request')
var logger = require('morgan')

var db = require('./models')

var PORT = 3000

var url = 'https://bleacherreport.com/'

var app = express()

app.use(logger('dev'))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))

mongoose.Promise = Promise
mongoose.connect('mongodb://localhost/sportsscraper')
var mc = mongoose.connection

mc.on('error', function(error) {
    console.log('Mongoose Error', error)
})
mc.once('open', function() {
    console.log('Connected to Database')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

var routes = require('./controllers/articleController.js')

app.use(routes)

app.get('/', function (req, res) {
    res.render('index')
})

app.get('/scrape', function(req, res) {
    
    request(url, function(err, response, body) {
        if (err) {
            console.log(err)
        } 
        var $ = cheerio.load(body)
        console.log('Starting here:')
        console.log('Starting here:')
        console.log('Starting here:')
        $('.articleContent').each(function(i, element) {
            console.log('element:')
            console.log(element)
            var result = {}
            result.title = $(this)
                .children('a')
                .text()
            console.log(result.title)
            result.link = $(this)
                .children('a')
                .attr('href')
                // console.log('Articles:')
                // console.log(result)
            console.log(result.link)
            db.Article.create(result)
              .then(function(dbArticle) {
                  console.log(dbArticle)
              })
              .catch(function(err) {
                  return res.json(err)
              })
        })
        res.send('COMPLETED SCRAPE')
    })

})

app.get('/articles', function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
          res.json(dbArticle)
      })
      .catch(function(err) {
          res.json(err)
      })
})

app.get('/savedArticles', function(req, res) {
    db.SavedArticle.find({})
      .then(function(dbArticle) {
          res.json(dbArticle)
      })
      .catch(function(err) {
          res.json(err)
      })
})

app.get('/articles/:id', function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate('note')
      .then(function(dbArticle) {
          res.json(dbArticle)
      })
      .catch(function(err) {
          res.json(err)
      })
})

app.post('/articles/:id', function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
          return db.Article.findOneAndUpdate({ _id: req.params.id },{ note: dbNote._id },{ new: true })
      })
      .then(function(dbArticle) {
          res.json(dbArticle)
      })
      .catch(function(err) {
          res.json(err)
      })
})

app.post('/savedArticles/:id', function(req, res) {
    db.SavedArticle.create(req.body)
      .then(function(dbSavedArticle) {
          return db.SavedArticles.findOneAndUpdate({ _id: req.params.id },{ savedArticle: dbSavedArticle }, { new: true })
      })
      .then(function(dbArticle) {
          res.json(dbArticle)
      })
      .catch(function(err) {
          res.json(err)
      })
})



app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});