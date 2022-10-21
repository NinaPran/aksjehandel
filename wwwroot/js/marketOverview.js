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
        "<th>Symbol</th><th>Navn</th><th></th><th></th><th></th>" +
        "</tr>";
    for (let company of companies) {
        out += "<tr>" +
            "<td>" + company.symbol + "</td>" +
            "<td>" + company.name + "</td>" +
            "<td> <a class='btn btn-primary' href='order.html?id=" + company.id + "'>Kjøp</a></td>" +
            "<th></th><th></th>" +
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