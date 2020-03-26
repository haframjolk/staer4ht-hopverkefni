"use strict";

const canvas = document.getElementById("app");
const ctx = canvas.getContext("2d");
const scaleSlider = document.getElementById("scale-slider");
const resolutionSlider = document.getElementById("resolution-slider");
const maxIterationSlider = document.getElementById("iteration-slider");

/* ==========
   Stillingar
   ========== */
let scale = 50;           // Sjálfgefið 50
let resolution = 4;       // Sjálfgefið 4
let maxIterations = 255;  // Sjálfgefið 255

let xmin = -2;
let ymin = -2;

/* =======
   Sliders
   ======= */
noUiSlider.create(scaleSlider, {
    start: scale,
    step: 1,
    tooltips: [true],
    range: {
        "min": 1,
        "max": 200
    },
    format: {
        to(value) {
            return Math.round(value);
        },
        from(value) {
            return Math.round(value);
        }
    }
});
noUiSlider.create(resolutionSlider, {
    start: resolution,
    step: 1,
    range: {
        "min": 1,
        "max": 10
    },
    format: {
        to(value) {
            return Math.round(value);
        },
        from(value) {
            return Math.round(value);
        }
    },
    tooltips: [{
        // Sýna upplausnartölu sem almenn brot (því það er deilt með henni)
        to(value) {
            return `1/${Math.round(value)}`;
        }
    }]
});
noUiSlider.create(maxIterationSlider, {
    start: maxIterations,
    step: 1,
    tooltips: [true],
    range: {
        "min": 1,
        "max": 255
    },
    format: {
        to(value) {
            return Math.round(value);
        },
        from(value) {
            return Math.round(value);
        }
    }
});

// Slider events
scaleSlider.noUiSlider.on("set", val => { scale = val[0]; render(); });
resolutionSlider.noUiSlider.on("set", val => { resolution = val[0]; render(); });
maxIterationSlider.noUiSlider.on("set", val => { maxIterations = val[0]; render(); });

/* ================
   Fractal renderer
   ================ */
function render() {
    // Raðir (x)
    for (let x = 0; x < canvas.width / resolution; x++) {
        // Dálkar (y)
        for (let y = 0; y < canvas.height / resolution; y++) {
            // Finna gildi á tvinnsléttu (e. complex plane)
            let cx = xmin + x / scale;
            let cy = ymin + y / scale;

            // Mandelbrot-fallaútreikningar
            let zx = 0;
            let zy = 0;

            // Stoppar ef zx^2 + zy^2 er hærra en eða jafnt og 4 því þá er ósamleitni og þá þarf ekki að halda áfram
            let i;
            for (i = 0; i < maxIterations && (zx * zx + zy * zy) < 4; i++) {
                let xt = zx * zy;
                zx = zx * zx - zy * zy + cx;  // zx^2 - xy^2 + cx
                zy = 2 * xt + cy;             // 2xt + cy
            }

            // Velja lit fyrir hvern bút út frá því hve margar ítranir voru gerðar í lykkjunni hér að ofan
            const color = i.toString(16);

            // Teikna hvern bút
            ctx.beginPath();
            ctx.rect(x * resolution, y * resolution, resolution, resolution);
            ctx.fillStyle = `#${color}${color}${color}`;
            ctx.fill();
        }
    }
}
render();
