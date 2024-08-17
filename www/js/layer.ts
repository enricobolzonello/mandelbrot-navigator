import * as L from "leaflet";
import { mandelbrot_image } from "mandelbrot-webapp";

class MandelbrotLayer extends L.GridLayer {
    defaultPosition: [number, number];

    constructor(defaultPosition: [number, number]) {
        super({
            noWrap: true
        });
        this.defaultPosition = defaultPosition;
    }

    // TODO: i dont know that this function does lol
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

    createTile(coords: L.Coords, done: L.DoneCallback){
        const canvas = L.DomUtil.create(
            "canvas",
            "mandelbrot-tile"
        ) as HTMLCanvasElement;

        const tile_size = this.getTileSize().x; 
        const ctx = canvas.getContext("2d")!;
        canvas.height = tile_size;
        canvas.width = tile_size;

        const {re : re_min, im : im_min} = this.tilePositionToComplexParts(coords.x, coords.y, coords.z);
        const {re : re_max, im : im_max} = this.tilePositionToComplexParts(coords.x+1, coords.y+1, coords.z);

        const data = mandelbrot_image(
            re_min,
            re_max,
            im_min,
            im_max,
            tile_size,
            tile_size
        )

        const imageData = new ImageData(
            Uint8ClampedArray.from(data),
            tile_size,
            tile_size
        );

        ctx.putImageData(imageData, 0, 0);

        return canvas;
    }
}

export {MandelbrotLayer};