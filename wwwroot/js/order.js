

function regOrder() {
    const portfolio = getCurrentPortfolio();
    const company = $("#company");
    const type = $('input[name=type]:checked');
    const price = $("#price");
    const amount = $("#amount");

    const order = {
        portfolio: portfolio,
        company: company.val(),
        type: type.val(),
        price: price.val(),
        amount: amount.val()
    }

    const url = "stock/regOrder";
    $.post(url, order, function (OK) {
        if (OK) {
            window.location.href = 'index.html';
        }
        else {
            $("#error").html("Feil i db - prøv igjen senere");
        }
    });
}