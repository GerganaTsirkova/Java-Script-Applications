const BASE_URL = 'https://baas.kinvey.com/';
const APP_KEY = '';
const APP_SECRET = '';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};

function startApp() {
    showHomeView();
    showHideMenuLinks();
    $('#linkLogin').on('click',login);
    $('#linkRegister').on('click',register);
    $('#linkHome').on('click',showHomeView);

    function showHomeView() {
        $('#linkHome').click(function () {
            window.location.reload();
            $('#viewRegister').hide();
            $('#viewLogin').hide();
        });
    }

    function showHideMenuLinks() {
        $('#viewHome').show();
        if (sessionStorage.getItem('authToken') === null) { // No logged in user
            $("#linkLogin").show();
            $("#linkRegister").show();
            $("#linkHome").show();
        } else { // We have logged in user
            $("#linkListAds").show();
            $("#linkCreateAd").show();
            $("#linkLogout").show();
            $("#linkLogin").hide();
            $("#linkRegister").hide();
            $("#linkHome").hide();
            $('#loggedInUser').text("Welcome, " + sessionStorage.getItem('username') + "!")
        }
    }


    function login() {
        $('#viewLogin').show();
        $('#viewRegister').hide();
    }

    function register() {
        $('#viewRegister').show();
        $('#viewLogin').hide();
    }

    function registerUser() {
        let username = '';
        let password = '';

        $.ajax({
            method: 'POST',
            url: BASE_URL + 'user/' + APP_KEY + '/',
            headers: AUTH_HEADERS,
            data: {username, password}
        }).then(function (res) {

        }).catch(handleAjaxError)
    }

    function loginUser() {
        let username = '';
        let password = '';
        $.ajax({
            method: 'POST',
            url: BASE_URL + 'user/' + APP_KEY + '/login',
            headers: AUTH_HEADERS,
            data: {username, password}
        }).then(function (res) {

        }).catch(handleAjaxError)
    }

    function logoutUser() {
        $.ajax({
            method: 'POST',
            url: BASE_URL + 'user/:' +APP_KEY +'/_logout',
            headers: {Authorization: 'Kinvey' + sessionStorage.getItem('authToken')}
        }).then(function (res) {

        }).catch(handleAjaxError);
        sessionStorage.clear();
        showHomeView();
        showHideMenuLinks();
        $('#loggedInUser').text('');
    }

    function saveAuthInSession(userInfo) {
        sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
        sessionStorage.setItem('username', userInfo.username);
        sessionStorage.setItem('userID', userInfo._id);
    }

    function handleAjaxError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON && response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg)
    }
}