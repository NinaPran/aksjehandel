const portfolioDropDown = $("#portfolioDropDown");

$(function () {
    getAllPortfolios();
});


function getAllPortfolios() {
    $.get("stock/getAllPortfolios", function (portfolios) {
        formatPortfolios(portfolios);
    });
}

function formatPortfolios(portfolios) {
    for (const portfolio of portfolios) {
        portfolioDropDown
            .append($("<option></option>")
                .attr("value", portfolio.displayName)
                .text(portfolio.displayName));
    }
}

