function attachAllEvents() {
    //link views

    $("#site-header > nav > section.navbar-dashboard > div.second-bar > ul > li:nth-child(2)").on('click', logoutUser); //logOutLint
    $("#site-header > nav > section.navbar-anonymous > ul > li:nth-child(1)").on('click', showRegisterView); //registerLink
    $("#site-header > nav > section.navbar-anonymous > ul > li:nth-child(2)").on('click', showLoginView); //loginLink

    //buttons
    let loginButton = $("#site-content > section.login > form > fieldset > input");
    loginButton.unbind('submit');
    loginButton.on('click', function (event) {
        event.preventDefault();
        loginUser()
    }); //loginButton
    let registerButton = $("#site-content > section.register > form > fieldset > input");
    registerButton.unbind('submit');
    registerButton.on('click', function (event) {
        event.preventDefault();
        registerUser();
    }); //registerButton

    let addPetsButton = $('#site-header > nav > section.navbar-dashboard > div.first-bar > a:nth-child(3)');
    addPetsButton.unbind('submit');
    addPetsButton.on('click',function (event) {
        event.preventDefault();
        showView('create')
    });

    let createBtn = $('#site-content > section.create > form > fieldset > input');
    createBtn.unbind('submit');
    createBtn.on('click',function (event) {
        event.preventDefault();
        createPet();
    });

    let myPets = $('#site-header > nav > section.navbar-dashboard > div.first-bar > a:nth-child(2)');
    myPets.unbind('submit');
    myPets.on('click',function (event) {
        event.preventDefault();
        showView('my-pets');
        displayMyPets();
    });

    let dashBoardBtn = $('#site-header > nav > section.navbar-dashboard > div.first-bar > a:nth-child(1)');
    dashBoardBtn.click(function () {
        showLoggedInView();
    });

    let btnAll = $('#site-content > section.dashboard > nav > ul > li:nth-child(1) > a');
    btnAll.on('click',function () {
        showLoggedInView();
    });

    let btnCats = $('#site-content > section.dashboard > nav > ul > li:nth-child(2) > a');
    btnCats.on('click',function () {
        showLoggedInView('Cat')
    });

    let btnDogs = $('#site-content > section.dashboard > nav > ul > li:nth-child(3) > a');
    btnDogs.on('click',function () {
        showLoggedInView('Dog')
    });

    let btnParrots = $('#site-content > section.dashboard > nav > ul > li:nth-child(4) > a');
    btnParrots.on('click',function () {
        showLoggedInView('Parrot')
    });

    let btnReptiles = $('#site-content > section.dashboard > nav > ul > li:nth-child(5) > a');
    btnReptiles.on('click',function () {
        showLoggedInView('Reptile')
    });

    let btnOthers = $('#site-content > section.dashboard > nav > ul > li:nth-child(6) > a');
    btnOthers.on('click',function () {
        showLoggedInView('Other')
    })
}