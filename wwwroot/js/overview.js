$(function () {
    getAllShareholdings();
    getAllActiveOrders();
});

function getAllPortfolios() {
    $.get("stock/getAllShareholdings", function (shareholdings) {
        formatShareholdings(shareholdings);
        
    });
}

function getAllPortfolios() {
    $.get("stock/getAllActiveOrders", function (activeOrders) {
        formatActiveOrders(activeOrders);

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
            "</tr>";
    }

    out += "<table>";
    $("#shareholdingContainer").html(out);

}

function formatActiveOrders(activeOrders) {
    let out = "<table class'table table-striped'>" +
        "<tr>" +
        "<th>Selskap</th><th>Type</th><th>Pris</th><th>Antall</th><th></th><th></th>" +
        "</tr>";
    for (let order of activeOrders) {
        out += "<tr>" +
            "<td>" + order.company + "</td>" +
            "<td>" + order.type + "</td>" +
            "<td>" + order.price + "</td>" +
            "<td>" + order.amount + "</td>" +
            "<td> <a class='btn btn-primary' href='change.html?id=" + order.id + "'>Endre</a></td>" +
            "<td> <button class='btn btn-danger' onclick='deleteOrder(" + order.id + ")'>Slett</Button></td>"
            "</tr>";
    }

    out += "<table>";
    $("#activeOrderContainer").html(out);
}