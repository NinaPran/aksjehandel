var priceInput;
var amountInput;
var companySelectInput;
var priceError;
var amountError;
var error;
var ownedShareholdings


$(function () {
    priceInput = $("#price");
    amountInput = $("#amount");
    companySelectInput = $("#companySelect");
    priceError = $("#feilPris");
    amountError = $("#feilAntall");
    purchasingPower = $("#purchasingPower");
    error = $("#error");
});

function isBuyOrder() {
    const type = $('input[name=type]:checked').val();
    return type === "buy"; // Hvis typen er en kjøpsordre returnerer denne true

}

function validerPris() {
    const regexp = /^[0-9]{2,8}$/
    const ok = regexp.test(priceInput.val());

    if (!ok) {
        priceError.text("Pris må være beløp mellom 10 og 99999999");
        return false;
    }
    else {
        priceError.text("");
        return true;
    }
}

function validateOrder() {
    if (!getCurrentPortfolio()) {
        error.text("Portfolio er ikke satt");
        return false;
    }
    if (companySelectInput.val() === null) {
        error.text("Company er ikke satt");
        return false;
    }
    if (!validerAntall() || !validerPris()) {
        error.text("Pris eller antall er ikke gyldig");
        return false;
    }
    if (isBuyOrder()) {
        if (!validateEnoughPurchasePower()) {
            error.text("Det disponible beløpet dekker ikke kjøpet, vennligst endre pris eller antall");
            return false;
        }
    } else {
        if (!validateEnoughStocks()) {
            error.text("Antall aksjer til dispoisjon for salg dekker ikke antall forsøkt solgt, vennligst endre antall");
            return false;
        }
    }    
    error.text("");
    return true;
}

function validateEnoughPurchasePower() {
    var purchasePower = Number(purchasingPower.text());
    var price = Number(priceInput.val());
    var amount = Number(amountInput.val());
    if ((purchasePower - (price * amount) < 0)) {
        return false;
    } else {
        return true;
    }
}

function getOwnedShareholdings(portfolioId) {
    ownedShareholdings = null;
    $.get("stock/getAllShareholdings?portfolioId=" + portfolioId, function (shareholdings) {
        ownedShareholdings = shareholdings;

    });
    

}

function validateEnoughStocks() {
    const companyId = Number(companySelectInput.val());
    const amountSell = amountInput.val();
    if (!ownedShareholdings) {
        return false;
    }

    for (var i = 0; i < ownedShareholdings.length; i++) {
        const shareholding = ownedShareholdings[i];
        if (shareholding.companyId === companyId) {            
            return amountSell <= shareholding.remainingAmount;
        }
    }
    return false;

    
}

function validerAntall() {
    const regexp = /^[0-9]{1,8}$/
    const ok = regexp.test(amountInput.val());
    if (!ok) {
        amountError.text("Antall må være mellom 1 og 99999999");
        return false;
    }
    else {
        amountError.text("");
        return true;

    }

    /*
       function validerPortfolio(portfolio) {
           var portfolio = regOrder.getElementById("portfolioSelect"),
               validationButton = regOrder.getElementById('portfolioSelect');
   
           validationButton.addEventListener('click', function (e) {
               var selectedValue = portfolio.options[portfolio.selectedIndex] ? portfolio.options[portfolio.selectedIndex].value : null;
   
               if (!selectedValue) {
                   $("#feilPortfolio").val("Du må velge en portefølje");
               } else {
                   $("#feilPortfolio").val("");
                   return true;
               }
           });
   
   */

}