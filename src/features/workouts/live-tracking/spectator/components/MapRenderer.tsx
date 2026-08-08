import { MapContainer, TileLayer, GeoJSON, Marker, useMap } from 'react-leaflet'
import { CrosshairIcon } from '@phosphor-icons/react'
import L from 'leaflet'
import { runnerIcon } from '../mapIcon'

import 'leaflet/dist/leaflet.css'

interface MapRendererProps {
	currentPosition: [number, number] | null // np. [49.968, 20.430]
	routeGeoJson: any | null // parse file GPX
}

export function MapRenderer({ currentPosition, routeGeoJson }: MapRendererProps) {
	const defaultCenter: [number, number] = [49.968, 20.43]

	// -----------------------------------------------------------------
	// FUNCTION: Drawing points <wpt> from GPX
	// -----------------------------------------------------------------
	const renderWaypoint = (_feature: any, latlng: L.LatLng): L.Layer => {
		const feature = _feature
		const name = feature.properties.name || 'Punkt kontrolny'

		const customIcon = L.divIcon({
			className: 'bg-transparent border-none',
			html: `
       		<div class="flex flex-col items-center justify-center drop-shadow-md">
          		<div class="bg-neutral-900 border border-neutral-700 text-white text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap mb-1">
            		${name}
          		</div>
          		<div class="w-3 h-3 bg-yellow-500 border-2 border-black rounded-full"></div>
        	</div>
      		`,
			iconSize: [120, 40],
			iconAnchor: [60, 36],
		})

		return L.marker(latlng, { icon: customIcon })
	}

	return (
		<div className="relative z-0 h-full w-full">
			<MapContainer
				center={currentPosition || defaultCenter}
				zoom={13}
				scrollWheelZoom={true}
				className="h-full w-full bg-neutral-900"
				zoomControl={false}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
				/>

				{/* route and points (WPT) */}
				{routeGeoJson && (
					<GeoJSON
						data={routeGeoJson}
						style={{
							color: '#3b82f6',
							weight: 4,
							opacity: 0.7,
						}}
						pointToLayer={renderWaypoint}
					/>
				)}

				{currentPosition && <Marker position={currentPosition} icon={runnerIcon} />}

				{/* 3. center map */}
				<MapController currentPosition={currentPosition} />
			</MapContainer>
		</div>
	)
}

// -------------------------------------------------------------
// "center map"
// -------------------------------------------------------------
function MapController({ currentPosition }: { currentPosition: [number, number] | null }) {
	const map = useMap()

	const handleCenter = () => {
		if (currentPosition) {
			// center position with animation and zoom level 15
			map.flyTo(currentPosition, 15, { animate: true, duration: 1.5 })
		}
	}

	return (
		<button
			onClick={handleCenter}
			className="absolute right-6 bottom-6 z-400 cursor-pointer rounded-full border border-neutral-700 bg-black/80 p-3 text-white shadow-2xl backdrop-blur-md transition-all hover:bg-neutral-800 active:scale-95"
			title="Centruj na biegaczu"
		>
			<CrosshairIcon size={24} weight="bold" className="text-blue-500" />
		</button>
	)
}
