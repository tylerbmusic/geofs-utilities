// ==UserScript==
// @name         GeoFS Utilities
// @version      0.1
// @description  Adds some suggestions by bili-開飛機のzm and suggestions by discord users (idk who): 10 spoiler positions, a light that you could pretend is a landing light, autobrakes, and a key to make the elevator trim match the aileron pitch.
// @author       GGamerGGuy
// @match        https://www.geo-fs.com/geofs.php?v=*
// @match        https://*.geo-fs.com/geofs.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geo-fs.com
// @grant        none
// ==/UserScript==
//Note: between 6:20 and 17:52 (exclusive), the light is not visible.
//Keyboard shortcuts:
// Extend spoilers 10%:   \
// Retract spoilers 10%:  /
// Toggle light:          '
// Elevator trim thing:   w

(function() {
    'use strict';
    window.isLightOn = false;
    window.isLight = false;
    window.offI = 0.0;
    window.wasGrounded = true;
    window.autoBrakes = true;
    function airBrakes(event) {
        /*if (event.key == "b") {
            event.preventDefault();
            if (controls.airbrakes.position == controls.airbrakes.target) {
                if (controls.airbrakes.target < 0.95) {
                    controls.airbrakes.target += 0.1;
                    controls.airbrakes.delta = 0.5;
                } else {
                    controls.airbrakes.target = 0;
                    controls.airbrakes.delta = -0.5;
                }
            }
        } else*/ if (event.key == "\\") {
            event.preventDefault();
            if ((controls.airbrakes.position == controls.airbrakes.target) && (controls.airbrakes.target < 0.95)) {
                controls.airbrakes.target += 0.1;
                controls.airbrakes.delta = 0.5;
            }
        } else if (event.key == "/") {
            event.preventDefault();
            if ((controls.airbrakes.position == controls.airbrakes.target) && (controls.airbrakes.target > 0.05)) {
                controls.airbrakes.target -= 0.1;
                controls.airbrakes.delta = -0.5;
            }
        } else if (event.key == "'") {
            event.preventDefault();
            if (!window.isLight) {
                geofs.api.viewer.scene.globe.dynamicAtmosphereLighting = false;
                const flashlight = new Cesium.DirectionalLight({
                    direction: geofs.api.viewer.scene.camera.directionWC, // Updated every frame, apparently
                });
                //geofs.api.viewer.scene.light.intensity = 0;
                geofs.api.viewer.scene.light.red = 1;
                geofs.api.viewer.scene.light.green = 1;
                geofs.api.viewer.scene.light.blue = 1;
                geofs.api.viewer.scene.light.alpha = 1;
                window.isLight = true;
            }
            if (window.isLightOn) {
                window.isLightOn = false;
                geofs.api.viewer.scene.light.intensity = window.offI;
            } else {
                window.isLightOn = true;
                window.offI = geofs.api.viewer.scene.light.intensity;
                geofs.api.viewer.scene.light.intensity = 10;
            }
        } else if (event.key == "w") {
            controls.elevatorTrim = (controls.pitch - controls.elevatorTrim) / 2;
        }
    }
    document.addEventListener("keydown", airBrakes);
    function autoBrakes() {
        if (geofs.cautiousWithTerrain == false && window.autoBrakes && (geofs.animation.values.groundContact && !window.wasGrounded)) { //Auto brakes
            controls.throttle = -1;
            controls.airbrakes.target = 1;
            controls.airbrakes.delta = 0.5;
            controls.brakes = 1;
        }
        window.wasGrounded = geofs.animation.values.groundContact;
    }
    setInterval(autoBrakes, 30);
})();
