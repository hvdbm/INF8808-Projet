const fs = require('fs')
const csv = require('csv-parser');

let data = []
let v1 = []
let map = new Map();

fs.createReadStream('TRIP_V1.csv')
  .pipe(csv())
  .on('data', (row) => {
    // clean(row)
    data.push(row)
  })
  .on('end', () => {
    console.log('data:', data.length)
    // console.log('data', data[0])
    console.log('CSV file successfully processed');
    // formatV1()
    // formatV1_2()
    groupByThirdMonth()
    // console.log('v1:', v1.length)
    console.log('map;', map.size)
    console.log('Format V1 succeed')
    fs.writeFile('Output.csv', writeClean(), (err) => {
      if (err) throw err;
    }) 
});

function findGlobalVesselType(vesselType) {
  if (['Barge Bulk Cargo', 'Barge Chemical','Barge Chips','Barge Derrick','Barge General','Barge Log','Barge Miscellaneous','Barge Oil Drilling Rig', 'Barge Oil/Petroleum', 'Barge Rail/Trailer','Barge Self-Propelled','Barge Towed',"Don't use",'Landing Craft','Logs Raft Section'].includes(vesselType)) {
    return 'Barges'
  } else if (['Excursion Passenger'].includes(vesselType)) {
    return 'Excursion'
  } else if (['Crab Boat', 'Dragger (Scallop, Clam, etc.)', 'Factory Ship', 'Fishery Patrol', 'Fishing Vessel', 'Gillnetter', 'Groundfish Boat (Open Boat)', 'Lobster Boat', 'Longliner', 'Other Fishing VSL (Open Boat)', 'Seiner', 'Shrimp Boat', 'Trawler', 'Troller'].includes(vesselType)) {
    return 'Fishing'
  } else if (['Cruise', 'Merchant (Dry)', 'Merchant Auto', 'Merchant Bulk', 'Merchant Cement', 'Merchant Coastal', 'Merchant Container', 'Merchant Ferry', 'Merchant General', 'Merchant Lash', 'Merchant Livestock', 'Merchant Ore', 'Merchant Passenger', 'Merchant Rail/Trailer Ferry', 'Merchant Reefer', 'Merchant RO/RO'].includes(vesselType)) {
    return 'Merchant'
  } else if (['Yacht - Pleasure Crafts', 'Yacht Power', 'Yacht Sails'].includes(vesselType)) {
    return 'Pleasure Crafts'
  } else if(['Merchant (Tanker)', 'Merchant Chemical', 'Merchant Chemical/Oil Products Tanker','Merchant Crude','Merchant Gasoline','Merchant Liquified Gas','Merchant Molasses','Merchant Ore/Bulk/Oil','Merchant Super Tanker','Merchant ULCC','Merchant VLCC','Merchant Water'].includes(vesselType)) {
    return 'Tanker'
  } else if (['Tug', 'Tug Fire', 'Tug Harbour', 'Tug Ocean', 'Tug Supply', 'Tugs Workboat'].includes(vesselType)) {
    return 'Tugs'
  } else {
    return 'Other'
  }
}

function clean(element) {
  if (element['Lenght'] != 0 && 
      element['Width'] != 0 & 
      element['Maximum Draugth'] < 30 &&
      element['Departure Date'] < ['Arrival Date']) {
    data.push({
      'Arrival Date': element['Arrival Date'].substring(0,10),
      'Arrival Hardour': element['Arrival Hardour'],
      'Arrival Region': element['Arrival Region'],
      'DeadWeight Tonnage': element['DeadWeight Tonnage'],
      'Departure Date': element['Departure Date'].substring(0, 10),
      'Departure Hardour': element['Departure Hardour'],
      'Departure Region': element['Departure Region'],
      'Lenght': element['Lenght'],
      'Maximum Draugth': element['Maximum Draugth'],
      'Vessel Type': element['Vessel Type'],
      'Global Vessel Type': findGlobalVesselType(element['Vessel Type']),
      'Width': element['Width']
    })
  }
}

function writeClean() {
  let csv2 = []
  const mapArray = Array.from(map.values())

  console.log(Object.keys(mapArray[0]))

  csv2.push(Object.keys(mapArray[0]).map((key) => {
    if (key.includes(',')) return `"${key}"`
    return key
  }).join(','))

  // csv2.push(Object.keys(data[0]).join(','))

  mapArray.forEach(element => {
    csv2.push(Object.values(element).map((value) => {
      if (value.toString().includes(',')) return `"${value}"`
      return value
    }).join(','));
  })

  return csv2.join('\n')
}

function formatV1() {
  let current = '';
  data.forEach((element, index) => {
    if (element['Departure Date'].slice(0, 8) !== current) {
      current = element['Departure Date'].slice(0, 4)
      console.log(current, `element ${index}`)
    }

    let departureDate = new Date(element['Departure Date']);
    let arrivalDate = new Date(element['Arrival Date']);
    for (var d = departureDate; d <= arrivalDate; d.setDate(d.getDate() + 1)) {
      const index = v1.findIndex((v => { return v.date === d.toISOString().slice(0, 10) && v.type === element['Global Vessel Type'] }));
      if (index == -1) {
        v1.push({
          date: d.toISOString().slice(0, 10),
          type: element['Global Vessel Type'],
          count: 1
        })
      } else {
        v1[index].count++
      }
    }
  })
}

