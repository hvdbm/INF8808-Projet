const fs = require('fs')
const csv = require('csv-parser');

let data = []
let map = new Map();

fs.createReadStream('V2_PORT_DATA.csv')
  .pipe(csv())
  .on('data', (row) => {
    transformDataPorts(row)
    data.push(row)
  })
  .on('end', () => {
    format()
    fs.writeFile('Output.csv', writeClean(), (err) => {
      if (err) throw err;
    }) 
});

fs.createReadStream('V2_MONTHS_DATA.csv')
  .pipe(csv())
  .on('data', (row) => {
    transformDataMonths(row)
    data.push(row)
  })
  .on('end', () => {
    format()
    fs.writeFile('Output.csv', writeClean(), (err) => {
      if (err) throw err;
    }) 
});

function transformDataPorts(data) {
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

function transformDataMonths(data) {
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
    console.log('test')
    return dataPerMonth
}