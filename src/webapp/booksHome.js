$(function () {

    getAllBooks();

    //wczytywanie listy książek
    function getAllBooks() {
        $.ajax({
            url: "http://localhost:8282/books/",
            data: {},
            method: "GET",
            dataType: "json"
        }).done(function (result) {
            var table = $('.bookContainer');
            for (var i = 0; i < result.length; i++) {
                table.append("<tr>"
                    + "<td class='bookTitle'>" + result[i].title + "<div class='bookId' id=" + result[i].id + ">" + "</div>" + "</td>"
                    + "<td>" + "<button class='deleteBook'>" + "Usuń" + "</button>" + "</td>" + "</tr>");
            }
        }).fail(function () {
            alert('Nie udało się wczytać książek')
        });
    }

    //wczytywanie danych
    $('.bookContainer').on('click', 'tr', function moreInfo() {
        var bookId = $(this).children(0).children(0).attr('id');
        var div = $(this).children(0).find('.bookId');
        $.ajax({
            url: "http://localhost:8282/books/" + bookId,
            data: {},
            method: "GET",
            dataType: "json"
        }).done(function (bookData) {
            var publ = bookData.title;
            var autor = bookData.author;
            var is = bookData.isbn;
            var type = bookData.type;

            div.append(
                '<p>Wydawca: ' + publ + '</p>' +
                '<p>Autor: ' + autor + '</p>' +
                '<p>ISBN: ' + is + '</p>' +
                '<p>Typ: ' + type + '</p>');
            div.slideToggle();
        }).fail(function () {
            alert('Nie udało się wczytać danych do książki')
        });
    });

    //dodawanie
    $('input[type="submit"]').on('click', function (e) {
        e.preventDefault();
        var addBookTitle = $('#addBookTitle').val();
        var addBookAuthor = $('#addBookAuthor').val();
        var addBookPublisher = $('#addBookPublisher').val();
        var addBookIsbn = $('#addBookIsbn').val();
        var addBookType = $('#addBookType').val();
        $.ajax({
            url: "http://localhost:8282/books/",
            data: JSON.stringify({
                "isbn": addBookIsbn,
                "title": addBookTitle,
                "author": addBookAuthor,
                "publisher": addBookPublisher,
                "type": addBookType
            }),
            contentType: "application/json",
            method: "post"
        }).done(function () {
            alert('Dodano książkę');
            location.reload();
        }).fail(function () {
            alert('Nie udało się dodać książki');
        });
        $(this).trigger("reset");
    });

    //usuwanie
    $('.bookContainer').on('click', 'button.deleteBook', function deleteBook(e) {
        e.stopPropagation();
        var bookId = $(this).parent().siblings().children().attr('id');
        $.ajax({
            url: "http://localhost:8282/books/" + bookId,
            method: "DELETE"
        }).done(function () {
            alert('Książka została usunięta');
            location.reload();
            getAllBooks();
        }).fail(function () {
            alert('Nie udało się usunąć książki');
        });
    });
});