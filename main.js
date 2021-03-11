
const defaultCountryColor = "#CCCCCC"

/**
 * Button 1 ocean background and button 1 white text
 */
function button1() {
    //Button text color
    const button1 = window.document.getElementById("myButton1")
    button1.style.color = "white"
    //Body
    const body = window.document.body
    body.style.backgroundColor = "#92B4F2"

    //Extra colored div containing the map
    const mapContainer = window.document.getElementById("map-container")
    mapContainer.style.backgroundColor = "#92B4F2"
}

/**
 * Button 2 reset background
 */
function button2() {
    //Body
    const body = window.document.body
    body.style.backgroundColor = "white"

    //Extra colored div containing the map
    const mapContainer = window.document.getElementById("map-container")
    mapContainer.style.backgroundColor = "#F9F9FB"
}

/**
 * Button 3 - country infos with CCA2 code input (official name and capital) and highlight
 * the same speaking countries in the world map if enabled
 */
function button3() {
    waterEnabled = false //Disable async water processing

    //Get the user's code input
    const countryCode = window.document.getElementById("myText1").value

    //Load XML and XSL and process them with AJAX
    const xslt = chargerHttpXML("cherchePays.xsl")

    const xsltProcessor = new XSLTProcessor()
    xsltProcessor.importStylesheet(xslt)
    xsltProcessor.setParameter(null, "countryCode", countryCode)

    const xmlDocument = chargerHttpXML("countriesTP.xml")
    const styledCountry = xsltProcessor.transformToDocument(xmlDocument)

    //Render the result
    const div3 = window.document.getElementById("button3-render")
    div3.replaceWith(styledCountry.getElementById("button3-render"))

    //Question 10 - highlight same speaking countries in green on the world map

    resetMap() //First we reset the map (colors, legends)

    //Query the same speaking countries in XPath
    const sameSpeakingCodes = xmlDocument.evaluate("//country[languages/descendant::* = //country[country_codes/cca2 = '" + countryCode + "']/languages/descendant::*]/country_codes/cca2", xmlDocument)

    //Iterate and render on the world map (if displayed otherwise null and not rendered)
    let sameSpeakingCode = sameSpeakingCodes.iterateNext();
    while (sameSpeakingCode) {
        const countrySvgPath = window.document.getElementById(sameSpeakingCode.textContent)
        if(countrySvgPath != null) {
            countrySvgPath.style.fill = "green"
        }
        sameSpeakingCode = sameSpeakingCodes.iterateNext()
    }
}

/**
 * Button 4 display the example.svg
 */
function button4() {

    //Load the SVG with AJAX
    const svgFile = chargerHttpXML("exemple.svg")

    let svgRender = window.document.getElementById("example-svg-render")
    const svgElement = svgFile.getElementById("lesFormes")

    //Serialize it and edit the innerHTML of the render zone
    svgRender.innerHTML = new XMLSerializer().serializeToString(svgElement)

    //Handle button activation
    const button = window.document.getElementById("myButton4")
    button.classList.add("button-enabled")

}

/**
 * Button 5 clickable example.svg elements to display their title attribute
 */
function button5() {
    const svgHTML = window.document.getElementById("lesFormes")
    if(svgHTML != null) {
        const group = svgHTML.getElementsByTagName("g")[0]

        if (group != null) {
            //Handle button activation (svg must be rendered first)
            const button = window.document.getElementById("myButton5")
            button.classList.add("button-enabled")

            //Iterate through the group children (must be the paths) and add a click event listener
            const children = group.children;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                child.addEventListener("click", shapeElementClicked, false)
            }
        }

    }
}

/**
 * Button 6 display the world map svg
 */
function button6() {
    //Handle button activation
    const button = window.document.getElementById("myButton6")
    button.classList.add("button-enabled")

    //Load svg with AJAX
    const svgFile = chargerHttpXML("worldHigh.svg")

    //Serialize it and edit the innerHTML of the render zone
    const mapRender = window.document.getElementById("country-map-render")
    mapRender.innerHTML = new XMLSerializer().serializeToString(svgFile.getElementsByTagName("svg")[0])
}

