$(function () {

    getAllOrders();
});

function getAllOrders() {
    $.get("stock/getAllCompanies", function (companies) {
        formatCompanies(companies);

    });
}

function formatCompanies(companies) {
    let out = "<table class='table table-striped'>" +
        "<tr>" +
        "<th>Symbol</th><th>Navn</th><th></th><th></th>" +
        "</tr>";
    for (let company of companies) {
        out += "<tr>" +
            "<td>" + company.symbol + "</td>" +
            "<td>" + company.name + "</td>" +
            "<td> <a class='btn btn-primary' href='order.html?id=" + company.id + "'>Kjøp</a></td>" +
        "</tr>";
    }

    out += "</table>";
    $("#companyContainer").html(out);
}