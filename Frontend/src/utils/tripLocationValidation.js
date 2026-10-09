const normalizeRegion = (value) => String(value || '').trim().toLowerCase()

export const getTripLocationError = (pickup, destination) => {
  const pickupCountry = normalizeRegion(pickup?.countryCode)
  const destinationCountry = normalizeRegion(destination?.countryCode)
  const pickupRegion = normalizeRegion(pickup?.regionCode)
  const destinationRegion = normalizeRegion(destination?.regionCode)

  if (!pickupCountry || !destinationCountry || !pickupRegion || !destinationRegion) {
    return 'We could not verify that both locations are within a state or region. Please choose different locations. The request was canceled.'
  }

  if (pickupCountry !== destinationCountry || pickupRegion !== destinationRegion) {
    return 'Trips must start and end within the same state or region of one country. The request was canceled.'
  }

  return ''
}
