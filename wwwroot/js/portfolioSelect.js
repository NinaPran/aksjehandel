const portfolioSelect = $("#portfolioSelect");
const SELECTEDPORTFOLIOKEY = "selected-portfolio";
let allPortfolios;
let currentPortfolioId = -1;
let currentPortfolio;

$(function () {
    getAllPortfolios();
});


function getAllPortfolios() {
    $.get("stock/getAllPortfolios", function (portfolios) {
        allPortfolios = portfolios;
        formatPortfolios(portfolios);
        loadSelectePortfolio();
        portfolioSelect.change(saveSelectedPortfolio);
    });
}

function formatPortfolios(portfolios) {
    for (const portfolio of portfolios) {
        portfolioSelect
            .append($("<option></option>")
                .attr("value", portfolio.id)
                .text(portfolio.displayName));
    }
}


function saveSelectedPortfolio() {
    currentPortfolioId = portfolioSelect.val();    
    currentPortfolio = getPortfolioFromId(currentPortfolioId);
    window.localStorage.setItem(SELECTEDPORTFOLIOKEY, currentPortfolioId);
}

function loadSelectePortfolio() {
    const portfolioId = window.localStorage.getItem(SELECTEDPORTFOLIOKEY);
    if (portfolioId >= 0) {
        currentPortfolioId = portfolioId;
        currentPortfolio = getPortfolioFromId(currentPortfolioId);
        portfolioSelect.val(currentPortfolioId);
    }
}

function getPortfolioFromId(id) {
    // returnerer første portfolio som matcher id
    return allPortfolios.find((portfolio) => { return portfolio.id == id });
}

function getPortfolioId() {
    return currentPortfolioId
}

function getCurrentPortfolio() {
    return currentPortfolio;
}
