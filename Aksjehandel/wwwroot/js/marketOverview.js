﻿// Innholdet i denne filen er basert på KundeApp fra ITPE3200-1 22H, OsloMet
$(function () {

    getAllOrders();
    getAllTrades();
});

function getAllOrders() {
    $.get("stock/getAllCompanies", function (companies) {
        formatOrders(companies);

    })
        .fail(function (returnError) {
            if (returnError.status == 401) {
                window.location.href = 'signIn.html'
            } else {
                $("#errorCompanies").html("Feil i db - prøv igjen senere");
            }
        });
}

function getAllTrades() {
    $.get("stock/getAllTrades", function (trades) {
        formatTrades(trades);
    })
        .fail(function (returnError) {
            if (returnError.status == 401) {
                window.location.href = 'signIn.html'
            } else {
                $("#errorTrades").html("Feil i db - prøv igjen senere");
            }
        });
}

function formatOrders(companies) {
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
        "<th>Dato</th><th>Selskap</th><th>Kjøper Portfolio</th><th>Selger Portfolio</th><th>Antall</th><th>Pris</th>" +
        "</tr>";
    for (let trade of trades) {
        out += "<tr>" +
            "<td>" + trade.date + "</td>" +
            "<td>" + trade.companyName + "</td>" +
            "<td>" + trade.buyerPortfolioId + "</td>" +
            "<td>" + trade.sellerPortfolioId + "</td>" +
            "<td>" + trade.amount + "</td>" +
            "<td>" + trade.price + "</td>" +
            "</tr>";
    }
    out += "</table>";
    $("#tradeContainer").html(out);
}