// ==UserScript==
// @name         GeoFS Utilities
// @version      0.5.3
// @description  Adds various suggestions by bili-開飛機のzm, VR PoZz, bluga4893, and suggestions by discord users (idk who): 10 spoiler positions, a light that you could pretend is a landing light, autobrakes, a key to make the elevator trim match the aileron pitch, smoke, a G-Force Meter, and an AoA meter.
// @author       GGamerGGuy
// @match        https://www.geo-fs.com/geofs.php?v=*
// @match        https://*.geo-fs.com/geofs.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geo-fs.com
// @grant        none
// @downloadURL  https://github.com/tylerbmusic/geofs-utilities/raw/refs/heads/main/userscript.js
// @updateURL    https://github.com/tylerbmusic/geofs-utilities/raw/refs/heads/main/userscript.js
// ==/UserScript==
//Note: between 6:20 and 17:52 (exclusive), the light is not visible.
function waitForEntities() {
    try {
        if (window.geofs.cautiousWithTerrain == false) {
            // Entities are already defined, no need to wait
            window.DEGREES_TO_RAD = window.DEGREES_TO_RAD || 0.017453292519943295769236907684886127134428718885417254560971914401710091146034494436822415696345094822123044925073790592483854692275281012398474218934047117319168245015010769561697553581238605305168789;
            window.RAD_TO_DEGREES = window.RAD_TO_DEGREES || 57.295779513082320876798154814105170332405472466564321549160243861202847148321552632440968995851110944186223381632864893281448264601248315036068267863411942122526388097467267926307988702893110767938261;
            window.METERS_TO_FEET = window.METERS_TO_FEET || 3.280839895;
            setTimeout(window.mainUtilFn(), 3000);
            return;
        }
    } catch (error) {
        // Handle any errors (e.g., log them)
        console.log('Error in waitForEntities:', error);
    }
    // Retry after 1000 milliseconds
    setTimeout(() => {waitForEntities();}, 1000);
}
//@returns bestAoAMin
function aoaLookup(id) {
    switch(id) {
        case 1:
            return 6;
        case 2:
            return 4;
        case 3:
            return 10;
        case 4:
            return 6;
        case 5:
            return 5;
        case 6:
            return 5;
        case 7:
            return 10;
        case 8:
            return 8;
        case 9:
            return 0;
        case 10:
            return 6;
        case 11:
            return 4;
        case 12:
            return 7;
        case 13:
            return 8;
        case 14:
            return 7;
        case 15:
            return 7;
        case 16:
            return 7;
        case 18:
            return 11;
        case 20:
            return 11;
        case 21:
            return 8;
        case 22:
            return 6;
        case 23:
            return 6;
        case 24:
            return 6;
        case 25:
            return 6;
        case 26:
            return 6;
        case 27:
            return 12;
        case 31:
            return 6;
        case 40:
            return 6;
        default:
            return 6;
    }
}
(function() {
    if (!window.gmenu || !window.GMenu) {
        fetch('https://raw.githubusercontent.com/tylerbmusic/GeoFS-Addon-Menu/refs/heads/main/addonMenu.js')
            .then(response => response.text())
            .then(script => {eval(script);})
            .then(() => {setTimeout(afterGMenu, 100);});
    } else afterGMenu()
    function afterGMenu() {
        window.isSmokeOn = false;
        const utilMenu = new window.GMenu("Utilities", "utils");
        utilMenu.addHeader(2, "Individual Utility Settings");
        utilMenu.addItem("Spoilers Enabled: ", "SpEnabled", "checkbox", 1, 'true');
        utilMenu.addItem("Reverse Thrust Enabled: ", "RtEnabled", "checkbox", 1, 'true');
        utilMenu.addItem("Spoilers Armed: ", "Armed", "checkbox", 1, 'true');
        utilMenu.addHeader(2, "Keybinds");
        utilMenu.addKBShortcut("Arm/Disarm Spoilers: ", "Arm", 1, "AltRight", spArm);
        utilMenu.addKBShortcut("Extend Spoilers 10%: ", "SpExt", 1, '\\', spExt);
        utilMenu.addKBShortcut("Retract Spoilers 10%: ", "SpRet", 1, '/', spRet);
        utilMenu.addKBShortcut("Toggle light: ", "Light", 1, "'", light);
        utilMenu.addKBShortcut("Elevator Trim Adjustment: ", "Trim", 1, 'w', trim);
        utilMenu.addKBShortcut("Toggle smoke: ", "Smoke", 1, 'q', toggleSmoke);
        utilMenu.addHeader(2, "Smoke Settings");
        utilMenu.addItem("Color: ", "Color", "color", 1, "#ffffff");
        utilMenu.addItem("Smoke Start Size: ", "SmokeStart", "number", 1, "0.003");
        utilMenu.addItem("Smoke End Size: ", "SmokeEnd", "number", 1, "0.4");
        utilMenu.addItem("Smoke life span (seconds): ", "SLife", "number", 1, "60");
        utilMenu.addHeader(2, "G-Force & AoA Meter");
        utilMenu.addItem("Show G-Force Meter: ", "ShowGs", "checkbox", 1, 'false');
        utilMenu.addItem("Show AoA Meter: ", "ShowAoA", "checkbox", 1, 'false');
        utilMenu.addItem("Use simplified AoA Meter: ", "SimpleAoA", "checkbox", 1, 'true');
        utilMenu.addHeader(2, "Camera settings");
        utilMenu.addItem("Reset cam when mouse button released: ", "CamReset", "checkbox", 1, 'false');
        utilMenu.addItem("Cam reset time (seconds): ", "CamResetTime", "number", 1, "1");
    }
    waitForEntities();
    window.smokeParticles = [];

    function spArm() {
        if ((localStorage.getItem("utilsEnabled") == 'true')) {
            if (localStorage.getItem("utilsArmed") == "true") {
                localStorage.setItem("utilsArmed", "false");
                document.getElementById("utilsArmed").checked = false;
            } else {
                localStorage.setItem("utilsArmed", "true");
                document.getElementById("utilsArmed").checked = true;
            }
        }
    }
    function spExt() {
        if (((localStorage.getItem("utilsEnabled") == 'true')) && (window.controls.airbrakes.position == window.controls.airbrakes.target) && (window.controls.airbrakes.target < 0.95)) {
            window.controls.airbrakes.target += 0.1;
            window.controls.airbrakes.delta = 0.5;
        }
    }
    function spRet() {
        if (((localStorage.getItem("utilsEnabled") == 'true')) && (window.controls.airbrakes.position == window.controls.airbrakes.target) && (window.controls.airbrakes.target > 0.05)) {
            window.controls.airbrakes.target -= 0.1;
            window.controls.airbrakes.delta = -0.5;
        }
    }
    function light() {
        if ((localStorage.getItem("utilsEnabled") == 'true')) {
            if (!window.isLight) {
                window.geofs.api.viewer.scene.globe.dynamicAtmosphereLighting = false;
                const flashlight = new window.Cesium.DirectionalLight({
                    direction: window.geofs.api.viewer.scene.camera.directionWC, // Updated every frame, apparently
                });
                //geofs.api.viewer.scene.light.intensity = 0;
                window.geofs.api.viewer.scene.light.red = 1;
                window.geofs.api.viewer.scene.light.green = 1;
                window.geofs.api.viewer.scene.light.blue = 1;
                window.geofs.api.viewer.scene.light.alpha = 1;
                window.isLight = true;
            }
            if (window.isLightOn) {
                window.isLightOn = false;
                window.geofs.api.viewer.scene.light.intensity = window.offI;
            } else {
                window.isLightOn = true;
                window.offI = window.geofs.api.viewer.scene.light.intensity;
                window.geofs.api.viewer.scene.light.intensity = 10;
            }
        }
    }
    function trim() {
        if ((localStorage.getItem("utilsEnabled") == 'true')) {
            window.controls.elevatorTrim = (window.controls.pitch - window.controls.elevatorTrim) / 2;
        }
    }
    function toggleSmoke() {
        console.log("toggleSmoke");
        if ((localStorage.getItem("utilsEnabled") == 'true')) {
            if (window.isSmokeOn == false) {
                window.isSmokeOn = true;
                window.smoke = new window.geofs.fx.ParticleEmitter({
                    off: 0,
                    anchor: /*window.geofs.aircraft.instance.engines[0].points.contrailAnchor || {worldPosition: window.geofs.aircraft.instance.engines[0].object3d.worldPosition}*/ {worldPosition: [0,0,0]},
                    duration: 1E10,
                    rate: .03,
                    life: Number(localStorage.getItem("utilsSLife"))*1E3, //60 seconds by default
                    easing: "easeOutQuart",
                    startScale: Number(localStorage.getItem("utilsSmokeStart")),
                    endScale: Number(localStorage.getItem("utilsSmokeEnd")),
                    randomizeStartScale: 0.005,
                    randomizeEndScale: 0.05,
                    startOpacity: 1,
                    endOpacity: .4,
                    startRotation: "random",
                    texture: "whitesmoke"
                });
                function hexToRgb(hex) {
                    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : null;
                }
                let c = hexToRgb(localStorage.getItem("utilsColor")); //c for Color
                window.smokeParticles.push([window.smoke, new window.Cesium.Color(c.r/255, c.g/255, c.b/255, 1), 0]);
                console.log("window.smokeParticles: ");
                console.log(window.smokeParticles);
                if (window.smokeColor) {
                    clearInterval(window.smokeColor);
                }
                window.smokeColor = setInterval(() => {
                    //window.geofs.fx.setParticlesColor(new window.Cesium.Color(r,g,b,1)); //(Old system)
                    for (let p in window.smokeParticles) {
                        let id = window.smokeParticles[p][0]._id; //Get the id of the particleEmitter
                        let stillExists = false;
                        for (let i in window.geofs.fx.particles) { //Compare the id to all of the particles' emitter ids
                            if (window.geofs.fx.particles[i]._emitter._id == id) {
                                window.geofs.fx.particles[i].setColor(window.smokeParticles[p][1]);
                                stillExists = true;
                            }
                        }
                        if (!stillExists) {
                            console.log("doesn't still exist");
                            window.smokeParticles[p][2]++;
                            if (window.smokeParticles[p][2] > 3) {
                                window.smokeParticles.splice(p, 1); //Remove the smoke particleEmitter if it has no particles.
                            }
                        }
                    }
                },20);
            } else if (window.smoke && window.smokeColor) {
                window.isSmokeOn = false;
                window.smoke.destroy();
            }
        }
    }
})();

