$(document).on('click', '.articleSearch', function(event) {
    event.preventDefault()
    $.getJSON('/articles', function(data) {
        for (var i=0; i<data.length; i++) {
            var article = {
                title: data[i].title,
                link: data[i].link
            }
            $('#articles').append("<p data-id='" + data[i]._id + "' class='article'>" + article.title + "<br>" + article.link + "</p><hr>")
            console.log(data[i])
        }
    })
})

$(document).on('click', '.article', function(event) {
    console.log(this);
    $("#notes").empty();
    var thisId = $(this).attr('data-id')

    $.ajax({
        method: 'GET',
        url: '/articles/' + thisId
    })
    .then(function(data) {
        $('#notes').append('<h2>' + data.title + '<h2>')
        $('#notes').append('<input id="titleInput" name="title" >')
        $('#notes').append('<textarea id="bodyInput" name"body"></textarea>')
        $('#notes').append('<button data-id="' + data._id + '" id="savedNote">Save Note</button>')
    
        if (data.note) {
            $('notes').append(data.note)
        }

    })

})