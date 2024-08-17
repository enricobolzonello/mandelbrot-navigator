import { init } from "mandelbrot-webapp";

(async () => {
	try {
		const { MandelbrotLayer } = await import('./layer');
		const L = await import('leaflet');

		try {
			init();
			var map = L.map('mandelbrot-map').setView([ 0, 0 ], 2);
			const layer = new MandelbrotLayer([ -0.5, 0 ]);
			layer.addTo(map);
		} catch (error) {
			console.error('Error in DOMContentLoaded:', error);
		}
	} catch (error) {
		console.error('Error loading modules:', error);
	}
})();
