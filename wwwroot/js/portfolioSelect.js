const portfolioSelect = $("#portfolioSelect");
const SELECTEDPORTFOLIOKEY = "selected-portfolio";
let currentPortfolio = '';

$(function () {
    getAllPortfolios();
});


function getAllPortfolios() {
    $.get("stock/getAllPortfolios", function (portfolios) {
        formatPortfolios(portfolios);
        loadSelectePortfolio();
        portfolioSelect.change(saveSelectedPortfolio);
    });
}

function formatPortfolios(portfolios) {
    for (const portfolio of portfolios) {
        portfolioSelect
            .append($("<option></option>")
                .attr("value", portfolio.displayName)
                .text(portfolio.displayName));
    }
}


function saveSelectedPortfolio() {
    currentPortfolio = portfolioSelect.val();
    window.localStorage.setItem(SELECTEDPORTFOLIOKEY, currentPortfolio);
}

function loadSelectePortfolio() {
    const portfolio = window.localStorage.getItem(SELECTEDPORTFOLIOKEY);
    if (portfolio) {
        currentPortfolio = currentPortfolio;
        portfolioSelect.val(portfolio);
    }
}

function getCurrentPortfolio() {
    return currentPortfolio;
}
