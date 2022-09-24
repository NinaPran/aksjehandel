$(function () {
    getAllShareholdings();
    getAllOrders();
});

function getAllShareholdings() {
    $.get("stock/getAllShareholdings", function (shareholdings) {
        formatShareholdings(shareholdings);
        
    });
}

function getAllOrders() {
    $.get("stock/getAllOrders", function (orders) {
        formatOrders(orders);

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

function formatOrders(orders) {
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