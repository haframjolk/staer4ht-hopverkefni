"use strict";

const canvas = document.getElementById("app");
const ctx = canvas.getContext("2d");
const scaleSlider = document.getElementById("scale-slider");
const resolutionSlider = document.getElementById("resolution-slider");
const maxIterationSlider = document.getElementById("iteration-slider");
const xPosSlider = document.getElementById("x-pos-slider");
const yPosSlider = document.getElementById("y-pos-slider");
const sliders = [scaleSlider, resolutionSlider, maxIterationSlider, xPosSlider, yPosSlider];
const sliderResetBtn = document.getElementById("slider-reset-btn");
const colorSelect = document.getElementById("color-select");

/* ==========
   Stillingar
   ========== */
let settings = {
    scale: 200,          // Stærð fractals
    resolution: 4,       // Upplausn (deilt með, þ.e. 4 = 1/4)
    maxIterations: 255,  // Hámarksfjöldi ítrana
    xmin: -2,            // Upphafsstaðsetning fractals (x)
    ymin: -2,            // Upphafsstaðsetning fractals (y)
    rendering: true,
    color: "bw"
};

/* =======
   Sliders
   ======= */
noUiSlider.create(scaleSlider, {
    start: settings.scale,
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
noUiSlider.create(resolutionSlider, {
    start: settings.resolution,
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
    start: settings.maxIterations,
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
noUiSlider.create(xPosSlider, {
    start: settings.xmin,
    step: 1,
    tooltips: [true],
    range: {
        "min": -10,
        "max": 5
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
noUiSlider.create(yPosSlider, {
    start: settings.ymin,
    step: 1,
    tooltips: [true],
    range: {
        "min": -10,
        "max": 5
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

// Uppfæra stillingar og teikna fractal upp á nýtt ef á við
function updateSettingsValue(propertyName, newValue) {
    settings[propertyName] = newValue;
    if (settings.rendering) {
        render();
    }
}

// Slider events
scaleSlider.noUiSlider.on("set", val => updateSettingsValue("scale", val[0]));
resolutionSlider.noUiSlider.on("set", val => updateSettingsValue("resolution", val[0]));
maxIterationSlider.noUiSlider.on("set", val => updateSettingsValue("maxIterations", val[0]));
xPosSlider.noUiSlider.on("set", val => updateSettingsValue("xmin", val[0]));
yPosSlider.noUiSlider.on("set", val => updateSettingsValue("ymin", val[0]));

// Velja lit á fractal
colorSelect.addEventListener("change", event => {
    settings.color = event.target.value;
    render();
});

// Takki til að núllstilla alla slidera
sliderResetBtn.addEventListener("click", event => {
    event.preventDefault();
    settings.rendering = false;
    sliders.forEach(sliderElement => sliderElement.noUiSlider.reset());
    render();
    settings.rendering = true;
});

/* ================
   Fractal renderer
   ================ */
function render() {
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
            // Velja lit út frá núverandi stillingu
            if (settings.color == "bw") {
                ctx.fillStyle = `#${color}${color}${color}`;
            } else if (settings.color == "r") {
                ctx.fillStyle = `#${color}00`;
            } else if (settings.color == "g") {
                ctx.fillStyle = `#0${color}0`;
            } else if (settings.color == "b") {
                ctx.fillStyle = `#00${color}`;
            }
            ctx.fill();
        }
    }
}
render();
