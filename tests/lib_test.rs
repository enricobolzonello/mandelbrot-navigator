#[cfg(test)]
mod tests {
    use mandelbrot_webapp::mandelbrot_image;


    #[test]
    fn test_mandelbrot_image_size() {
        let width = 100;
        let height = 80;
        let image = mandelbrot_image(-2.0, 1.0, -1.0, 1.0, width, height);
        assert_eq!(image.len(), width * height * 4);
    }

    #[test]
    fn test_mandelbrot_image_bounds() {
        let image = mandelbrot_image(-2.0, 1.0, -1.0, 1.0, 10, 10);
        assert!(image.iter().all(|&pixel| pixel <= 255));
    }

    #[test]
    fn test_mandelbrot_image_alpha() {
        let image = mandelbrot_image(-2.0, 1.0, -1.0, 1.0, 10, 10);
        assert!(image.iter().skip(3).step_by(4).all(|&alpha| alpha == 255));
    }

    #[test]
    fn test_mandelbrot_image_different_sizes() {
        let image1 = mandelbrot_image(-2.0, 1.0, -1.0, 1.0, 50, 50);
        let image2 = mandelbrot_image(-2.0, 1.0, -1.0, 1.0, 100, 100);
        assert_ne!(image1.len(), image2.len());
    }

    #[test]
    fn test_mandelbrot_image_zoom() {
        let image1 = mandelbrot_image(-2.0, 1.0, -1.0, 1.0, 100, 100);
        let image2 = mandelbrot_image(-1.0, 0.0, -0.5, 0.5, 100, 100);
        assert_ne!(image1, image2);
    }

    #[test]
    fn test_mandelbrot_image_corner_pixels() {
        let width = 10;
        let height = 10;
        let image = mandelbrot_image(-2.0, 1.0, -1.0, 1.0, width, height);
        
        // Check top-left corner
        assert_ne!(image[0..4], [0, 0, 0, 0]);
        
        // Check top-right corner
        assert_ne!(image[(width - 1) * 4..(width - 1) * 4 + 4], [0, 0, 0, 0]);
        
        // Check bottom-left corner
        assert_ne!(image[(height - 1) * width * 4..(height - 1) * width * 4 + 4], [0, 0, 0, 0]);
        
        // Check bottom-right corner
        assert_ne!(image[image.len() - 4..], [0, 0, 0, 0]);
    }
}