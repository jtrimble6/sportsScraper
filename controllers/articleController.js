var mongoose = require('mongoose')
var cheerio = require('cheerio')
var request = require('request')
var logger = require('morgan')
var url = 'https://bleacherreport.com/'
var db = require('../models')

module.exports = function(app) {
    app.use(logger('dev'))
    var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/sportsscraper'
    // var DEVELOPMENT = 'mongodb://localhost/sportsscraper'

    mongoose.Promise = Promise
    mongoose.connect(MONGODB_URI)

    app.get('/', function (req, res) {
        res.render('index')
    })

    app.get('/saved', function (req, res) {
        res.render('saved')
    })
    
    app.get('/scrape', function(req, res) {
        
        request(url, function(err, response, body) {
            if (err) {
                console.log('REQUEST ERROR')
                console.log(err)
            } 
            var $ = cheerio.load(body)
            console.log('Starting here:')
            console.log('Starting here:')
            console.log('Starting here:')
            var result = {}
            // $('.articleMedia').each(function(i, element) {
            //     result.img = $(this)
            //         .children('a')
            //         .children('img')
            //         .attr('src')
            //     console.log(result.img)
            // })
            
            $('.articleContent').each(function(i, element) {
                console.log('THIS:')
                // console.log(this)
                
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
                // db.Article.create(result)
                //   .then(function(dbArticle) {
                //       console.log(dbArticle)
                //   })
                //   .catch(function(err) {
                //       console.log(err)
                //     //   return res.json(err)
                // })
            })
            $('.articleMedia').each(function(i, element) {
                result.img = $(this)
                    .children('a')
                    .children('img')
                    .attr('src')
                console.log(result.img)
            
                db.Article.create(result)
                    .then(function(dbArticle) {
                        console.log(dbArticle)
                    })
                    .catch(function(err) {
                        console.log(err)
                    //   return res.json(err)
                })
            })
            
            // db.Article.create(result)
            //     .then(function(dbArticle) {
            //         console.log(dbArticle)
            //     })
            //     .catch(function(err) {
            //         console.log(err)
            //     //   return res.json(err)
            //     })
            res.send('scrape complete')
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
        db.Article.findOneAndUpdate({ _id: req.params.id },{ saved: true })
          .then(function(dbSavedArticle) {
              res.redirect('/')
          })
          .catch(function(err) {
              res.json(err)
          })
    })

    app.post('/removedArticles/:id', function(req, res) {
        db.Article.findOneAndUpdate({ _id: req.params.id },{ saved: false })
          .then(function(dbDeletedArticle) {
              res.redirect('/')
          })
          .catch(function(err) {
              res.json(err)
          })
    })


    

}