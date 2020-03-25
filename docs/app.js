"use strict";

const canvas = document.getElementById("app");
const ctx = canvas.getContext("2d");
const scaleSlider = document.getElementById("scale-slider");
const maxIterationSlider = document.getElementById("iteration-slider");

/* ==========
   Stillingar
   ========== */
let scale;          // Sjálfgefið 4
let maxIterations;  // Sjálfgefið 255

/* =======
   Sliders
   ======= */
noUiSlider.create(scaleSlider, {
    start: 4,
    step: 1,
    tooltips: [true],
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
    }
});

noUiSlider.create(maxIterationSlider, {
    start: 255,
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
scaleSlider.noUiSlider.on("update", val => { scale = val[0]; render(); });
maxIterationSlider.noUiSlider.on("update", val => { maxIterations = val[0]; render(); });

function render() {
    // Raðir (x)
    for (let x = 0; x < canvas.width / scale; x++) {
        // Dálkar (y)
        for (let y = 0; y < canvas.height / scale; y++) {
            // Finna gildi á tvinnsléttu (e. complex plane)
            let cx = -2 + x / (200 / scale);
            let cy = -2 + y / (200 / scale);

            // TODO: http://slicker.me/fractals/zoom.htm

            // Mandelbrot-fallaútreikningar
            let zx = 0;
            let zy = 0;

            // Stoppar ef zx^2 + zy^2 er hærra en eða jafnt og scale því þá er ósamleitni og þá þarf ekki að halda áfram
            let i;
            for (i = 0; i < maxIterations && (zx * zx + zy * zy) < scale; i++) {
                let xt = zx * zy;
                zx = zx * zx - zy * zy + cx;  // zx^2 - xy^2 + cx
                zy = 2 * xt + cy;             // 2xt + cy
            }

            // Velja lit fyrir hvern bút út frá því hve margar ítranir voru gerðar í lykkjunni hér að ofan
            const color = i.toString(16);

            // Teikna hvern bút
            ctx.beginPath();
            ctx.rect(x * scale, y * scale, scale, scale);
            ctx.fillStyle = `#${color}${color}${color}`;
            ctx.fill();
        }
    }
}
// Óþarfi að kalla á render því, sliderarnir gerir það þegar þeir eru tilbúnir
// render();
