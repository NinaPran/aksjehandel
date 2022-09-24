$(function () {
    const id = window.location.search.substring(1);
    const url = "stock/getOneOrder?" + id;
    $.get(url, function (order) {
        $("#id").val(order.id);
        $("#company").val(order.companyName);
        if (order.type == "buy") {
            $("#type-buy").prop("checked", true);
        }
        else {
            $("#type-sell").prop("checked", true);
        }
        $("#price").val(order.price);
        $("#amount").val(order.amount);
    });
});

function changeOrder() {
    const order = {
        id: $("#id").val(),
        price: $("#price").val(),
        amount: $("#amount").val()
    }
    $.post("stock/changeOrder", order, function (OK) {
        if (OK) {
            window.location.href = 'overview.html';
        }
        else {
            $("#error").html("Feil i db - prøv igjen senere");
        }
    });

};