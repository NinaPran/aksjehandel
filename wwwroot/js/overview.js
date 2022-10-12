$(function () {
    onPortfolioChangeListener = onPortfolioChanged;
});

// Denne kalles når portefølgen er satt eller endret (f.eks fra dropdown menyen)
function onPortfolioChanged(portfolio) {
    $("#purchasingPower").html(portfolio.purchasingPower);
    // Legg inn getAll her for å filtrere på portfolio.id
    getAllShareholdings(portfolio.id);
    getAllOrders(portfolio.id);
    
}

function getAllShareholdings(portfolioId) {
    $.get("stock/getAllShareholdings?portfolioId="+portfolioId, function (shareholdings) {
        formatShareholdings(shareholdings);
        
    });
}

function getAllOrders(portfolioId) {
    $.get("stock/getAllOrders?portfolioId="+portfolioId, function (orders) {
        formatCompanies(orders);

    });
}


function formatShareholdings(shareholdings) {
    let out = "<table class'table table-striped'>" +
        "<tr>" +
        "<th>Selskap</th><th>Antall</th><th></th><th></th>" +
        "</tr>";
    for (let shareholding of shareholdings) {
        out += "<tr>" +
            "<td>" + shareholding.company + "</td>" +
            "<td>" + shareholding.amount + "</td>" +
            "<td> <a class='btn btn-primary' href='order.html?id=" + shareholding.id + "&type=buy'>Kjøp</a></td>" +
            "<td> <a class='btn btn-primary' href='order.html?id=" + shareholding.id + "&type=sell'>Salg</a></td>" +
            "</tr>";
    }

    out += "<table>";
    $("#shareholdingContainer").html(out);

}

function formatCompanies(orders) {
    let out = "<table class'table table-striped'>" +
        "<tr>" +
        "<th>Selskap</th><th>Type</th><th>Pris</th><th>Antall</th><th></th><th></th>" +
        "</tr>";
    for (let order of orders) {
        out += "<tr>" +
            "<td>" + order.companyName + "</td>" +
            "<td>" + order.type + "</td>" +
            "<td>" + order.price + "</td>" +
            "<td>" + order.amount + "</td>" +
            "<td> <a class='btn btn-primary' href='change.html?id=" + order.id + "'>Endre</a></td>" +
            "<td> <button class='btn btn-danger' onclick='deleteOrder(" + order.id + ")'>Slett</Button></td>"
            "</tr>";
    }

    out += "<table>";
    $("#orderContainer").html(out);
}

function deleteOrder(id) {
    const url = "stock/deleteOrder?id=" + id;
    $.get(url, function (OK) {
        if (OK) {
            window.location.href = 'overview.html';
        }
        else {
            $("#feil").html("Feil i db - prøv igjen senere");
        }

    });
};