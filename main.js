(() => {
    'use strict'

    var selected = ['', '']

    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    function updateSelected() {
        const first = document.querySelector("#select-one").value
        const second = document.querySelector("#select-two").value
        selected = [first, second]
        return
    }

    function updateSelectedMode(mode) {
        const distSelector = document.querySelector("#distanceSelector")
        const timeSelector = document.querySelector("#timeSelector")
        const textDisplay = document.querySelector("#user-item")

        if (mode == 'Time') {
            distSelector.setAttribute('class', "nav-link rounded-5")
            timeSelector.setAttribute('class', "nav-link active rounded-5")
        } else {
            distSelector.setAttribute('class', "nav-link active rounded-5")
            timeSelector.setAttribute('class', "nav-link rounded-5")
        }

        textDisplay.innerHTML = mode.toLowerCase()
        textDisplay.style.animation = "textChange 0.5s ease";
        localStorage.setItem('mode', mode)
    }

    var storedMode = localStorage.getItem('mode')

    if (storedMode == null) {
        localStorage.setItem('mode', "Distance")
        storedMode = "Distance"
    }

    updateSelectedMode(storedMode)

    class MobilityMethod {
        constructor(name, icon, speed, range) {
            this.name = name;
            this.icon = icon;
            this.speed = speed;
            this.range = range;
        }
    }
    
    const transporationMethods = [
        new MobilityMethod('Walking', 'person-fill', 3.1, 30),
        new MobilityMethod('Boosted Mini S Board', 'scooter', 18, 7),
        new MobilityMethod('Evolve Bamboo GTR 2in1', 'truck-flatbed', 24, 31),
        new MobilityMethod('OneWheel XR', 'truck-flatbed', 19, 18),
        new MobilityMethod('MotoTec Skateboard', 'truck-flatbed', 22, 10),
        new MobilityMethod('Segway Ninebot S', 'scooter', 10, 13),
        new MobilityMethod('Segway Ninebot S-PLUS', 'scooter', 12, 22),
        new MobilityMethod('Razor Scooter', 'scooter', 18, 15),
        new MobilityMethod('GeoBlade 500', 'truck-flatbed', 15, 8),
        new MobilityMethod('Hovertrax Hoverboard', 'truck-flatbed', 9, 6),
    ]

    let sortedMethods = transporationMethods.sort(
        (p1, p2) => (p1.range < p2.range) ? 1 : (p1.range > p2.range) ? -1 : 0);
    
    const makeTableEntry = (name, icon, range, time, distance, outOfBounds) => {
        var headAttr = ""


        if (outOfBounds) {
            headAttr = 'align-middle text-danger'
            time = "Out of Range"
            distance = "Out of Range"
        } else {
            headAttr = 'align-middle'


            if (getInputVal() == 0) {
                time = "N/A"
                distance = "N/A"
            } else {
                time = time + " min"
                distance = distance + " mi"
            }
            
        }

        return `
        <tr class="${headAttr}">
            <th scope="row" class="fs-4 fw-bold py-3">
                <i class="bi bi-${icon}"></i> ${name}
            </th>
            <td>${range} mi</td>
            <td>${time}</td>
            <td>${distance}</td>
        </tr>
        `
    }

    const makeCardEntry = (name, icon, range, time, distance, outOfBounds) => {
        if (name === '') {
            // make placeholder card
            return `
            <h1 class="placeholder-wave display-1 text-primary mb-0">
                <span class="placeholder col-2 rounded"></span>
            </h1>
            <h3 class="placeholder-wave">
                <span class="placeholder col-5 rounded"></span>
            </h3>
            <hr class="mx-md-5">
            <p class="placeholder-wave">
                <span class="placeholder col-1 rounded"></span>
                <span class="placeholder col-2 rounded"></span>
                <span class="placeholder col-4 rounded"></span>
            </p>

            <p class="placeholder-wave">
                <span class="placeholder col-1 rounded"></span>
                <span class="placeholder col-4 rounded"></span>
                <span class="placeholder col-2 rounded"></span>
            </p>

            <p class="placeholder-wave">
                <span class="placeholder col-1 rounded"></span>
                <span class="placeholder col-3 rounded"></span>
                <span class="placeholder col-2 rounded"></span>
            </p>
            `
        } else {
            return makeCard(name, icon, range, time, distance, outOfBounds)
        }
    }

    const selectMenus = document.querySelectorAll(".mobility-options");
    selectMenus.forEach(obj => {
        var inner = `
        <option value="">Select Option</option>
        `

        transporationMethods.forEach(method => {
            inner += `
            <option value="${method.name}">${method.name}</option>
            `
        })

        obj.innerHTML = inner
    })

    const makeCard = (name, icon, range, time, distance, outOfBounds) => {
        var headAttr = ""

        if (outOfBounds) {
            headAttr = 'align-middle text-danger'
            time = "Out of Range"
            distance = "Out of Range"
        } else {
            headAttr = 'align-middle'

            const inputVal = getInputVal()
            if (inputVal == 0) {
                time = "N/A"
                distance = "N/A"
            } else {
                time = time + " min"
                distance = distance + " mi"
            }   
        }

        return `
        <div class="${headAttr}">
            <i class="bi bi-${icon} display-1"></i>
            <h3>${name}</h3>
            <hr class="mx-md-5">
            <p class="fs-4 mb-1"><i class="bi bi-alarm"></i> Time: ${time}</p>
            <p class="fs-4 mb-1"><i class="bi bi-globe"></i> Distance: ${distance}</p>
            <p class="fs-4 mb-1"><i class="bi bi-fuel-pump-fill"></i> Range: ${range} mi</p>
        </div>
        `
    }

    const calcStats = (method, mode, input) => {
        if (input == 0) {
            console.log("zero input")
            return [0, 0, false]
        }

        var distance = 0
        var time = 0

        if (mode === 'Time') {
            time = input

            distance = round((input * method.speed) / 60, 1)

            if (distance > method.range) {
                return [time, distance, true]
            }

            return [time, distance, false]

        } else {
            // distance mode
            distance = input
            
            if (distance > method.range) {
                return [time, distance, true]
            }

            time = round(60 *(input / method.speed), 1)

            return [time, distance, false]
        }
    }

    const getMode = () => {
        return localStorage.getItem('mode') || "Distance"
    }

    const getInputVal = () => {
        return document.getElementById('main-input').value
    }

    const drawTable = () => {
        const tableContents = document.querySelector("#main-table-body")
        var inner = ''
        sortedMethods.forEach(method => {
            if (!selected.includes(method.name)) {
                const stats = calcStats(method, getMode(), getInputVal())
                inner += makeTableEntry(method.name, method.icon, method.range, stats[0], stats[1], stats[2])
            }
        });

        tableContents.innerHTML = inner
    }

    const drawCard = (cardNum) => {
        var numText = cardNum == 1 ? 'one' : 'two'
        const cardContents = document.querySelector('#compare-' + numText)
        const selectedOption = selected[cardNum - 1]
        
        const method = sortedMethods.find(obj => obj.name === selectedOption) || ''

        var stats = ['', '', '']

        if (method !== '') {
            stats = calcStats(method, getMode(), getInputVal())
        }

        var inner = makeCardEntry(selectedOption, method.icon, method.range, stats[0], stats[1], stats[2])

        cardContents.innerHTML = inner
    }

    function updateDOM() {
        cleanInput()

        console.log("input val: " + getInputVal())

        const inputLabel = document.querySelector("#input-label")

        if (getMode() == "Distance") {
            inputLabel.innerHTML = "mi"
        } else {
            inputLabel.innerHTML = "min"
        }

        drawCard(1)
        drawCard(2)
        drawTable()

        return
    }

    function cleanInput() {
        const mainInput = document.getElementById('main-input')

        mainInput.value = Math.max(0, mainInput.value)
    }

    window.addEventListener('DOMContentLoaded', () => {
        updateDOM()

        const firstSelect = document.querySelector("#select-one")
        const secondSelect = document.querySelector("#select-two")

        const distSelector = document.querySelector("#distanceSelector")
        const timeSelector = document.querySelector("#timeSelector")
        const mainInput = document.getElementById('main-input')

        firstSelect.addEventListener('change', (event) => {
            updateSelected()
            updateDOM()
        });

        secondSelect.addEventListener('change', (event) => {
            updateSelected()
            updateDOM()
        });

        distSelector.addEventListener('click', (event) => {
            updateSelectedMode('Distance')
            console.log('Clicked distance')
            updateDOM()
        })

        timeSelector.addEventListener('click', (event) => {
            updateSelectedMode('Time')
            console.log('Clicked time')
            updateDOM()
        })

        mainInput.addEventListener('change', (event) => {
            updateDOM()
        });
    })
})()