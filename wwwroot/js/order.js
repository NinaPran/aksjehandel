
const companySelect = $("#companySelect");

$(function () {
    onPortfolioChangeListener = onPortfolioChanged;
    getAllCompanies();
});

/*
$(function () {
    getAllCompanies();
});
*/


// Denne kalles når portefølgen er satt eller endret (f.eks fra dropdown menyen)

function onPortfolioChanged(portfolio) {
    $("#purchasingPower").html(portfolio.purchasingPower);
}


function getAllCompanies() {
    $.get("stock/getAllCompanies", function (companies) {
        formatCompanies(companies);
    });
}

function formatCompanies(companies) {
    const url = new URL(location.href); // lager url objekt

    const id = url.searchParams.get('id'); // leter etter id'en i url'en 
    const type = url.searchParams.get('type'); // leter etter type i url'en

    for (const company of companies) {

        companySelect
            .append($("<option></option>")
                .attr("value", company.id)
                .text(company.symbol + " - " + company.name));
    }


    if (id != "") {
        companySelect.val(id);

    }
    if (type == "sell") {
        $("#type-sell").prop("checked", true);
    }
    else {
        $("#type-buy").prop("checked", true);
    }
}
function regOrder() {
    const portfolio = getCurrentPortfolio();
    const portfolioId = portfolio.id;
    const type = $('input[name=type]:checked');
    const price = $("#price");
    const amount = $("#amount");

    const order = {
        portfolioId: portfolioId,
        companyId: companySelect.val(),
        type: type.val(),
        price: price.val(),
        amount: amount.val()
    }

    const url = "stock/regOrder";
    $.post(url, order, function () {
        window.location.href = 'overview.html';
    })

        .fail(function () {
            $("#error").html("Feil i db - prøv igjen senere");
        });
};