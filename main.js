/* =========================================================
   ÉTNICA SALÓN
   MAIN.JS COMPLETO
   VERSIÓN CORREGIDA
========================================================= */


/* =========================================================
   01. CONFIGURACIÓN GENERAL
========================================================= */

const WHATSAPP_NUMBER = "51924814586";

const $ = (selector, scope = document) =>
    scope.querySelector(selector);

const $$ = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

const finePointer =
    window.matchMedia("(pointer:fine)").matches;


/* =========================================================
   02. DETECCIÓN DE DISPOSITIVO
========================================================= */

const deviceMemory =
    navigator.deviceMemory || 8;

const hardwareThreads =
    navigator.hardwareConcurrency || 8;

const isLowPowerDevice =
    deviceMemory <= 4 ||
    hardwareThreads <= 4 ||
    window.innerWidth <= 480;

document.body.classList.toggle(
    "is-low-power",
    isLowPowerDevice
);


/* =========================================================
   03. LIBRERÍAS
========================================================= */

const hasGSAP =
    typeof window.gsap !== "undefined";

const hasScrollTrigger =
    typeof window.ScrollTrigger !== "undefined";

if (hasGSAP && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
}


/* =========================================================
   04. LENIS
========================================================= */

let lenis = null;

if (typeof window.Lenis !== "undefined") {

    lenis = new Lenis({
        lerp: isLowPowerDevice ? 0.24 : 0.18,
        smoothWheel: true,
        wheelMultiplier: 1
    });

    if (hasScrollTrigger) {
        lenis.on(
            "scroll",
            ScrollTrigger.update
        );
    }

    if (hasGSAP) {

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    }
}


/* =========================================================
   05. VISIBILIDAD DE LA PÁGINA
========================================================= */

let pageIsVisible =
    !document.hidden;

document.addEventListener(
    "visibilitychange",
    () => {

        pageIsVisible =
            !document.hidden;

        updateServiceAutoplay();
        updateRitualAutoplay();
        updateThreeRendering();
    }
);


/* =========================================================
   06. PRECARGA DE IMÁGENES
========================================================= */

function preloadImage(src) {

    return new Promise((resolve) => {

        if (!src) {
            resolve();
            return;
        }

        const image =
            new Image();

        image.decoding =
            "async";

        image.onload =
            resolve;

        image.onerror =
            resolve;

        image.src =
            src;
    });
}


/* =========================================================
   07. IMÁGENES DE SERVICIOS
========================================================= */

const serviceCards =
    $$(".service-card");

function loadServiceImage(card) {

    if (
        !card ||
        card.dataset.imageLoaded === "true"
    ) {
        return;
    }

    const src =
        card.dataset.serviceImage;

    if (!src) {
        return;
    }

    card.dataset.imageLoaded =
        "true";

    preloadImage(src).then(() => {

        card.style.setProperty(
            "--service-image",
            `url("${src}")`
        );
    });
}


/* =========================================================
   08. IMÁGENES DE BEAUTY EDIT
========================================================= */

const slatBacks =
    $$(".slat-back[data-slat-image]");

function loadBeautyImage(back) {

    if (
        !back ||
        back.dataset.imageLoaded === "true"
    ) {
        return;
    }

    const src =
        back.dataset.slatImage;

    if (!src) {
        return;
    }

    back.dataset.imageLoaded =
        "true";

    preloadImage(src).then(() => {

        back.style.setProperty(
            "--slat-image",
            `url("${src}")`
        );
    });
}


/* =========================================================
   09. LAZY LOAD DE IMÁGENES
========================================================= */

if ("IntersectionObserver" in window) {

    const assetObserver =
        new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    if (
                        entry.target.matches(
                            ".service-card"
                        )
                    ) {
                        loadServiceImage(
                            entry.target
                        );
                    }

                    if (
                        entry.target.matches(
                            ".slat-back"
                        )
                    ) {
                        loadBeautyImage(
                            entry.target
                        );
                    }

                    assetObserver.unobserve(
                        entry.target
                    );
                });
            },

            {
                rootMargin: "500px 0px",
                threshold: 0.01
            }
        );

    serviceCards.forEach((card) => {
        assetObserver.observe(card);
    });

    slatBacks.forEach((back) => {
        assetObserver.observe(back);
    });

} else {

    serviceCards.forEach(
        loadServiceImage
    );

    slatBacks.forEach(
        loadBeautyImage
    );
}


/* =========================================================
   10. INTRO / PUERTAS
========================================================= */

const siteIntro =
    $("#siteIntro");

const introDoorLeft =
    $("#introDoorLeft");

const introDoorRight =
    $("#introDoorRight");

const introCenter =
    $("#introCenter");

const introMeta =
    $$(".intro-meta");

let introOpening =
    false;

let introFinished =
    false;


/* =========================================================
   BLOQUEAR SCROLL DURANTE INTRO
========================================================= */

if (siteIntro && lenis) {
    lenis.stop();
}


/* =========================================================
   11. PRESENTACIÓN INICIAL
========================================================= */

