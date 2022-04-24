const ROW_CHART_HEIGHT = 16.68
const ROW_CHART_HEIGHT_MARGIN = 21.75

// Lecture des données
d3.csv("./TRIP_PART_1.csv").then( function(data1) {
    d3.csv("./TRIP_PART_2.csv").then( function(data2) {
        d3.csv("./TRIP_PART_3.csv").then( function(data3) {
            d3.csv("./Vessel Type Class.csv").then(function(dataTypes) {
                // Concaténation des données de trajet
                let data = data1.concat(data2).concat(data3)

                // Tableau des paires classes (regroupement de types) de navire et types de navire
                const dataVesselTypesArray = dataTypes.map((d) => {
                    return {
                        vesselClass: d.Class,
                        vesselType: d.Type
                    }
                })

                // Map des classes de navire selon le type de navire
                let dataVesselTypes = new Map()
                for (const entry of dataVesselTypesArray) {
                    const vesselClass = entry.vesselClass
                    const vesselType = entry.vesselType
                    dataVesselTypes.set(vesselType, vesselClass)
                }
                
                // On réorganise et transforme les données de trajet en types de données utilisables
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

                // Regroupment des données via la librairie crossfilter
                // Les changements de tout graphique l'utilisant sera répercuté dans les autres graphiques
                const ndx = crossfilter(data)

                const vesselClassX = ndx.dimension(d => d.vesselClass)
                // Liste des classes de navire
                const classes = vesselClassX.group().all().map(d => d.key)

                // Schema de couleurs utilisé pour les classes de navire
                const typeColorScale = d3.scaleOrdinal(d3.schemeSet2).domain(classes)
                const firstClass = classes[0]


                // Graphique des longueurs des navires

                const vesselLengthRange = 400
                const vesselLengthBarWidth = vesselLengthRange / chartNbBars
                const vesselLength = ndx.dimension(d => d.vesselLength)
                const vesselLengths = vesselLength.group(d => Math.floor(d / vesselLengthBarWidth) * vesselLengthBarWidth).reduce(
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) + 1
                      return p}, 
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) - 1
                      return p}, 
                    function() {
                      return {}
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
                    return this.layer + ': ' + d.value[this.layer]
                })

                for (let i = 1; i < classes.length; i++) {
                    const type = classes[i]
                    vesselLengthChart.stack(vesselLengths, type, d => d.value[type])
                }
                
                vesselLengthChart.yAxis().ticks(8)

                vesselLengthChart.render()


                // Graphique des largeurs des navires

                const vesselWidthRange = 180
                const vesselWidthBarWidth = vesselWidthRange / chartNbBars
                const vesselWidth = ndx.dimension(d => d.vesselWidth)
                const vesselWidths = vesselWidth.group(d => Math.floor(d / vesselWidthBarWidth) * vesselWidthBarWidth).reduce(
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) + 1
                      return p}, 
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) - 1
                      return p}, 
                    function() {
                      return {}
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
                    return this.layer + ': ' + d.value[this.layer]
                })

                for (let i = 1; i < classes.length; i++) {
                    const type = classes[i]
                    vesselWidthChart.stack(vesselWidths, type, d => d.value[type])
                }

                vesselWidthChart.yAxis().ticks(7)

                vesselWidthChart.render()


                // Graphique des capacités des navires

                const vesselCapacityRange = 650000
                const vesselCapacityBarWidth = vesselCapacityRange / chartNbBars
                const vesselCapacity = ndx.dimension(d => d.vesselCapacity)
                const vesselCapacities = vesselCapacity.group(d => Math.floor(d / vesselCapacityBarWidth) * vesselCapacityBarWidth).reduce(
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) + 1
                      return p}, 
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) - 1
                      return p}, 
                    function() {
                      return {}
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
                    return this.layer + ': ' + d.value[this.layer]
                })

                for (let i = 1; i < classes.length; i++) {
                    const type = classes[i]
                    vesselCapacityChart.stack(vesselCapacities, type, d => d.value[type])
                }
                
                vesselCapacityChart.yAxis().ticks(9)

                vesselCapacityChart.render()

                
                // Graphique des tirants d'eau des navires

                const vesselDraughtRange = 30
                const vesselDraughtBarWidth = vesselDraughtRange / chartNbBars
                const vesselDraught = ndx.dimension(d => d.vesselDraught)
                const vesselDraughts = vesselDraught.group(d => Math.floor(d / vesselDraughtBarWidth) * vesselDraughtBarWidth).reduce(
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) + 1
                      return p}, 
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) - 1
                      return p}, 
                    function() {
                      return {}
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
                    return this.layer + ': ' + d.value[this.layer]
                })

                for (let i = 1; i < classes.length; i++) {
                    const type = classes[i]
                    vesselDraughtChart.stack(vesselDraughts, type, d => d.value[type])
                }
                
                vesselDraughtChart.yAxis().ticks(6)

                vesselDraughtChart.render()


                // Graphique des types des navires

                const nullDimension = ndx.dimension(_ => 0)
                const vesselClassesY = nullDimension.group().reduce(
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) + 1
                      return p}, 
                    function(p, v) {
                      p[v.vesselClass] = (p[v.vesselClass] || 0) - 1
                      return p}, 
                    function() {
                      return {}
                    }
                )

                const vesselTypeChart = new ReverseBarChart("#type-chart")
                .x(d3.scaleOrdinal().domain([0, 0]))
                .width(200)
                .height(750)
                .margins({top: 10, right: 50, bottom: 180, left: 0})
                .dimension(nullDimension)
                .group(vesselClassesY, firstClass, d => d.value[firstClass])
                .xUnits(() => 1)
                .colors(typeColorScale)
                .brushOn(false)
                .elasticY(true)
                .legend(dc.legend().y(600))
                .title(function (d) {
                    return this.layer + ': ' + d.value[this.layer]
                })
                

                for (let i = 1; i < classes.length; i++) {
                    const vesselClass = classes[i]
                    vesselTypeChart.stack(vesselClassesY, vesselClass, d => d.value[vesselClass])
                }

                vesselTypeChart.filter = function() {}

                vesselTypeChart.render()


                // Graphique du trafic total

                const vesselTraffic = ndx.dimension(d => d.departureDate)
                const vesselTraffics = vesselTraffic.group(d3.timeMonth)
                
                const minDate = vesselTraffic.bottom(1)[0].departureDate
                const maxDate = vesselTraffic.top(1)[0].departureDate

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

                
                // Graphique de liste des ports

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

                // Change la grandeur du graphique selon le nombre de ports présents dans la sélection temporelle
                portChart.on('pretransition', function() {
                    portChart.select('g.axis').attr('transform', 'translate(0,0)')
                    portChart.selectAll('line.grid-line').attr('y2', portChart.effectiveHeight())
                    const count = filteredGroup.all().length
                    const height = count * ROW_CHART_HEIGHT_MARGIN + 20
                    portChart.select('svg').attr('height', height)
                })

                portChart.render()

                // Fin du chargement, on enlève l'icône de chargement
                d3.select("#loader")
                    .style("display", "none")
                d3.select("#loader-container")
                    .style("display", "none")
            })
        })
    })
})

// Permet d'inverser l'ordre de la légende pour que l'ordre soit identique aux couleurs sur le graphique
class ReverseBarChart extends dc.BarChart {
    legendables () {
        const items = super.legendables()
        return items.reverse()
    }
}

// Source : https://github.com/dc-js/dc.js/wiki/FAQ#how-do-i-filter-the-data-before-its-charted
function remove_empty_bins(source_group) {
    return {
        all:function () {
            return source_group.all().filter(function(d) {
                return d.value !== 0
            })
        }
    }
}