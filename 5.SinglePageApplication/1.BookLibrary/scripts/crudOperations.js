const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_HJA5TuO9X';
const APP_SECRET = '95de1d993ca74490bc500b7570f1f0ec';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};
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
        console.log(res);
        signInUser(res, 'Login successful.');
    }).catch(handleAjaxError)
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
        signInUser(res, 'Registration successful.');
    }).catch(handleAjaxError)
}

function listBooks() {
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/Books',
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")}
    }).then(function (res) {
        displayPaginationAndBooks(res.reverse())
    }).catch(handleAjaxError);
}


function createBook() {
    let author = $('#formCreateBook input[name="author"]').val();
    let title = $('#formCreateBook input[name="title"]').val();
    let description = $('#formCreateBook textarea[name="description"]').val();
    $.ajax({
        method: 'POST',
        url: BASE_URL + 'appdata/' + APP_KEY + '/Books',
        data: {title, author, description},
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")}
    }).then(function (res) {
        listBooks();
        $('#viewCreateBook').hide();
        showInfo('Book created.')
    }).catch(handleAjaxError);

}

function deleteBook(book) {
    $.ajax({
        method: 'DELETE',
        url: BASE_URL + 'appdata/' + APP_KEY + '/Books/' + book._id,
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")}
    }).then(function () {
        showInfo('Book deleted.');
        listBooks();
    }).catch(handleAjaxError)
}

function loadBookForEdit(book) {
    $('#viewEditBook').show();
    $('#formEditBook input[name="author"]').val(book.author);
    $('#formEditBook input[name="title"]').val(book.title);
    $('#formEditBook textarea[name="description"]').val(book.description);
    $('#formEditBook input[name="id"]').val(book._id);
    $('#viewBooks').hide();
}

function editBook() {
    let author = $('#formEditBook input[name="author"]').val();
    let title = $('#formEditBook input[name="title"]').val();
    let description = $('#formEditBook textarea[name="description"]').val();
    let id = $('#formEditBook input[name="id"]').val();
    $.ajax({
        method: 'PUT',
        url: BASE_URL + 'appdata/' + APP_KEY + '/Books/' + id,
        data: {author,title,description},
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")}
    }).then(function () {
        showInfo('Book edited.');
        $('#viewEditBook').hide();
        listBooks();
    }).catch(handleAjaxError)
}

function saveAuthInSession(userInfo) {
    sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
    sessionStorage.setItem('username', userInfo.username);
    sessionStorage.setItem('userID', userInfo._id);
}

function logoutUser() {
    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/:' +APP_KEY +'/_logout',
        headers: {Authorization: 'Kinvey' + sessionStorage.getItem('authToken')}
    }).then(function (res) {
        console.log(res);
    }).catch(handleAjaxError);
    sessionStorage.clear();
    showHomeView();
    showHideMenuLinks();
    $('#loggedInUser').text('');
    showInfo('Logout successful.');
}

function signInUser(res, message) {
    saveAuthInSession(res);
    showInfo(message);
    showHideMenuLinks();
    showHomeView();
    $('#loggedInUser').text('Hello, ' + res.username + '!');
}

function displayPaginationAndBooks(books) {
    $('#viewBooks').show();
    $('#viewHome').hide();
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
            $('#books table tr').each((index, element) => {
                if (index > 0) {
                    element.remove()
                }
            });

            let startBook = (page - 1) * BOOKS_PER_PAGE;
            let endBook = Math.min(startBook + BOOKS_PER_PAGE, books.length);
            $(`a:contains(${page})`).addClass('active');
            for (let i = startBook; i < endBook; i++) {
                let tr = $('<tr>')
                    .append(`<td>${books[i].title}</td>`)
                    .append(`<td>${books[i].author}</td>`)
                    .append(`<td>${books[i].description}</td>`);
                if (books[i]._acl.creator === sessionStorage.getItem('userID')) {
                    tr.append($('<td>')
                        .append($(`<a href="#">[Delete]</a>`).on('click', function () {
                            deleteBook(books[i])
                        }))
                        .append($(`<a href="#">[Edit]</a>`).on('click', function () {
                            loadBookForEdit(books[i]);
                    })));
                }
                $('#books table').append(tr)
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