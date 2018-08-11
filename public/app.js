$(document).on('click', '.articleSearch', function(event) {
    event.preventDefault()
    console.log('find clicked')
    $.getJSON('/articles', function(data) {
        $('#articles').empty()
        for (var i=0; i<10; i++) {
            if(!data[i].saved) {
                var article = {
                    title: data[i].title,
                    link: data[i].link
                }
                $('#articles').append("<div class='article'><p class='pTitle'>" + article.title + "</p><p class='pLink'><a href='" + article.link + "'>" + article.link +"</a></p><button type='button' class='btn btn-danger saveArticle' data-id='" + data[i]._id + "'>Save Article</button></div><hr>")
                console.log(data[i])
            }  
        }
    })
})

$(document).on('click', '.savedSearch', function(event) {
    event.preventDefault()
    console.log('search clicked')
    $('#articles').empty()
    $.get('/articles', function(data) {
        for (var k=0; k<data.length; k++) {
            if(data[k].saved) {
                var savedArticle = {
                    title: data[k].title,
                    link: data[k].link
                }
                $('#articles').append("<div class='article'><p class='pTitle'>" + savedArticle.title + "</p><p class='pLink'><a href='" + savedArticle.link + "'>" + savedArticle.link +"</a></p><button type='button' class='btn btn-warning removeArticle' data-id='" + data[k]._id + "'>Remove Article</button></div><hr>")
                console.log(data)
            }
            
        }
            
    })
        
    
})


$(document).on('click', '.saveArticle', function(event) {
    console.log(this);
    $("#notes").empty();
    var thisId = $(this).attr('data-id')

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
            console.log('Here are your notes:')
            console.log(data.note.body)
            $('#notes').append(data.note.body)
        }

        

        $(document).on('click', '#savedNote', function(event) {
            event.preventDefault()
            console.log('save me')
            var thisId = $(this).attr('data-id')
            console.log(this)

            $.ajax({
                method: 'POST',
                url: '/articles/' + thisId,
                data: {
                    body: $('#bodyInput').val()
                }
            })
            .then(function(data) {
                console.log('Here is the data:')
                console.log(data)
                console.log(data.note)
                $('#notes').empty()
            })

            $('bodyInput').val('')

            $.ajax({
                method: 'POST',
                url: '/savedArticles/' + thisId
            })
            .then(function(data) {
                console.log('You just saved an article')
                // $.getJSON('/articles', function(data) {
                //     for (var i=0; i<10; i++) {
                //         if(!data[i].saved) {
                //             var article = {
                //                 title: data[i].title,
                //                 link: data[i].link
                //             }
                //             $('#articles').append("<div class='article'><p class='pTitle'>" + article.title + "</p><p class='pLink'><a href=" + article.link + " + </a></p><button data-id='" + data[i]._id + "' class='saveArticle'>Save Article</button></div><hr>")
                //             console.log(data[i])
                //         }  
                //     }
                // })
            })
        })
    })
})

$(document).on('click', '.removeArticle', function(event) {
    event.preventDefault()
    console.log('save me')
    var thisId = $(this).attr('data-id')
    console.log(this)
    $.ajax({
        method: 'POST',
        url: '/removedArticles/' + thisId
    })
    .then(function(data) {
        console.log('You just removed an article')
    })
})

// $(document).on('click', '#savedNote', function(event) {
//     event.preventDefault()
//     console.log('save me')
//     if (data.note) {
//         console.log(data.note)
//         $('#notes').append(data.note)
//     }
// })