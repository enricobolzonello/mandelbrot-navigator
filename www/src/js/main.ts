import { init } from "mandelbrot-webapp";
import { GradientPicker } from "./gradient_picker"
import { MandelbrotLayer } from "./layer"
import "../css/input.css"
import "leaflet/dist/leaflet.css";

let mandelbrotLayer: MandelbrotLayer;

(async () => {
    try {
        const { MandelbrotLayer } = await import('./layer');
        const L = await import('leaflet');

        try {
            init();

            // Initialize GradientPicker with default colors
            const gradientPicker = new GradientPicker('colorPickerContainer', 'gradientPreview', 'addColorButton', 'submitButton');

            const map = L.map('mandelbrot-map', {
                crs: L.CRS.Simple,
                center: [0, 0],
                zoom: 3,
                minZoom: 3,
                maxZoom: 20,
                zoomControl: true
            });

            mandelbrotLayer = new MandelbrotLayer([-0.5, 0], gradientPicker.colors);
            mandelbrotLayer.addTo(map);
            map.setView([-120.0, 130.0], 3);

            // Listen for the custom "gradientSubmitted" event
            document.addEventListener('gradientSubmitted', (event: CustomEvent) => {
                const newColors = event.detail;
                mandelbrotLayer.updateGradient(newColors); // Update the gradient in the MandelbrotLayer
                map.eachLayer(layer => map.removeLayer(layer)); // Remove existing layer
                mandelbrotLayer = new MandelbrotLayer([-0.5, 0], newColors);
                mandelbrotLayer.addTo(map);
            });

        } catch (error) {
            console.error('Error in executing:', error);
        }
    } catch (error) {
        console.error('Error loading modules:', error);
    }
})();
