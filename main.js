
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

    const button = window.document.getElementById("myButton4")
    button.classList.add("button-enabled")

}

function button5() {
    const svgHTML = window.document.getElementById("lesFormes")
    if(svgHTML != null) {
        const group = svgHTML.getElementsByTagName("g")[0]
        if (group != null) {
            const button = window.document.getElementById("myButton5")
            button.classList.add("button-enabled")
            const children = group.children;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                child.addEventListener("click", formsElementClicked, false)
            }
        }
    }
}

function button6() {
    const button = window.document.getElementById("myButton6")
    button.classList.add("button-enabled")
    const svgFile = chargerHttpXML("worldHigh.svg")
    const mapRender = window.document.getElementById("country-map-render")
    mapRender.innerHTML = new XMLSerializer().serializeToString(svgFile.getElementsByTagName("svg")[0])
}

function button7() {
    const mapRender = window.document.getElementById("country-map-render")
    const paths = mapRender.getElementsByTagName("path");

    if (paths != null) {
        if(paths.length > 0) { //Check if the map was activated before hence paths length > 0
            const button = window.document.getElementById("myButton7")
            button.classList.add("button-enabled")
        }
        for (let i = 0; i < paths.length; i++) {
            const child = paths[i];
            child.addEventListener("click", mapElementClicked, false)
        }
    }
}

function button8() {
    const mapRender = window.document.getElementById("country-map-render")
    const paths = mapRender.getElementsByTagName("path");
    if (paths != null) {
        if(paths.length > 0) { //Check if the map was activated before hence paths length > 0
            const button = window.document.getElementById("myButton8")
            button.classList.add("button-enabled")
        }
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
        const button = window.document.getElementById("myButton9")
        button.classList.add("button-enabled")
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
    if(currencyEnabled) {
        const button = window.document.getElementById("myButton10")
        button.classList.add("button-enabled")
    } else {
        const button = window.document.getElementById("myButton10")
        button.classList.remove("button-enabled")
    }
}

/**
 * Gini coefficient
 */
async function button11() {
    resetMap()
    waterEnabled = false;
    const mapLegend = window.document.getElementById("country-map-legend-gini")
    mapLegend.style.display = "block"

    let results = await fetch("https://restcountries.eu/rest/v2/all?fields=alpha2Code;gini")
        .then(response => response.json())

    for(let i = 0; i < results.length; i++) {
        const result = results[i]
        const gini = result.gini
        const code = result.alpha2Code
        const countryPath = window.document.getElementById(code)
        if(countryPath != null) countryPath.style.fill = giniColor(gini)
    }

    //Handle button activation
    const buttonGini = window.document.getElementById("myButton11")
    buttonGini.classList.add("button-enabled")
    const buttonWater = window.document.getElementById("myButton12")
    buttonWater.classList.remove("button-enabled")
    const buttonDensity = window.document.getElementById("myButton13")
    buttonDensity.classList.remove("button-enabled")

}

let waterEnabled = false;
/**
 * Water recommendations
 */
async function button12() {
    //Reset map before drawing
    resetMap()

    //Set the water drawing process as enabled
    waterEnabled = true;

    //Handle button activation
    const buttonGini = window.document.getElementById("myButton11")
    buttonGini.classList.remove("button-enabled")
    const buttonWater = window.document.getElementById("myButton12")
    buttonWater.classList.add("button-enabled")
    const buttonDensity = window.document.getElementById("myButton13")
    buttonDensity.classList.remove("button-enabled")

    //Button proccess
    const mapLegend = window.document.getElementById("country-map-legend-water")
    mapLegend.style.display = "block"
    let countries = await fetch("https://travelbriefing.org/countries.json")
        .then(response => response.json())


    const mapRender = window.document.getElementById("country-map-render")
    const paths = mapRender.getElementsByTagName("path")

    const promises = new Map()

    //Send queries in parallel
    for(let path of paths) {
        promises.set(path, fetch("https://travelbriefing.org/" + path.id + "?format=json")
            .then(response => response.json()))
    }
    const keys = promises.keys()
    let key = keys.next()
    while(!key.done && waterEnabled) {
        const path = key.value
        const promise = await promises.get(path)
        if(promise != null) {
            let water = promise.water.short
            if(water != null) path.style.fill = waterColor(water)
        }
        key = keys.next()
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
    waterEnabled = false;
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

    //Handle button activation
    const buttonGini = window.document.getElementById("myButton11")
    buttonGini.classList.remove("button-enabled")
    const buttonWater = window.document.getElementById("myButton12")
    buttonWater.classList.remove("button-enabled")
    const buttonDensity = window.document.getElementById("myButton13")
    buttonDensity.classList.add("button-enabled")

}

let avgTemperatureEnabled = false
let hourEnabled = false

function button14() {
    avgTemperatureEnabled = !avgTemperatureEnabled
    //If enabled, disable collisions (only one at once for CORS header missing websites)
    if(avgTemperatureEnabled) {
        hourEnabled = false
        const buttonTime = window.document.getElementById("myButton15")
        buttonTime.classList.remove("button-enabled")

        const button = window.document.getElementById("myButton14")
        button.classList.add("button-enabled")
    } else {
        const button = window.document.getElementById("myButton14")
        button.classList.remove("button-enabled")
    }
}

function button15() {
    hourEnabled = !hourEnabled
    //If enabled, disable collisions (only one at once for CORS header missing websites)
    if(hourEnabled) {
        avgTemperatureEnabled = false
        const button = window.document.getElementById("myButton14")
        button.classList.remove("button-enabled")

        const buttonTime = window.document.getElementById("myButton15")
        buttonTime.classList.add("button-enabled")

    } else {
        const button = window.document.getElementById("myButton15")
        button.classList.remove("button-enabled")
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

    const xsltProcessor = new XSLTProcessor()
    xsltProcessor.importStylesheet(xslt)
    xsltProcessor.setParameter(null, "countryCode", countryCode)
    xsltProcessor.setParameter(null, "countryCodeLowerCase", countryCode.toLowerCase())
    xsltProcessor.setParameter(null, "currencyInfo", currencyEnabled)
    xsltProcessor.setParameter(null, "dateTimeInfo", hourEnabled)
    xsltProcessor.setParameter(null, "avgTempInfo", avgTemperatureEnabled)
    if (currencyEnabled) {
        const result = await fetch("https://restcountries.eu/rest/v2/alpha/" + countryCode + "?fields=currencies")
            .then(response => response.json())
            .then(currenciesArray => currenciesArray.currencies[0])
        xsltProcessor.setParameter(null, "currencyValue", result.name + " " + result.symbol)
    }
    if (avgTemperatureEnabled) {
        let result = await fetch("https://travelbriefing.org/" + countryCode + "?format=json")
            .then(response => response.json())
            let weather = result.weather
            var avgTemp = 0
            for (const month in weather) {
                avgTemp += parseFloat(weather[month]['tAvg'])
            }
            avgTemp /= 12
            xsltProcessor.setParameter(null, "avgTempValue", avgTemp)
    }
    if (hourEnabled) {
        const result = await fetch("https://travelbriefing.org/" + countryCode + "?format=json")
            .then(response => response.json())
        const timezone = result.timezone.name
        const timezoneapi = await fetch("https://worldtimeapi.org/api/timezone/"+ timezone)
            .then(response => response.json())
        const date_time = timezoneapi.datetime
        const date = date_time.substring(0,9)
        const time = date_time.substring(11,19)

        xsltProcessor.setParameter(null, "dateTimeValue", date + " " + time)
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