function initDoorPresentation() {

    if (
        !siteIntro ||
        !hasGSAP
    ) {
        return;
    }

    gsap.fromTo(
        ".intro-brand-main",

        {
            autoAlpha: 0,
            y: 25,
            scale: 0.96
        },

        {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.05,
            delay: 0.15,
            ease: "power3.out"
        }
    );


    gsap.fromTo(
        ".intro-brand-sub",

        {
            autoAlpha: 0,
            y: 12
        },

        {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            delay: 0.62,
            ease: "power3.out"
        }
    );


    gsap.fromTo(
        [
            ".intro-center-line",
            ".intro-enter-text",
            ".intro-enter-icon"
        ],

        {
            autoAlpha: 0,
            y: 10
        },

        {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.08,
            delay: 0.84,
            ease: "power3.out"
        }
    );


    gsap.fromTo(
        introMeta,

        {
            autoAlpha: 0,
            y: -8
        },

        {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            delay: 0.45
        }
    );
}

initDoorPresentation();


/* =========================================================
   12. ANIMACIÓN DEL HERO
========================================================= */

let heroEntranceStarted =
    false;

function startHeroEntrance() {

    if (heroEntranceStarted) {
        return;
    }

    heroEntranceStarted =
        true;

    document.body.classList.add(
        "hero-intro-playing"
    );

    window.setTimeout(() => {

        document.body.classList.remove(
            "hero-intro-pending"
        );

        document.body.classList.remove(
            "hero-intro-playing"
        );

    }, 2900);
}


/* =========================================================
   13. FINALIZAR INTRO
========================================================= */

function finishIntro() {

    if (introFinished) {
        return;
    }

    introFinished =
        true;

    siteIntro?.remove();

    document.body.classList.remove(
        "intro-active"
    );

    if (lenis) {
        lenis.start();
    }

    if (hasScrollTrigger) {

        requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });
    }
}


/* =========================================================
   14. APERTURA DE PUERTAS
========================================================= */

function openSiteIntro() {

    if (
        !siteIntro ||
        introOpening
    ) {
        return;
    }

    introOpening =
        true;

    siteIntro.classList.add(
        "is-opening"
    );


    /* =====================================================
       DESAPARECER LOGO CENTRAL
    ====================================================== */

    if (introCenter?.animate) {

        introCenter.animate(

            [
                {
                    opacity: 1,
                    transform:
                        "translate(-50%, -50%) scale(1)"
                },

                {
                    opacity: 0,
                    transform:
                        "translate(-50%, -52%) scale(.965)"
                }
            ],

            {
                duration: 520,
                easing:
                    "cubic-bezier(.45,0,.55,1)",
                fill: "forwards"
            }
        );
    }


    /* =====================================================
       DESAPARECER TEXTOS SUPERIORES
    ====================================================== */

    introMeta.forEach((element) => {

        element.animate?.(

            [
                {
                    opacity: 1,
                    transform:
                        "translateY(0)"
                },

                {
                    opacity: 0,
                    transform:
                        "translateY(-12px)"
                }
            ],

            {
                duration: 480,
                easing: "ease",
                fill: "forwards"
            }
        );
    });


    /* =====================================================
       APERTURA APROBADA
       NO SE MODIFICA
    ====================================================== */

    const doorDuration =
        2400;

    const doorDelay =
        140;

    const doorEase =
        "cubic-bezier(.77, 0, .175, 1)";


    if (
        !introDoorLeft ||
        !introDoorRight ||
        !introDoorLeft.animate ||
        !introDoorRight.animate
    ) {

        startHeroEntrance();
        finishIntro();

        return;
    }


    const leftAnimation =
        introDoorLeft.animate(

            [
                {
                    transform:
                        "translate3d(0%,0,0)"
                },

                {
                    transform:
                        "translate3d(-102%,0,0)"
                }
            ],

            {
                duration: doorDuration,
                delay: doorDelay,
                easing: doorEase,
                fill: "forwards"
            }
        );


    const rightAnimation =
        introDoorRight.animate(

            [
                {
                    transform:
                        "translate3d(0%,0,0)"
                },

                {
                    transform:
                        "translate3d(102%,0,0)"
                }
            ],

            {
                duration: doorDuration,
                delay: doorDelay,
                easing: doorEase,
                fill: "forwards"
            }
        );


    /* Hero comienza mientras todavía
       se están terminando de abrir las puertas */

    window.setTimeout(
        startHeroEntrance,
        1450
    );


    Promise.all([
        leftAnimation.finished,
        rightAnimation.finished
    ])
        .then(finishIntro)
        .catch(finishIntro);
}


/* =========================================================
   EVENTOS DE INTRO
========================================================= */

siteIntro?.addEventListener(
    "click",
    openSiteIntro
);

siteIntro?.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();
            openSiteIntro();
        }
    }
);


/* =========================================================
   15. HEADER AL HACER SCROLL
========================================================= */

const siteHeader =
    $("#siteHeader");

let headerTicking =
    false;

function updateHeader() {

    if (!siteHeader) {
        return;
    }

    siteHeader.classList.toggle(
        "is-scrolled",
        window.scrollY > 25
    );

    headerTicking =
        false;
}

window.addEventListener(
    "scroll",
    () => {

        if (headerTicking) {
            return;
        }

        headerTicking =
            true;

        requestAnimationFrame(
            updateHeader
        );
    },
    {
        passive: true
    }
);

