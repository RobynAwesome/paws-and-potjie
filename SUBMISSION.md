# Paws & Potjie — DEV Frontend Challenge Submission

**Frontend Challenge Perfect Landing Submission 🍲🥧**

This is a submission for **Frontend Challenge: Comfort Food Edition — Perfect Landing**.

## What I Built

I built **Paws & Potjie**, a fictional South African comfort kitchen for dogs and their humans.

The landing page treats comfort food as a shared ritual rather than a static restaurant menu. The hero centres a potjie — rendered as adaptive Three.js on capable devices and as a lightweight CSS illustration when WebGL, device resources, Save-Data, or motion preferences say “keep it simple.”

The main interaction is the **Comfort Compass**: choose the human mood and the dog's current energy, and the page deterministically pairs one human comfort dish with one deliberately plain dog-side bowl. The interaction is local and instant; it does not pretend to need AI to make a tiny menu decision.

Key frontend details:

- React 19 + Vite 8 + TypeScript 7
- Three.js + React Three Fiber/Drei hero scene
- mobile-first responsive layout
- keyboard focus states and `aria-pressed` selection states
- `prefers-reduced-motion`, Save-Data, WebGL and device-resource adaptation
- lazy-loaded 3D chunk so lite devices do not pay the Three.js download cost
- installable PWA shell with offline fallback and update-safe navigation caching
- deterministic pairing logic with no network dependency

## Demo

**Open in StackBlitz:**  
https://stackblitz.com/github/RobynAwesome/paws-and-potjie?startScript=stackblitz

**Source:**  
https://github.com/RobynAwesome/paws-and-potjie

If a hosted production URL is available before publishing the DEV post, put it above the StackBlitz link and keep StackBlitz as the inspectable fallback.

## Journey

I wanted the theme to feel local rather than like a generic restaurant template, so I anchored the visual language around a South African potjie, warm maize-yellow, veld green, tomato red, tactile cream, and the social feeling of a long Sunday meal.

The biggest technical decision was **not** to make the 3D layer universal. A dramatic WebGL hero is fun, but forcing it onto every phone would work against the experience. The runtime classifies the client as `lite`, `balanced`, or `full`; `lite` keeps the CSS potjie, while balanced/full devices can load the Three.js scene. Reduced-motion and Save-Data preferences also constrain motion, DPR and continuous rendering.

I also kept a proof boundary in the product: this is a fictional restaurant concept, and the dog-side menu is illustrative rather than veterinary advice. Visual polish is not treated as evidence of a real restaurant or nutrition product.

The project was built with AI-assisted engineering under my direction: concept, product decisions, governance constraints and final acceptance remained human-directed while ChatGPT helped implement and review the code.

## What I'm Proud Of

The part I like most is that the immersive layer has **logic**. Three.js is not there just because 3D looks impressive: its presence, rendering budget and motion all respond to the user's device and preferences, while the exact same story survives in the CSS fallback.

That made the page feel more alive without making “alive” synonymous with “heavier.”

---

**Solo submission.**
