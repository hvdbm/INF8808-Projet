import * as crossfilter from 'crossfilter'
import * as dc from 'dc'
import { vesselTypeClasses } from './vesselTypeClasses.js'

export function build() {
    
    const ROW_CHART_HEIGHT = 16.68
    const ROW_CHART_HEIGHT_MARGIN = 21.75

    // Reading the data
    d3.csv("./TRIP_Part1.csv").then( function(data1) {
        d3.csv("./TRIP_Part2.csv").then( function(data2) {
            d3.csv("./TRIP_Part3.csv").then( function(data3) {
                d3.csv("./Vessel Type Class.csv").then(function(dataTypes) {
                    // Id,Departure Date,Departure Hardour,Departure Region,Departure Latitude,Departure Longitude,Arrival Date,Arrival Hardour,Arrival Region,Arrival Latitude,Arrival Longitude,Vessel Type,Lenght,Width,DeadWeight Tonnage,Maximum Draugth
                    // 6079000000783579,    2011-01-01 00:00:00.000,Virtual Harbour (Central Region),Central Region,45.71666667,-84.24861111,2011-01-01 15:30:00.000,Goderich,Central Region,43.745,-81.7294441666667,Merchant Bulk,222.509994506836,22.9400005340576,31751,8.72999954223633
                    // 23079000000766048,   2011-01-01 00:10:00.000,Whiffen Head,Newfoundland Region,47.7727836111111,-54.0171797222222,2011-01-01 01:00:00.000,Whiffen Head,Newfoundland Region,47.7727836111111,-54.0171797222222,Tug Fire,38.9000015258789,13.8999996185303,314,3.5
                    // 23079000000766035,   2011-01-01 00:57:00.000,Whiffen Head,Newfoundland Region,47.7727836111111,-54.0171797222222,2011-01-02 12:45:00.000,Virtual Harbour (Newfoundland Region),Newfoundland Region,47.75,-53,Merchant Crude,271.799987792969,46.0499992370606,126646,15.3459997177124
        
                    let data = data1.concat(data2).concat(data3)
                    let dataVesselTypes = new Map()
    
                    const dataVesselTypesArray = dataTypes.map((d) => {
                        return {
                            vesselClass: d.Class,
                            vesselType: d.Type
                        }
                    })
    
                    for (const entry of dataVesselTypesArray) {
                        const vesselClass = entry.vesselClass
                        const vesselType = entry.vesselType
                        dataVesselTypes.set(vesselType, vesselClass)
                    }
                    
                    data = data.map((d, i) => {
                        const vesselType = d['Vessel Type']
                        let vesselClass = dataVesselTypes.get(d['Vessel Type'])
                        if (vesselType == '<Unknown Type>') {
                            vesselClass = 'Other'
                        }
                        return {
                            index: i,
                            departureDate: d3.timeParse('%Y-%m-%d')(d['Departure Date']),
                            departurePort: d['Departure Hardour'],
                            arrivalDate: d3.timeParse('%Y-%m-%d')(d['Arrival Date']),
                            arrivalPort: d['Arrival Hardour'],
                            vesselClass: vesselClass,
                            vesselType: d['Vessel Type'],
                            vesselLength: +d['Lenght'],
                            vesselWidth: +d['Width'],
                            vesselCapacity: +d['DeadWeight Tonnage'],
                            vesselDraught: +d['Maximum Draugth']
                        }
                    })

                    const chartWidth = 776
                    const chartHeight = 160
                    const chartNbBars = 50

                    const timeSelectWidth = 950

                    const ndx = crossfilter.crossfilter(data)

                    const vesselLengthRange = 400
                    const vesselLengthBarWidth = vesselLengthRange / chartNbBars
                    const vesselLength = ndx.dimension(d => d.vesselLength)
                    const vesselLengths = vesselLength.group(d => Math.floor(d / vesselLengthBarWidth) * vesselLengthBarWidth)

                    const vesselLengthChart = new dc.BarChart('#length-chart')
                    .width(chartWidth)
                    .height(chartHeight)
                    .margins({top: 10, right: 50, bottom: 30, left: 50})
                    .x(d3.scaleLinear()
                        .domain([0, vesselLengthRange]))
                    .xUnits(() => chartNbBars)
                    .brushOn(false)
                    .xAxisLabel("Longueur")
                    .elasticY(true)
                    .dimension(vesselLength)
                    .group(vesselLengths)
                    
                    vesselLengthChart.yAxis().ticks(8)

                    vesselLengthChart.render()

                    const vesselWidthRange = 180
                    const vesselWidthBarWidth = vesselWidthRange / chartNbBars
                    const vesselWidth = ndx.dimension(d => d.vesselWidth)
                    const vesselWidths = vesselWidth.group(d => Math.floor(d / vesselWidthBarWidth) * vesselWidthBarWidth)

                    const vesselWidthChart = new dc.BarChart('#width-chart')
                    .width(chartWidth)
                    .height(chartHeight)
                    .margins({top: 10, right: 50, bottom: 30, left: 50})
                    .x(d3.scaleLinear()
                        .domain([0, vesselWidthRange]))
                    .xUnits(() => chartNbBars)
                    .brushOn(false)
                    .xAxisLabel("Largeur")
                    .elasticY(true)
                    .dimension(vesselWidth)
                    .group(vesselWidths)

                    vesselWidthChart.yAxis().ticks(7)

                    vesselWidthChart.render()

                    const vesselCapacityRange = 650000
                    const vesselCapacityBarWidth = vesselCapacityRange / chartNbBars
                    const vesselCapacity = ndx.dimension(d => d.vesselCapacity)
                    const vesselCapacities = vesselCapacity.group(d => Math.floor(d / vesselCapacityBarWidth) * vesselCapacityBarWidth)

                    const vesselCapacityChart = new dc.BarChart('#capacity-chart')
                    .width(chartWidth)
                    .height(chartHeight)
                    .margins({top: 10, right: 50, bottom: 30, left: 50})
                    .x(d3.scaleLinear()
                        .domain([0, vesselCapacityRange]))
                    .xUnits(() => chartNbBars)
                    .brushOn(false)
                    .xAxisLabel("Capacité")
                    .elasticY(true)
                    .dimension(vesselCapacity)
                    .group(vesselCapacities)
                    
                    vesselCapacityChart.yAxis().ticks(9)

                    vesselCapacityChart.render()

                    const vesselDraughtRange = 30
                    const vesselDraughtBarWidth = vesselDraughtRange / chartNbBars
                    const vesselDraught = ndx.dimension(d => d.vesselDraught)
                    const vesselDraughts = vesselDraught.group(d => Math.floor(d / vesselDraughtBarWidth) * vesselDraughtBarWidth)

                    const vesselDraughtChart = new dc.BarChart('#draught-chart')
                    .width(chartWidth)
                    .height(chartHeight)
                    .margins({top: 10, right: 50, bottom: 30, left: 50})
                    .x(d3.scaleLinear()
                        .domain([0, vesselDraughtRange]))
                    .xUnits(() => chartNbBars)
                    .brushOn(false)
                    .xAxisLabel("Tirant d'eau")
                    .elasticY(true)
                    .dimension(vesselDraught)
                    .group(vesselDraughts)
                    
                    vesselDraughtChart.yAxis().ticks(6)

                    vesselDraughtChart.render()

                    const vesselType = ndx.dimension(d => d.vesselClass)
                    const vesselTypes = vesselType.group()

                    const typeColorScale = d3.scaleOrdinal(d3.schemeSet2).domain(vesselTypeClasses())

                    const vesselTypeChart = new dc.PieChart("#type-chart")
                    .width(150)
                    .height(310)
                    .cy(75)
                    .innerRadius(50)
                    .dimension(vesselTypes)
                    .group(vesselTypes)
                    .colors(typeColorScale)
                    .minAngleForLabel(360)
                    .legend(dc.legend().y(160))

                    vesselTypeChart.filter = function() {};

                    vesselTypeChart.render()

                    const vesselTraffic = ndx.dimension(d => d.departureDate)
                    const vesselTraffics = vesselTraffic.group(d3.timeMonth)
                    
                    const minDate = vesselTraffic.bottom(1)[0].departureDate
                    const maxDate = vesselTraffic.top(1)[0].departureDate

                    const vesselTrafficRange = maxDate - minDate
                    const vesselTrafficBarWidth = vesselTrafficRange / chartNbBars

                    const vesselTrafficChart = new dc.BarChart('#traffic-chart')
                    .width(timeSelectWidth)
                    .height(125)
                    .margins({top: 10, right: 50, bottom: 30, left: 50})
                    .dimension(vesselTraffic)
                    .group(vesselTraffics)
                    .round(d3.timeMonth)
                    .x(d3.scaleTime()
                        .domain([minDate, maxDate])
                        .rangeRound([0, timeSelectWidth]))
                    .brushOn(true)
                    .elasticY(true)

                    vesselTrafficChart.yAxis().ticks(5)

                    vesselTrafficChart.render()

                    const portDim = ndx.dimension(d => d.departurePort)

                    ndx.dimension(d=> d.departurePort)
                    .filter(d => !d.includes('Virtual Harbour'))

                    const portTraffic = portDim.group().reduceCount()
                    const filteredGroup = remove_empty_bins(portTraffic)

                    const portChart = new dc.RowChart('#port-chart')
                    .width(600)
                    .height(900)
                    .margins({top: 30, right: 50, bottom: 30, left: 30})
                    .dimension(portDim)
                    .group(filteredGroup)
                    .x(d3.scaleLinear()
                        .domain([0, portTraffic.top(1)[0].value])
                        .rangeRound([0, 500]))
                    .xAxis(d3.axisTop())
                    .colors(d3.scaleOrdinal(['#1f77b4']))
                    .othersGrouper(false)
                    .elasticX(true)
                    .label(d => d.key + ': ' + d.value)
                    .fixedBarHeight(ROW_CHART_HEIGHT)

                    portChart.on('pretransition', function() {
                        portChart.select('g.axis').attr('transform', 'translate(0,0)')
                        portChart.selectAll('line.grid-line').attr('y2', portChart.effectiveHeight())
                        const count = filteredGroup.all().length
                        const height = count * ROW_CHART_HEIGHT_MARGIN + 20
                        portChart.select('svg').attr('height', height)
                    })

                    portChart.render()
                })
            })
        })
    })
}

// https://github.com/dc-js/dc.js/wiki/FAQ#how-do-i-filter-the-data-before-its-charted
function remove_empty_bins(source_group) {
    return {
        all:function () {
            return source_group.all().filter(function(d) {
                return d.value !== 0;
            });
        }
    };
}