updateHeader();


/* =========================================================
   16. MENÚ MOBILE
========================================================= */

const menuToggle =
    $("#menuToggle");

const mobileMenu =
    $("#mobileMenu");

menuToggle?.addEventListener(
    "click",
    () => {

        if (!mobileMenu) {
            return;
        }

        const open =
            mobileMenu.classList.toggle(
                "open"
            );

        document.body.classList.toggle(
            "menu-open",
            open
        );

        menuToggle.setAttribute(
            "aria-expanded",
            String(open)
        );
    }
);


/* =========================================================
   17. LINKS INTERNOS
========================================================= */

$$("a[href^='#']").forEach((link) => {

    link.addEventListener(
        "click",
        (event) => {

            const href =
                link.getAttribute("href");

            if (
                !href ||
                href === "#"
            ) {
                return;
            }

            const target =
                $(href);

            if (!target) {
                return;
            }

            event.preventDefault();

            mobileMenu?.classList.remove(
                "open"
            );

            document.body.classList.remove(
                "menu-open"
            );

            menuToggle?.setAttribute(
                "aria-expanded",
                "false"
            );

            if (lenis) {

                lenis.scrollTo(
                    target,
                    {
                        offset: -74,
                        duration: 0.9
                    }
                );

            } else {

                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    );
});


/* =========================================================
   18. CURSOR PERSONALIZADO
========================================================= */

const cursorDot =
    $(".cursor-dot");

const cursorRing =
    $(".cursor-ring");

if (
    cursorDot &&
    cursorRing &&
    finePointer &&
    hasGSAP &&
    !isLowPowerDevice
) {

    const dotX =
        gsap.quickTo(
            cursorDot,
            "x",
            {
                duration: 0.06
            }
        );

    const dotY =
        gsap.quickTo(
            cursorDot,
            "y",
            {
                duration: 0.06
            }
        );

    const ringX =
        gsap.quickTo(
            cursorRing,
            "x",
            {
                duration: 0.2,
                ease: "power3.out"
            }
        );

    const ringY =
        gsap.quickTo(
            cursorRing,
            "y",
            {
                duration: 0.2,
                ease: "power3.out"
            }
        );


    window.addEventListener(
        "pointermove",
        (event) => {

            dotX(event.clientX);
            dotY(event.clientY);

            ringX(event.clientX);
            ringY(event.clientY);
        },
        {
            passive: true
        }
    );
}


/* =========================================================
   19. EFECTO MAGNETIC
========================================================= */

if (
    finePointer &&
    hasGSAP &&
    !isLowPowerDevice
) {

    $$(".magnetic").forEach((element) => {

        element.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    element.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left -
                    rect.width / 2;

                const y =
                    event.clientY -
                    rect.top -
                    rect.height / 2;

                gsap.to(
                    element,
                    {
                        x: x * 0.08,
                        y: y * 0.08,
                        duration: 0.22,
                        overwrite: "auto"
                    }
                );
            }
        );


        element.addEventListener(
            "mouseleave",
            () => {

                gsap.to(
                    element,
                    {
                        x: 0,
                        y: 0,
                        duration: 0.4,
                        overwrite: "auto"
                    }
                );
            }
        );
    });
}


/* =========================================================
   20. THREE.JS
========================================================= */

let threeRenderer = null;
let threeScene = null;
let threeCamera = null;
let threeSphere = null;
let threeTorus = null;
let threeClock = null;
let threeRAF = null;

let heroVisible = true;
let lastThreeFrame = 0;

const THREE_FRAME_TIME =
    isLowPowerDevice
        ? 1000 / 30
        : 1000 / 60;


/* =========================================================
   CREAR ESCENA THREE
========================================================= */

function initBeautyThree() {

    const canvas =
        $("#beautyCanvas");

    /*
       Three.js solamente se crea
       en escritorio.
    */

    if (
        !canvas ||
        typeof window.THREE === "undefined" ||
        window.innerWidth < 1024
    ) {
        return;
    }


    threeScene =
        new THREE.Scene();


    threeCamera =
        new THREE.PerspectiveCamera(
            45,
            1,
            0.1,
            100
        );

    threeCamera.position.z =
        7;


    threeRenderer =
        new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: !isLowPowerDevice,
            powerPreference:
                "high-performance"
        });


    threeRenderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            isLowPowerDevice
                ? 1
                : 1.35
        )
    );


    const segments =
        isLowPowerDevice
            ? 16
            : 24;


    const material =
        new THREE.MeshPhysicalMaterial({
            color: "#7A4050",
            roughness: 0.35,
            transparent: true,
            opacity: 0.34
        });


    /* =====================================================
       ESFERA
    ====================================================== */

    threeSphere =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.5,
                segments,
                segments
            ),

            material
        );

    threeSphere.position.set(
        -3,
        1.25,
        -1
    );

    threeScene.add(
        threeSphere
    );


    /* =====================================================
       ARO
    ====================================================== */

    threeTorus =
        new THREE.Mesh(

            new THREE.TorusGeometry(
                0.75,
                0.055,
                isLowPowerDevice ? 8 : 12,
                isLowPowerDevice ? 32 : 56
            ),

            material
        );

    threeTorus.position.set(
        3,
        1.2,
        -0.8
    );

    threeTorus.rotation.x =
        1.2;

    threeScene.add(
        threeTorus
    );


    /* =====================================================
       LUZ
    ====================================================== */

    threeScene.add(
        new THREE.AmbientLight(
            "#D7B8AA",
            3
        )
    );


    threeClock =
        new THREE.Clock();


    resizeThree();


    window.addEventListener(
        "resize",
        resizeThree,
        {
            passive: true
        }
    );


    /* =====================================================
       SOLO RENDERIZAR CUANDO HERO ES VISIBLE
    ====================================================== */

    const hero =
        $("#inicio");

    if (
        hero &&
        "IntersectionObserver" in window
    ) {

        const heroObserver =
            new IntersectionObserver(

                (entries) => {

                    heroVisible =
                        entries[0].isIntersecting;

                    updateThreeRendering();
                },

                {
                    threshold: 0.01
                }
            );

        heroObserver.observe(hero);
    }


    updateThreeRendering();
}


