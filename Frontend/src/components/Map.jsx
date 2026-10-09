import { useEffect, useRef, useState } from 'react'
import MapGL, { Layer, Marker, NavigationControl, Source } from 'react-map-gl/mapbox'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const DEFAULT_VIEW = { longitude: 74.3587, latitude: 31.5204, zoom: 11 };
const ignoreRouteInfo = () => {}

const isCoordinate = (point) =>
  point && Number.isFinite(point.longitude) && Number.isFinite(point.latitude)

const MapComponent = ({
  pickup,
  destination,
  driverLocation,
  showUserLocation = false,
  className = '',
  onRouteInfo = ignoreRouteInfo,
}) => {
  const [userLocation, setUserLocation] = useState(null)
  const [route, setRoute] = useState(null)
  const [mapError, setMapError] = useState('')
  const userCentered = useRef(false)
  const mapRef = useRef(null)
  const routeKey = isCoordinate(pickup) && isCoordinate(destination)
    ? `${pickup.longitude},${pickup.latitude};${destination.longitude},${destination.latitude}`
    : null

  useEffect(() => {
    if (!MAPBOX_TOKEN || !showUserLocation || !navigator.geolocation) return undefined

    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        setUserLocation({
          longitude: coords.longitude,
          latitude: coords.latitude,
        })
      },
      (error) => setMapError(`Unable to read your location: ${error.message}`),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [showUserLocation])

  useEffect(() => {
    if (!MAPBOX_TOKEN || !routeKey) {
      return undefined
    }

    const controller = new AbortController()
    const params = new URLSearchParams({
      geometries: 'geojson',
      overview: 'full',
      access_token: MAPBOX_TOKEN,
    })

    fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${routeKey}?${params}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Mapbox directions returned ${response.status}`)
        return response.json()
      })
      .then((data) => {
        const directions = data.routes?.[0]
        if (!directions) throw new Error('No driving route was found for these locations.')
        const routeData = {
          key: routeKey,
          geometry: directions.geometry,
          distance: directions.distance,
          duration: directions.duration,
        }
        setRoute(routeData)
        onRouteInfo({
          key: routeKey,
          distance: directions.distance,
          duration: directions.duration,
        })
        setMapError('')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setMapError(error.message)
        }
      })

    return () => controller.abort()
  }, [routeKey, onRouteInfo])

  useEffect(() => {
    if (isCoordinate(pickup) && isCoordinate(destination)) {
      mapRef.current?.fitBounds([
        [
          Math.min(pickup.longitude, destination.longitude),
          Math.min(pickup.latitude, destination.latitude),
        ],
        [
          Math.max(pickup.longitude, destination.longitude),
          Math.max(pickup.latitude, destination.latitude),
        ],
      ], { padding: 80, maxZoom: 14, duration: 800 })
      return
    }
    const latestPoint = pickup || destination
    if (latestPoint) mapRef.current?.flyTo({
      center: [latestPoint.longitude, latestPoint.latitude],
      zoom: 13,
      duration: 800,
    })
  }, [pickup, destination])

  useEffect(() => {
    if (isCoordinate(driverLocation)) mapRef.current?.flyTo({
      center: [driverLocation.longitude, driverLocation.latitude],
      zoom: 14,
      duration: 800,
    })
  }, [driverLocation])

  useEffect(() => {
    if (userLocation && !userCentered.current && !pickup && !destination && !driverLocation) {
      userCentered.current = true
      mapRef.current?.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 13,
        duration: 800,
      })
    }
  }, [userLocation, pickup, destination, driverLocation])

  if (!MAPBOX_TOKEN) {
    return (
      <div className={`flex h-full min-h-64 items-center justify-center bg-slate-100 p-6 text-center ${className}`}>
        <div className='max-w-sm rounded-2xl bg-white p-5 shadow'>
          <i className='ri-map-2-line text-4xl text-emerald-900' aria-hidden='true' />
          <p className='mt-2 font-semibold text-emerald-950'>Mapbox is ready to connect</p>
          <p className='mt-1 text-sm text-slate-600'>Add VITE_MAPBOX_TOKEN to Frontend/.env to display the map.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative h-full min-h-64 w-full ${className}`}>
      <MapGL
        ref={mapRef}
        initialViewState={DEFAULT_VIEW}
        mapStyle='mapbox://styles/mapbox/streets-v12'
        mapboxAccessToken={MAPBOX_TOKEN}
        onError={(event) => setMapError(event.error?.message || 'The map could not be loaded.')}
        attributionControl
      >
        <NavigationControl position='bottom-right' />
        {pickup && isCoordinate(pickup) && (
          <Marker longitude={pickup.longitude} latitude={pickup.latitude} color='#047857' anchor='bottom'>
            <span className='rounded-full bg-white px-2 py-1 text-xs font-bold text-emerald-900 shadow'>Pickup</span>
          </Marker>
        )}
        {destination && isCoordinate(destination) && (
          <Marker longitude={destination.longitude} latitude={destination.latitude} color='#dc2626' anchor='bottom'>
            <span className='rounded-full bg-white px-2 py-1 text-xs font-bold text-red-800 shadow'>Drop-off</span>
          </Marker>
        )}
        {driverLocation && isCoordinate(driverLocation) && (
          <Marker longitude={driverLocation.longitude} latitude={driverLocation.latitude} anchor='center'>
            <span className='flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-emerald-800 text-xl text-white shadow-lg'>
              <i className='ri-taxi-line' aria-label='Driver location' />
            </span>
          </Marker>
        )}
        {userLocation && (
          <Marker longitude={userLocation.longitude} latitude={userLocation.latitude} anchor='center'>
            <span className='block h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow' aria-label='Your location' />
          </Marker>
        )}
        {route?.key === routeKey && route.geometry && (
          <Source id='ride-route' type='geojson' data={{ type: 'Feature', properties: {}, geometry: route.geometry }}>
            <Layer
              id='ride-route-line'
              type='line'
              paint={{ 'line-color': '#047857', 'line-width': 5, 'line-opacity': 0.8 }}
              layout={{ 'line-cap': 'round', 'line-join': 'round' }}
            />
          </Source>
        )}
      </MapGL>
      {mapError && (
        <p role='status' className='absolute bottom-3 left-3 max-w-[85%] rounded-lg bg-white/95 px-3 py-2 text-xs text-red-700 shadow'>
          {mapError}
        </p>
      )}
    </div>
  )
}

export default MapComponent