window.mainUtilFn = function() {
    'use strict';
    window.isLightOn = false;
    window.isLight = false;
    window.offI = 0.0;
    window.wasGrounded = true;
    window.autoBrakes = true;
    window.isCamReset = false;
    var s = setInterval(() => {
        if (localStorage.getItem("utilsShowGs") == 'true' && (!window.instruments.list.gmeter)) {
            var theUrl = 'https://tylerbmusic.github.io/GPWS-files_geofs/gmeter.png';
            window.instruments.add(new window.Indicator({
                container: ".geofs-instruments-container",
                compositors: "canvas,css",
                stackX: !0,
                overlay: {
                    url: "images/instruments/background.png",
                    class: "geofs-instrument-background",
                    size: {
                        x: 200,
                        y: 200
                    },
                    anchor: {
                        x: 100,
                        y: 100
                    },
                    position: {
                        x: 100,
                        y: 100
                    },
                    rescale: !0,
                    rescalePosition: !0,
                    overlays: [{
                        url: theUrl,
                        anchor: {
                            x: 100,
                            y: 100
                        },
                        size: {
                            x: 200,
                            y: 200
                        }
                    }, {
                        animations: [{
                            type: "rotate",
                            value: "accZ",
                            ratio: -2.25,
                            max: 180,
                            min: -30,
                            offset: 0
                        }],
                        url: "images/instruments/airspeed-hand.png",
                        anchor: {
                            x: 10,
                            y: 34
                        },
                        size: {
                            x: 20,
                            y: 120
                        },
                        position: {
                            x: 0,
                            y: 0
                        }
                    }]
                }
            }), 'gmeter');
        } else if (window.instruments.list.gmeter && localStorage.getItem("utilsShowGs") == 'false') {
            window.instruments.list.gmeter.overlay.compositorLayer._$element.style.display = 'none !important';
            window.instruments.list.gmeter.overlay.compositorLayer._$element.style.visibility = 'hidden !important';
            window.instruments.list.gmeter.destroy();
        }
        if (localStorage.getItem("utilsShowAoA") == 'true' && !document.getElementById("aoa-container")) {
            var d = document.createElement("div");
            d.style.position = 'fixed';
            d.style.zIndex = '1000';
            d.style.top = localStorage.getItem("utilsAoATop") || '10px';
            d.style.left = localStorage.getItem("utilsAoALeft") || '700px';
            d.style.background = 'rgba(0,0,0,0.5)';
            d.id = 'aoa-container';

            if (localStorage.getItem("utilsSimpleAoA") == 'false') {
                d.style.width = '20%';
                d.style.height = '100px';
                document.body.appendChild(d);
                d.innerHTML = `<div id="aoa-dragger" style="
    position: absolute;
    left: 0px;
    top: -5px;
    width: 100%;
    height: 5px;
    background: gray;
    cursor: move !important;
"></div><div id="AoA-Div" style="
    position: absolute;
    left: 0;
    color: white;
">AoA:</div><div style="position: absolute;left: 50%;width: 20%;background: darkred;border-top: black;border-right: black;border-bottom: black;border-left: 0px black;border-image: initial;border-radius: 0px 10px 10px 0px;" id="criticalAoA"></div><div style="position: absolute; height: 0.1%; background: white; left: 45%; width: 5%;" id="aoaIndicator"></div><div style="
    position: absolute;
    left: 50%;
    width: 1%;
    height: 100px;
    background: black;
    border-radius: 100px;
"></div><div style="position: absolute;left: 51%;width: 5%;height: 5px;background: blue;border-radius: 0px 20px 20px 0px;border-top: 1px solid black;border-right: 1px solid black;border-bottom: 1px solid black;border-image: initial;border-left: none;" id="AoABlueRange"></div>`;
                const c = document.getElementById("aoa-container");
                document.getElementById("aoa-dragger").addEventListener('mousedown', function(e) {
                    let offsetX = e.clientX - c.getBoundingClientRect().left;
                    let offsetY = e.clientY - c.getBoundingClientRect().top;

                    function mouseMoveHandler(e) {
                        c.style.left = `${e.clientX - offsetX}px`;
                        c.style.top = `${e.clientY - offsetY}px`;
                    }

                    function mouseUpHandler() {
                        document.removeEventListener('mousemove', mouseMoveHandler);
                        document.removeEventListener('mouseup', mouseUpHandler);
                        localStorage.setItem("utilsAoALeft", c.style.left);
                        localStorage.setItem("utilsAoATop", c.style.top);
                    }

                    document.addEventListener('mousemove', mouseMoveHandler);
                    document.addEventListener('mouseup', mouseUpHandler);
                });

                setInterval(() => {
                    window.uAoA = -window.geofs.animation.values.atilt-(Math.atan((window.geofs.animation.values.verticalSpeed*0.00987473)/window.geofs.animation.values.groundSpeedKnt)*window.RAD_TO_DEGREES);
                    if (window.uAoA) {
                        document.getElementById("AoA-Div").innerHTML = "AoA: " + Math.round(window.uAoA*10)/10;
                        document.getElementById("criticalAoA").style.height = (50+window.geofs.aircraft.instance.airfoils[2].stallIncidence*-2.5) + "px";
                        document.getElementById("aoaIndicator").style.top = (100-(50+Math.max(-50, Math.min(50, (window.uAoA*2.5))))) + "px";
                        document.getElementById("AoABlueRange").style.top = (50-(aoaLookup(Number(window.geofs.aircraft.instance.id))+2)*2.5) + "px";
                    }
                }, 50);
            } else {
                d.style.width = '135px';
                d.style.height = '240px';
                document.body.appendChild(d);
                d.innerHTML = `<div id="aoa-dragger" style="
    position: absolute;
    left: 0px;
    top: -5px;
    width: 100%;
    height: 5px;
    background: gray;
    cursor: move !important;
"></div><div id="AoA-Div" style="
    position: absolute;
    left: 0;
    color: white;
">AoA:</div><img id="aoa-img" style="position: absolute; right: 0;" src="https://tylerbmusic.github.io/GPWS-files_geofs/aoa0.png">`;
                const c = document.getElementById("aoa-container");
                function inRange(val, low, high) {
                    return ((val >= low) && (val <= high)) ? true : false;
                }

                setInterval(() => {
                    c.style.display = (window.instruments.visible) ? 'block' : 'none';
                    window.uAoA = -window.geofs.animation.values.atilt-(Math.atan((window.geofs.animation.values.verticalSpeed*0.00987473)/window.geofs.animation.values.groundSpeedKnt)*window.RAD_TO_DEGREES);
                    document.getElementById("AoA-Div").innerHTML = "AoA: " + Math.round(window.uAoA*10)/10;
                    let i = document.getElementById("aoa-img");
                    let blue = aoaLookup(Number(window.geofs.aircraft.instance.id));
                    let crit = (window.geofs.aircraft.instance.airfoils[2] && window.geofs.aircraft.instance.airfoils[2].stallIncidence);
                    if (!window.geofs.aircraft.instance.engine.on) {
                        i.src = "https://tylerbmusic.github.io/GPWS-files_geofs/aoa0.png";
                    } else if (inRange(window.uAoA, 0, blue/2)) {
                        i.src = "https://tylerbmusic.github.io/GPWS-files_geofs/aoa1.png";
                    } else if (inRange(window.uAoA, blue/2, blue)) {
                        i.src = "https://tylerbmusic.github.io/GPWS-files_geofs/aoa2.png";
                    } else if (inRange(window.uAoA, blue, blue+1)) {
                        i.src = "https://tylerbmusic.github.io/GPWS-files_geofs/aoa3.png";
                    } else if (inRange(window.uAoA, blue+1, blue+2)) {
                        i.src = "https://tylerbmusic.github.io/GPWS-files_geofs/aoa4.png";
                    } else if (window.uAoA > blue+2) {
                        i.src = "https://tylerbmusic.github.io/GPWS-files_geofs/aoa5.png";
                    } else {
                        i.src = "https://tylerbmusic.github.io/GPWS-files_geofs/aoa0.png";
                    }
                }, 50);

                document.getElementById("aoa-dragger").addEventListener('mousedown', function(e) {
                    let offsetX = e.clientX - c.getBoundingClientRect().left;
                    let offsetY = e.clientY - c.getBoundingClientRect().top;

                    function mouseMoveHandler(e) {
                        c.style.left = `${e.clientX - offsetX}px`;
                        c.style.top = `${e.clientY - offsetY}px`;
                    }

                    function mouseUpHandler() {
                        document.removeEventListener('mousemove', mouseMoveHandler);
                        document.removeEventListener('mouseup', mouseUpHandler);
                        localStorage.setItem("utilsAoALeft", c.style.left);
                        localStorage.setItem("utilsAoATop", c.style.top);
                    }

                    document.addEventListener('mousemove', mouseMoveHandler);
                    document.addEventListener('mouseup', mouseUpHandler);
                });
            }
        }
        if (!window.isCamReset && localStorage.getItem("utilsCamReset") == 'true') {
            window.isCamReset = true;
            window.utilsCameraTick = function() {
                if (window.geofs.camera.currentMode != 5) {
                    let time = Number(localStorage.getItem("utilsCamResetTime"))*1000;
                    let fTime = Date.now()+time;
                    let fac = Math.min(1-(fTime-Date.now())/time, 1);
                    let f;
                    let cO;
                    let nO;
                    let cP;
                    let nP;
                    function theTick () {
                        fac = Math.min(1-(fTime-Date.now())/time, 1);
                        f = Math.pow(Math.sin((Math.PI/2)*fac), 2); //Sin(Pi/2*fac)^2 makes transition smooth
                        cO = window.geofs.camera.currentDefinition.orientations.current;
                        nO = window.geofs.camera.currentDefinition.orientations.neutral;
                        cP = window.geofs.camera.currentDefinition.offsets.current;
                        nP = window.geofs.camera.currentDefinition.offsets.neutral;
                        for (var i = 0; i < 3; i++) {
                            window.geofs.camera.currentDefinition.orientations.current[i] = cO[i] + (nO[i] - cO[i])*f;
                            window.geofs.camera.currentDefinition.offsets.current[i] = cP[i] + (nP[i] - cP[i])*f;
                        }
                        if (fac < 1) {
                            setTimeout(theTick,10);
                        }
                    }
                    theTick();
                }
            }
            document.getElementById("geofs-ui-3dview").addEventListener('mouseup', window.utilsCameraTick);
        } else if (window.isCamReset && localStorage.getItem("utilsCamReset") == 'false') {
            document.getElementById("geofs-ui-3dview").removeEventListener('mouseup',window.utilsCameraTick);
        }
    }, 100);
    function autoBrakes() {
        if ((localStorage.getItem("utilsArmed") == "true") && window.geofs.cautiousWithTerrain == false && window.autoBrakes && (window.geofs.animation.values.groundContact && !window.wasGrounded)) { //Auto brakes
            if (localStorage.getItem("utilsRtEnabled") == 'true') {
                window.controls.throttle = -1;
            }
            if (localStorage.getItem("utilsSpEnabled") == 'true') {
                window.controls.airbrakes.target = 1;
                window.controls.airbrakes.delta = 0.5;
            }
            window.controls.brakes = 1;
            localStorage.setItem("utilsArmed", "false");
        }
        window.wasGrounded = window.geofs.animation.values.groundContact;
    }
    setInterval(autoBrakes, 30);
};
