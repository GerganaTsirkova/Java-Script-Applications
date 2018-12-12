const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_HJA5TuO9X';
const APP_SECRET = '95de1d993ca74490bc500b7570f1f0ec';
const AUTH_HEADERS = {Authorization: "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};
const BOOKS_PER_PAGE = 10;

function loginUser() {

    let username = $('#viewLogin input[name="username"]').val();
    let password = $('#viewLogin input[name="passwd"]').val();
    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/' + APP_KEY + '/login',
        headers: AUTH_HEADERS,
        data: {username, password}
    }).then(function (res) {
        signInUser(res, 'Login successful.');
    }).catch(handleAjaxError);
}

function registerUser() {

    let username = $('#viewRegister input[name="username"]').val();
    let password = $('#viewRegister input[name="passwd"]').val();

    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/' + APP_KEY + '/',
        headers: AUTH_HEADERS,
        data: {username, password}
    }).then(function (res) {
        showHomeView();
        showInfo('Registration successful.');
    }).catch(handleAjaxError)
}

function listBooks() {
    $("#viewCreateBook").hide();
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/Books',
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")}
    }).then(function (res) {
        displayPaginationAndBooks(res.reverse())
    }).catch(handleAjaxError);
}


function createBook() {
    let [title, author, description] = [$('input[name="title"]'), $('input[name="author"]'), $('textarea[name="description"]')];
    $.ajax({
        method: 'POST',
        url: BASE_URL + 'appdata/' + APP_KEY + '/Books',
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")},
        data: {title: title.val(), author: author.val(), description: description.val()}
    }).then(function (res) {
        showInfo('Book created.');
        $("#viewBooks").hide();
        $('#linkListBooks').trigger('click');

    }).catch(handleAjaxError);
    title.val('');
    author.val('');
    description.val('');
}

function deleteBook(book) {
    $.ajax({
        method: 'DELETE',
        url: BASE_URL + 'appdata/' + APP_KEY + '/Books/' + book._id,
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")}
    }).then(function (res) {
        showInfo('Book deleted.');
        showView('viewBooks');

    }).catch(handleAjaxError);
}

function loadBookForEdit(book) {
    showView('viewEditBook');
    $('#formEditBook input[name="title"]').val(book.title);
    $('#formEditBook input[name="author"]').val(book.author);
    $('#formEditBook textarea[name="description"]').val(book.description);
    $('#formEditBook input[name="id"]').val(book._id);
}

function editBook() {
    let [title, author, description, id] = [$('#formEditBook input[name="title"]'), $('#formEditBook input[name="author"]'), $('#formEditBook textarea[name="description"]'), $('#formEditBook input[name="id"]')];
    $.ajax({
        method: 'PUT',
        url: BASE_URL + 'appdata/' + APP_KEY + '/Books/' + id.val(),
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")},
        data: {title: title.val(), author: author.val(), description: description.val()}
    }).then(function (res) {
        $('#linkListBooks').trigger('click');
        showInfo('Book edited.');
    }).catch(handleAjaxError);
    title.val('');
    author.val('');
    description.val('');
}

function saveAuthInSession(userInfo) {
    sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
    sessionStorage.setItem('username', userInfo.username);
    sessionStorage.setItem('userId', userInfo._id);
}

function logoutUser() {
    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/' + APP_KEY + '/_logout',
        headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')}
    });
    sessionStorage.clear();
    showHomeView();
    showHideMenuLinks();
    $('#loggedInUser').text("");
    showInfo('Logout successful.')
}

function signInUser(res, message) {
    saveAuthInSession(res);
    showInfo(message);
    showHideMenuLinks();
    showHomeView();
}

function displayPaginationAndBooks(books) {
    showView('viewBooks');
    let table = $('table');
    let pagination = $('#pagination-demo');
    if (pagination.data("twbs-pagination")) {
        pagination.twbsPagination('destroy')
    }
    pagination.twbsPagination({
        totalPages: Math.ceil(books.length / BOOKS_PER_PAGE),
        visiblePages: 5,
        next: 'Next',
        prev: 'Prev',
        onPageClick: function (event, page) {
            table.empty();
            table.append($('<tr>')
                .append($('<th>Title</th>'))
                .append($('<th>Author</th>'))
                .append($('<th>Description</th>'))
                .append($('<th>Actions</th>')));
            let startBook = (page - 1) * BOOKS_PER_PAGE;
            let endBook = Math.min(startBook + BOOKS_PER_PAGE, books.length);
            $(`a:contains(${page})`).addClass('active');
            for (let i = startBook; i < endBook; i++) {
                if (books[i].author === sessionStorage.getItem('username')) {
                    table.append($('<tr>')
                        .append($(`<td>${books[i].title}</td>`))
                        .append($(`<td>${books[i].author}</td>`))
                        .append($(`<td>${books[i].description}</td>`))
                        .append($('<td>')
                            .append($('<a href="#">[Delete]</a>').on('click', function () {
                                $(this).parent().parent().remove();
                                deleteBook(books[i]);
                            }))
                            .append($('<a href="#">[Edit]</a>').on('click', function () {
                                loadBookForEdit(books[i]);
                                //editBook(books[i])
                            }))))
                } else {
                    table.append($('<tr>')
                        .append($(`<td>${books[i].title}</td>`))
                        .append($(`<td>${books[i].author}</td>`))
                        .append($(`<td>${books[i].description}</td>`)));
                }
            }
        }
    })
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error.";
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description;
    showError(errorMsg)
}