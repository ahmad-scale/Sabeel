import { useEffect, useState } from 'react'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const LocationSearchPanel = ({ query, onSelect }) => {
  const [suggestions, setSuggestions] = useState([])
  const [suggestionQuery, setSuggestionQuery] = useState('')
  const [error, setError] = useState('')
  const [errorQuery, setErrorQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim() || !MAPBOX_TOKEN) return undefined

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      setLoading(true)
      setError('')
      setErrorQuery('')
      try {
        const params = new URLSearchParams({
          q: query,
          access_token: MAPBOX_TOKEN,
          limit: '5',
          autocomplete: 'true',
          language: 'en',
        })
        const response = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?${params}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Place search failed (${response.status}).`)
        const data = await response.json()
        setSuggestions((data.features || []).map((feature) => {
          const context = feature.properties?.context || {}
          const coordinates = {
            longitude: feature.geometry.coordinates[0],
            latitude: feature.geometry.coordinates[1],
          }

          return {
            id: feature.id || `${coordinates.longitude},${coordinates.latitude}`,
            name: feature.properties?.full_address || feature.properties?.name || feature.place_name,
            details: [context.place?.name, context.region?.name, context.country?.name]
              .filter(Boolean)
              .join(', '),
            coordinates,
            countryCode: context.country?.country_code
              || context.country?.country_code_alpha_3
              || context.country?.name,
            regionCode: context.region?.region_code_full
              || context.region?.region_code
              || context.region?.name,
          }
        }))
        setSuggestionQuery(query.trim())
      } catch (searchError) {
        if (searchError.name !== 'AbortError') {
          setError(searchError.message)
          setErrorQuery(query.trim())
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 300)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [query])

  const visibleError = query.trim() && !MAPBOX_TOKEN
    ? 'Add VITE_MAPBOX_TOKEN to Frontend/.env to search places.'
    : errorQuery === query.trim() ? error : ''
  const visibleLoading = Boolean(query.trim() && MAPBOX_TOKEN && loading)

  return (
    <div className='max-h-64 overflow-y-auto'>
      {visibleLoading && <p className='px-2 py-3 text-sm text-slate-500'>Searching Mapbox…</p>}
      {visibleError && <p role='status' className='px-2 py-3 text-sm text-red-700'>{visibleError}</p>}
      {!visibleLoading && !visibleError && suggestionQuery === query.trim() && suggestions.length === 0 && (
        <p className='px-2 py-3 text-sm text-slate-500'>No matching places found.</p>
      )}
      {query.trim() && suggestionQuery === query.trim() && suggestions.map((suggestion) => (
        <button
          key={suggestion.id}
          type='button'
          onClick={() => onSelect(suggestion)}
          aria-label={`Select ${suggestion.name}`}
          className='my-1 flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-gray-50 p-3 text-left hover:border-emerald-800'
        >
          <i className='ri-map-pin-line text-2xl text-emerald-900' aria-hidden='true' />
          <span className='min-w-0'>
            <span className='block text-sm font-medium'>{suggestion.name}</span>
            {suggestion.details && (
              <span className='mt-0.5 block text-xs text-slate-500'>{suggestion.details}</span>
            )}
          </span>
        </button>
      ))}
    </div>
  )
}

export default LocationSearchPanel
