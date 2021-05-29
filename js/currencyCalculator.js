var wartosc = 0;
let zeruj = false;
let przelicz = true;
let mnoznikPLN = 1;

//Wciśnięcie przycisku
function onButton(e) {
    var btn = e.target || e.srcElement;
    var action = document.getElementById(btn.id).innerHTML;
    var res = document.getElementById('res');

    if (zeruj && przelicz) {
        res.innerHTML = wartosc;
        zeruj = false;
    }

    switch (action) {
        case 'C':
            res.innerHTML = '';
            wartosc = '';
            przelicz = true;
            break;
        case 'PRZELICZ':
            if (przelicz) {

                wartosc = res.innerHTML;
                wartosc = Number(wartosc);
                if (wartosc == '') wartosc = 0;

                let zloty = wartosc * mnoznikPLN;

                let mnoznik = selectCurrency.value;
                res.innerHTML = wartosc + ' [PLN] = ' + Math.round(wartosc / (mnoznikPLN / mnoznik) * 100) / 100 + ' [' + selectCurrency.options[selectCurrency.selectedIndex].text + '] ';

                zeruj = true;
                przelicz = false
            }
            break;
        default:
            if (zeruj) {
                res.innerHTML = "";
            }
            res.innerHTML += action;
            wartosc = res.innerHTML;
            przelicz = true;
            break;
    }
}
//Dodanie metody onclick dla przycisków
var buttons = document.getElementsByTagName('button');
for (let button of buttons) {
    button.onclick = onButton;
}

//Wgrywanie pliku eurofxref-daily.xml z katalogu głównego
let xmlContent = '';
let selectCurrency = document.getElementById('currences');

fetch('eurofxref-daily.xml').then((response) => {
    response.text().then((xml) => {
        xmlContent = xml;
        //Uruchomienie parsera
        let parser = new DOMParser();
        let xmlDOM = parser.parseFromString(xmlContent, 'application/xml');
        let currences = xmlDOM.querySelectorAll('Cube[currency]');
        //Pętla wczytująca każdego noda dla waluty
        currences.forEach(currencyXmlNode => {
            let currency = document.createElement('option');
            currency.innerText = currencyXmlNode.getAttribute('currency');
            let rate = currencyXmlNode.getAttribute('rate');
            //Zapamiętanie mnożnika dla PLN
            if (currency.innerText == 'PLN') mnoznikPLN = rate;

            currency.setAttribute("value", rate);
            //Dodanie dziecka do DOM-u
            selectCurrency.appendChild(currency);
        });
    });
});

//Nasłuch zmiany w menu select
selectCurrency.addEventListener("change", function () {
    przelicz = true;
});
