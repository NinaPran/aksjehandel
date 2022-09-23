$(function () {
    const id = window.location.search.substring(1);
    const url = "stock/getOneOrder?" + id;
    $.get(url, function (order) {
        $("#id").val(order.id);
        $("#company").val(order.company);
        $("#type").val(order.type);
        $("#price").val(order.price);
        $("#amount").val(order.amount);
    });
});

function changeOrder() {
    const kunde = {
        id: $("#id").val(),
        fornavn: $("#fornavn").val(),
        etternavn: $("#etternavn").val(),
        adresse: $("#adresse").val(),
        postnr: $("#postnr").val(),
        poststed: $("#poststed").val()
    }
    $.post("Kunde/Endre", kunde, function (OK) {
        if (OK) {
            window.location.href = 'index.html';
        }
        else {
            $("#error").html("Feil i db - prøv igjen senere");
        }
    });

};