/* =========================================================
   RESIZE THREE
========================================================= */

function resizeThree() {

    if (
        !threeRenderer ||
        !threeCamera
    ) {
        return;
    }

    const canvas =
        threeRenderer.domElement;

    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;

    if (
        width <= 0 ||
        height <= 0
    ) {
        return;
    }

    threeRenderer.setSize(
        width,
        height,
        false
    );

    threeCamera.aspect =
        width / height;

    threeCamera.updateProjectionMatrix();
}


/* =========================================================
   LOOP THREE
========================================================= */

function renderThree(time) {

    if (
        !threeRenderer ||
        !threeScene ||
        !threeCamera ||
        !heroVisible ||
        !pageIsVisible
    ) {

        threeRAF =
            null;

        return;
    }


    threeRAF =
        requestAnimationFrame(
            renderThree
        );


    if (
        time -
        lastThreeFrame <
        THREE_FRAME_TIME
    ) {
        return;
    }


    lastThreeFrame =
        time;

    const elapsed =
        threeClock.getElapsedTime();


    if (threeSphere) {

        threeSphere.position.y =
            1.25 +
            Math.sin(
                elapsed * 0.7
            ) * 0.08;
    }


    if (threeTorus) {

        threeTorus.rotation.z =
            elapsed * 0.1;
    }


    threeRenderer.render(
        threeScene,
        threeCamera
    );
}


/* =========================================================
   ACTIVAR / DETENER THREE
========================================================= */

function updateThreeRendering() {

    if (!threeRenderer) {
        return;
    }

    const shouldRender =
        heroVisible &&
        pageIsVisible;


    if (
        shouldRender &&
        !threeRAF
    ) {

        threeClock.start();

        threeRAF =
            requestAnimationFrame(
                renderThree
            );
    }


    if (
        !shouldRender &&
        threeRAF
    ) {

        cancelAnimationFrame(
            threeRAF
        );

        threeRAF =
            null;
    }
}


initBeautyThree();


/* =========================================================
   21. REVEALS GENERALES
========================================================= */

if (
    hasGSAP &&
    hasScrollTrigger
) {

    gsap.utils
        .toArray(".reveal")
        .forEach((element) => {

            gsap.fromTo(

                element,

                {
                    autoAlpha: 0,
                    y: 30
                },

                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.75,
                    ease: "power3.out",

                    scrollTrigger: {
                        trigger: element,
                        start: "top 90%",
                        once: true
                    }
                }
            );
        });
}


/* =========================================================
   22. SERVICIOS
========================================================= */

const servicesSection =
    $("#servicios");

let serviceIndex = 0;
let serviceTimer = null;
let servicesVisible = false;


/* =========================================================
   ACTIVAR UNA CARTILLA
========================================================= */

function activateService(index) {

    if (!serviceCards.length) {
        return;
    }

    serviceIndex =
        (
            index +
            serviceCards.length
        ) %
        serviceCards.length;


    serviceCards.forEach(
        (card, i) => {

            card.classList.toggle(
                "is-showcase",
                i === serviceIndex
            );
        }
    );
}


/* =========================================================
   AUTOPLAY SERVICIOS
========================================================= */

function updateServiceAutoplay() {

    clearInterval(
        serviceTimer
    );

    serviceTimer =
        null;

    if (
        !servicesVisible ||
        !pageIsVisible
    ) {
        return;
    }


    serviceTimer =
        setInterval(
            () => {

                activateService(
                    serviceIndex + 1
                );

            },
            3400
        );
}


/* =========================================================
   HOVER SERVICIOS
========================================================= */

serviceCards.forEach(
    (card, index) => {

        card.addEventListener(
            "mouseenter",
            () => {

                loadServiceImage(
                    card
                );

                activateService(
                    index
                );
            }
        );
    }
);


/* =========================================================
   DETECTAR SERVICIOS EN PANTALLA
========================================================= */

if (
    servicesSection &&
    "IntersectionObserver" in window
) {

    const serviceSectionObserver =
        new IntersectionObserver(

            (entries) => {

                servicesVisible =
                    entries[0].isIntersecting;


                if (servicesVisible) {

                    serviceCards.forEach(
                        loadServiceImage
                    );
                }


                updateServiceAutoplay();
            },

            {
                threshold: 0.12
            }
        );


    serviceSectionObserver.observe(
        servicesSection
    );
}


