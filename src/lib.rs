mod utils;

use num::Complex;
use utils::set_panic_hook;
use wasm_bindgen::prelude::*;

use itertools_num::linspace;

extern crate web_sys;

// A macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

const MAX_ITERATION: usize = 1000;

const MAPPING: [(u8, u8, u8); 16] = [
    (66, 30, 15),
    (25, 7, 26),
    (9, 1, 47),
    (4, 4, 73),
    (0, 7, 100),
    (12, 44, 138),
    (24, 82, 177),
    (57, 125, 209),
    (134, 181, 229),
    (211, 236, 248),
    (241, 233, 191),
    (248, 201, 95),
    (255, 170, 0),
    (204, 128, 0),
    (153, 87, 0),
    (106, 52, 3),
];

fn gradient_color_interpolation(n: f64) -> u32 {
    if n < MAX_ITERATION as f64 && n > 0.0 {
        let i1 = (n.floor() as usize) % 16;
        let i2 = (i1 + 1) % 16;
        let fraction = n.fract();

        let (r1, g1, b1) = MAPPING[i1];
        let (r2, g2, b2) = MAPPING[i2];

        let r = r1 as f64 * (1.0 - fraction) + r2 as f64 * fraction;
        let g = g1 as f64 * (1.0 - fraction) + g2 as f64 * fraction;
        let b = b1 as f64 * (1.0 - fraction) + b2 as f64 * fraction;

        (r as u32) << 16 | (g as u32) << 8 | b as u32
    } else {
        return 0;
    }
}

fn get_mandelbrot_color(re: f64, im: f64) -> u32 {
    let c = Complex::new(re, im);
    let mut z = c;

    let mut iteration: usize = 0;

    while z.norm_sqr() < 4.0 && iteration < MAX_ITERATION {
        z = z * z + c;

        iteration += 1;
    }

    // float sn = n - log(log(length(z))/log(B))/log(2.0); // smooth iteration count
    // reference: https://iquilezles.org/articles/msetsmooth/
    let smooth_iteration = iteration as f64 - ((z.norm().ln() / 2.0f64.ln()).ln() / 2.0f64.ln());

    return gradient_color_interpolation(smooth_iteration);
}

#[wasm_bindgen]
pub fn mandelbrot_image(
    re_min: f64,
    re_max: f64,
    im_min: f64,
    im_max: f64,
    image_width: usize,
    image_height: usize
) -> Vec<u8> {
    // generate grid of complex numbers
    let values_re = linspace(re_min, re_max, image_width);  // reals on the x-axis
    let values_im = linspace(im_min, im_max, image_height); // imaginaries on the y-axis
    let mut image: Vec<u8> = vec![0; image_width * image_height * 4];
    for (y, im) in values_im.enumerate() {
        for (x, re) in values_re.clone().enumerate() {
            let pixel = get_mandelbrot_color(re, im);
            let index = (y * image_width + x) * 4;
            image[index] = ((pixel >> 16) & 0xFF) as u8;        // Red
            image[index + 1] = ((pixel >> 8) & 0xFF) as u8;     // Green
            image[index + 2] = (pixel & 0xFF) as u8;            // Blue
            image[index + 3] = 255;                             // Alpha
        }
    }
    image
}

#[wasm_bindgen]
pub fn init(){
    set_panic_hook();
}