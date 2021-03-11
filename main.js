
const defaultCountryColor = "#CCCCCC"

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

    //Question 10 - highlight same speaking countries in green on the world map

    resetMap() //First we reset the map (colors, legends)

    const sameSpeakingCodes = xmlDocument.evaluate("//country[languages/descendant::* = //country[country_codes/cca2 = '" + countryCode + "']/languages/descendant::*]/country_codes/cca2", xmlDocument)
    let sameSpeakingCode = sameSpeakingCodes.iterateNext();
    while (sameSpeakingCode) {
        const countrySvgPath = window.document.getElementById(sameSpeakingCode.textContent)
        if(countrySvgPath != null) {
            countrySvgPath.style.fill = "green"
        }
        sameSpeakingCode = sameSpeakingCodes.iterateNext()
    }
}

function button4() {

    const svgFile = chargerHttpXML("exemple.svg")

    let svgRender = window.document.getElementById("example-svg-render")
    const svgElement = svgFile.getElementById("lesFormes")
    svgRender.innerHTML = new XMLSerializer().serializeToString(svgElement)


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
    const mapRender = window.document.getElementById("country-map-render")
    mapRender.innerHTML = new XMLSerializer().serializeToString(svgFile.getElementsByTagName("svg")[0])
}

function button7() {
    const mapRender = window.document.getElementById("country-map-render")
    const paths = mapRender.getElementsByTagName("path");

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
        const codes = xmlDocument.evaluate("//country/country_codes/cca2", xmlDocument)
        let code = codes.iterateNext();
        while (code) {
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

/**
 * Gini coefficient
 */
async function button11() {
    resetMap()
    const mapLegend = window.document.getElementById("country-map-legend-gini")
    mapLegend.style.display = "block"

    let results = await fetch("https://restcountries.eu/rest/v2/all?fields=alpha2Code;gini")
        .then(response => response.json())

    for(let i = 0; i < results.length; i++) {
        const result = results[i]
        const gini = result.gini
        const code = result.alpha2Code
        const countryPath = window.document.getElementById(code)
        if(gini != null) countryPath.style.fill = giniColor(gini)
    }

}

/**
 * Water recommendations
 */
async function button12() {
    resetMap()
    const mapLegend = window.document.getElementById("country-map-legend-water")
    mapLegend.style.display = "block"
    let countries = await fetch("https://travelbriefing.org/countries.json")
        .then(response => response.json())


    const mapRender = window.document.getElementById("country-map-render")
    const paths = mapRender.getElementsByTagName("path")
    for(let path of paths) {
        let results = await fetch("https://travelbriefing.org/" + path.id + "?format=json")
            .then(response => response.json())
        let water = results.water.short
        if(water != null) path.style.fill = waterColor(water)
    }

}

function waterColor(water) {
    if(water === "not safe") return "#000000"
    else if(water === "not recommended") return "#d2d22e"
    else if(water === "safe") return "#108110"
    else return defaultCountryColor
}

/**
 * Population density
 */
async function button13() {
    resetMap()
    const mapLegend = window.document.getElementById("country-map-legend-density")
    mapLegend.style.display = "block"

    let results = await fetch("https://restcountries.eu/rest/v2/all?fields=alpha2Code;population;area")
        .then(response => response.json())

    for(let i = 0; i < results.length; i++) {
        const result = results[i]
        const population = result.population
        const area = result.area
        const code = result.alpha2Code
        const density = population / area
        //Linear gradient for the color based on the computed density
        //Min - 241, 227, 216 -> 38, 24, 13
        const colorRed = 241 - (203 * (density / 300.0))
        const colorGreen = 227 - (203 * (density / 300.0))
        const colorBlue = 216 - (203 * (density / 300.0))

        const countryPath = window.document.getElementById(code)
        if(countryPath != null) {
            countryPath.style.fill = "rgb(" + colorRed + ", " + colorGreen + ", " + colorBlue + ")"
        }
    }

}

function giniColor(gini) {
    if(gini > 0 && gini <= 25) return "#ACE8DA"
    else if(gini <= 45) return "#00BFAC"
    else if(gini <= 60) return "#00726A"
    else return "#003135"
}

function formsElementClicked(event) {
    window.alert(event.target.getAttribute("title"))
}

function mapElementClicked(event) {
    window.alert(event.target.getAttribute("countryname"))
}

let lastColor = defaultCountryColor

//Display nom, capitale et drapeau dans un tableau au dessus de la carte
async function countryOver(event) {
    lastColor = event.target.style.fill
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
    event.target.style.fill = lastColor
}

function resetMap() {
    //Clear legend
    const mapLegendGini = window.document.getElementById("country-map-legend-gini")
    const mapLegendWater = window.document.getElementById("country-map-legend-water")
    const mapLegendDensity = window.document.getElementById("country-map-legend-density")
    mapLegendGini.style.display = "none"
    mapLegendWater.style.display = "none"
    mapLegendDensity.style.display = "none"
    //Clear map colors
    const mapRender = window.document.getElementById("country-map-render")
    const paths = mapRender.getElementsByTagName("path")
    for(let path of paths) {
        path.style.fill = defaultCountryColor
    }
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