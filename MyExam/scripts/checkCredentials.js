function checkInputCredentials(username, password) {
    let regexUsername = RegExp('[A-Za-z]{3,}');
    let regexPassword = RegExp('[A-Za-z0-9]{6,}');
    if (username.length < 3) {
        showError('Username must be at least 3 symbols');
        return false;
    } else if (password.length < 6) {
        showError('Password must be at least 6 symbols');
        return false;
    }
    return true;
}
