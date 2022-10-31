function signOut() {
    $.get("stock/SignOut", function () {
        window.location.href = 'signIn.html';
    });
}
