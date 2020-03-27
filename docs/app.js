"use strict";

const canvas = document.getElementById("app");
const ctx = canvas.getContext("2d");
const sliders = {
    scale: document.getElementById("scale-slider"),
    resolution: document.getElementById("resolution-slider"),
    maxIterations: document.getElementById("iteration-slider"),
    xmin: document.getElementById("x-pos-slider"),
    ymin: document.getElementById("y-pos-slider")
};

const colorSelect = document.getElementById("color-select");
const paramResetBtn = document.getElementById("param-reset-btn");

/* ==========
   Stillingar
   ========== */
let settings = {
    scale: 200,          // Stærð fractals
    resolution: 4,       // Upplausn (deilt með, þ.e. 4 = 1/4)
    maxIterations: 255,  // Hámarksfjöldi ítrana
    xmin: -2,            // Upphafsstaðsetning fractals (x)
    ymin: -2,            // Upphafsstaðsetning fractals (y)
    rendering: true,     // Á að rendera ef stillingum er breyttr?
    color: "bw",         // Í hvaða lit á fractalinn að vera
    // Formatting stillingar fyrir sliders
    sliderNumberFormat: {
        to(value) {
            return Math.round(value);
        },
        from(value) {
            return Math.round(value);
        }
    }
};

/* =======
   Sliders
   ======= */
noUiSlider.create(sliders.scale, {
    start: settings.scale,
    step: 1,
    tooltips: [true],
    range: {
        "min": 1,
        "max": 255
    },
    format: settings.sliderNumberFormat
});
noUiSlider.create(sliders.resolution, {
    start: settings.resolution,
    step: 1,
    range: {
        "min": 1,
        "max": 10
    },
    format: settings.sliderNumberFormat,
    tooltips: [{
        // Sýna upplausnartölu sem almenn brot (því það er deilt með henni)
        to(value) {
            return `1/${Math.round(value)}`;
        }
    }]
});
noUiSlider.create(sliders.maxIterations, {
    start: settings.maxIterations,
    step: 1,
    tooltips: [true],
    range: {
        "min": 1,
        "max": 255
    },
    format: settings.sliderNumberFormat
});
noUiSlider.create(sliders.xmin, {
    start: settings.xmin,
    step: 1,
    tooltips: [true],
    range: {
        "min": -10,
        "max": 5
    },
    format: settings.sliderNumberFormat
});
noUiSlider.create(sliders.ymin, {
    start: settings.ymin,
    step: 1,
    tooltips: [true],
    range: {
        "min": -10,
        "max": 5
    },
    format: settings.sliderNumberFormat
});

/* ====
   Föll
   ==== */
// Uppfæra stillingar og teikna fractal upp á nýtt ef á við
function updateSettingsValue(propertyName, newValue) {
    settings[propertyName] = newValue;
    if (settings.rendering) {
        render();
    }
}
// Núllstilla alla slidera
function resetAllSliders() {
    for (let key in sliders) {
        sliders[key].noUiSlider.reset();
    }
}
// Núllstilla lit í svarthvítt (upphafsgildi)
function resetColor() {
    colorSelect.querySelector("input[value='bw']").checked = true;
    settings.color = "bw";
}

/* ======
   Events
   ====== */
// Slider events
for (let key in sliders) {
    sliders[key].noUiSlider.on("set", val => updateSettingsValue(key, val[0]));  // Hver slider uppfærir stillingu með samsvarandi nafni
}
// Velja lit á fractal (radio takkar)
colorSelect.addEventListener("change", event => {
    settings.color = event.target.value;
    render();
});
// Takki til að núllstilla alla slidera og lit
paramResetBtn.addEventListener("click", event => {
    event.preventDefault();
    settings.rendering = false;
    resetAllSliders();
    resetColor();
    render();
    settings.rendering = true;
});

/* ================
   Fractal renderer
   ================ */
function render() {
    // Hreinsa canvas áður en byrjað er að teikna
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Raðir (x)
    for (let x = 0; x < canvas.width / settings.resolution; x++) {
        // Dálkar (y)
        for (let y = 0; y < canvas.height / settings.resolution; y++) {
            // Finna gildi á tvinnsléttu (e. complex plane)
            let cx = settings.xmin + x / (settings.scale / settings.resolution);
            let cy = settings.ymin + y / (settings.scale / settings.resolution);

            // Mandelbrot-fallaútreikningar
            let zx = 0;
            let zy = 0;

            // Stoppar ef zx^2 + zy^2 er hærra en eða jafnt og 4 því þá er ósamleitni og þá þarf ekki að halda áfram
            let i;
            for (i = 0; i < settings.maxIterations && (zx * zx + zy * zy) < 4; i++) {
                let xt = zx * zy;
                zx = zx * zx - zy * zy + cx;  // zx^2 - xy^2 + cx
                zy = 2 * xt + cy;             // 2xt + cy
            }

            // Velja lit fyrir hvern bút út frá því hve margar ítranir voru gerðar í lykkjunni hér að ofan
            const color = i.toString(16);

            // Teikna hvern bút
            ctx.beginPath();
            ctx.rect(x * settings.resolution, y * settings.resolution, settings.resolution, settings.resolution);
            // Velja hex lit út frá núverandi stillingu
            if (settings.color == "bw") {
                ctx.fillStyle = `#${color}${color}${color}`;  // Svarthvítt
            } else if (settings.color == "r") {
                ctx.fillStyle = `#${color}00`;                // Rauður
            } else if (settings.color == "g") {
                ctx.fillStyle = `#0${color}0`;                // Grænn
            } else if (settings.color == "b") {
                ctx.fillStyle = `#00${color}`;                // Blár
            }
            ctx.fill();
        }
    }
}
render();
