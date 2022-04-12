// import { crossfilter } from './crossfilter'

export function removeDuplicate(name) {
    if (name == 'Saint John NB') {
        return "St. John's"
    }
    return name
}

export function cleanPortName(name) {
    name = removeDuplicate(name)
    const words = name.split(/,| |\/|-/)
    words.forEach((word, index) => {
        if (word.length > 2) {
            let newWord = word.toLowerCase()

            let letterIndex = 0
            while (true) {
                const letter = newWord[letterIndex]
                if (letter.match(/[a-z]/i)) {
                    newWord = newWord.substring(0, letterIndex) + letter.toUpperCase() + newWord.substring(letterIndex + 1)
                    break
                }
                letterIndex += 1
            }
            words[index] = newWord
        }
    })
    return words.join(' ')
}

export function isPortExcluded(name) {
    if (name.includes('Virtual Harbour')) {
        return true
    }
    return false
}

let dataPerMonth
let dataPerPort
let data

const selectWidth = 950
const selectHeight = 125

// Reading the data
d3.csv("./TRIP_Part1.csv").then( function(data1) {
    d3.csv("./TRIP_Part2.csv").then( function(data2) {
        d3.csv("./TRIP_Part3.csv").then( function(data3) {
            // Id,Departure Date,Departure Hardour,Departure Region,Departure Latitude,Departure Longitude,Arrival Date,Arrival Hardour,Arrival Region,Arrival Latitude,Arrival Longitude,Vessel Type,Lenght,Width,DeadWeight Tonnage,Maximum Draugth
            // 6079000000783579,    2011-01-01 00:00:00.000,Virtual Harbour (Central Region),Central Region,45.71666667,-84.24861111,2011-01-01 15:30:00.000,Goderich,Central Region,43.745,-81.7294441666667,Merchant Bulk,222.509994506836,22.9400005340576,31751,8.72999954223633
            // 23079000000766048,   2011-01-01 00:10:00.000,Whiffen Head,Newfoundland Region,47.7727836111111,-54.0171797222222,2011-01-01 01:00:00.000,Whiffen Head,Newfoundland Region,47.7727836111111,-54.0171797222222,Tug Fire,38.9000015258789,13.8999996185303,314,3.5
            // 23079000000766035,   2011-01-01 00:57:00.000,Whiffen Head,Newfoundland Region,47.7727836111111,-54.0171797222222,2011-01-02 12:45:00.000,Virtual Harbour (Newfoundland Region),Newfoundland Region,47.75,-53,Merchant Crude,271.799987792969,46.0499992370606,126646,15.3459997177124

            data = data1.concat(data2).concat(data3)

            dataPerPort = transformDataPorts(data)
            dataPerMonth = transformDataMonths(data)

            setHistograms(data)
            setStackedBar(data)

            build(d3.select('#tab-2-content'), dataPerMonth, dataPerPort)
        });
    });
});

export function transformDataPorts(data) {
    const map = new Map()
    data.forEach(line => {
        const arrivalPort = cleanPortName(line['Arrival Hardour'])
        const departurePort = cleanPortName(line['Departure Hardour'])

        if (!isPortExcluded(arrivalPort)) {
            if (!map.has(arrivalPort)) {
                map.set(arrivalPort, {
                    'name': arrivalPort,
                    'traffic': 1
                })
            } else {
                map.get(arrivalPort).traffic += 1
            }
        }

        if (!isPortExcluded(departurePort)) {
            if (!map.has(departurePort)) {
                map.set(departurePort, {
                    'name': departurePort,
                    'traffic': 1
                })
            } else {
                map.get(departurePort).traffic += 1
            }
        }
    })

    const dataPerPort = Array.from(map.values())
    dataPerPort.sort(function (a, b) {
        return b.traffic - a.traffic
    })
    return dataPerPort
}

export function transformDataMonths(data) {
    const map = new Map()
    data.forEach(line => {
        const departureDate = new Date(line['Departure Date'])
        departureDate.setDate(1)
        const arrivalDate = new Date(line['Arrival Date'])
        arrivalDate.setDate(1)

        for (let date = departureDate; date <= arrivalDate; date.setMonth(date.getMonth()+1)) {
            const sDate = date.toDateString()
            if (!map.has(sDate)) {
                map.set(sDate, {
                    'date': sDate,
                    'traffic': 1
                })
            } else {
                map.get(sDate).traffic += 1
            }
        }
    })

    const dataPerMonth = Array.from(map.values())
    dataPerMonth.forEach(month => {
        month.date = new Date(month.date)
    })
    return dataPerMonth
}

export function build(div, dataPerMonth, dataPerPort, nb = 20) {
    buildTable(div, dataPerPort, nb)

    const xScale = d3.scaleBand().padding(0.7)
    xScale.domain(
        dataPerMonth.map((month) => month.date))
    .range([0, 950])

    const yScale = d3.scaleLinear()
    let max = 0
    for (const month of dataPerMonth) {
        if (month.traffic > max) {
            max = month.traffic
        }
    }
    yScale.domain([0, max]).range([125, 0])

    div.select('#time-select-graph  #graph-clip-path')
    .selectAll('rect')
    .data(dataPerMonth)
    .join('rect')
    .attr('width', 950 / dataPerMonth.length)
    .attr('height', data => 125 - yScale(data.traffic))
    .attr('x', data => xScale(data.date))
    .attr('y', data => yScale(data.traffic))

    div.select('#time-select-graph')
    .select('.x.axis')
    .attr('transform', 'translate(0, ' + 125 + ')')
    .call(d3.axisBottom(xScale)
    .tickValues(xScale.domain().filter(function(d, i) {
        return !(i % 12 - 1)
    }))
    .tickFormat(d3.timeFormat("%Y")))
}

