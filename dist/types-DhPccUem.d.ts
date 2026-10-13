import { V as Vector, k as FullParticularConfig, R as RendererType, o as MouseForceConfig, t as Particular, e as Emitter, i as ForceSource, a as AttractorConfig, A as Attractor, M as MouseForce, h as FlockingForceConfig, F as FlockingForce, b as BoundaryConfig, d as ContainerGlowConfig, p as MouseTrailConfig, g as ExplodeOptions, W as WobbleConfig, I as ImageParticlesConfig, T as TextImageConfig, E as ElementParticlesConfig, l as ImageShatterConfig } from './particular-D4GlsUaf.js';
import { a as CameraConfig, C as Camera } from './camera-DkBD-jlm.js';

declare const presetRegistry: {
    readonly confetti: {
        shape: "rectangle";
        blendMode: "normal";
        shadow: true;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        gravityJitter: number;
        scaleStep: number;
        friction: number;
        maxCount: number;
        colors: string[];
    };
    readonly magic: {
        shape: "sparkle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        gravityJitter: number;
        scaleStep: number;
        friction: number;
        maxCount: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        colors: string[];
    };
    readonly fireworks: {
        shape: "triangle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        gravityJitter: number;
        scaleStep: number;
        friction: number;
        maxCount: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        colors: string[];
    };
    readonly fireworksDetonation: {
        shape: "triangle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        gravityJitter: number;
        scaleStep: number;
        maxCount: number;
        particleLife: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        detonate: {
            at: number;
            childCount: number;
            velocity: number;
            velocitySpread: number;
            friction: number;
            scaleStep: number;
            childLife: number;
            sizeMin: number;
            sizeMax: number;
            fadeTime: number;
            inheritColor: true;
            shape: "triangle";
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
        };
    };
    readonly images: {
        shape: "roundedRectangle";
        blendMode: "normal";
        imageTint: false;
        glow: false;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        scaleStep: number;
        maxCount: number;
    };
    readonly imageText: {
        shape: "square";
        blendMode: "normal";
        glow: false;
        maxCount: number;
    };
    readonly imageShape: {
        shape: "circle";
        blendMode: "normal";
        glow: true;
        glowSize: number;
        glowAlpha: number;
        maxCount: number;
    };
    readonly snow: {
        shape: "circle";
        blendMode: "normal";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        gravityJitter: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        acceleration: number;
        accelerationSize: number;
        friction: number;
        frictionSize: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly meteors: {
        shape: "ring";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        gravityJitter: number;
        acceleration: number;
        accelerationSize: number;
        friction: number;
        frictionSize: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly flock: {
        shape: "triangle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        colors: string[];
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        acceleration: number;
        accelerationSize: number;
        friction: number;
        frictionSize: number;
        rotateToVelocity: true;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
    };
    readonly river: {
        shape: "circle";
        blendMode: "normal";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly fireworksShow: {
        shape: "triangle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        gravityJitter: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
        detonate: {
            at: number;
            childCount: number;
            velocity: number;
            velocitySpread: number;
            friction: number;
            scaleStep: number;
            childLife: number;
            sizeMin: number;
            sizeMax: number;
            fadeTime: number;
            inheritColor: true;
            shape: "triangle";
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
        };
    };
    readonly galaxySpin: {
        shape: "ring";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        spread3d: number;
        spawnDepth: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        gravityJitter: number;
        fadeTime: number;
        gravity: number;
        acceleration: number;
        accelerationSize: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly depthField: {
        shape: "circle";
        blendMode: "normal";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        spawnDepth: number;
        spawnWidth: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly supernova: {
        shape: "star";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        spread3d: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        colors: string[];
    };
    readonly fireworks3d: {
        shape: "triangle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        spread3d: number;
        spawnDepth: number;
        spawnWidth: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        acceleration: number;
        accelerationSize: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
        detonate: {
            at: number;
            childCount: number;
            velocity: number;
            velocitySpread: number;
            friction: number;
            scaleStep: number;
            childLife: number;
            sizeMin: number;
            sizeMax: number;
            fadeTime: number;
            inheritColor: true;
            shape: "sparkle";
            spread3d: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
        };
    };
};
declare const presets: {
    readonly Burst: {
        /** Celebratory confetti burst: colorful rectangles fluttering outward and drifting down */
        readonly confetti: {
            shape: "rectangle";
            blendMode: "normal";
            shadow: true;
            rate: number;
            life: number;
            velocity: Vector;
            spread: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            gravityJitter: number;
            scaleStep: number;
            friction: number;
            maxCount: number;
            colors: string[];
        };
        /** Signature magical burst: glowing sparkles with soft trails */
        readonly magic: {
            shape: "sparkle";
            blendMode: "additive";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            rate: number;
            life: number;
            velocity: Vector;
            spread: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            gravityJitter: number;
            scaleStep: number;
            friction: number;
            maxCount: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            colors: string[];
        };
        /** Cinematic fireworks: glowing triangles with bright trailing bloom */
        readonly fireworks: {
            shape: "triangle";
            blendMode: "additive";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            rate: number;
            life: number;
            velocity: Vector;
            spread: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            gravityJitter: number;
            scaleStep: number;
            friction: number;
            maxCount: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            colors: string[];
        };
        /** Fireworks with timed detonation: narrow upward launch that auto-explodes into colorful sub-bursts */
        readonly fireworksDetonation: {
            shape: "triangle";
            blendMode: "additive";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            rate: number;
            life: number;
            velocity: Vector;
            spread: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            gravityJitter: number;
            scaleStep: number;
            maxCount: number;
            particleLife: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            detonate: {
                at: number;
                childCount: number;
                velocity: number;
                velocitySpread: number;
                friction: number;
                scaleStep: number;
                childLife: number;
                sizeMin: number;
                sizeMax: number;
                fadeTime: number;
                inheritColor: true;
                shape: "triangle";
                trail: true;
                trailLength: number;
                trailFade: number;
                trailShrink: number;
            };
        };
    };
    readonly Burst3D: {
        /** Spinning galaxy: spherical emission with slow orbit drift */
        readonly galaxySpin: {
            shape: "ring";
            blendMode: "additive";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            rate: number;
            life: number;
            particleLife: number;
            velocity: Vector;
            spread: number;
            spread3d: number;
            spawnDepth: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            gravityJitter: number;
            fadeTime: number;
            gravity: number;
            acceleration: number;
            accelerationSize: number;
            friction: number;
            scaleStep: number;
            maxCount: number;
            continuous: true;
            autoStart: true;
            colors: string[];
        };
        /** Depth field: particles spread along z-axis for parallax effect */
        readonly depthField: {
            shape: "circle";
            blendMode: "normal";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            rate: number;
            life: number;
            particleLife: number;
            velocity: Vector;
            spread: number;
            spawnDepth: number;
            spawnWidth: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            friction: number;
            scaleStep: number;
            maxCount: number;
            continuous: true;
            autoStart: true;
            colors: string[];
        };
        /** Supernova: explosive 3D burst with spherical emission */
        readonly supernova: {
            shape: "star";
            blendMode: "additive";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            rate: number;
            life: number;
            particleLife: number;
            velocity: Vector;
            spread: number;
            spread3d: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            friction: number;
            scaleStep: number;
            maxCount: number;
            colors: string[];
        };
        /** 3D fireworks show: rockets launch upward and detonate into spherical sub-bursts */
        readonly fireworks3d: {
            shape: "triangle";
            blendMode: "additive";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            rate: number;
            life: number;
            particleLife: number;
            velocity: Vector;
            spread: number;
            spread3d: number;
            spawnDepth: number;
            spawnWidth: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            acceleration: number;
            accelerationSize: number;
            friction: number;
            scaleStep: number;
            maxCount: number;
            continuous: true;
            autoStart: true;
            colors: string[];
            detonate: {
                at: number;
                childCount: number;
                velocity: number;
                velocitySpread: number;
                friction: number;
                scaleStep: number;
                childLife: number;
                sizeMin: number;
                sizeMax: number;
                fadeTime: number;
                inheritColor: true;
                shape: "sparkle";
                spread3d: number;
                trail: true;
                trailLength: number;
                trailFade: number;
                trailShrink: number;
                glow: true;
                glowSize: number;
                glowColor: string;
                glowAlpha: number;
            };
        };
    };
    readonly Images: {
        /** Tuned for icon/image particles (no tint by default). */
        readonly showcase: {
            shape: "roundedRectangle";
            blendMode: "normal";
            imageTint: false;
            glow: false;
            rate: number;
            life: number;
            velocity: Vector;
            spread: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            scaleStep: number;
            maxCount: number;
        };
    };
    readonly ImageParticles: {
        /** High-fidelity text rendered as tiny particles with spring return. */
        readonly text: {
            shape: "square";
            blendMode: "normal";
            glow: false;
            maxCount: number;
        };
        /** Shape/icon rendered as particles with soft glow. */
        readonly shape: {
            shape: "circle";
            blendMode: "normal";
            glow: true;
            glowSize: number;
            glowAlpha: number;
            maxCount: number;
        };
    };
    readonly Ambient: {
        /** Gentle snowfall: soft white particles drifting downward across the viewport */
        readonly snow: {
            shape: "circle";
            blendMode: "normal";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            rate: number;
            life: number;
            particleLife: number;
            velocity: Vector;
            spread: number;
            gravityJitter: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            acceleration: number;
            accelerationSize: number;
            friction: number;
            frictionSize: number;
            scaleStep: number;
            maxCount: number;
            continuous: true;
            autoStart: true;
            colors: string[];
        };
        /** Meteors: fast diagonal streaks with long glowing trails, additive blending */
        readonly meteors: {
            shape: "ring";
            blendMode: "additive";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            rate: number;
            life: number;
            particleLife: number;
            velocity: Vector;
            spread: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            gravityJitter: number;
            acceleration: number;
            accelerationSize: number;
            friction: number;
            frictionSize: number;
            scaleStep: number;
            maxCount: number;
            continuous: true;
            autoStart: true;
            colors: string[];
        };
        /** Fireworks show: gentle rockets launch from the bottom and auto-explode into colorful bursts */
        readonly fireworksShow: {
            shape: "triangle";
            blendMode: "additive";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            rate: number;
            life: number;
            particleLife: number;
            velocity: Vector;
            spread: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            gravityJitter: number;
            scaleStep: number;
            maxCount: number;
            continuous: true;
            autoStart: true;
            colors: string[];
            detonate: {
                at: number;
                childCount: number;
                velocity: number;
                velocitySpread: number;
                friction: number;
                scaleStep: number;
                childLife: number;
                sizeMin: number;
                sizeMax: number;
                fadeTime: number;
                inheritColor: true;
                shape: "triangle";
                trail: true;
                trailLength: number;
                trailFade: number;
                trailShrink: number;
            };
        };
        /** Boids flock: bird-like triangles with gentle steering and sustained flight. Use with addFlockingForce(). */
        readonly flock: {
            shape: "triangle";
            blendMode: "additive";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            rate: number;
            life: number;
            particleLife: number;
            velocity: Vector;
            spread: number;
            colors: string[];
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            acceleration: number;
            accelerationSize: number;
            friction: number;
            frictionSize: number;
            rotateToVelocity: true;
            scaleStep: number;
            maxCount: number;
            continuous: true;
            autoStart: true;
        };
        /** River flow: horizontal stream of water particles, designed for use with attractors */
        readonly river: {
            shape: "circle";
            blendMode: "normal";
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            rate: number;
            life: number;
            particleLife: number;
            velocity: Vector;
            spread: number;
            sizeMin: number;
            sizeMax: number;
            velocityMultiplier: number;
            fadeTime: number;
            gravity: number;
            friction: number;
            scaleStep: number;
            maxCount: number;
            continuous: true;
            autoStart: true;
            colors: string[];
        };
    };
    readonly Colors: {
        /** White to offwhite range */
        readonly snow: {
            readonly colors: string[];
        };
        /** Full black-to-white range */
        readonly grayscale: {
            readonly colors: string[];
        };
        /** Single-hue cool blue range */
        readonly coolBlue: {
            readonly colors: string[];
        };
        /** Desaturated warm/cool mix */
        readonly muted: {
            readonly colors: string[];
        };
        /** Bold saturated blue */
        readonly blue: {
            readonly colors: string[];
        };
        /** Bold saturated orange */
        readonly orange: {
            readonly colors: string[];
        };
        /** Bold saturated green */
        readonly green: {
            readonly colors: string[];
        };
        /** Finnish flag blue and white */
        readonly finland: {
            readonly colors: string[];
        };
        /** American flag red, white, blue */
        readonly usa: {
            readonly colors: string[];
        };
        /** White-hot to deep red meteor palette */
        readonly meteor: {
            readonly colors: string[];
        };
        /** Cyan-to-white water palette */
        readonly water: {
            readonly colors: string[];
        };
        /** Blue-purple sparkle (magic preset signature) */
        readonly magic: {
            readonly colors: string[];
        };
        /** Extended blue-purple-pink (galaxy/nebula effects) */
        readonly nebula: {
            readonly colors: string[];
        };
        /** Hot reds, oranges, whites (explosions/supernova) */
        readonly solar: {
            readonly colors: string[];
        };
        /** Earth tones: deep reds, burnt orange, sienna */
        readonly autumn: {
            readonly colors: string[];
        };
        /** Dark greys for subtle/muted backgrounds */
        readonly ash: {
            readonly colors: string[];
        };
        /** Dark blue-grey tones */
        readonly slate: {
            readonly colors: string[];
        };
        /** Pastel blue, purple, teal, mint mix */
        readonly fairy: {
            readonly colors: string[];
        };
        /** Warm glowing orange-gold */
        readonly amber: {
            readonly colors: string[];
        };
        /** Soft pink gradient from hot to pastel */
        readonly rose: {
            readonly colors: string[];
        };
        /** Warm yellow-orange gradient */
        readonly gold: {
            readonly colors: string[];
        };
        /** Deep violet-purple range */
        readonly violet: {
            readonly colors: string[];
        };
        /** Bright green to pastel mint */
        readonly emerald: {
            readonly colors: string[];
        };
        /** Natural bird flock: charcoals, browns, warm grays */
        readonly birds: {
            readonly colors: string[];
        };
        /** Sunset murmuration: deep oranges, magentas, dusky purples */
        readonly sunset: {
            readonly colors: string[];
        };
        /** Multicolor vivid fireworks */
        readonly fireworks: {
            readonly colors: string[];
        };
    };
    readonly confetti: {
        shape: "rectangle";
        blendMode: "normal";
        shadow: true;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        gravityJitter: number;
        scaleStep: number;
        friction: number;
        maxCount: number;
        colors: string[];
    };
    readonly magic: {
        shape: "sparkle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        gravityJitter: number;
        scaleStep: number;
        friction: number;
        maxCount: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        colors: string[];
    };
    readonly fireworks: {
        shape: "triangle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        gravityJitter: number;
        scaleStep: number;
        friction: number;
        maxCount: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        colors: string[];
    };
    readonly fireworksDetonation: {
        shape: "triangle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        gravityJitter: number;
        scaleStep: number;
        maxCount: number;
        particleLife: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        detonate: {
            at: number;
            childCount: number;
            velocity: number;
            velocitySpread: number;
            friction: number;
            scaleStep: number;
            childLife: number;
            sizeMin: number;
            sizeMax: number;
            fadeTime: number;
            inheritColor: true;
            shape: "triangle";
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
        };
    };
    readonly images: {
        shape: "roundedRectangle";
        blendMode: "normal";
        imageTint: false;
        glow: false;
        rate: number;
        life: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        scaleStep: number;
        maxCount: number;
    };
    readonly imageText: {
        shape: "square";
        blendMode: "normal";
        glow: false;
        maxCount: number;
    };
    readonly imageShape: {
        shape: "circle";
        blendMode: "normal";
        glow: true;
        glowSize: number;
        glowAlpha: number;
        maxCount: number;
    };
    readonly snow: {
        shape: "circle";
        blendMode: "normal";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        gravityJitter: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        acceleration: number;
        accelerationSize: number;
        friction: number;
        frictionSize: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly meteors: {
        shape: "ring";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        gravityJitter: number;
        acceleration: number;
        accelerationSize: number;
        friction: number;
        frictionSize: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly flock: {
        shape: "triangle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        colors: string[];
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        acceleration: number;
        accelerationSize: number;
        friction: number;
        frictionSize: number;
        rotateToVelocity: true;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
    };
    readonly river: {
        shape: "circle";
        blendMode: "normal";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly fireworksShow: {
        shape: "triangle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        gravityJitter: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
        detonate: {
            at: number;
            childCount: number;
            velocity: number;
            velocitySpread: number;
            friction: number;
            scaleStep: number;
            childLife: number;
            sizeMin: number;
            sizeMax: number;
            fadeTime: number;
            inheritColor: true;
            shape: "triangle";
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
        };
    };
    readonly galaxySpin: {
        shape: "ring";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        spread3d: number;
        spawnDepth: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        gravityJitter: number;
        fadeTime: number;
        gravity: number;
        acceleration: number;
        accelerationSize: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly depthField: {
        shape: "circle";
        blendMode: "normal";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        spawnDepth: number;
        spawnWidth: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
    };
    readonly supernova: {
        shape: "star";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        spread3d: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        colors: string[];
    };
    readonly fireworks3d: {
        shape: "triangle";
        blendMode: "additive";
        glow: true;
        glowSize: number;
        glowColor: string;
        glowAlpha: number;
        trail: true;
        trailLength: number;
        trailFade: number;
        trailShrink: number;
        rate: number;
        life: number;
        particleLife: number;
        velocity: Vector;
        spread: number;
        spread3d: number;
        spawnDepth: number;
        spawnWidth: number;
        sizeMin: number;
        sizeMax: number;
        velocityMultiplier: number;
        fadeTime: number;
        gravity: number;
        acceleration: number;
        accelerationSize: number;
        friction: number;
        scaleStep: number;
        maxCount: number;
        continuous: true;
        autoStart: true;
        colors: string[];
        detonate: {
            at: number;
            childCount: number;
            velocity: number;
            velocitySpread: number;
            friction: number;
            scaleStep: number;
            childLife: number;
            sizeMin: number;
            sizeMax: number;
            fadeTime: number;
            inheritColor: true;
            shape: "sparkle";
            spread3d: number;
            trail: true;
            trailLength: number;
            trailFade: number;
            trailShrink: number;
            glow: true;
            glowSize: number;
            glowColor: string;
            glowAlpha: number;
        };
    };
};
type PresetName = keyof typeof presetRegistry;
/** Mutable lookup of all named color palettes, for Storybook controls. */
declare const colorPalettes: Record<string, string[]>;

/** Framework-independent styles that are also assignable to React's canvas style prop. */
interface CanvasLayerStyle {
    position: 'fixed' | 'absolute';
    inset: number;
    width: string;
    height: string;
    pointerEvents: 'none';
    zIndex?: number;
}
declare const DEFAULT_Z_INDEX = 10000;
/**
 * Recommended inline style for a full-viewport, click-through particle canvas
 * so particles render on top of the page without blocking clicks or other interaction.
 * Use with useParticles (spread as canvasStyle) or with a vanilla canvas element.
 */
declare const particlesBackgroundLayerStyle: CanvasLayerStyle;
declare function getParticlesBackgroundLayerStyle(zIndex?: number): CanvasLayerStyle;
/**
 * Style for a container-aware particle canvas.
 * The canvas fills its parent container using absolute positioning.
 * The parent element must have `position: relative` (or absolute/fixed).
 */
declare const particlesContainerLayerStyle: CanvasLayerStyle;
declare function getParticlesContainerLayerStyle(zIndex?: number): CanvasLayerStyle;

/**
 * Imperatively apply positioning styles to a canvas element.
 * Used by createParticles() / startScreensaver() for auto-created canvases
 * so users don't need to set any styles manually.
 */
declare function applyCanvasStyles(canvas: HTMLCanvasElement, container?: HTMLElement, zIndex?: number): void;

interface BurstOptions extends Partial<FullParticularConfig> {
    x: number;
    y: number;
}
interface CreateParticlesOptions {
    /** Canvas element. If omitted, one is auto-created and appended to `container` or `document.body`. */
    canvas?: HTMLCanvasElement;
    preset?: PresetName;
    config?: Partial<FullParticularConfig> & {
        camera?: CameraConfig;
    };
    /** Rendering backend. Default `'webgl'`. Use `'webgl3d'` for perspective projection with 3D particles. */
    renderer?: RendererType;
    autoResize?: boolean;
    autoClick?: boolean;
    clickTarget?: EventTarget;
    /** Container element for container-aware mode. Canvas sizes to this element
     *  and all coordinates become container-relative. Omit for full-viewport mode. */
    container?: HTMLElement;
    /** Add a mouse-tracking force. `true` uses sensible defaults, or pass a config object. */
    mouseForce?: boolean | MouseForceConfig;
}
/** Handle returned by addBoundary(). */
interface BoundaryHandle {
    /** Re-sync repulsors to the element's current position/size. Called automatically on resize. */
    update: () => void;
    /** Remove this boundary and its repulsors. */
    destroy: () => void;
}
/** Handle returned by addContainerGlow(). */
interface ContainerGlowHandle {
    /** Re-sync glow emitters to the element's current position/size. Called automatically on resize. */
    update: () => void;
    /** Stop emitting new particles. Existing particles fade out naturally. Call start() to resume. */
    stop: () => void;
    /** Resume emitting after stop(). */
    start: () => void;
    /** Remove this glow effect and its emitters immediately. */
    destroy: () => void;
}
/** Handle returned by addMouseTrail(). */
interface MouseTrailHandle {
    /** Stop emitting trail particles. Existing particles fade out naturally. */
    stop: () => void;
    /** Resume emitting after stop(). */
    start: () => void;
    /** Remove the trail and all its listeners. */
    destroy: () => void;
}
interface ParticlesController {
    engine: Particular;
    /** The canvas element used by this controller (may have been auto-created). */
    canvas: HTMLCanvasElement;
    /** Camera instance (only available when renderer is 'webgl3d'). */
    camera: Camera | null;
    burst: (options: BurstOptions) => Emitter;
    attachClickBurst: (target?: EventTarget, overrides?: Partial<FullParticularConfig>) => () => void;
    addForce: (force: ForceSource) => ForceSource;
    removeForce: (force: ForceSource) => void;
    addAttractor: (config: AttractorConfig) => Attractor;
    removeAttractor: (attractor: Attractor) => void;
    addRandomAttractors: (count: number, config?: Partial<Omit<AttractorConfig, 'x' | 'y'>>) => Attractor[];
    removeAllAttractors: () => void;
    addMouseForce: (config?: MouseForceConfig) => MouseForce;
    removeMouseForce: (mouseForce: MouseForce) => void;
    /** Add a boids flocking force. Particles self-organize into swarm patterns via
     *  separation, alignment, and cohesion steering rules. Composes with attractors and mouse force. */
    addFlockingForce: (config?: FlockingForceConfig) => FlockingForce;
    removeFlockingForce: (flockingForce: FlockingForce) => void;
    /** Create a repulsion boundary around an HTML element. Particles are pushed away from its edges.
     *  The boundary auto-syncs when the element resizes or scrolls. Returns a handle to update or remove it. */
    addBoundary: (config: BoundaryConfig) => BoundaryHandle;
    /** Create a glowing particle halo around an HTML element. Particles emit outward from all edges
     *  with a gentle pulse. Works with any element including text. Returns a handle to update or remove it. */
    addContainerGlow: (config: ContainerGlowConfig) => ContainerGlowHandle;
    /** Create a particle trail that follows the mouse cursor. Particles inherit cursor velocity
     *  direction and leave glowing wisp streaks. Returns a handle to stop or remove it. */
    addMouseTrail: (config?: MouseTrailConfig) => MouseTrailHandle;
    explode: (options?: ExplodeOptions) => void;
    /** Scatter all particles with a random impulse. Particles with home positions spring back.
     *  Pass `rotation` to also add a random rotational impulse (degrees/tick). */
    scatter: (options?: {
        velocity?: number;
        rotation?: number;
    }) => void;
    /** Start continuous per-frame wobble on all spring-return particles.
     *  Small random velocity and rotation nudges each frame — the spring fights back,
     *  creating an organic jitter effect. Call stopWobble() to let particles settle. */
    startWobble: (config?: WobbleConfig) => void;
    /** Stop wobble and let spring-return particles settle back to home positions. */
    stopWobble: () => void;
    imageToParticles: (config: ImageParticlesConfig) => Promise<Emitter>;
    textToParticles: (text: string, config?: Omit<ImageParticlesConfig, 'image'> & {
        textConfig?: Omit<TextImageConfig, 'text'>;
    }) => Promise<Emitter>;
    /** Capture any HTML element and replace it with particles at the same position.
     *  Uses manual Canvas 2D rendering (reads computed styles) — no external libraries needed.
     *  The original element is hidden by default and restored on destroy(). */
    elementToParticles: (element: HTMLElement, config?: ElementParticlesConfig) => Promise<Emitter>;
    /** Shatter an image into irregular polygon chunks that explode outward like broken glass.
     *  Each chunk is a particle with its own piece of the source image as texture.
     *  Pass `homeConfig` for interactive mode — chunks spring back after scatter(). */
    shatterImage: (config: ImageShatterConfig) => Promise<Emitter>;
    /** Render text to a canvas and shatter it into polygon chunks.
     *  Supports all ImageShatterConfig options plus text styling via textConfig. */
    shatterText: (text: string, config?: Omit<ImageShatterConfig, 'image'> & {
        textConfig?: Omit<TextImageConfig, 'text'>;
    }) => Promise<Emitter>;
    /** Toggle idle animations (breathing, wiggle, wave, pulse) on all particles with home positions.
     *  Spring return still works when idle is disabled — particles return home but stay still once there. */
    setIdleEffect: (enabled: boolean) => void;
    /** Set the camera position (only works when renderer is 'webgl3d'). */
    setCameraPosition: (x: number, y: number, z: number) => void;
    /** Set camera position from spherical coordinates around the target (only works when renderer is 'webgl3d'). */
    orbitCamera: (azimuth: number, elevation: number, distance: number) => void;
    /** Enable mouse-drag orbit + scroll-zoom controls (only works when renderer is 'webgl3d'). Returns cleanup function. */
    enableOrbitControls: () => (() => void) | null;
    /** Start automatic camera orbit around the target (only works when renderer is 'webgl3d').
     *  Speed is radians per second (default 0.3). Returns cleanup function. */
    enableAutoOrbit: (speed?: number) => (() => void) | null;
    destroy: () => void;
}
interface ScreensaverOptions {
    /** Canvas element. If omitted, one is auto-created and appended to `container` or `document.body`. */
    canvas?: HTMLCanvasElement;
    preset?: PresetName;
    config?: Partial<FullParticularConfig>;
    /** Rendering backend. Default `'webgl'`. */
    renderer?: RendererType;
    autoResize?: boolean;
    /** Mouse wind configuration. Pass `false` to disable entirely. */
    mouseWind?: MouseForceConfig | false;
    /** Container element for container-aware mode. Omit for full-viewport mode. */
    container?: HTMLElement;
}
interface ScreensaverController {
    engine: Particular;
    controller: ParticlesController;
    destroy: () => void;
}

export { type BoundaryHandle as B, type CanvasLayerStyle as C, DEFAULT_Z_INDEX as D, type MouseTrailHandle as M, type ParticlesController as P, type ScreensaverController as S, type BurstOptions as a, type ContainerGlowHandle as b, type CreateParticlesOptions as c, type PresetName as d, type ScreensaverOptions as e, applyCanvasStyles as f, colorPalettes as g, getParticlesBackgroundLayerStyle as h, getParticlesContainerLayerStyle as i, particlesContainerLayerStyle as j, presets as k, particlesBackgroundLayerStyle as p };