/* =========================================================
   23. EXPERIENCIA ÉTNICA
========================================================= */

const BEAUTY_IMAGES = {

    salon:
        "https://images.pexels.com/photos/7755170/pexels-photo-7755170.jpeg?auto=compress&cs=tinysrgb&w=1200",

    color:
        "https://images.pexels.com/photos/3993311/pexels-photo-3993311.jpeg?auto=compress&cs=tinysrgb&w=1200",

    treatment:
        "https://images.pexels.com/photos/3993290/pexels-photo-3993290.jpeg?auto=compress&cs=tinysrgb&w=1200",

    makeup:
        "https://images.pexels.com/photos/7984906/pexels-photo-7984906.jpeg?auto=compress&cs=tinysrgb&w=1200"
};


/* =========================================================
   ESCENAS
========================================================= */

const ritualScenes = [

    {
        step:
            "01 / 04 · ESCUCHAR",

        title:
            "Primero entendemos tu idea.",

        text:
            "Conversamos sobre tu estilo, rutina y el resultado que te gustaría conseguir.",

        tags: [
            "Asesoría",
            "Estilo personal",
            "Objetivo realista"
        ],

        caption:
            "CONSULTA / DETALLE",

        image:
            BEAUTY_IMAGES.salon
    },


    {
        step:
            "02 / 04 · CREAR",

        title:
            "Diseñamos el cambio contigo.",

        text:
            "Elegimos forma, tono y acabado buscando equilibrio entre tendencia e identidad.",

        tags: [
            "Propuesta visual",
            "Técnica",
            "Personalización"
        ],

        caption:
            "FORMA / COLOR",

        image:
            BEAUTY_IMAGES.color
    },


    {
        step:
            "03 / 04 · CUIDAR",

        title:
            "El proceso también importa.",

        text:
            "Cada etapa se trabaja con atención al detalle y una experiencia cómoda.",

        tags: [
            "Cuidado",
            "Precisión",
            "Experiencia"
        ],

        caption:
            "CARE / PROCESS",

        image:
            BEAUTY_IMAGES.treatment
    },


    {
        step:
            "04 / 04 · FINALIZAR",

        title:
            "Terminamos con intención.",

        text:
            "Ajustamos textura, brillo y acabado final para completar el look.",

        tags: [
            "Styling",
            "Acabado",
            "Confianza"
        ],

        caption:
            "FINISH / IDENTITY",

        image:
            BEAUTY_IMAGES.makeup
    }
];


/* =========================================================
   SELECTORES EXPERIENCIA
========================================================= */

const ritualSection =
    $("#experiencia");

const ritualBase =
    $("#ritualBase");

const ritualSlats =
    $$(".ritual-slat");

const ritualStep =
    $("#ritualStep");

const ritualTitle =
    $("#ritualTitle");

const ritualText =
    $("#ritualText");

const ritualTags =
    $("#ritualTags");

const ritualCaption =
    $("#ritualCaption");

const ritualCounter =
    $("#ritualCounter");

const ritualTabs =
    $$(".ritual-tab");


let ritualIndex = 0;
let ritualBusy = false;
let ritualTimer = null;
let ritualVisible = false;
let ritualImagesPreloaded = false;


/* =========================================================
   PRECARGAR IMÁGENES DE EXPERIENCIA
========================================================= */

function preloadRitualImages() {

    if (ritualImagesPreloaded) {
        return;
    }

    ritualImagesPreloaded =
        true;

    ritualScenes.forEach((scene) => {
        preloadImage(scene.image);
    });
}


/* =========================================================
   PREPARAR PERSIANA
========================================================= */

function prepareRitual(image) {

    ritualSlats.forEach((slat) => {

        slat.style.backgroundImage =
            `url("${image}")`;
    });
}


/* =========================================================
   ACTUALIZAR DATOS
========================================================= */

function paintRitual(
    scene,
    index
) {

    if (ritualStep) {
        ritualStep.textContent =
            scene.step;
    }

    if (ritualTitle) {
        ritualTitle.textContent =
            scene.title;
    }

    if (ritualText) {
        ritualText.textContent =
            scene.text;
    }

    if (ritualCaption) {
        ritualCaption.textContent =
            scene.caption;
    }

    if (ritualCounter) {

        ritualCounter.textContent =
            String(index + 1)
                .padStart(
                    2,
                    "0"
                );
    }


    if (ritualTags) {

        ritualTags.innerHTML =
            scene.tags
                .map(
                    (item) =>
                        `<span>${item}</span>`
                )
                .join("");
    }


    ritualTabs.forEach(
        (tab, i) => {

            tab.classList.toggle(
                "is-active",
                i === index
            );

            tab.classList.remove(
                "progress-running"
            );
        }
    );


    const active =
        ritualTabs[index];

    if (active) {

        void active.offsetWidth;

        active.classList.add(
            "progress-running"
        );
    }
}


/* =========================================================
   CAMBIAR ESCENA
========================================================= */

