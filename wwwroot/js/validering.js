var priceInput;
var amountInput;
var companySelectInput;
var priceError;
var amountError;
var error;
var ownedShareholdings;
var availableAmountOutput;


$(function () {
    priceInput = $("#price");
    amountInput = $("#amount");
    companySelectInput = $("#companySelect");
    priceError = $("#feilPris");
    amountError = $("#feilAntall");
    purchasingPower = $("#purchasingPower");
    error = $("#error");
    availableAmountOutput = $("#availableAmount");
});

function isBuyOrder() {
    const type = $('input[name=type]:checked').val();
    return type === "buy"; // Hvis typen er en kjøpsordre returnerer denne true

}

function validerPris() {
    const regexp = /^[0-9]{1,10}$/
    const ok = regexp.test(priceInput.val());

    if (!ok) {
        priceError.text("Pris må være et positivt tall");
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
        error.text("Selskap er ikke satt");
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
        setAvailableAmount();
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
    return true;
    const regexp = /^[0-9]{1,9}$/
    const ok = regexp.test(amountInput.val());
    if (!ok) {
        amountError.text("Antall må være et positivt tall");
        return false;
    }
    else {
        amountError.text("");
        return true;

    }

}

function setAvailableAmount() {
    const isSell = !isBuyOrder();
    const availableAmount = getAvailableAmount();
    console.log(isSell, availableAmount);

    if (availableAmount > 0 && isSell) {
        availableAmountOutput.text("Tilgjengelig antall: " + availableAmount);
    } else {
        availableAmountOutput.text("");
    }

}

function getAvailableAmount() {
    const companyId = Number(companySelectInput.val());
    if (!ownedShareholdings) {
        return 0;
    }

    for (var i = 0; i < ownedShareholdings.length; i++) {
        const shareholding = ownedShareholdings[i];
        if (shareholding.companyId === companyId) {
            return shareholding.remainingAmount;
        }
    }
    return 0;
}