$(function () {

    getAllCompanies();
    getAllTrades();
});

function getAllCompanies() {
    $.get("stock/getAllCompanies", function (companies) {
        formatCompanies(companies);

    });
}

function getAllTrades() {
    $.get("stock/getAllTrades", function (trades) {
        formatTrades(trades);
    });
}

function formatCompanies(companies) {
    let out = "<table class='table table-striped'>" +
        "<tr>" +
        "<th>Symbol</th><th>Navn</th><th>Max Pris</th><th>Minimum Pris</th><th></th>" +
        "</tr>";
    for (let company of companies) {
        out += "<tr>" +
            "<td>" + company.symbol + "</td>" +
            "<td>" + company.name + "</td>" +
            "<td>" + company.maxPrice + "</td>" +
            "<td> " + company.minPrice + "</td> " +
            "<td> <a class='btn btn-primary' href='order.html?id=" + company.id + "'>Kjøp</a></td>" +
            "</tr>";
    }

    out += "</table>";
    $("#companyContainer").html(out);
}

function formatTrades(trades) {
    let out = "<table class='table table-striped'>" +
        "<tr>" +
        "<th>Date</th><th>Company</th><th>Portfolio</th><th>Amount</th><th>Price</th>" +
        "</tr>";
    for (let trade of trades) {
        out += "<tr>" +
            "<td>" + trade.date + "</td>" +
            "<td>" + trade.companyName + "</td>" +
            "<td>" + trade.buyerPortfolioId + "</td>" +
            "<td>" + trade.amount + "</td>" +
            "<td>" + trade.price + "</td>" +
            "</tr>";
    }
    out += "</table>";
    $("#tradeContainer").html(out);
}