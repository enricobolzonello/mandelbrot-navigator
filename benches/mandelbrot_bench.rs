use criterion::{criterion_group, criterion_main, Criterion};
use mandelbrot_webapp::mandelbrot_image;

fn benchmark_mandelbrot(c: &mut Criterion) {
    const WIDTH: usize = 256;
    const HEIGHT: usize = 256;

    let scenarios = [
        (
            "mostly_black",
            -0.7, -0.5,
            -0.7, -0.5,
        ),
        (
            "edge_detail",
            -0.745, -0.735,
            0.1, 0.11,
        ),
        (
            "balanced",
            -1.5, -0.5,
            -0.5, 0.5,
        ),
        (
            "mostly_colored",
            0.2, 0.4,
            -0.1, 0.1,
        ),
        (
            "full_set",
            -2.0, 1.0,
            -1.5, 1.5,
        ),
    ];

    for (name, re_min, re_max, im_min, im_max) in scenarios.iter() {
        c.bench_function(&format!("mandelbrot_{}", name), |b| {
            b.iter(|| {
                mandelbrot_image(
                    *re_min,
                    *re_max,
                    *im_min,
                    *im_max,
                    WIDTH,
                    HEIGHT,
                    vec!["#3147AA".to_string(), "#08C0F5".to_string(), "#50F475".to_string(), "#60F800".to_string(), "#DFFB00".to_string()]
                )
            })
        });
    }
}

criterion_group!(benches, benchmark_mandelbrot);
criterion_main!(benches);