function changeRitual(requested) {

    if (
        ritualBusy ||
        !ritualBase
    ) {
        return;
    }


    const next =
        (
            requested +
            ritualScenes.length
        ) %
        ritualScenes.length;


    if (
        next === ritualIndex
    ) {
        return;
    }


    const scene =
        ritualScenes[next];

    ritualBusy =
        true;


    preloadImage(
        scene.image
    );

    prepareRitual(
        scene.image
    );


    /* =====================================================
       FALLBACK SIN GSAP
    ====================================================== */

    if (!hasGSAP) {

        ritualBase.style.backgroundImage =
            `url("${scene.image}")`;

        paintRitual(
            scene,
            next
        );

        ritualIndex =
            next;

        ritualBusy =
            false;

        return;
    }


    const textTargets = [
        ritualStep,
        ritualTitle,
        ritualText,
        ritualTags
    ].filter(Boolean);


    const timeline =
        gsap.timeline({

            onComplete: () => {

                ritualIndex =
                    next;

                ritualBusy =
                    false;
            }
        });


    /* =====================================================
       SALIR TEXTO
    ====================================================== */

    timeline.to(
        textTargets,
        {
            autoAlpha: 0,
            x: -20,
            duration: 0.22,
            stagger: 0.02
        },
        0
    );


    /* =====================================================
       PREPARAR LÁMINAS
    ====================================================== */

    timeline.set(
        ritualSlats,
        {
            scaleY: 0,
            transformOrigin: "top"
        },
        0
    );


    /* =====================================================
       BAJAR PERSIANA
    ====================================================== */

    timeline.to(
        ritualSlats,
        {
            scaleY: 1,
            stagger: 0.045,
            duration: 0.48,
            ease: "power3.inOut"
        },
        0.03
    );


    /* =====================================================
       CAMBIO DE ESCENA
    ====================================================== */

    timeline.call(
        () => {

            ritualBase.style.backgroundImage =
                `url("${scene.image}")`;

            paintRitual(
                scene,
                next
            );
        },
        null,
        0.5
    );


    /* =====================================================
       SUBIR PERSIANA
    ====================================================== */

    timeline.to(
        ritualSlats,
        {
            scaleY: 0,
            transformOrigin: "bottom",
            stagger: 0.035,
            duration: 0.5,
            ease: "power3.inOut"
        },
        0.58
    );


    /* =====================================================
       ENTRADA NUEVO TEXTO
    ====================================================== */

    timeline.fromTo(
        textTargets,

        {
            autoAlpha: 0,
            x: 25
        },

        {
            autoAlpha: 1,
            x: 0,
            duration: 0.55,
            stagger: 0.045,
            ease: "power3.out"
        },

        0.64
    );
}


/* =========================================================
   ESCENA INICIAL
========================================================= */

if (ritualBase) {

    preloadImage(
        ritualScenes[0].image
    ).then(() => {

        ritualBase.style.backgroundImage =
            `url("${ritualScenes[0].image}")`;
    });


    prepareRitual(
        ritualScenes[0].image
    );

    paintRitual(
        ritualScenes[0],
        0
    );
}


/* =========================================================
   AUTOPLAY EXPERIENCIA
========================================================= */

function updateRitualAutoplay() {

    clearInterval(
        ritualTimer
    );

    ritualTimer =
        null;


    if (
        !ritualVisible ||
        !pageIsVisible
    ) {
        return;
    }


    ritualTimer =
        setInterval(
            () => {

                changeRitual(
                    ritualIndex + 1
                );

            },
            4800
        );
}


/* =========================================================
   BOTONES EXPERIENCIA
========================================================= */

ritualTabs.forEach((tab) => {

    tab.addEventListener(
        "click",
        () => {

            changeRitual(
                Number(
                    tab.dataset.ritualIndex
                )
            );

            updateRitualAutoplay();
        }
    );
});


/* =========================================================
   DETECTAR EXPERIENCIA EN PANTALLA
========================================================= */

if (
    ritualSection &&
    "IntersectionObserver" in window
) {

    const ritualObserver =
        new IntersectionObserver(

            (entries) => {

                ritualVisible =
                    entries[0].isIntersecting;


                if (ritualVisible) {
                    preloadRitualImages();
                }


                updateRitualAutoplay();
            },

            {
                rootMargin:
                    "250px 0px",

                threshold:
                    0.05
            }
        );


    ritualObserver.observe(
        ritualSection
    );
}


/* =========================================================
   24. BEAUTY EDIT
========================================================= */

const beautyBlind =
    $("#beautyBlind");

const beautySlats =
    $$(".beauty-slat");

let currentOpenSlat =
    -1;

let slatCloseTimer =
    null;


/* =========================================================
   ALTURA CERRADA

   MOBILE:
   se mantiene suficiente altura para evitar
   que las letras salgan de la persiana.
========================================================= */

function getClosedHeight() {

    if (
        window.innerWidth <= 390
    ) {
        return 150;
    }

    if (
        window.innerWidth <= 680
    ) {
        return 146;
    }

    if (
        window.innerWidth <= 960
    ) {
        return 116;
    }

    return 132;
}


/* =========================================================
   ALTURA ABIERTA
========================================================= */

