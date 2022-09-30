const portfolioSelect = $("#portfolioSelect");
const SELECTEDPORTFOLIOKEY = "selected-portfolio";
let allPortfolios;
let currentPortfolioId = -1;
let currentPortfolio;
const portfolioListeners = [];

$(function () {
    getAllPortfolios();
});


function getAllPortfolios() {
    $.get("stock/getAllPortfolios", function (portfolios) {
        allPortfolios = portfolios;
        formatPortfolios(portfolios);
        loadSelectePortfolio();
        portfolioSelect.change(setSelectedPortfolio);
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


function setSelectedPortfolio() {
    currentPortfolioId = portfolioSelect.val();    
    currentPortfolio = getPortfolioFromId(currentPortfolioId);
    window.localStorage.setItem(SELECTEDPORTFOLIOKEY, currentPortfolioId);
    notifyPortfolioListeners();

}

function loadSelectePortfolio() {
    const portfolioId = window.localStorage.getItem(SELECTEDPORTFOLIOKEY);
    if (portfolioId >= 0) {
        currentPortfolioId = portfolioId;
        currentPortfolio = getPortfolioFromId(currentPortfolioId);
        portfolioSelect.val(currentPortfolioId);
        notifyPortfolioListeners();
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

// Brukes for å registrere funksjoner som kalles med nåværende portefølge hver gang den endres
function addPortfolioListener(listener) {
    portfolioListeners.push(listener);
}

// Kaller alle registrerte listeners som funksjoner og sender med currentPortfolio
// Vi trenger dette fordi portfolio ikke er klar ved ready og fordi den kan endre seg underveis
function notifyPortfolioListeners() {
    portfolioListeners.forEach(listener => {
        listener(currentPortfolio);
    })
}
