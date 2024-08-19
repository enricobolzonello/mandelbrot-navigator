import * as L from "leaflet";
import { mandelbrot_image } from "mandelbrot-webapp";

class MandelbrotLayer extends L.GridLayer {
    defaultPosition: [number, number];
    colors: string[];

    constructor(defaultPosition: [number, number], colors: string[]) {
        super({
            noWrap: true
        });
        this.defaultPosition = defaultPosition;
        this.colors = colors;
    }

    private tilePositionToComplexParts(
        x: number,
        y: number,
        zoom: number
    ): { re: number; im: number } {
        const scaleFactor = this.getTileSize().x / 128;
        const d = 2 ** (zoom - 2);
        const re = (x / d) * scaleFactor - 4 + this.defaultPosition[0];
        const im = (y / d) * scaleFactor - 4 + this.defaultPosition[1];
        return { re, im };
    }

    createTile(coords: L.Coords, done: L.DoneCallback) {
        const wrapper = document.createElement('div');
        const canvas = document.createElement('canvas');
    
        const tile_size = this.getTileSize(); 
        const ctx = canvas.getContext("2d");
    
        if (!ctx) {
            console.error('Failed to get 2D context');
            done(new Error('Failed to get 2D context'), null);
            return null;
        }
    
        canvas.width = tile_size.x;
        canvas.height = tile_size.y;
        
        wrapper.style.width = tile_size.x + 'px';
        wrapper.style.height = tile_size.y + 'px';
        wrapper.appendChild(canvas);
    
        setTimeout(() => {
            const {re: re_min, im: im_min} = this.tilePositionToComplexParts(coords.x, coords.y, coords.z);
            const {re: re_max, im: im_max} = this.tilePositionToComplexParts(coords.x+1, coords.y+1, coords.z);
    
            const data = mandelbrot_image(
                re_min,
                re_max,
                im_min,
                im_max,
                tile_size.x,
                tile_size.y,
                this.colors
            );
    
            const imageData = new ImageData(
                Uint8ClampedArray.from(data),
                tile_size.x,
                tile_size.y
            );
    
            ctx.putImageData(imageData, 0, 0);
    
            done(null, wrapper);
        }, 1);
    
        return wrapper;
    }

    updateGradient(newColors: string[]) {
        this.colors = newColors;
    }
}

export { MandelbrotLayer };