function getOpenHeight() {

    if (
        window.innerWidth <= 680
    ) {
        return 365;
    }

    if (
        window.innerWidth <= 960
    ) {
        return 330;
    }

    return 360;
}


/* =========================================================
   ABRIR PERSIANA
========================================================= */

function openBeautySlat(index) {

    clearTimeout(
        slatCloseTimer
    );


    /* Cerrar cualquier otra lámina */

    beautySlats.forEach(
        (slat, i) => {

            if (
                i !== index &&
                slat.classList.contains(
                    "is-open"
                )
            ) {

                closeBeautySlat(
                    i,
                    false
                );
            }
        }
    );


    const slat =
        beautySlats[index];

    if (!slat) {
        return;
    }


    const back =
        $(".slat-back", slat);

    const inner =
        $(".slat-inner", slat);

    const copy =
        $(".slat-back-copy", slat);

    const image =
        $(".slat-back-image", slat);


    loadBeautyImage(
        back
    );


    slat.classList.add(
        "is-open"
    );

    currentOpenSlat =
        index;


    /* =====================================================
       FALLBACK SIN GSAP
    ====================================================== */

    if (!hasGSAP) {

        slat.style.height =
            `${getOpenHeight()}px`;

        if (inner) {

            inner.style.transform =
                "rotateX(-180deg)";
        }

        return;
    }


    /* =====================================================
       AUMENTAR ALTURA
    ====================================================== */

    gsap.to(
        slat,
        {
            height:
                getOpenHeight(),

            duration:
                0.72,

            ease:
                "power3.inOut",

            overwrite:
                true
        }
    );


    /* =====================================================
       GIRO 3D
    ====================================================== */

    if (inner) {

        gsap.to(
            inner,
            {
                rotationX:
                    -180,

                duration:
                    0.88,

                ease:
                    "power4.inOut",

                overwrite:
                    true
            }
        );
    }


    /* =====================================================
       IMAGEN
    ====================================================== */

    if (image) {

        gsap.fromTo(
            image,

            {
                scale: 1.1
            },

            {
                scale: 1.04,
                duration: 1.05,
                delay: 0.3,
                overwrite: true
            }
        );
    }


    /* =====================================================
       TEXTO INTERIOR
    ====================================================== */

    if (copy) {

        gsap.fromTo(
            copy,

            {
                autoAlpha: 0,
                y: 20
            },

            {
                autoAlpha: 1,
                y: 0,
                duration: 0.55,
                delay: 0.35,
                ease: "power3.out",
                overwrite: true
            }
        );
    }
}


/* =========================================================
   CERRAR PERSIANA
========================================================= */

function closeBeautySlat(
    index,
    useDelay = true
) {

    const closeNow = () => {

        const slat =
            beautySlats[index];

        if (!slat) {
            return;
        }


        const inner =
            $(".slat-inner", slat);


        slat.classList.remove(
            "is-open"
        );


        /* =================================================
           FALLBACK
        ================================================== */

        if (!hasGSAP) {

            slat.style.height =
                `${getClosedHeight()}px`;

            if (inner) {

                inner.style.transform =
                    "rotateX(0deg)";
            }

            if (
                currentOpenSlat === index
            ) {

                currentOpenSlat =
                    -1;
            }

            return;
        }


        /* =================================================
           VOLVER FRENTE
        ================================================== */

        if (inner) {

            gsap.to(
                inner,
                {
                    rotationX: 0,
                    duration: 0.74,
                    ease: "power4.inOut",
                    overwrite: true
                }
            );
        }


        /* =================================================
           RECUPERAR ALTURA
        ================================================== */

        gsap.to(
            slat,
            {
                height:
                    getClosedHeight(),

                duration:
                    0.68,

                delay:
                    0.08,

                ease:
                    "power3.inOut",

                overwrite:
                    true
            }
        );


        if (
            currentOpenSlat === index
        ) {

            currentOpenSlat =
                -1;
        }
    };


    if (useDelay) {

        clearTimeout(
            slatCloseTimer
        );

        slatCloseTimer =
            setTimeout(
                closeNow,
                100
            );

    } else {

        closeNow();
    }
}


/* =========================================================
   EVENTOS BEAUTY EDIT
========================================================= */

beautySlats.forEach(
    (slat, index) => {

        /* =================================================
           DESKTOP
        ================================================== */

        slat.addEventListener(
            "mouseenter",
            () => {

                if (!finePointer) {
                    return;
                }

                openBeautySlat(
                    index
                );
            }
        );


        slat.addEventListener(
            "mouseleave",
            () => {

                if (!finePointer) {
                    return;
                }

                closeBeautySlat(
                    index
                );
            }
        );


        /* =================================================
           MOBILE
        ================================================== */

        slat.addEventListener(
            "click",
            (event) => {

                if (finePointer) {
                    return;
                }

                event.preventDefault();


                if (
                    slat.classList.contains(
                        "is-open"
                    )
                ) {

                    closeBeautySlat(
                        index,
                        false
                    );

                } else {

                    openBeautySlat(
                        index
                    );
                }
            }
        );
    }
);


/* =========================================================
   ALTURA INICIAL BEAUTY EDIT
========================================================= */

beautySlats.forEach((slat) => {

    slat.style.height =
        `${getClosedHeight()}px`;
});


