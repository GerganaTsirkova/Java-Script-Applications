const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = 'kid_rkk_iAQeE';
const APP_SECRET = '67c3b4ac27b94b14adde891d2b29b541';
const AUTH_HEADERS = {Authorization: "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};

function loginUser() {
    let username = $('.login #username').val();
    let password = $('.login #password').val();
    if (checkInputCredentials(username, password)) {
        $.ajax({
            method: 'POST',
            url: BASE_URL + 'user/' + APP_KEY + '/login',
            headers: AUTH_HEADERS,
            data: {username, password}
        }).then(function (res) {
            signInUser(res, 'Login successful.');
            showLoggedInView();
        }).catch(function (err) {
            handleAjaxError(err);
            showView('login');
        });
        $('form').trigger('reset');
    }
}

function registerUser() {
    let username = $('.register #username').val();
    let password = $('.register #password').val();
    if (checkInputCredentials(username, password)) {
        $.ajax({
            method: 'POST',
            url: BASE_URL + 'user/' + APP_KEY + '/',
            headers: AUTH_HEADERS,
            data: {username, password}
        }).then(function (res) {
            signInUser(res, 'User registration successful.');
            showLoggedInView()
        }).catch(function (err) {
            handleAjaxError(err);
            showView('register')
        });
        $('form').trigger('reset');
    }
}

function showLoggedInView(type) {
    $('#site-content > section').hide();// Hide all views
    $('.dashboard').show();
    $('#footer').show();
    $('#site-content > section.dashboard > ul').empty();
    if(type === undefined){
        $.ajax({
            method: 'GET',
            url: BASE_URL + 'appdata/' + APP_KEY + '/pets',
            headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")}
        }).then(function (res) {
            if (res.length > 0) {
                res.sort((x, y) => parseInt(y.likes, 10) - parseInt(x.likes, 10));
                for (let pet of res) {
                    if (pet.creator !== sessionStorage.getItem('username')) {
                        let li = $('<li>')
                            .append($(`<h3>Name: ${pet.name}</h3>`))
                            .append($(`<p>Category: ${pet.category}</p>`))
                            .append($(`<p class="img"><img src="${pet.imageURL}"></p>`))
                            .append($(`<p class="description">${pet.description}</p>`))
                            .append($(`<div class="pet-info"></div>`)
                                .append($(`<a href="#">`)
                                    .append($(`<button class="button">`)
                                        .append($(`<i class="fas fa-heart"> Pet</i>`).on('click',function () {
                                            let name = pet.name;
                                            let creator = pet.creator;
                                            let description = pet.description;
                                            let imageURL = pet.imageURL;
                                            let category = pet.category;
                                            let likes = Number(pet.likes) + 1;
                                            let id = pet._id;
                                            $.ajax({
                                                method: 'PUT',
                                                url: BASE_URL + 'appdata/' + APP_KEY + '/pets/' + id,
                                                headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")},
                                                data: {name, creator, description, imageURL, category, likes, id}
                                            }).then(function (res) {
                                                showLoggedInView();
                                                showInfo('Pet liked!');
                                            }).catch(handleAjaxError);
                                        }))))
                                .append($(`<a href="#"></a>`)
                                    .append($(`<button class="button">Details</button>`).on('click', function () {
                                        showHideMenuLinks();
                                        showView('detailsOtherPet');
                                        detailsOtherPet(pet);
                                    })))
                                .append($(`<i class="fas fa-heart"></i>`)
                                    .append($(`<span> ${pet.likes}</span>`))));

                        $('#site-content > section.dashboard > ul').append(li);
                    }
                }

            }
        }).catch(handleAjaxError)
    }
    else {
        $.ajax({
            method: 'GET',
            url: BASE_URL + 'appdata/' + APP_KEY + '/pets',
            headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")}
        }).then(function (res) {
            if (res.length > 0) {
                res.sort((x, y) => parseInt(y.likes, 10) - parseInt(x.likes, 10));
                for (let pet of res) {
                    if (pet.creator !== sessionStorage.getItem('username')) {
                        if(pet.category === type){
                            let li = $('<li>')
                                .append($(`<h3>Name: ${pet.name}</h3>`))
                                .append($(`<p>Category: ${pet.category}</p>`))
                                .append($(`<p class="img"><img src="${pet.imageURL}"></p>`))
                                .append($(`<p class="description">${pet.description}</p>`))
                                .append($(`<div class="pet-info"></div>`)
                                    .append($(`<a href="#">`)
                                        .append($(`<button class="button">`)
                                            .append($(`<i class="fas fa-heart"> Pet</i>`).on('click',function () {
                                                let name = pet.name;
                                                let creator = pet.creator;
                                                let description = pet.description;
                                                let imageURL = pet.imageURL;
                                                let category = pet.category;
                                                let likes = Number(pet.likes) + 1;
                                                let id = pet._id;
                                                $.ajax({
                                                    method: 'PUT',
                                                    url: BASE_URL + 'appdata/' + APP_KEY + '/pets/' + id,
                                                    headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")},
                                                    data: {name, creator, description, imageURL, category, likes, id}
                                                }).then(function (res) {
                                                    showLoggedInView();
                                                    showInfo('Pet liked!');
                                                }).catch(handleAjaxError);
                                            }))))
                                    .append($(`<a href="#"></a>`)
                                        .append($(`<button class="button">Details</button>`).on('click', function () {
                                            showHideMenuLinks();
                                            showView('detailsOtherPet');
                                            detailsOtherPet(pet);
                                        })))
                                    .append($(`<i class="fas fa-heart"></i>`)
                                        .append($(`<span> ${pet.likes}</span>`))));

                            $('#site-content > section.dashboard > ul').append(li);
                        }
                    }
                }

            }
        }).catch(handleAjaxError)
    }
}

function detailsOtherPet(pet) {
    let petDetails = $('#site-content > section.detailsOtherPet');
    petDetails.empty();
    petDetails
        .append($(`<h3>${pet.name}</h3>`))
        .append($('<p>')
            .text(`Pet counter: ${pet.likes} `)
            .append($(`<a href="#"></a>`).on('click', function () {
                likePet(pet);
            })
                .append($('<button class="button">\n                            Pet</button>')
                    .append($('<i class="fas fa-heart"></i>')))))
        .append($('<p class="img">')
            .append($(`<img src="${pet.imageURL}">`)))
        .append($(`<p class="description">${pet.description}</p>`));
}

function likePet(pet) {
    let name = pet.name;
    let creator = pet.creator;
    let description = pet.description;
    let imageURL = pet.imageURL;
    let category = pet.category;
    let likes = Number(pet.likes) + 1;
    let id = pet._id;
    $.ajax({
        method: 'PUT',
        url: BASE_URL + 'appdata/' + APP_KEY + '/pets/' + id,
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")},
        data: {name, creator, description, imageURL, category, likes, id}
    }).then(function (res) {
        detailsOtherPet(res);
        showInfo('Pet liked!');
    }).catch(handleAjaxError);
}

function displayMyPets() {
    $('.my-pets-list').empty();
    $.ajax({
        method: 'GET',
        url: BASE_URL + 'appdata/' + APP_KEY + '/pets',
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")}
    }).then(function (res) {
        if (res.length > 0) {
            res.sort((x, y) => parseInt(y.likes, 10) - parseInt(x.likes, 10));
            for (let pet of res) {
                if (pet.creator !== undefined && pet.creator === sessionStorage.getItem('username')) {
                    let section = $('<section class="myPets">')
                        .append($(`<h3>Name: ${pet.name}</h3>`))
                        .append($(`<p>Category: Cat</p>`))
                        .append($(`<p class="img"><img src="${pet.imageURL}"></p>`))
                        .append($(`<p class="description">${pet.description}</p>`))
                        .append($(`<div class="pet-info"></div>`)
                            .append($(`<a href="#">`)
                                .append($(`<button class="button">Edit</button>`)).on('click', function () {
                                    loadPetForEdit(pet);
                                }))
                            .append($(`<a href="#"></a>`)
                                .append($(`<button class="button">Delete</button>`).on('click', function () {
                                    deletePet(pet);
                                })))
                            .append($(`<i class="fas fa-heart"></i>`)
                                .append($(`<span> ${pet.likes}</span>`))));
                    $('#site-content > section.my-pets > ul').append(section);
                }
            }


        } else {
            $('#site-content').append($('<section class="myPets" style="display: none">'));
        }
    }).catch(handleAjaxError)
}

function createPet() {
    let [name, description, imageURL, category] =
        [
            $('.create #name').val(),
            $('.create #description').val(),
            $('.create #image').val(),
            $('#site-content > section.create > form > fieldset > p:nth-child(5) > span > select > option:selected').val(),
        ];
    let creator = sessionStorage.getItem('username');
    let likes = 0;
    if ((name !== '') && (description !== "") && (imageURL !== "")) {
        $.ajax({
            method: 'POST',
            url: BASE_URL + 'appdata/' + APP_KEY + '/pets',
            headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")},
            data: {name, description, imageURL, category, creator, likes}
        }).then(function (res) {
            showInfo('Pet created.');
            $('#site-header > nav > section.navbar-dashboard > div.first-bar > a:nth-child(2)').trigger('click');
        }).catch(handleAjaxError);
    }
}

function deletePet(pet) {
    $.ajax({
        method: 'DELETE',
        url: BASE_URL + 'appdata/' + APP_KEY + '/pets/' + pet._id,
        headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")}
    }).then(function (res) {
        $('#site-header > nav > section.navbar-dashboard > div.first-bar > a:nth-child(2)').trigger('click');
        showInfo('Pet deleted.');
    }).catch(handleAjaxError);
}


function loadPetForEdit(pet) {
    let detailsMyPet = $('.detailsMyPet');
    detailsMyPet.empty();
    showView('detailsMyPet');
    detailsMyPet
        .append($(`<h3>${pet.name}</h3>`))
        .append($(`<p>Pet counter: <i class="fas fa-heart"></i> ${pet.likes}</p>`))
        .append($(`<p class="img"><img src="${pet.imageURL}"></p>`))
        .append($(`<form action="#" method="POST">
                    <textarea type="text" name="description">${pet.description}</textarea>
                    <button class="button"> Save</button>
                </form>`));
    $(`#site-content > section.detailsMyPet > form > button`).on('click',function (event) {
        event.preventDefault();
        editPet(pet);
    });
}

function editPet(pet) {
    let [name, likes, imageURL, id, description, creator,category] =
        [
            pet.name,
            pet.likes,
            pet.imageURL,
            pet._id,
            $('#site-content > section.detailsMyPet > form > textarea').val(),
            sessionStorage.getItem('username'),
            pet.category
        ];
    if (description) {
        $.ajax({
            method: 'PUT',
            url: BASE_URL + 'appdata/' + APP_KEY + '/pets/' + id,
            headers: {Authorization: "Kinvey " + sessionStorage.getItem("authToken")},
            data: {name, likes, imageURL, id, description, creator,category}
        }).then(function (res) {
            $('.my-pets-list').empty();
            $('form').trigger('click');
            showInfo('Edited successfully!');
            $('#site-header > nav > section.navbar-dashboard > div.first-bar > a:nth-child(2)').trigger('click')

        }).catch(handleAjaxError);
    } else {
        showError('Pet credentials are not correct!')
    }
}

function saveAuthInSession(userInfo) {
    sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
    sessionStorage.setItem('username', userInfo.username);
}

function logoutUser() {
    $.ajax({
        method: 'POST',
        url: BASE_URL + 'user/' + APP_KEY + '/_logout',
        headers: {Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')}
    }).then(function () {
        sessionStorage.clear();
        showInfo('Logout successful.');
        showHomeView();
    }).catch(handleAjaxError)
}

function signInUser(res, message) {
    saveAuthInSession(res);
    showInfo(message);
    showHideMenuLinks();
    $("#homeLink").trigger('click')
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error.";
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description;
    showError(errorMsg);
}

