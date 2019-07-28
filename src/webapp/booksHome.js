$(function () {

    function ajaxFunction(url, ajaxMethod, successAlert, failAlert, ajaxData, contentType) {
        $.ajax({
            url: '"' + url + '"',
            data: '"' + ajaxData + '"',
            type: '"' + ajaxMethod + '"',
            dataType: '"' + contentType + '"'
        }).done(function (result) {
            var dataBook = result;
            insideFunction = 'Tutaj wywołać funkcję z parametrami result specyficzną dla konkretnego eventu';
            if (successAlert !== "") {
                alert(successAlert);
            }
            location.reload();
        }).fail(function () {
            alert(failAlert);
        });
    }

    //wczytywanie listy książek
    function getAllBooks() {
        var ajaxData = '{}';
        var contentType = 'json';
        var ajaxMethod = $('.bookContainer').data().method;
        var successAlert = "";
        var failAlert = "Nie udało się wczytać książek";
        var url = 'http://localhost:8282/books/';

        var insideFunction = function () {
            var table = $('.bookContainer');
            for (var i = 0; i < result.length; i++) {
                table.append("<tr>"
                    + "<td class='bookTitle'>" + result[i].title + "<div class='bookId' id=" + result[i].id + ">" + "</div>" + "</td>"
                    + "<td>" + "<button class='deleteBook' data-method='DELETE'>" + "Usuń" + "</button>" + "</td>" + "</tr>");
            }
        };

        ajaxFunction(url, ajaxMethod, successAlert, failAlert, ajaxData, contentType);
    }

    getAllBooks();

    //wczytywanie danych
    $('.bookContainer').on('click', 'tr', function moreInfo() {
        var bookId = $(this).children(0).children(0).attr('id');
        var url = 'http://localhost:8282/books/' + bookId;
        var div = $(this).children(0).find('.bookId');
        var successAlert = "";
        var ajaxData = '{}';
        var ajaxMethod = $('.bookContainer').data().method;
        var contentType = 'json';
        var failAlert = 'Nie udało się wczytać danych do książki';
        div.slideToggle();

        var insideFunction = function getDataBook(bookData) {
            var publ = bookData.title;
            var autor = bookData.author;
            var is = bookData.isbn;
            var type = bookData.type;

            div.append(
                '<p>Wydawca: ' + publ + '</p>' +
                '<p>Autor: ' + autor + '</p>' +
                '<p>ISBN: ' + is + '</p>' +
                '<p>Typ: ' + type + '</p>');
            // div.hide();
        };

        ajaxFunction(url, ajaxMethod, successAlert, failAlert, ajaxData, contentType, getDataBook());
    });

    //dodawanie
    $('input[type="submit"]').on('click', function (e) {
        e.preventDefault();
        var url = 'http://localhost:8282/books/';
        var addBookTitle = $('#addBookTitle').val();
        var addBookAuthor = $('#addBookAuthor').val();
        var addBookPublisher = $('#addBookPublisher').val();
        var addBookIsbn = $('#addBookIsbn').val();
        var addBookType = $('#addBookType').val();
        var ajaxMethod = $('input[type="submit"]').data().method;
        var ajaxData = JSON.stringify({
            "isbn": addBookIsbn,
            "title": addBookTitle,
            "author": addBookAuthor,
            "publisher": addBookPublisher,
            "type": addBookType
        });
        var sucessAlert = 'Dodano książkę';
        var failAlert = 'Nie udało się dodać książki';
        var contentType = 'application/json';
        var insideFunction = function () {

        };

        ajaxFunction(url, ajaxMethod, sucessAlert, failAlert, ajaxData, contentType, insideFunction());
        $(this).trigger("reset");
    });

    //usuwanie
    $('.bookContainer').on('click', 'button.deleteBook', function deleteBook(e) {
        e.stopPropagation();
        var bookId = $(this).parent().siblings().children().attr('id');
        var url = 'http://localhost:8282/books/' + bookId;
        var sucessAlert = 'Książka została usunięta';
        var failAlert = 'Nie udało się usunąć książki';
        var ajaxMethod = $('button.deleteBook').data().method;
        var ajaxData = null;
        var contentType = null;
        var insideFunction = function () {

        };
        ajaxFunction(url, ajaxMethod, sucessAlert, failAlert, ajaxData, contentType, insideFunction());
    });
});

// zapytanie AJAX do dodawania książek - do usunięcia jeśli będzie działać
//        $.ajax({
//             url: "http://localhost:8282/books/",
//             data: JSON.stringify({
//                 "isbn": addBookIsbn,
//                 "title": addBookTitle,
//                 "author": addBookAuthor,
//                 "publisher": addBookPublisher,
//                 "type": addBookType
//             }),
//             contentType: "application/json",
//             method: "post"
//         }).done(function () {
//             alert('Dodano książkę');
//             location.reload();
//         }).fail(function () {
//             alert('Nie udało się dodać książki');
//         });

// zapytanie do usuwania
//        $.ajax({
//             url: "http://localhost:8282/books/" + bookId,
//             method: "DELETE"
//         }).done(function () {
//             alert('Książka została usunięta');
//             location.reload();
//             getAllBooks();
//         }).fail(function () {
//             alert('Nie udało się usunąć książki');
//         });