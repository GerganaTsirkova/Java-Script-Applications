const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_Sy6wbRpcX';
const APP_SECRET = '44c43ef43906468ea6aa4f269c5b9b52';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};

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
        $('#viewLogin input[name="username"]').val('');
        $('#viewLogin input[name="passwd"]').val('')
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
        $('#linkLogin').trigger('click');
        $('#viewRegister input[name="username"]').val('');
        $('#viewRegister input[name="passwd"]').val('');
    }).catch(handleAjaxError)
}

function listAds() {
    let content = $('#content');
    content.empty();
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/advertisments',
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")}
    }).then(function (res) {
        showView('viewAds');
        content
            .append($('<h1 class="titleForm">Advertisements</h1>'))
            .append($('<div id="ads" class="ads">'));
        if (res.length === 0) {
            $('#ads').append($('<p>No ads in database.</p>'))
        } else {
            for (let ad of res) {
                if (ad.publisher === sessionStorage.getItem('username')) {
                    $('#ads')
                        .append($('<div class="ad-box">')
                            .append($(`<div class="title" data-id="${ad._id}">${ad.title}</div>`)
                                .append($('<button class="ad-control delete">&#10006</button>').on('click', function () {
                                    $(this).parent().remove();
                                    deleteAd(ad);
                                    $('#linkListAds').trigger('click')
                                }))
                                .append($('<button class="ad-control edit">&#9998</button>').on('click', function () {
                                    loadAdForEdit(ad);
                                })))
                            .append($(`<div><img src="${ad.imageUrl}"/></div>`))
                            .append($(`<div> Price: ${ad.price} BGN | By ${ad.publisher}</div>`)));
                } else {
                    $('#ads')
                        .append($('<div class="ad-box">')
                            .append($(`<div class="title" data-id="${ad._id}">${ad.title}</div>`))
                            .append($(`<div><img src="${ad.imageUrl}"/></div>`))
                            .append($(`<div> Price: ${ad.price} BGN | By ${ad.publisher}</div>`)))
                }
            }
        }
    }).catch(handleAjaxError);
}


function createAd() {
    showCreateAdView();
    let [title, publisher, description, price, imageUrl] =
        [$('#formCreateAd input[name="title"]').val(),
            sessionStorage.getItem('username'),
            $('#formCreateAd textarea[name="description"]').val(),
            $('#formCreateAd input[name="price"]').val(),
            $('#formCreateAd input[name="imageUrl"]').val()];
    if ((title === '') || (!title)) {
        showError('Title must be a non-empty string');
        return;
    }
    if ((price === '') || (!price)) {
        showError('Price must be a non-empty string');
        return;
    }
    $.ajax({
        method: 'POST',
        url: BASE_URL + 'appdata/' + APP_KEY + '/advertisments',
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")},
        data: {title, publisher, description, price, imageUrl}
    }).then(function (res) {
        showInfo('Ad created.');
        $("#viewAds").hide();
        $('#linkListAds').trigger('click');
        $('#formCreateAd input[name="title"]').val('');
        $('#formCreateAd textarea[name="description"]').val('');
        $('#formCreateAd input[name="price"]').val('');
        $('#formCreateAd input[name="imageUrl"]').val('');
    }).catch(handleAjaxError);
}

function deleteAd(ad) {
    $.ajax({
        method: 'DELETE',
        url: BASE_URL + 'appdata/' + APP_KEY + '/advertisments/' + ad._id,
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")}
    }).then(function (res) {
        showInfo('Ad deleted.');
        showView('viewBooks');
    }).catch(handleAjaxError);
}

function loadAdForEdit(ad) {
    showView('viewEditAd');
    $('#formEditAd input[name="title"]').val(ad.title);
    $('#formEditAd input[name="price"]').val(ad.price);
    $('#formEditAd input[name="imageUrl"]').val(ad.imageUrl);
    $('#formEditAd textarea[name="description"]').val(ad.description);
    $('#formEditAd input[name="id"]').val(ad._id);
}

function editAd(ad) {
    let [title, publisher, description, price, imageUrl, id] =
        [$('#formEditAd input[name="title"]'),
            sessionStorage.getItem('username'),
            $('#formEditAd textarea[name="description"]'),
            $('#formEditAd input[name="price"]'),
            $('#formEditAd input[name="imageUrl"]'),
            $('#formEditAd input[name="id"]')];
    if ((title === '') || (!title)) {
        showError('Title must be a non-empty string');
        return;
    }
    if ((price === '') || (!price)) {
        showError('Price must be a non-empty string');
        return;
    }
    $.ajax({
        method: 'PUT',
        url: BASE_URL + 'appdata/' + APP_KEY + '/advertisments/' + id,
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")},
        data: {title:title.val(), publisher:publisher.val(), description:description.val(), price:price.val(), imageUrl:imageUrl.val()}
    }).then(function (res) {
        $('#linkListBooks').trigger('click');
        showInfo('Ad edited.');
        $('#linkListAds').trigger('click');
    }).catch(handleAjaxError);
    title.val('');
    description.val('');
    price.val('');
    imageUrl.val('');
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

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error.";
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description;
    showError(errorMsg)
}