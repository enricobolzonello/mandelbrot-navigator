import { init } from "mandelbrot-webapp";
import "leaflet/dist/leaflet.css";

(async () => {
	try {
		const { MandelbrotLayer } = await import('./layer');
		const L = await import('leaflet');

		try {
			init();
			var map = L.map('mandelbrot-map', {
				crs: L.CRS.Simple,
				center: [0, 0],
				zoom: 3,
				minZoom: 3,
				maxZoom: 20,
				zoomControl: true
			});
			const layer = new MandelbrotLayer([-0.5, 0]);
			layer.addTo(map);
			map.setView([-120.0, 130.0], 3);
		} catch (error) {
			console.error('Error in executing:', error);
		}
	} catch (error) {
		console.error('Error loading modules:', error);
	}
})();
