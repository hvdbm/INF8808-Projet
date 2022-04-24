export const GLOBAL_VESSEL_TYPE = ['Barges', 'Excursion', 'Fishing', 'Merchant', 'Other', 'Pleasure Crafts', 'Tanker', 'Tugs']
export const REGION_NAME = ['Arctic', 'Central', 'East Canadian Water', 'Newfoundland', 'Maritimes', 'Pacific', 'Quebec', 'St. Lawrence Seaway', 'West Canadian Water']
export const REGION_COLOR = ['#CAB2D6', '#6A3D9A', '#33A02C', '#FB9A99', '#FDBF6F', '#E31A1C', '#1F78B4', '#A6CEE3', '#FF7F00']
export const REGION_NAME_ALT = ['Arctic', 'Central', 'East_Canadian_Water', 'Newfoundland', 'Maritimes', 'Pacific', 'Quebec', 'St_Lawrence_Seaway', 'West_Canadian_Water']

export function heatmapMap() {
  let map = new Map()

  REGION_NAME.forEach((region) => {
    GLOBAL_VESSEL_TYPE.forEach((type) => {
      const key = region + type
      map.set(key, {
        'Region': region,
        'Type': type,
        'count': 0
      })
    })
  })
  return map
}

export function chordMatrix(data, departureDate, arrivalDate) {
  const matrix = new Array(REGION_NAME.length)
  for (let index = 0; index < matrix.length; index++) {
    matrix[index] = new Array(REGION_NAME.length)
  }
  
  REGION_NAME.forEach((departureRegion, i) => {
    REGION_NAME.forEach((arrivalRegion, j) => {
      matrix[i][j] = data
        .filter((d) => {
          return departureRegion === d['Departure Region'].slice(0,-7)
            && arrivalRegion === d['Arrival Region'].slice(0,-7)
            && departureDate <= d['Departure Date']
            && arrivalDate >= d['Arrival Date']
        })
        .map((value) => value.count)
        .reduce((partialSum, v) => Number(partialSum) + Number(v), 0)
    })
  })

  return matrix
}