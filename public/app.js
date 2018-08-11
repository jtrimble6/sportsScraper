//FUNCTION TO FIND ARTICLES
function getArticles() {
    $.getJSON('/articles', function(data) {
        $('#articles').empty()
        for (var i=0; i<10; i++) {
            if(!data[i].saved) {
                var article = {
                    title: data[i].title,
                    link: data[i].link,
                    img: data[i].img
                }
                $('#articles').append("<div class='article'><p class='pTitle'>" + article.title + "</p><img class='pImg' src='" + article.img + "'><p class='pLink'><a href='" + article.link + "'>Link to Article</a></p><button type='button' class='btn btn-danger saveArticle' data-id='" + data[i]._id + "'>Save Article</button></div><hr>")
                // console.log(data[i])
            }  
        }
    })
}

//FUNCTION TO FIND SAVED ARTICLES
function getSaved() {
    $('#articles').empty()
    $.get('/articles/', function(data) {
        for (var k=0; k<data.length; k++) {
            if(data[k].saved) {
                var savedArticle = {
                    title: data[k].title,
                    link: data[k].link,
                    img: data[k].img
                }
                // console.log(savedArticle)
                $('#articles').append("<div class='article'><p class='pTitle'>" + savedArticle.title + "</p><img class='pImg' src='" + savedArticle.img + "'><p class='pLink'><a href='" + savedArticle.link + "'>Link to Article</a></p><button type='button' class='btn btn-warning removeArticle' data-id='" + data[k]._id + "'>Remove Article</button></div><hr>")
                // console.log(data)
            }
            
        }
            
    })
}

//FUNCTION TO SAVE AN ARTICLE
function saveArticle(thisId) {
    $.ajax({
        method: 'GET',
        url: '/articles/' + thisId
    })
    .then(function(data) {
    
        $('#notes').append('<h2>' + data.title + '<h2>')
        $('#notes').append('<p>Submit A Note</p>')
        $('#notes').append('<textarea id="bodyInput" name"body"></textarea><br>')
        $('#notes').append('<button type="button" class="btn btn-warning" data-id="' + data._id + '" id="savedNote">Save Note</button><hr>')
        
        $('#notes').append('<p>Saved Note:</p>')
        
        if (data.note) {
            $('#notes').append(data.note.body)
        }

        

        $(document).on('click', '#savedNote', function(event) {
            event.preventDefault()
            console.log('save me')
            let thisId = $(this).attr('data-id')

            $.ajax({
                method: 'POST',
                url: '/articles/' + thisId,
                data: {
                    body: $('#bodyInput').val()
                }
            })
            .then(function(data) {
                $('#notes').empty()
            })

            $('bodyInput').val('')

            $.ajax({
                method: 'POST',
                url: '/savedArticles/' + thisId
            })
            .then(function(data, res) {
                console.log('You just saved an article')
            })
        })
    })
}

//FUNCTION TO REMOVE AN ARTICLE
function removeArticle(thisId) {
    $.ajax({
        method: 'POST',
        url: '/removedArticles/' + thisId
    })
    .then(function(data) {
        console.log('You just removed an article')
    })
}

//RUN FUNCTION TO FIND ARTICLES WHEN 'ARTICLE SEARCH' IS CLICKED
$(document).on('click', '.articleSearch', function(event) {
    event.preventDefault()
    console.log('find clicked')
    getArticles()
})

//RUN FUNCTION TO FIND SAVED ARTICLES WHEN 'SAVED ARTICLES' IS CLICKED
$(document).on('click', '.savedSearch', function(event) {
    event.preventDefault()
    console.log('search clicked')
    getSaved()
})

//RUN FUNCTION TO SAVE ARTICLE WHEN 'SAVE NOTE' IS CLICKED
$(document).on('click', '.saveArticle', function(event) {
    $("#notes").empty();
    let thisId = $(this).attr('data-id')
    saveArticle(thisId)
})

//RUN FUNCTION TO REMOVE ARTICLE WHEN 'REMOVE ARTICLE' IS CLICKED
$(document).on('click', '.removeArticle', function(event) {
    event.preventDefault()
    console.log('save me')
    var thisId = $(this).attr('data-id')
    removeArticle(thisId)
})
