function showView(viewName) {
    $('main > section').hide() ;// Hide all views
    $('#' + viewName).show() // Show the selected view only
}

function showHideMenuLinks() {
    $("#linkHome").show();
    if (sessionStorage.getItem('authToken') === null) { // No logged in user
        $("#linkLogin").show();
        $("#linkRegister").show();
        $("#linkListAds").hide();
        $("#linkCreateAd").hide();
        $("#linkLogout").hide();
    } else { // We have logged in user
        $("#linkLogin").hide();
        $("#linkRegister").hide();
        $("#linkListAds").show();
        $("#linkCreateAd").show();
        $("#linkLogout").show();
        $('#loggedInUser').text("Welcome, " + sessionStorage.getItem('username') + "!")
    }
}

function showInfo(message) {
    let infoBox = $('#infoBox');
    infoBox.text(message);
    infoBox.show();
    setTimeout(() => infoBox.fadeOut(), 3000);
}

function showError(message) {
    let errorBox = $('#errorBox');
    errorBox.text(message);
    errorBox.show();
}

function showHomeView() {
    showView('viewHome');
}

function showLoginView() {
    showView('viewLogin');
    $('#viewLogin').trigger('reset');
}

function showRegisterView() {
    showView('viewRegister');
    $('#viewRegister').trigger('reset');
}

function showCreateAdView() {
    showView('viewCreateAd');
    $('#viewCreateAd').trigger('reset');
}

function showEditAdView() {
    $('#viewEditAd').trigger('reset');
    showView('viewEditAd');
}

function showAds() {
    $('#viewAdds').trigger('reset');
    showView('viewAds');
}