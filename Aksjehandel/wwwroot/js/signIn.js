var signInError = $("#signInError");

function signIn() {
    const usernameOK = validateUser();
    const passwordOK = validatePassword();

    if (usernameOK && passwordOK) {
        const user = {
            username: $("#username").val(),
            password: $("#password").val()
        }
        $.post("stock/SignIn", user, function (OK) {
            if (OK) {
                window.location.href = 'index.html';
            }
            else {
                signInError.text("Feil brukernavn eller passord");
            }
        })
            .fail(function () {
                signInError.text("Feil på server -prøv igjen senere");
            });
    }
}