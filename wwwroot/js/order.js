
const companySelect = $("#companySelect");

$(function () {
    getAllCompanies();
});


function getAllCompanies() {
    $.get("stock/getAllCompanies", function (companies) {
        formatCompanies(companies);
    });
}

function formatCompanies(companies) {
    for (const company of companies) {
        companySelect
            .append($("<option></option>")
                .attr("value", company.id)
                .text(company.symbol + " - " + company.name));
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
    $.post(url, order, function (OK) {
        if (OK) {
            window.location.href = 'overview.html';
        }
        else {
            $("#error").html("Feil i db - prøv igjen senere");
        }
    });
}