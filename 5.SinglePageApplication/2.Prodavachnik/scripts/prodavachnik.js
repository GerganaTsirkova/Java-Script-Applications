const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_Sy6wbRpcX';
const APP_SECRET = '44c43ef43906468ea6aa4f269c5b9b52';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};
const infoBox = $('#infoBox');
const errorBox = $('#errorBox');
const loggedInUser = $('#loggedInUser');
const formEdit = $('#formEditAd');
const readMore = $('#viewAdDetails');

function startApp() {
    $('#viewHome').show();
    showHideMenuLinks();
    $('#linkLogin').on('click', login);
    $('#linkRegister').on('click', register);
    $('#linkHome').on('click', showHomeView);
    $('#linkLogout').on('click', logoutUser);
    $('#linkListAds').on('click', listAds);
    $('#linkCreateAd').on('click', createAds);


    function showHomeView() {
        infoBox.hide();
        errorBox.hide();
        window.location.reload();
        $('#viewRegister').hide();
        $('#viewLogin').hide();
        $('#viewAds').hide();
        $('#viewCreateAd').hide();
        $('#viewEditAd').hide();
    }


    function showHideMenuLinks() {
        $("#linkHome").show();
        if (sessionStorage.getItem('authToken') === null) { // No logged in user
            $("#linkLogin").show();
            $("#linkRegister").show();
        } else { // We have logged in user
            $("#linkListAds").show();
            $("#linkCreateAd").show();
            $("#linkLogout").show();
            $("#linkLogin").hide();
            $("#linkRegister").hide();
            $('#loggedInUser').text('');
        }
    }

    function login() {
        $('#viewLogin').show();
        $('#viewRegister').hide();
        infoBox.hide();
        errorBox.hide();
        loginUser();

    }

    function register() {
        $('#viewRegister').show();
        $('#viewLogin').hide();
        infoBox.hide();
        errorBox.hide();
        registerUser();
    }

    function registerUser() {
        $('#viewHome').hide();
        let formRegister = $('#formRegister');
        let username = formRegister.find($('input[name="username"]'));
        let password = formRegister.find($('input[name="passwd"]'));

        $('#buttonRegisterUser').on('click', function () {
            $.ajax({
                method: 'POST',
                url: BASE_URL + 'user/' + APP_KEY + '/',
                headers: AUTH_HEADERS,
                data: {username: username.val(), password: password.val()}
            }).then(function (res) {
                username.val('');
                password.val('');
                saveAuthInSession(res);
                showHideMenuLinks();
                showInfo('User registration successful.');
                loggedInUser.css('display', 'block');
                loggedInUser.text('Hello, ' + res.username);
                $('#viewRegister').hide();
                showHomeView();
            }).catch(function (err) {
                username.val('');
                password.val('');
                handleAjaxError(err)
            })
        })
    }

    function loginUser() {
        let formLogin = $('#formLogin');
        let username = formLogin.find($('input[name="username"]'));
        let password = formLogin.find($('input[name="passwd"]'));
        $('#buttonLoginUser').click(function () {
            $.ajax({
                method: 'POST',
                url: BASE_URL + 'user/' + APP_KEY + '/login',
                headers: AUTH_HEADERS,
                data: {username: username.val(), password: password.val()}
            }).then(function (res) {
                username.val('');
                password.val('');
                showInfo('User login successful.');
                saveAuthInSession(res);
                showHideMenuLinks();
                $('#viewLogin').hide();
                loggedInUser.show();
                loggedInUser.text('Hello, ' + res.username);
                showHomeView();
            }).catch(function (err) {
                username.val('');
                password.val('');
                handleAjaxError(err)
            })
        })
    }

    function logoutUser() {
        sessionStorage.clear();
        showHideMenuLinks();
        showInfo('User logout successful.');
        $('#linkListAds').css('display', 'none');
        $('#linkCreateAd').css('display', 'none');
        $('#linkLogout').css('display', 'none');
        loggedInUser.hide();
        $('#linkHome').trigger('click');
        $('#viewHome').show();
    }

    function saveAuthInSession(userInfo) {
        sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
        sessionStorage.setItem('username', userInfo.username);
        sessionStorage.setItem('userID', userInfo._id);
        sessionStorage.setItem('userID', userInfo.password);
    }

    function handleAjaxError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON && response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg);
    }

    $(document).on({
        ajaxStart: function () {
            $("#loadingBox").show()
        },
        ajaxStop: function () {
            $("#loadingBox").hide()
        }
    });

    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.text(message);
        infoBox.show();
        setTimeout(function () {
            infoBox.fadeOut()
        }, 3000)
    }

    function showError(errorMsg) {
        let errorBox = $('#errorBox');
        errorBox.text("Error: " + errorMsg);
        errorBox.show();
        setTimeout(function () {
            errorBox.fadeOut()
        }, 3000)
    }

    function listAds() {
        $('#viewHome').css('display', 'none');
        $('#viewEditAd').css('display', 'none');
        $('#viewCreateAd').css('display', 'none');
        $('#viewAds').css('display', 'block');
        $('#ads').empty();


        $.ajax({
            method: 'GET',
            url: BASE_URL + 'appdata/' + APP_KEY + '/advertisments',
            headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")}
        }).then(function (res) {
            if (res.length === 0) {
                $('#viewAds').append($('<div>No advertisements available.</div>'));
            } else {
                let table = $('<table></table>');
                table.append($('<tr>' +
                    '<th>Title</th>' +
                    '<th>Publisher</th>' +
                    '<th>Description</th>' +
                    '<th>Price</th>' +
                    '<th>Date Published</th>' +
                    '</tr>'));
                for (let response of res) {
                    if (response.publisher === sessionStorage.getItem('username')) {
                        table.append($('<tr>')
                            .append($(`<td>${response.title}</td>`))
                            .append($(`<td>${response.publisher}</td>`))
                            .append($(`<td>${response.description}</td>`))
                            .append($(`<td>${response.price}</td>`))
                            .append($(`<td>${response.datePublished}</td>`))
                            .append(($('<td>'))
                                .append($('<a href="#">[Delete]</a>').on('click', function () {
                                    deleteAd(response);
                                }))
                                .append($('<a href="#">[Edit]</a>').on('click', function () {
                                    editAdvert(response);
                                }))
                                .append($('<a href="#">[Read More]</a>').on('click', function () {
                                    detailsAd(response);
                                }))))
                        
                    }
                    else {
                        table.append($('<tr>')
                            .append($(`<td>${response.title}</td>`))
                            .append($(`<td>${response.publisher}</td>`))
                            .append($(`<td>${response.description}</td>`))
                            .append($(`<td>${response.price}</td>`))
                            .append($(`<td>${response.datePublished}</td>`))
                            .append(($('<td>'))
                                .append($('<a href="#"> [Read More] </a>').on('click', function () {
                                    detailsAd(response);
                                })))
                        );
                    }
                    $('#ads').append(table);
                    $('#viewAds').show();
                    $('#viewCreateAd').hide();
                }
            }
        }).catch(handleAjaxError);

    }

    function createAds() {
        $('#viewHome').css('display', 'none');
        $('#viewAds').hide();
        let createAdd = $('#viewCreateAd');
        createAdd.css('display', 'block');

        let title = createAdd.find('input[name="title"]');
        let description = createAdd.find('textarea[name="description"]');
        let datePublished = createAdd.find('input[name="datePublished"]');
        let price = createAdd.find('input[name="price"]');
        $('#buttonCreateAd').on('click', function () {
            $.ajax({
                method: 'POST',
                url: BASE_URL + 'appdata/' + APP_KEY + '/advertisments',
                headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")},
                data: {
                    title: title.val(),
                    description: description.val(),
                    publisher: sessionStorage.getItem('username'),
                    datePublished: datePublished.val(),
                    price: price.val()
                }
            }).then(function (res) {
                title.val('');
                description.val('');
                datePublished.val('');
                price.val('');
                createAdd.css('display', 'none');
                $('#linkListAds').trigger('click');
                showInfo('Advertisment added successfuly.');
            }).catch(handleAjaxError)
        })

    }

    function editAdvert(ad) {
        $('#viewEditAd').css('display', 'block');
        $('#viewAds').css('display', 'none');
        let formEdit = $('#formEditAd');
        let titleEdit = formEdit.find($('input[name="title"]'));
        let descriptionEdit = formEdit.find($('textarea[name="description"]'));
        let datePublishedEdit = formEdit.find($('input[name="datePublished"]'));
        let priceEdit = formEdit.find($('input[name="price"]'));
        titleEdit.val(ad.title);
        priceEdit.val(ad.price);
        descriptionEdit.val(ad.description);
        datePublishedEdit.val(ad.datePublished);
        $('#buttonEditAd').on('click', function () {
            $.ajax({
                method: 'PUT',
                url: BASE_URL + 'appdata/' + APP_KEY + '/advertisments/' + response._id,
                data: {
                    title: titleEdit.val(),
                    description: descriptionEdit.val(),
                    publisher: sessionStorage.getItem('username'),
                    datePublished: datePublishedEdit.val(),
                    price: priceEdit.val()
                },
                headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")},
            }).then(function (res) {
                showInfo('Advertisment edited successfuly.');
                $('#viewEditAd').css('display', 'none');
                $('#linkListAds').trigger('click');
            }).catch(handleAjaxError)
        });
    }

    function deleteAd(ad) {
        $.ajax({
            method: 'DELETE',
            url: BASE_URL + 'appdata/' + APP_KEY + '/advertisments/' + response._id,
            headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")},
        }).then(function (res) {
            showInfo('Advertisment deleted successfuly.');
            $('#linkListAds').trigger('click');
        }).catch(handleAjaxError)
    }
    
    function detailsAd(ad) {
        if(readMore){
            readMore.remove();
        }
        let section = $('<section id="viewAdDetails"></section>')
            .append($('<div>').append(
                $('<img>').attr('src', ad.image),
                $('<br>'),
                $('<label>').text('Title:'),
                $('<h1>').text(ad.title),
                $('<label>').text('Description:'),
                $('<p>').text(ad.description),
                $('<label>').text('Publisher:'),
                $('<div>').text(ad.publisher),
                $('<label>').text('Date:'),
                $('<div>').text(ad.datePublished)));
        $('body').append(section);
        $('main > section').css('display','none');
        section.css('display','block');
    }
}
