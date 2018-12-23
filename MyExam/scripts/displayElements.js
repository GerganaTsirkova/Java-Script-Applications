function showView(viewName) {
    $('#site-content > section').hide();// Hide all views
    $('.' + viewName).show();// Show the selected view only
    $('#footer').show();
}
function showHideMenuLinks() {
    if (sessionStorage.getItem('authToken') === null) { // No logged in user
        $('.basic').show();
        $('.footer').show();
        $('#site-header > nav > section.navbar-dashboard').hide();
        $('#site-header > nav > section.navbar-anonymous').show();
    } else { // We have logged in user
        $('.basic').show();
        $('.footer').show();
        $('#site-header > nav > section.navbar-dashboard').show();
        $('#site-header > nav > section.navbar-anonymous').hide();
        $('#site-header > nav > section.navbar-dashboard > div.second-bar > ul > li:nth-child(1)').text(`Welcome, ${sessionStorage.getItem('username')}!`)
    }
}

function showHomeView() {
    if(sessionStorage.getItem('username') === null){
        showHideMenuLinks();
        showView('basic')
    }
    else {
        showLoggedInView();
    }
}

function showLoginView() {
    showHideMenuLinks();
    showView('login');
}

function showRegisterView() {
    showHideMenuLinks();
    showView('register')
}