export function buildTable(div, dataPerPort, nb) {
    const topTraffic = dataPerPort[0].traffic

    const row = div.select('#port-table tbody')
    .selectAll('tr.port-row')
    .data(dataPerPort)
    .enter()
    .filter((data, index) => nb <= 0 || index < nb)
    .append('tr')
    .attr('data-port', (data, index) => data.name)

    row.append('td')
    .attr('class', 'port-cell column-rank')
    .append('div')
    .attr('class', 'rank-container')
    .append('span')
    .text((data, index) => index + 1)

    row.append('td')
    .attr('class', 'port-cell column-port')
    .append('div')
    .attr('class', 'port-container')
    .append('span')
    .text((data, index) => data.name)

    row.append('td')
    .attr('class', 'port-cell column-traffic')
    .append('div')
    .attr('class', 'traffic-container')
    .append('span')
    .text((data, index) => data.traffic)

    row.append('td')
    .attr('class', 'port-cell-graph column-proportions')
    .append('div')
    .attr('class', 'proportions-container')
    .style('width', (data, index) => data.traffic / topTraffic * 100 + '%')
    
    div.selectAll('#port-table tr').on('click', function() {
        const row = d3.select(this)
        const selected = row.classed('selected')

        d3.selectAll('#port-table tr').classed('selected', false)
        row.classed('selected', !selected)

        const port = selected ? undefined : row.attr('data-port')

        selectPort(port)
    })
}

d3.select('#tab-2-content #row-nb-control-refresh').on('click', function() {
    reset(d3.select('#tab-2-content'))
    const nbLines = d3.select('#row-nb-control').property('value')
    build(d3.select('#tab-2-content'), dataPerMonth, dataPerPort, nbLines)
})

export function reset(div) {
    div.select('#port-table tbody').html('')
    selectPort(undefined)
}

export function selectPort(port) {
    const title = d3.select('#caracteristics-title-port')
    if (port == undefined) {
        title.text('AUCUN PORT SÉLECTIONNÉ - CARACTÉRISTIQUES GLOBALES')
    } else {
        title.text(port)
    }
}

export function setHistogram(data, max, width, height, id, title) {
    var svg = d3.select(id)
        .append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g")
            .attr("transform", "translate(50,10)");

    var x = d3.scaleLinear()
        .domain([0, max])
        .range([0, width - 100]);
    svg.append("g")
        .attr("transform", "translate(0," + (height - 30) + ")")
        .call(d3.axisBottom(x))

    var hist = d3.histogram()
        .value(d => { return d[title]; })
        .domain(x.domain())
        .thresholds(x.ticks(40));

    var bins = hist(data);

    var y = d3.scaleLinear()
        .range([height - 30, 0])
        .domain([0, d3.max(bins, d => { return d.length; })]);
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5));

    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
            .attr("x", 1)
            .attr("transform", d => { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
            .attr("width", d => { return x(d.x1) - x(d.x0); })
            .attr("height", d => { return height - y(d.length) - 30; })
            .style("fill", "#4479AB")
}

export function setHistograms(data) {
    setHistogram(data, 400, 776, 160, "#repartition-length", "Lenght");
    setHistogram(data, 180, 776, 160, "#repartition-width", "Width")
    setHistogram(data, 650000, 776, 160, "#repartition-tonnage", "DeadWeight Tonnage");
    setHistogram(data, 30, 776, 160, "#repartition-draught", "Maximum Draugth");
}

export function setStackedBar(data) {
    var svg = d3.select("#repartition-types")
        .append("svg")
            .attr("height", 556)
            .attr("width", 130)
            .append("g")
                .attr("transform", "translate(10,10)");
    
    var total = 0
    const map = new Map()
    data.forEach(line => {
        const type = line['Global Vessel Type']
        const subtype = line['Vessel Type']
        total++;

        if (!map.has(type)) {
            map.set(type, {
                'type': type,
                'number': 1,
                'subtypes': {}
            })
        } else {
            map.get(type).number += 1;
        }
            
        if (!(subtype in map.get(type).subtypes)) {
            map.get(type).subtypes[subtype] = 1;
        } else {
            map.get(type).subtypes[subtype] += 1;
        }
    })

    const colors = {"Barges": "#66c2a5", "Excursion": "#fc8d62", "Fishing": "#8da0cb", "Merchant": "#e78ac3", "Other": "#a6d854", "Pleasure Crafts": "#ffd92f", "Tanker": "#e5c494", "Tugs": "#b3b3b3"}
    const darker_colors = {"Barges": "#46b08f", "Excursion": "#d66236", "Fishing": "#748cc2", "Merchant": "#d96aae", "Other": "#8fbd44", "Pleasure Crafts": "#d6b313", "Tanker": "#cfa569", "Tugs": "#919191"}

    var currSum = 10
    for (var type of map.entries()) {
        var i = 0
        for (var subtype in type[1].subtypes) {
            var color_list = i % 2 == 0 ? colors : darker_colors
            i++
            svg.append("rect")
                .attr("width", 130)
                .attr("height", (Math.ceil(490 * type[1].subtypes[subtype]/total)))
                .attr("transform", "translate(10," + currSum + ")")
                .attr("fill", color_list[type[0]]);
            currSum += Math.ceil(490 * type[1].subtypes[subtype]/total);
        }
    }
}