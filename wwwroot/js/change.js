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
    const order = {
        id: $("#id").val(),
        compayny: $("#company").val(),
        type: $('input[name=type]:checked').val(),
        price: $("#price").val(),
        amount: $("#amount").val()
    }
    $.post("stock/changeOrder", order, function (OK) {
        if (OK) {
            window.location.href = 'index.html';
        }
        else {
            $("#error").html("Feil i db - prøv igjen senere");
        }
    });

};