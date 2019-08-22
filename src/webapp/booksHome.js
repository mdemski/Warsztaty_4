$(function () {

    function ajaxFunction(dataForAjax, successAlert, failAlert) {
        return $.ajax(dataForAjax)
            .done(function () {
                if (successAlert !== "") {
                    alert(successAlert);
                }
                // result.responseJSON; można usunąć??? TODO
                // JSON.stringify(result); można usunąć??? TODO
            }).fail(function () {
                alert(failAlert);
            });
    }

    getAllBooks();

    function getAllBooks() {
        var dataForAjax = {
            url: "http://localhost:8282/books/",
            data: {},
            method: "GET",
            dataType: "json",
            async: false
        };
        var successAlert = "";
        var failAlert = "Nie udało się wczytać książek";

        var data = ajaxFunction(dataForAjax, successAlert, failAlert);
        var result = data.valueOf().responseJSON;

        var table = $('.bookContainer').children(0);
        table.append("<tr>" + "<th>Tytuł</th>" + "<th>Usuwanie</th>" + "<th>Edytowanie</th>" + "</tr>");
        for (var i = 0; i < result.length; i++) {
            table.append("<tr>"
                + "<td class='bookTitle'>" + result[i].title + "<div class='bookId' id=" + result[i].id + ">" + "</div>" + "</td>"
                + "<td>" + "<button class='deleteBook' data-method='DELETE'>" + "Usuń" + "</button>" + "</td>"
                + "<td>" + "<button class='editBook' data-method='PUT'>" + "Edytuj" + "</button>" + "</td>" + "</tr>");
        }
    }

    //wczytywanie danych
    $('.bookContainer').on('click', 'tr', function moreInfo() {
        var bookId = $(this).children(0).children(0).attr('id');
        var div = $(this).children(0).find('.bookId');
        div.slideToggle();
        var tds = div.find('dd');
        tds.hide();
        var dataForAjax = {
            url: "http://localhost:8282/books/" + bookId,
            data: {},
            method: $('.bookContainer').data().method,
            dataType: "json",
            async: false
        };
        var successAlert = "";
        var failAlert = 'Nie udało się wczytać danych do książki';
        var data = ajaxFunction(dataForAjax, successAlert, failAlert);
        var result = data.valueOf().responseJSON;

        getDataBook();

        function getDataBook() {
            var publ = result.title;
            var autor = result.author;
            var is = result.isbn;
            var type = result.type;

            div.append(
                '<p>Wydawca: ' + publ + '</p>' +
                '<p>Autor: ' + autor + '</p>' +
                '<p>ISBN: ' + is + '</p>' +
                '<p>Typ: ' + type + '</p>');

        }
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

        // var url = "http://localhost:8282/books/";
        // var ajaxMethod = $('input[type="submit"]').data().method;
        // var ajaxData = JSON.stringify({
        //     "isbn": addBookIsbn,
        //     "title": addBookTitle,
        //     "author": addBookAuthor,
        //     "publisher": addBookPublisher,
        //     "type": addBookType
        // });
        // var successAlert = 'Dodano książkę';
        // var failAlert = 'Nie udało się dodać książki';
        // var contentType = "application/json";
        //
        // var dataForAjax = {
        //     url: url,
        //     data: ajaxData,
        //     dataType: contentType,
        //     method: ajaxMethod
        // };
        // ajaxFunction(dataForAjax, successAlert, failAlert);
        $(this).trigger("reset");
    });

    //usuwanie
    $('.bookContainer').on('click', 'button.deleteBook', function deleteBook(e) {
        e.stopPropagation();
        var bookId = $(this).parent().siblings().children().attr('id');
        var url = 'http://localhost:8282/books/' + bookId;
        var successAlert = 'Książka została usunięta';
        var failAlert = 'Nie udało się usunąć książki';
        var ajaxMethod = $('button.deleteBook').data().method;
        var ajaxData = null;
        var contentType = null;
        var dataForAjax = {
            url: url,
            data: ajaxData,
            method: ajaxMethod,
            dataType: contentType,
            async: false
        };
        ajaxFunction(dataForAjax, successAlert, failAlert);
        location.reload();
    });
});