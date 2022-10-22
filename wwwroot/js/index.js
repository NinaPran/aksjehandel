function toOrder() {
    window.location.assign("order.html")
}

function toOverview() {
    window.location.href = "overview.html";
}

function onPortfolioReady() {
    $("#loading").hide();
    $("#mainContent").show();
}

onPortfolioReadyListener = onPortfolioReady;