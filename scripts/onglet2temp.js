

            data2 = data.map((d, i) => {
                return {
                    index: i,
                    departureDate: d3.timeFormat('%Y-%m-%d %H:%M:%S.%L')(d['Departure Date']),
                    departurePort: d['Departure Hardour'],
                    arrivalDate: d3.timeFormat('%Y-%m-%d %H:%M:%S.%L')(d['Arrival Date']),
                    arrivalPort: d['Arrival Hardour'],
                    vesselType: d['Vessel Type'],
                    vesselLength: +d['Length'],
                    vesselWidth: +d['Width'],
                    vesselCapacity: +d['DeadWeight Tonnage'],
                    vesselDraught: +d['Maximum Draugth']
                }
            })

            const xf = crossfilter(data2)
            const all = xf.groupAll()
            const date = xf.dimension(d => d.departureDate)
            const dates = date.group(d3.timeDays)
            const vesselLength = xf.dimension(d => d.vesselLength)
            const vesselLengths = vesselLength.group(Math.floor)
            const vesselWidth = xf.dimension(d => d.vesselWidth)
            const vesselWidths = vesselWidth.group(Math.floor)
            const vesselCapacity = xf.dimension(d => d.vesselCapacity)
            const vesselCapacities = vesselCapacity.group(Math.floor)
            const vesselDraught = xf.dimension(d => d.vesselDraught)
            const vesselDraughts = vesselDraught.group(Math.floor)

            const minDate = date.bottom(1)[0].departureDate
            const maxDate = date.top(1)[0].departureDate
            const minLength = vesselLength.bottom(1)[0].vesselLength
            const maxLength = vesselLength.top(1)[0].vesselLength
            const minWidth = vesselWidth.bottom(1)[0].vesselWidth
            const maxWidth = vesselWidth.top(1)[0].vesselWidth
            const minCapacity = vesselCapacity.bottom(1)[0].vesselCapacity
            const maxCapacity = vesselCapacity.top(1)[0].vesselCapacity
            const minDraught = vesselDraught.bottom(1)[0].vesselDraught
            const maxDraught = vesselDraught.top(1)[0].vesselDraught

            var charts = [
            
                barChart()
                    .dimension(vesselLength)
                    .group(vesselLengths)
                .x(d3.scaleLinear()
                    .domain([minLength, maxLength])
                    .rangeRound([0, 10 * 24])),
            
                barChart()
                    .dimension(vesselWidth)
                    .group(vesselWidths)
                .x(d3.scaleLinear()
                    .domain([minWidth, maxWidth])
                    .rangeRound([0, 10 * 21])),
            
                barChart()
                    .dimension(vesselCapacity)
                    .group(vesselCapacities)
                .x(d3.scaleLinear()
                    .domain([minCapacity, maxCapacity])
                    .rangeRound([0, 10 * 40])),
            
                barChart()
                    .dimension(vesselDraught)
                    .group(vesselDraughts)
                .x(d3.scaleLinear()
                    .domain([minDraught, maxDraught])
                    .rangeRound([0, 10 * 40])),

                barChart()
                .dimension(date)
                .group(dates)
                .round(d3.timeMonths)
                .x(d3.scaleTime()
                    .domain([minDate, maxDate])
                    .rangeRound([0, selectWidth]))
            
            ];

            var formatNumber = d3.format(",d"),
                formatChange = d3.format("+,d"),
                formatDate = d3.timeFormat("%B %d, %Y"),
                formatTime = d3.timeFormat("%I:%M %p");

            var nestByDate = d3.nest()
                .key(function(d) { return d3.time.day(d.date); });
            
            let chart = d3.selectAll(".chart")
                .data(charts)
                .each(function(chart) { chart.on("brush", renderAll).on("end", renderAll); });

            let list = d3.selectAll(".list")
                .data([flightList]);

            function render(method) {
                d3.select(this).call(method);
            }
            
            function renderAll() {
                chart.each(render);
                list.each(render);
                d3.select("#active").text(formatNumber(all.value()));
            }

            function flightList(div) {
                var flightsByDate = nestByDate.entries(date.top(40));
            
                div.each(function() {
                    var date = d3.select(this).selectAll(".date")
                        .data(flightsByDate, function(d) { return d.key; });
            
                    date.enter().append("div")
                        .attr("class", "date")
                    .append("div")
                        .attr("class", "day")
                        .text(function(d) { return formatDate(d.values[0].date); });
            
                    date.exit().remove();
            
                    var flight = date.order().selectAll(".flight")
                        .data(function(d) { return d.values; }, function(d) { return d.index; });
            
                    var flightEnter = flight.enter().append("div")
                        .attr("class", "flight");
            
                    flightEnter.append("div")
                        .attr("class", "time")
                        .text(function(d) { return formatTime(d.date); });
            
                    flightEnter.append("div")
                        .attr("class", "origin")
                        .text(function(d) { return d.origin; });
            
                    flightEnter.append("div")
                        .attr("class", "destination")
                        .text(function(d) { return d.destination; });
            
                    flightEnter.append("div")
                        .attr("class", "distance")
                        .text(function(d) { return formatNumber(d.distance) + " mi."; });
            
                    flightEnter.append("div")
                        .attr("class", "delay")
                        .classed("early", function(d) { return d.delay < 0; })
                        .text(function(d) { return formatChange(d.delay) + " min."; });
            
                    flight.exit().remove();
            
                    flight.order();
                });
            }