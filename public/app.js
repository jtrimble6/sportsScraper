$(document).on('click', '.articleSearch', function(event) {
    event.preventDefault()
    console.log('clicked')
    $.getJSON('/articles', function(data) {
        for (var i=0; i<data.length; i++) {
            var article = {
                title: data[i].title,
                link: data[i].link
            }
            $('#articles').append("<div class='article'><p class='pTitle'>" + article.title + "</p><p class='pLink'>" + article.link + "</p><button data-id='" + data[i]._id + "' class='saveArticle'>Save Article</button></div><hr>")
            console.log(data[i])
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
        $('#notes').append('<button data-id="' + data._id + '" id="savedNote">Save Note</button><hr>')
        
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
            console.log(thisId)

            $.ajax({
                method: 'POST',
                url: '/savedArticles/' + thisId,
                data: {
                    id: thisId,
                    title: data.title,
                    link: data.link,
                    notes: data.note
                }
            })
            .then(function(data) {
                console.log('You just saved an article')
                console.log(data)
            })
            

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
                console.log(data.body)
                $('#notes').empty()
            })

            $('bodyInput').val('')

            
        })
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