pub mod utils;

use num::{complex::ComplexFloat, Complex};
use utils::set_panic_hook;
use wasm_bindgen::prelude::*;
use colorgrad::{Gradient, GradientBuilder};
use itertools_num::linspace;

extern crate web_sys;

const EPSILON: f64 = 1.0e-7;
const MAX_ITERATION: usize = 1000;


// Cardioid and period-2 bulb test
fn is_in_cardioid_or_bulb(c: Complex<f64>) -> bool {
    // Cardioid test
    let norm_sqr = c.norm_sqr();
    if 256.0 * norm_sqr * norm_sqr - 96.0 * norm_sqr + 32.0 * c.re() - 3.0 < 0.0 + EPSILON {
        return true;
    }

    false
}

// Smooth iteration count method to calculate the color based on the number of iterations
fn get_mandelbrot_color(
    re: f64,
    im: f64,
    gradient: &dyn Gradient,
) -> u32 {
    let c = Complex::new(re, im);

    if is_in_cardioid_or_bulb(c) {
        return 0;
    }

    let mut z = c;
    let mut iteration: usize = 0;

    while z.norm_sqr() < 4.0 && iteration < MAX_ITERATION {
        z = z * z + c;
        iteration += 1;
    }

    // Smooth iteration count
    let smooth_iteration = iteration as f64 + 1.0 - ((z.norm().ln()).ln() / 2.0f64.ln());

    if iteration < MAX_ITERATION {
        let c = gradient.at(smooth_iteration as f32 / MAX_ITERATION as f32).to_rgba8();
        (c[0] as u32) << 16 | (c[1] as u32) << 8 | c[2] as u32
    } else {
        0 // black for points within the set
    }
}

#[wasm_bindgen]
pub fn mandelbrot_image(
    re_min: f64,
    re_max: f64,
    im_min: f64,
    im_max: f64,
    image_width: usize,
    image_height: usize,
    colors: Vec<String>
) -> Vec<u8> {
    // Build the gradient once and reuse it for all pixels
    let gradient = GradientBuilder::new()
        .html_colors(&colors[..])
        .build::<colorgrad::CatmullRomGradient>()
        .unwrap();

    // Generate grid of complex numbers and the corresponding pixel colors
    let values_re = linspace(re_min, re_max, image_width); // reals on the x-axis
    let values_im = linspace(im_min, im_max, image_height); // imaginaries on the y-axis

    let mut image: Vec<u8> = vec![0; image_width * image_height * 4];

    for (y, im) in values_im.enumerate() {
        for (x, re) in values_re.clone().enumerate() {
            let index = (y * image_width + x) * 4;
            let pixel = get_mandelbrot_color(re, im, &gradient);

            image[index] = ((pixel >> 16) & 0xFF) as u8;        // Red
            image[index + 1] = ((pixel >> 8) & 0xFF) as u8;     // Green
            image[index + 2] = (pixel & 0xFF) as u8;            // Blue
            image[index + 3] = 255;                             // Alpha
        }
    }

    image
}

#[wasm_bindgen]
pub fn init() {
    set_panic_hook();
}
