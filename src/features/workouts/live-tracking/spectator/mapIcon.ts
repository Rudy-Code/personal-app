import L from 'leaflet'

export const runnerIcon = L.divIcon({
	className: 'bg-transparent border-none',
	html: `
    <div class="relative flex items-center justify-center w-8 h-8 -ml-4 -mt-4">
      <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-60"></div>
      <div class="relative w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
    </div>
  `,
	iconSize: [0, 0],
})