/**
 * Button 7 make the world map elements hence countries clickable
 */
function button7() {
    //Get the paths (countries)
    const mapRender = window.document.getElementById("country-map-render")
    const paths = mapRender.getElementsByTagName("path");

    //Check if the map is activated hence paths length > 0
    if (paths != null && paths.length > 0) {
        //Handle button activation
        const button = window.document.getElementById("myButton7")
        button.classList.add("button-enabled")

        //Iterate the paths and add the click event listener
        for (let i = 0; i < paths.length; i++) {
            const child = paths[i];
            child.addEventListener("click", mapElementClicked, false)
        }
    }
}

/**
 * Button 8 mouse enter and leave the map elements (countries)
 */
function button8() {
    const mapRender = window.document.getElementById("country-map-render")
    const paths = mapRender.getElementsByTagName("path");
    //Check if the map was activated before hence paths length > 0
    if (paths != null && paths.length > 0) {
        //Handle button activation
        const button = window.document.getElementById("myButton8")
        button.classList.add("button-enabled")

        //Iterate through the children and add the mouseover/mouseleave events listeners
        for (let i = 0; i < paths.length; i++) {
            const child = paths[i];
            child.addEventListener("mouseover", countryOver, false)
            child.addEventListener("mouseleave", countryLeft, false)
        }

    }
}

let listPopulated = false //Boolean to avoid populating the datalist (autocomplete) more than once

/**
 * Button 9 - Autocomplete option for the codes in the button 3's input field
 */