// const GLOBAL_VESSEL_TYPE = ['Barges', 'Excursion', 'Fishing', 'Merchant', 'Other Type', 'Pleasure Crafts', 'Tankers', 'Tugs']

function formatV1_2() {
  data.forEach((d) => {
    const key = d.date;

    if (!map.has(key)) {
      const line = {
        'date': d.date,
        'Fishing': 0,
        'Other': 0,
        'Barges': 0,
        'Tugs': 0,
        'Tanker': 0,
        'Pleasure Crafts': 0,
        'Excursion': 0,
        'Merchant': 0
      }
      
      line[d.type] += Number(d.count)
      map.set(key, line)
    } else {
      const line = map.get(key)
      line[d.type] += Number(d.count)
      map.set(key, line)
    }

  })
}

function groupByMonth() {
  data.forEach((d) => {
    // console.log(d)
    const key = d.date.slice(0, 7)
    if (!map.has(key)) {
      const line = {
        'date': key+"-01",
        'Merchant': 0,
        'Barges': 0,
        'Other': 0,
        'Tugs': 0,
        'Tanker': 0,
        'Fishing': 0,
        'Pleasure Crafts': 0,
        'Excursion': 0
      }

      line[d.type] += Number(d.count)
      map.set(key, line)
    } else {
      const line = map.get(key)
      line[d.type] += Number(d.count)
      map.set(key, line)
    }
  })
}

function groupByHalfMonth() {
  data.forEach((d) => {
    // console.log(d)
    const month = d.date.slice(0, 7)
    const day = Number(d.date.slice(8)) > 15 ? '15' : '01'

    const key = `${month}-${day}`

    if (!map.has(key)) {
      const line = {
        'date': key,
        'Merchant': 0,
        'Barges': 0,
        'Other': 0,
        'Tugs': 0,
        'Tanker': 0,
        'Fishing': 0,
        'Pleasure Crafts': 0,
        'Excursion': 0
      }

      line[d.type] += Number(d.count)
      map.set(key, line)
    } else {
      const line = map.get(key)
      line[d.type] += Number(d.count)
      map.set(key, line)
    }
  })
}

function groupByWeek() {
  data.forEach((d) => {
    // console.log(d)
    const month = d.date.slice(0, 7)
    const dayNumber = Number(d.date.slice(8))
    let day;

    if (dayNumber < 8) {
      day = "01"
    } else if (dayNumber < 15) {
      day = "08"
    } else if (dayNumber < 22) {
      day = "15"
    } else {
      day = "22"
    }

    const key = `${month}-${day}`

    if (!map.has(key)) {
      const line = {
        'date': key,
        'Merchant': 0,
        'Barges': 0,
        'Other': 0,
        'Tugs': 0,
        'Tanker': 0,
        'Fishing': 0,
        'Pleasure Crafts': 0,
        'Excursion': 0
      }

      line[d.type] += Number(d.count)
      map.set(key, line)
    } else {
      const line = map.get(key)
      line[d.type] += Number(d.count)
      map.set(key, line)
    }
  })
}

function groupByThirdMonth() {
  data.forEach((d) => {
    // console.log(d)
    const month = d.date.slice(0, 7)
    const dayNumber = Number(d.date.slice(8))
    let day;

    if (dayNumber < 11) {
      day = "10"
    } else if (dayNumber < 21) {
      day = "20"
    } else {
      day = "30"
    }

    const key = `${month}-${day}`

    if (!map.has(key)) {
      const line = {
        'date': key,
        'Other': 0,
        'Tugs': 0,
        'Fishing': 0,
        'Barges': 0,
        'Tanker': 0,
        'Pleasure Crafts': 0,
        'Excursion': 0,
        'Merchant': 0

      }

      line[d.type] += Number(d.count)
      map.set(key, line)
    } else {
      const line = map.get(key)
      line[d.type] += Number(d.count)
      map.set(key, line)
    }
  })
}

function groupBy5() {
  data.forEach((d) => {
    // console.log(d)
    const month = d.date.slice(0, 7)
    const dayNumber = Number(d.date.slice(8))
    let day;

    if (dayNumber < 6) {
      day = "01"
    } else if (dayNumber < 11) {
      day = "06"
    } else if (dayNumber < 16) {
      day = "11"
    } else if (dayNumber < 21) {
      day = "16"
    } else if (dayNumber < 26) {
      day = "21"
    } else {
      day = "26"
    }

    const key = `${month}-${day}`

    if (!map.has(key)) {
      const line = {
        'date': key,
        'Merchant': 0,
        'Barges': 0,
        'Other': 0,
        'Tugs': 0,
        'Tanker': 0,
        'Fishing': 0,
        'Pleasure Crafts': 0,
        'Excursion': 0
      }

      line[d.type] += Number(d.count)
      map.set(key, line)
    } else {
      const line = map.get(key)
      line[d.type] += Number(d.count)
      map.set(key, line)
    }
  })
}