/* =========================================================
   25. ENTRADA DE BEAUTY EDIT

   NOTA:
   Los rails superiores/inferiores ya fueron eliminados
   del HTML, por eso aquí SOLO se animan las persianas.
========================================================= */

if (
    beautyBlind &&
    hasGSAP &&
    hasScrollTrigger
) {

    gsap.fromTo(
        beautySlats,

        {
            autoAlpha: 0,
            y: -24,
            rotationX: -14
        },

        {
            autoAlpha: 1,
            y: 0,
            rotationX: 0,
            stagger: 0.09,
            duration: 0.65,
            ease: "power3.out",

            scrollTrigger: {
                trigger: beautyBlind,
                start: "top 87%",
                once: true
            }
        }
    );
}


/* =========================================================
   26. NUESTRA FORMA DE TRABAJAR
========================================================= */

if (
    hasGSAP &&
    hasScrollTrigger
) {

    gsap.fromTo(
        ".care-card",

        {
            autoAlpha: 0,
            y: 40
        },

        {
            autoAlpha: 1,
            y: 0,
            stagger: 0.13,
            duration: 0.75,
            ease: "power3.out",

            scrollTrigger: {
                trigger:
                    ".care-cards",

                start:
                    "top 86%",

                once:
                    true
            }
        }
    );
}


/* =========================================================
   27. FAQ
========================================================= */

$$(".faq-item").forEach((item) => {

    const button =
        $(".faq-question", item);

    button?.addEventListener(
        "click",
        () => {

            const opening =
                !item.classList.contains(
                    "is-open"
                );


            /* CERRAR TODAS */

            $$(".faq-item").forEach(
                (other) => {

                    other.classList.remove(
                        "is-open"
                    );

                    $(
                        ".faq-question",
                        other
                    )?.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            );


            /* ABRIR SELECCIONADA */

            if (opening) {

                item.classList.add(
                    "is-open"
                );

                button.setAttribute(
                    "aria-expanded",
                    "true"
                );
            }
        }
    );
});


/* =========================================================
   28. FORMULARIO / WHATSAPP
========================================================= */

const bookingForm =
    $("#bookingForm");

const toast =
    $("#toast");

const toastText =
    $("#toastText");

let toastTimer =
    null;


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    if (
        !toast ||
        !toastText
    ) {
        return;
    }

    toastText.textContent =
        message;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2800
        );
}


/* =========================================================
   FORMULARIO
========================================================= */

bookingForm?.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        const nombre =
            $("#nombre");

        const telefono =
            $("#telefono");

        const servicio =
            $("#servicio");

        const mensaje =
            $("#mensaje");


        if (
            !nombre?.value.trim() ||
            !telefono?.value.trim() ||
            !servicio?.value.trim()
        ) {

            showToast(
                "Completa nombre, celular y servicio."
            );

            return;
        }


        const text =
`Hola Étnica Salón, quisiera reservar una cita.

Nombre: ${nombre.value.trim()}
Celular: ${telefono.value.trim()}
Servicio: ${servicio.value.trim()}
Mensaje: ${mensaje?.value.trim() || "Sin mensaje adicional"}`;


        const url =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;


        showToast(
            "Abriendo WhatsApp..."
        );


        window.setTimeout(
            () => {

                window.open(
                    url,
                    "_blank",
                    "noopener,noreferrer"
                );

            },
            180
        );
    }
);


/* =========================================================
   29. AÑO FOOTER
========================================================= */

const year =
    $("#year");

if (year) {

    year.textContent =
        new Date().getFullYear();
}


/* =========================================================
   30. RESIZE
========================================================= */

let resizeTimer =
    null;

window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );

        resizeTimer =
            setTimeout(
                () => {

                    /* =========================================
                       BEAUTY EDIT
                    ========================================= */

                    beautySlats.forEach(
                        (slat) => {

                            const height =
                                slat.classList.contains(
                                    "is-open"
                                )
                                    ? getOpenHeight()
                                    : getClosedHeight();


                            if (hasGSAP) {

                                gsap.set(
                                    slat,
                                    {
                                        height
                                    }
                                );

                            } else {

                                slat.style.height =
                                    `${height}px`;
                            }
                        }
                    );


                    /* =========================================
                       THREE
                    ========================================= */

                    resizeThree();


                    /* =========================================
                       SCROLL TRIGGER
                    ========================================= */

                    if (hasScrollTrigger) {
                        ScrollTrigger.refresh();
                    }

                },
                180
            );
    },
    {
        passive: true
    }
);


/* =========================================================
   31. CAMBIO DE ORIENTACIÓN MOBILE
========================================================= */

window.addEventListener(
    "orientationchange",
    () => {

        window.setTimeout(
            () => {

                beautySlats.forEach(
                    (slat) => {

                        const height =
                            slat.classList.contains(
                                "is-open"
                            )
                                ? getOpenHeight()
                                : getClosedHeight();


                        if (hasGSAP) {

                            gsap.set(
                                slat,
                                {
                                    height
                                }
                            );

                        } else {

                            slat.style.height =
                                `${height}px`;
                        }
                    }
                );


                if (hasScrollTrigger) {
                    ScrollTrigger.refresh();
                }

            },
            250
        );
    }
);