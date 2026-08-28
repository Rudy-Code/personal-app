
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] })],
	resolve: {
		tsconfigPaths: true,
		alias: {
			'@': path.resolve(import.meta.dirname, './src'),
			'@features': path.resolve(import.meta.dirname, './src/features'),
			'@components': path.resolve(import.meta.dirname, './src/components'),
			'@stores': path.resolve(import.meta.dirname, './src/stores'),
		},
	},
	build: {
		rolldownOptions: {
			output: {
				codeSplitting: {
					groups: [
						{
							name: 'lucide',
							test: /node_modules[\\/]lucide-react[\\/]/,
							priority: 40,
						},
						{
							name: 'react-vendor',
							test: /node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/,
							priority: 30,
						},
						{
							name: 'leaflet',
							test: /node_modules[\\/](leaflet|react-leaflet|@react-leaflet)[\\/]/,
							priority: 20,
						},
						{
							name: 'recharts',
							test: /node_modules[\\/](recharts|victory-|d3-|internmap|delaunator)[\\/]/,
							priority: 20,
						},
					],
				},
			},
		},
	},
})
