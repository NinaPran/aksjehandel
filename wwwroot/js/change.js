﻿$(function () {
    const id = window.location.search.substring(1);
    const url = "stock/getOneOrder?" + id;
    $.get(url, function (order) {
        $("#id").val(order.id);
        $("#company").val(order.companyName);
        $("#company").prop("readonly", true); //Bruker kan ikke endre company navnet
        $("#portfolio").prop("readonly", true); //Bruker kan ikke endre portfolioen
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
    $.post("stock/changeOrder", order, function () {        
            window.location.href = 'overview.html';
    })
        .fail(function () {
            $("#error").html("Feil i db - prøv igjen senere");
    });
};