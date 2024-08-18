use image::{ImageBuffer, Rgb};
use wasm_bindgen::prelude::*;

use crate::mandelbrot_image;

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

pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

pub fn save_mandelbrot_png(
    filename: &str,
    re_min: f64,
    re_max: f64,
    im_min: f64,
    im_max: f64,
    image_width: usize,
    image_height: usize,
) -> Result<(), image::ImageError> {
    // Get the raw pixel data from mandelbrot_image
    let pixels = mandelbrot_image(re_min, re_max, im_min, im_max, image_width, image_height);

    // Create a new ImageBuffer
    let mut img = ImageBuffer::new(image_width as u32, image_height as u32);

    // Fill the ImageBuffer with the pixel data
    for (x, y, pixel) in img.enumerate_pixels_mut() {
        let idx = (y as usize * image_width + x as usize) * 4;
        *pixel = Rgb([
            pixels[idx],     // Red
            pixels[idx + 1], // Green
            pixels[idx + 2], // Blue
        ]);
    }

    // Save the image
    img.save(filename)
}
