

$(function () {
    onPortfolioChangeListener = onPortfolioChanged;
    const id = window.location.search.substring(1);
    const url = "stock/getOneOrder?" + id;
    $.get(url, function (order) {
        $("#id").val(order.id);
        $("#selectedCompany")
            .attr("value", order.companyId)
            .text(order.companySymbol + " - " + order.companyName);
        $("#companySelect").val(order.companyId);
        $("#companySelect").prop("readonly", true); //Bruker kan ikke endre company navnet
        $("#portfolioSelect").prop("readonly", true); //Bruker kan ikke endre portfolioen
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

// Denne kalles når portefølgen er satt eller endret (f.eks fra dropdown menyen)
function onPortfolioChanged(portfolio) {
    $("#purchasingPower").html(portfolio.purchasingPower);
    getOwnedShareholdings(portfolio.id);
}

function changeOrder() {
    if (validateOrder()) {
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
    }
};