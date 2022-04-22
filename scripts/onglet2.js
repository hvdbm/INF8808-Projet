const ROW_CHART_HEIGHT = 16.68
const ROW_CHART_HEIGHT_MARGIN = 21.75

// Reading the data
d3.csv("./TRIP_PART_1.csv").then( function(data1) {
    d3.csv("./TRIP_PART_2.csv").then( function(data2) {
        d3.csv("./TRIP_PART_3.csv").then( function(data3) {
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
                const chartHeight = 180
                const chartNbBars = 50

                const timeSelectWidth = 950

                const ndx = crossfilter(data)
                const vesselClassX = ndx.dimension(d => d.vesselClass)
                const classes = vesselClassX.group().all().map(d => d.key)

                const typeColorScale = d3.scaleOrdinal(d3.schemeSet2).domain(classes)
                const firstClass = classes[0]

                // Longueur

                const vesselLengthRange = 400
                const vesselLengthBarWidth = vesselLengthRange / chartNbBars
                const vesselLength = ndx.dimension(d => d.vesselLength)
                const vesselLengths = vesselLength.group(d => Math.floor(d / vesselLengthBarWidth) * vesselLengthBarWidth).reduce(
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) + 1;
                      return p;}, 
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) - 1;
                      return p;}, 
                    function() {
                      return {};
                    }
                )

                const vesselLengthChart = new dc.BarChart('#length-chart')
                .width(chartWidth)
                .height(chartHeight)
                .margins({top: 10, right: 50, bottom: 30, left: 50})
                .x(d3.scaleLinear()
                    .domain([0, vesselLengthRange]))
                .xUnits(() => chartNbBars)
                .brushOn(false)
                .colors(typeColorScale)
                .xAxisLabel('Longueur (m)')
                .elasticY(true)
                .dimension(vesselLength)
                .group(vesselLengths, firstClass, d => d.value[firstClass])
                .title(function (d) {
                    return d.key + '[' + this.layer + ']: ' + d.value[this.layer];
                })

                for (let i = 1; i < classes.length; i++) {
                    const type = classes[i]
                    vesselLengthChart.stack(vesselLengths, type, d => d.value[type])
                }
                
                vesselLengthChart.yAxis().ticks(8)

                vesselLengthChart.render()

                // Largeur

                const vesselWidthRange = 180
                const vesselWidthBarWidth = vesselWidthRange / chartNbBars
                const vesselWidth = ndx.dimension(d => d.vesselWidth)
                const vesselWidths = vesselWidth.group(d => Math.floor(d / vesselWidthBarWidth) * vesselWidthBarWidth).reduce(
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) + 1;
                      return p;}, 
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) - 1;
                      return p;}, 
                    function() {
                      return {};
                    }
                )

                const vesselWidthChart = new dc.BarChart('#width-chart')
                .width(chartWidth)
                .height(chartHeight)
                .margins({top: 10, right: 50, bottom: 30, left: 50})
                .x(d3.scaleLinear()
                    .domain([0, vesselWidthRange]))
                .xUnits(() => chartNbBars)
                .brushOn(false)
                .colors(typeColorScale)
                .xAxisLabel('Largeur (m)')
                .elasticY(true)
                .dimension(vesselWidth)
                .group(vesselWidths, firstClass, d => d.value[firstClass])
                .title(function (d) {
                    return d.key + '[' + this.layer + ']: ' + d.value[this.layer];
                })

                for (let i = 1; i < classes.length; i++) {
                    const type = classes[i]
                    vesselWidthChart.stack(vesselWidths, type, d => d.value[type])
                }

                vesselWidthChart.yAxis().ticks(7)

                vesselWidthChart.render()

                // Capacité

                const vesselCapacityRange = 650000
                const vesselCapacityBarWidth = vesselCapacityRange / chartNbBars
                const vesselCapacity = ndx.dimension(d => d.vesselCapacity)
                const vesselCapacities = vesselCapacity.group(d => Math.floor(d / vesselCapacityBarWidth) * vesselCapacityBarWidth).reduce(
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) + 1;
                      return p;}, 
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) - 1;
                      return p;}, 
                    function() {
                      return {};
                    }
                )

                const vesselCapacityChart = new dc.BarChart('#capacity-chart')
                .width(chartWidth)
                .height(chartHeight)
                .margins({top: 10, right: 50, bottom: 30, left: 50})
                .x(d3.scaleLinear()
                    .domain([0, vesselCapacityRange]))
                .xUnits(() => chartNbBars)
                .brushOn(false)
                .colors(typeColorScale)
                .xAxisLabel('Capacité (t)')
                .elasticY(true)
                .dimension(vesselCapacity)
                .group(vesselCapacities, firstClass, d => d.value[firstClass])
                .title(function (d) {
                    return d.key + '[' + this.layer + ']: ' + d.value[this.layer];
                })

                for (let i = 1; i < classes.length; i++) {
                    const type = classes[i]
                    vesselCapacityChart.stack(vesselCapacities, type, d => d.value[type])
                }
                
                vesselCapacityChart.yAxis().ticks(9)

                vesselCapacityChart.render()

                // Tirant d'eau

                const vesselDraughtRange = 30
                const vesselDraughtBarWidth = vesselDraughtRange / chartNbBars
                const vesselDraught = ndx.dimension(d => d.vesselDraught)
                const vesselDraughts = vesselDraught.group(d => Math.floor(d / vesselDraughtBarWidth) * vesselDraughtBarWidth).reduce(
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) + 1;
                      return p;}, 
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) - 1;
                      return p;}, 
                    function() {
                      return {};
                    }
                )

                const vesselDraughtChart = new dc.BarChart('#draught-chart')
                .width(chartWidth)
                .height(chartHeight)
                .margins({top: 10, right: 50, bottom: 30, left: 50})
                .x(d3.scaleLinear()
                    .domain([0, vesselDraughtRange]))
                .xUnits(() => chartNbBars)
                .brushOn(false)
                .colors(typeColorScale)
                .xAxisLabel("Tirant d'eau (m)")
                .elasticY(true)
                .dimension(vesselDraught)
                .group(vesselDraughts, firstClass, d => d.value[firstClass])
                .title(function (d) {
                    return d.key + '[' + this.layer + ']: ' + d.value[this.layer];
                })

                for (let i = 1; i < classes.length; i++) {
                    const type = classes[i]
                    vesselDraughtChart.stack(vesselDraughts, type, d => d.value[type])
                }
                
                vesselDraughtChart.yAxis().ticks(6)

                vesselDraughtChart.render()

                // Types

                const vesselTypeY = ndx.dimension(_ => 0)
                const vesselTypesY = vesselTypeY.group().reduce(
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) + 1;
                      return p;}, 
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) - 1;
                      return p;}, 
                    function() {
                      return {};
                    }
                )

                const vesselTypeChart = new dc.BarChart("#type-chart")
                .x(d3.scaleOrdinal().domain([0, 0]))
                .width(200)
                .height(750)
                .margins({top: 10, right: 50, bottom: 180, left: 0})
                .dimension(vesselTypeY)
                .group(vesselTypesY, firstClass, d => d.value[firstClass])
                .xUnits(() => 1)
                .colors(typeColorScale)
                .brushOn(false)
                .elasticY(true)
                .legend(dc.legend().y(600))
                .title(function (d) {
                    return this.layer + ': ' + d.value[this.layer];
                })
                

                for (let i = 1; i < classes.length; i++) {
                    const type = classes[i]
                    vesselTypeChart.stack(vesselTypesY, type, d => d.value[type])
                }

                vesselTypeChart.filter = function() {};

                vesselTypeChart.render()

                // Trafic

                const vesselTraffic = ndx.dimension(d => d.departureDate)
                const vesselTraffics = vesselTraffic.group(d3.timeMonth)
                
                const minDate = vesselTraffic.bottom(1)[0].departureDate
                const maxDate = vesselTraffic.top(1)[0].departureDate

                // const vesselTrafficRange = maxDate - minDate
                // const vesselTrafficBarWidth = vesselTrafficRange / chartNbBars

                const vesselTrafficChart = new dc.BarChart('#tab-2-content .traffic-chart')
                .width(timeSelectWidth)
                .height(125)
                .margins({top: 10, right: 50, bottom: 30, left: 30})
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
                    .filter(d => !d.includes('Virtual harbour'))

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

                d3.select("#loader")
                    .style("display", "none")
                d3.select("#loader-container")
                    .style("display", "none")
            })
        })
    })
})

class SingularStackedBarChart {
    constructor(parent, group) {
        this._groupAll = null;
        this._colors = null;
        this._width = this._height = 200;
        this._duration = 500;
        this._root = d3.select(parent);
        dc.registerChart(this, group);
        this._rect = null;
    }

    groupAll(groupAll) {
        if(!arguments.length)
            return this._groupAll;
        this._groupAll = groupAll;
        return this;
    }

    colors(colors) {
        if(!arguments.length)
            return this._colors;
        this._colors = colors;
        return this;
    }

    render() {
        const width = 200, height = 200;
        let svg = this._root.selectAll('svg')
            .data([0])
            .join('svg')
            .attr('width', width)
            .attr('height', width);
        this._rect = svg.selectAll('rect.swatch')
            .data([0])
            .join('rect')
            .attr('class', 'swatch')
            .attr('width', width)
            .attr('height', width);
        this.redraw();
    }

    redraw() {
        this._rect.transition()
            .duration(this._duration)
            .attr('fill', this._colors(this._groupAll.value()));
    }
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