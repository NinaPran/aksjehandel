function validerPris(pris) {
    const regexp = /^[0-9]{2,8}$/
    const ok = regexp.test(pris);
    if (!ok) {
        $("#feilPris").html("Pris må være beløp mellom 10 og 99999999");
        return false;
    }
    else {
        $("#feilPris").html("");
        return true;
    }
}

function validerAntall(antall) {
    const regexp = /^[0-9]{1,8}$/
    const ok = regexp.test(antall);
    if (!ok) {
        $("#feilAntall").html("Antall må være mellom 1 og 99999999");
        return false;
    }
    else {
        $("#feilAntall").html("");
        return true;
    }
}