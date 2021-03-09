function button1() {
    const body = window.document.body
    body.style.backgroundColor = "blue"
    const button1 = window.document.getElementById("myButton1")
    button1.style.color = "white"
}

function button2() {
    const body = window.document.body
    body.style.backgroundColor = "white"
}

function button3() {
    const countryCode = window.document.getElementById("myText1").value

    const xslt = chargerHttpXML("cherchePays.xsl")

    const xsltProcessor = new XSLTProcessor()
    xsltProcessor.importStylesheet(xslt)
    xsltProcessor.setParameter(null, "countryCode", countryCode)

    const xmlDocument = chargerHttpXML("countriesTP.xml")
    const styledCountry = xsltProcessor.transformToDocument(xmlDocument)

    const div3 = window.document.getElementById("button3-render")
    div3.replaceWith(styledCountry.getElementById("button3-render"))

}

function button4() {

    const svgFile = chargerHttpXML("exemple.svg")

    const svgHTML = svgFile.getElementById("lesFormes")
    window.document.body.appendChild(svgHTML)

}

function button5() {
    const svgHTML = window.document.getElementById("lesFormes")
    const group = svgHTML.getElementsByTagName("g")[0]
    if (group != null) {
        const children = group.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            child.addEventListener("click", formsElementClicked, false)
        }
    }
}

function button6() {

    const svgFile = chargerHttpXML("worldHigh.svg")
    window.document.body.appendChild(svgFile.getElementsByTagName("svg")[0])

}

function button7() {
    const paths = window.document.getElementsByTagName("path")
    if (paths != null) {
        for (let i = 0; i < paths.length; i++) {
            const child = paths[i];
            child.addEventListener("click", mapElementClicked, false)
        }
    }
}

function button8() {
    const paths = window.document.getElementsByTagName("path")
    if (paths != null) {
        for (let i = 0; i < paths.length; i++) {
            const child = paths[i];
            child.addEventListener("mouseover", countryOver, false)
            child.addEventListener("mouseleave", countryLeft, false)
        }
    }
}

let listPopulated = false

function button9() {
    if (!listPopulated) {
        //Population datalist for autocomplete
        const countryDatalist = window.document.getElementById("country-list")
        const xmlDocument = chargerHttpXML("countriesTP.xml")
        const codes = document.evaluate("//country/country_codes/cca2", xmlDocument)
        let code = codes.iterateNext();
        while (code) {
            console.log(code.textContent)
            const option = document.createElement("OPTION")
            option.value = code.textContent
            countryDatalist.appendChild(option)
            code = codes.iterateNext()
        }
        listPopulated = true
    }
}

let currencyEnabled = false

function button10() {
    currencyEnabled = !currencyEnabled
}

function formsElementClicked(event) {
    window.alert(event.target.getAttribute("title"))
}

function mapElementClicked(event) {
    window.alert(event.target.getAttribute("countryName"))
}

//Display nom, capitale et drapeau dans un tableau au dessus de la carte
async function countryOver(event) {
    //Visual
    event.target.style.fill = "red"

    //Table update
    const countryCode = event.target.id

    const xslt = chargerHttpXML("donneesPays.xsl")

    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xslt)
    xsltProcessor.setParameter(null, "countryCode", countryCode)
    xsltProcessor.setParameter(null, "countryCodeLowerCase", countryCode.toLowerCase())
    xsltProcessor.setParameter(null, "currencyInfo", currencyEnabled)
    if (currencyEnabled) {
        const result = await fetch("https://restcountries.eu/rest/v2/alpha/" + countryCode + "?fields=currencies")
            .then(response => response.json())
            .then(currenciesArray => currenciesArray.currencies[0])
        xsltProcessor.setParameter(null, "currencyValue", result.name + " " + result.symbol)
    }

    const xmlDocument = chargerHttpXML("countriesTP.xml")
    const styledCountryTable = xsltProcessor.transformToDocument(xmlDocument)

    const divCountryDataRender = window.document.getElementById("country-data-render")
    divCountryDataRender.replaceWith(styledCountryTable.getElementById("country-data-render"))
}

function countryLeft(event) {
    event.target.style.fill = "#CCCCCC"
}

//charge le fichier XML se trouvant à l'URL relative donné dans le paramètreet le retourne
function chargerHttpXML(xmlDocumentUrl) {
    let httpAjax;

    httpAjax = window.XMLHttpRequest ?
        new XMLHttpRequest() :
        new ActiveXObject('Microsoft.XMLHTTP');

    if (httpAjax.overrideMimeType) {
        httpAjax.overrideMimeType('text/xml');
    }

    //chargement du fichier XML à l'aide de XMLHttpRequest synchrone (le 3° paramètre est défini à false)
    httpAjax.open('GET', xmlDocumentUrl, false);
    httpAjax.send();

    return httpAjax.responseXML;
}