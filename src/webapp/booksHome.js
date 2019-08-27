$(function () {
    var context = window.location.pathname;

    function ajaxFunction(dataForAjax, successAlert, failAlert) {
        return $.ajax(dataForAjax)
            .done(function (result) {
                if (successAlert !== "") {
                    alert(successAlert);
                }
                result.responseJSON;
                JSON.stringify(result);
            }).fail(function () {
                alert(failAlert);
            });
    }

    getAllBooks();

    function getAllBooks() {
        var dataForAjax = {
            url: context + "books/",
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
                + "<td> <section class='bookInfo'><dt class='bookTitle'>" + result[i].title
                + "</dt><dd><div class='bookId' id=" + result[i].id + ">" + "</div>"
                + "<input class='author' placeholder='" + result[i].author + "'><br>"
                + "<input class='publisher' placeholder='" + result[i].publisher + "'><br>"
                + "<input class='isbn' placeholder='" + result[i].isbn + "'><br>"
                + "<input class='type' placeholder='" + result[i].type + "'>" + "</dd></dl></section></td>"
                + "<td>" + "<button id='" + result[i].id + "' class='deleteBook' data-method='DELETE'>" + "Usuń" + "</button>" + "</td>"
                + "<td>" + "<button id='" + result[i].id + "' class='editBook' data-method='PUT'>" + "Edytuj" + "</button>" + "</td>"
                + "</tr>");
        }
        var dds = $('dd');
        dds.hide();
    }

    //wczytywanie danych
    $('.bookInfo').on('click', 'dt', function moreInfo() {
        var bookId = $(this).next().find('.bookId').attr('id');
        var dd = $(this).siblings(0);
        var dataForAjax = {
            url: context + "books/" + bookId,
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
            var bookId = result.id;
            var localPubl = result.publisher;
            var localAutor = result.author;
            var localIsbn = result.isbn;
            var localType = result.type;

            console.log(localAutor);

            author = localAutor;
            publisher = localPubl;
            isbn = localIsbn;
            type = localType;
        }

        dd.slideToggle();
    });
    var author;
    var publisher;
    var isbn;
    var type;

    console.log(author);

    //dodawanie
    $('input[type="submit"]').on('click', function (e) {
        e.preventDefault();
        var addBookTitle = $('#addBookTitle').val();
        var addBookAuthor = $('#addBookAuthor').val();
        var addBookPublisher = $('#addBookPublisher').val();
        var addBookIsbn = $('#addBookIsbn').val();
        var addBookType = $('#addBookType').val();

        $.ajax({
            url: context + "books/",
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
        var bookId = $(this)[0].id;
        var url = context + "books/" + bookId;
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

    //edycja książki
    $('.bookContainer').on('click', 'button.editBook', function editBook(e) {
        e.preventDefault();
        var editBookId = $(this).parent().prev().prev().children(0).children(0).find('.bookId').attr('id');
        var editBookTitle = $(this).parent().prev().prev().children(0).children(0)[0].innerText;
        var editBookAuthor = $(this).parent().prev().prev().children(0).children(0).find('input.author').val();
        var editBookPublisher = $(this).parent().prev().prev().children(0).children(0).find('input.publisher').val();
        var editBookIsbn = $(this).parent().prev().prev().children(0).children(0).find('input.isbn').val();
        var editBookType = $(this).parent().prev().prev().children(0).children(0).find('input.type').val();

        $.ajax({
            url: context + "books/",
            data: JSON.stringify({
                "id": editBookId,
                "isbn": editBookIsbn,
                "title": editBookTitle,
                "author": editBookAuthor,
                "publisher": editBookPublisher,
                "type": editBookType
            }),
            contentType: "application/json",
            method: $('button.editBook').data().method
        }).done(function () {
            alert('Poprawnie zmienioną książkę');
            location.reload();
        }).fail(function () {
            alert('Nie udało się zmienić danych książki');
        });
        $(this).trigger("reset");
    });
});