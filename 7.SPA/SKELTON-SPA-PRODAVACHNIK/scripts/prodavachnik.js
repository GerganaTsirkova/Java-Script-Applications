function startApp() {
    
    const templates = {};

    loadTemplates();

    async function loadTemplates() {
        const [adsCatalogTemplate, adBoxTemplate]
            = await Promise.all([
                $.get('./templates/ads-catalog.html'),
                $.get('./templates/ad-box-partial.html')
        ]);

        templates['catalog'] = Handlebars.compile(adsCatalogTemplate);
        Handlebars.registerPartial('adBox', adBoxTemplate);
    }

    // Attach click events
    (() => {
        $('header').find('a[data-target]').click(navigateTo);
        $('#buttonLoginUser').click(login);
        $('#buttonRegisterUser').click(register);
        $('#linkLogout').click(logout);
        $('#buttonCreateAd').click(createAd);
        $('.notification').click(function () {
            $(this).hide();
        });
    })();



    if(localStorage.getItem('authtoken') !== null){
        userLoggedIn();
    } else {
        userLoggedOut();
    }


    function handleError(reason) {
        showError(reason.responseJSON.description);
    }

    function showView(viewName) {
        // Hide all views and show the selected view only
        $('main > section').hide();
        $('#' + viewName).show();

        if(viewName === 'viewAds'){
            loadAds();
        }
    }

    // Shows only the correct links for a logged in user
    function userLoggedIn() {
        // let span = $('#loggedInUser');
        // span.text(`Welcome, ${localStorage.getItem('username')}`)
        // span.show();
    }

    // Shows only the correct links for an anonymous user
    function userLoggedOut() {
        
    }

    function navigateTo() {
        
    }

    // Saves username/id/authtoken to local storage
    function saveSession(data) {
        localStorage.setItem('username', data.username);
        localStorage.setItem('id', data._id);
        localStorage.setItem('authtoken', data._kmd.authtoken);
        userLoggedIn();
    }

    // Logs in the user
    async function login() {
        let form = $('#formLogin');
        let username = form.find('input[name="username"]').val();
        let password = form.find('input[name="passwd"]').val();

        try {
            let response = await requester.post('user', 'login', 'basic', { username, password });
            saveSession(response);
            showView('viewAds');
            showInfo('Successfully logged in!');
        } catch (e) {
            handleError(e);
        }
    }

    // Register a user
    async function register() {
        let form = $('#formRegister');
        let username = form.find('input[name="username"]').val();
        let password = form.find('input[name="passwd"]').val();

        try {
            let response = await requester.post('user', '', 'basic', { username, password});
            saveSession(response);
            showView('viewAds');
            showInfo('Successfully registered!');
        } catch (e) {
            handleError(e);
        }
    }

    // Logout a user
    async function logout() {
        try {
            await requester.post('user', '_logout', 'kinvey', { authtoken: localStorage.getItem('authtoken')});
            localStorage.clear(); // Clears all session storage on logout
            userLoggedOut();
            showView('viewHome');
            showInfo('Logout successful!')
        } catch (e) {
            handleError(e);
        }
    }

    // Load all ads
    async function loadAds() {
       
    }

    // Create an add
    async function createAd() {
        
    }

    // Delete an add
    async function deleteAd() {
        
    }

    // Edit an add
    async function editAd(id, publisher, date) {
       
    }

    // Open edit add view
    async function openEditAdd() {
        
    }
}