function button9() {
    if (!listPopulated) {

        //Handle button activation
        const button = window.document.getElementById("myButton9")
        button.classList.add("button-enabled")

        //Population datalist for autocomplete
        const countryDatalist = window.document.getElementById("country-list")

        //Load countries xml with AJAX and get all the codes present in the countries xml
        const xmlDocument = chargerHttpXML("countriesTP.xml")
        const codes = xmlDocument.evaluate("//country/country_codes/cca2", xmlDocument)

        //Iterate the codes and create a matching option in the datalist
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

let currencyEnabled = false //Track if currency should be displayed

/**
 * Button 10 - toggle the currency in the map data table when hovering countries
 */
function button10() {
    currencyEnabled = !currencyEnabled

    //Handle button activation
    if(currencyEnabled) {
        const button = window.document.getElementById("myButton10")
        button.classList.add("button-enabled")
    } else {
        const button = window.document.getElementById("myButton10")
        button.classList.remove("button-enabled")
    }
}

/**
 * Button 11 - display the Gini coefficient on the world map
 */
async function button11() {
    resetMap() //Reset the map before drawing
    waterEnabled = false; //Disable async water processing

    //Display the gini legend
    const mapLegend = window.document.getElementById("country-map-legend-gini")
    mapLegend.style.display = "block"

    //Fetch the codes and gini values
    let results = await fetch("https://restcountries.eu/rest/v2/all?fields=alpha2Code;gini")
        .then(response => response.json())

    //Iterate the result and render it with an adequate color
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

let waterEnabled = false; //Track if async water processing is allowed or not
/**
 * Button 12 - display the water recommendations on the world map
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

    //Display the water legend
    const mapLegend = window.document.getElementById("country-map-legend-water")
    mapLegend.style.display = "block"

    //Get all the path elements (countries)
    const mapRender = window.document.getElementById("country-map-render")
    const paths = mapRender.getElementsByTagName("path")

    const promises = new Map() //To store the K: path (country) - V: query promise

    //Send queries in parallel and store the promises in the map
    for(let path of paths) {
        promises.set(path, fetch("https://travelbriefing.org/" + path.id + "?format=json")
            .then(response => response.json()))
    }

    //Iterate the promises while async water processing is enabled and remaining keys
    const keys = promises.keys()
    let key = keys.next()
    while(!key.done && waterEnabled) {
        const path = key.value
        const promise = await promises.get(path) //Wait for the promise to fulfill
        if(promise != null) {
            //Render on the map with a matching color
            let water = promise.water.short
            if(water != null) path.style.fill = waterColor(water)
        }
        key = keys.next()
    }

}

/**
 * @param water short string data from the API
 * @returns {string} color hexadecimal code
 */
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
    resetMap() //Reset map before drawing

    waterEnabled = false; //Disable async water processing

    //Display the density legend
    const mapLegend = window.document.getElementById("country-map-legend-density")
    mapLegend.style.display = "block"

    //Fetch the population and area of each countries from the API
    let results = await fetch("https://restcountries.eu/rest/v2/all?fields=alpha2Code;population;area")
        .then(response => response.json())

    //Iterate the array result and render it on the world map
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

let avgTemperatureEnabled = false //Track temperature activation
let hourEnabled = false //Track hour activation

/**
 * Button 14 - toggle the display of the average temperature of the country in map table when country is hovered
 * and manage "collisions"
 */
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

/**
 * Button 15 - toggle the display of the hour enabled of the country in map table when country is hovered
 * and manage "collisions"
 */
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

/**
 * Gini color levels
 * @param gini
 * @returns {string} hexadecimal color code
 */
function giniColor(gini) {
    if(gini > 0 && gini <= 25) return "#ACE8DA"
    else if(gini <= 45) return "#00BFAC"
    else if(gini <= 60) return "#00726A"
    else return "#003135"
}

/**
 * Shape element clicked handling (display the title attribute)
 */
function shapeElementClicked(event) {
    window.alert(event.target.getAttribute("title"))
}

/**
 * Map element clicked (country) display the countryname attribute
 */
function mapElementClicked(event) {
    window.alert(event.target.getAttribute("countryname"))
}

let lastColor = defaultCountryColor //Track the element's last color to change back to it when leaving (default country color)

/**
 * Display the name, capital and flag in a table above the map when hovering a country
 */
async function countryOver(event) {
    lastColor = event.target.style.fill //Update last color before highlighting
    //Visual highlight
    event.target.style.fill = "red"

    //Table update
    const countryCode = event.target.id

    //Load XSL with AJAX and process it
    const xslt = chargerHttpXML("donneesPays.xsl")
    const xsltProcessor = new XSLTProcessor()
    xsltProcessor.importStylesheet(xslt)

    //Set the parameters
    xsltProcessor.setParameter(null, "countryCode", countryCode)
    xsltProcessor.setParameter(null, "countryCodeLowerCase", countryCode.toLowerCase())
    xsltProcessor.setParameter(null, "currencyInfo", currencyEnabled)
    xsltProcessor.setParameter(null, "dateTimeInfo", hourEnabled)
    xsltProcessor.setParameter(null, "avgTempInfo", avgTemperatureEnabled)

    //Fetch currency data if enabled and pass it through the parameters
    if (currencyEnabled) {
        const result = await fetch("https://restcountries.eu/rest/v2/alpha/" + countryCode + "?fields=currencies")
            .then(response => response.json())
            .then(currenciesArray => currenciesArray.currencies[0])

        xsltProcessor.setParameter(null, "currencyValue", result.name + " " + result.symbol)
    }

    //Fetch the average temperature data if enabled and pass it through the parameters
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

    //Fetch the hour data if enabled and pass it through the parameters
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

    //Load the countries XML with AJAX and transform the document with the processed XSL
    const xmlDocument = chargerHttpXML("countriesTP.xml")
    const styledCountryTable = xsltProcessor.transformToDocument(xmlDocument)

    //Display the result in the render zone
    const divCountryDataRender = window.document.getElementById("country-data-render")
    divCountryDataRender.replaceWith(styledCountryTable.getElementById("country-data-render"))
}

/**
 * Country left handling
 */
function countryLeft(event) {
    event.target.style.fill = lastColor //Replace the color with the last color
}

/**
 * Reset the map drawings (legend and colors)
 */
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

/**
 * Load the XML located at the relative URL given in parameter and returns it
 */
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