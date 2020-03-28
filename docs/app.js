"use strict";

/* ==========
   DOM fastar
   ========== */
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
const settings = {
    scale: 200,          // Stærð fractals
    resolution: 4,       // Upplausn (deilt með, þ.e. 4 = 1/4)
    maxIterations: 255,  // Hámarksfjöldi ítrana
    xmin: -2,            // Upphafsstaðsetning fractals (x)
    ymin: -2,            // Upphafsstaðsetning fractals (y)
    rendering: true,     // Á að rendera ef stillingum er breyttr?
    color: "bw",         // Í hvaða lit á fractalinn að vera
    // Formatting stillingar fyrir sliders (heiltölur)
    sliderNumberFormat: {
        to(value) {
            return Math.round(value);
        },
        from(value) {
            return Math.round(value);
        }
    },
    // Formatting stillingar fyrir sliders (tugabrot)
    sliderDecimalNumberFormat: {
        to(value) {
            return Number(parseFloat(value).toFixed(1));
        },
        from(value) {
            return Number(parseFloat(value).toFixed(1));
        }
    }
};

/* =======
   Sliders
   ======= */
noUiSlider.create(sliders.scale, {
    start: settings.scale,
    step: 10,
    range: {
        "min": 0,
        "max": 2000
    },
    format: settings.sliderNumberFormat,
    tooltips: [true]
});
noUiSlider.create(sliders.resolution, {
    start: settings.resolution,
    step: 1,
    range: {
        min: 1,
        max: 10
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
    range: {
        min: 1,
        max: 255
    },
    format: settings.sliderNumberFormat,
    tooltips: [true]
});
noUiSlider.create(sliders.xmin, {
    start: settings.xmin,
    step: 0.1,
    range: {
        min: -10,
        max: 5
    },
    format: settings.sliderDecimalNumberFormat,
    tooltips: [true]
});
noUiSlider.create(sliders.ymin, {
    start: settings.ymin,
    step: 0.1,
    range: {
        min: -10,
        max: 5
    },
    format: settings.sliderDecimalNumberFormat,
    tooltips: [true]
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
    for (const key in sliders) {
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
for (const key in sliders) {
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
    // Algrím byggt á http://slicker.me/fractals/fractals.htm
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
            // Liturinn er valinn í hlutfalli við hámarksfjölda ítrana
            let color = Math.round(i * (255 / settings.maxIterations)).toString(16);
            // Ef hex strengurinn fyrir litinn er bara 1 stafur, tvöfalda hann að lengd svo hann virki alltaf með núllum hér fyrir neðan
            if (color.length == 1) {
                color = color.repeat(2);
            }

            // Teikna hvern bút
            ctx.beginPath();
            ctx.rect(x * settings.resolution, y * settings.resolution, settings.resolution, settings.resolution);
            // Velja hex lit út frá núverandi stillingu
            if (settings.color == "bw") {
                ctx.fillStyle = `#${color}${color}${color}`;  // Svarthvítt
            } else if (settings.color == "r") {
                ctx.fillStyle = `#${color}0000`;              // Rauður
            } else if (settings.color == "g") {
                ctx.fillStyle = `#00${color}00`;              // Grænn
            } else if (settings.color == "b") {
                ctx.fillStyle = `#0000${color}`;              // Blár
            }
            ctx.fill();
        }
    }
}
render();
