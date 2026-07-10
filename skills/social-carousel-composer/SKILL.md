---
name: social-carousel-composer
description: Compose concise LinkedIn or Instagram carousels from approved copy and Tencent Cloud illustration material, render stable square slides, and perform visual QA. Use when the user asks for a carousel, multiple social slides, or final PNG assets.
---

# Social Carousel Composer

Combine text-light illustration material with deterministic typography and layout.

## Input boundary

- Copy comes from `contentPackage.carousel`.
- Background or subject art comes from `tencent-cloud-illustration`.
- Do not ask the image generator to render long slide text.
- Backgrounds must be generated for the current candidate; do not borrow a prior carousel's finished art.

## Default system

- Canvas: 1080x1080.
- One idea per slide.
- Cover plus 3-6 content slides and an optional CTA ending.
- Sans-serif stack: SF Pro Display, Helvetica Neue, Arial, sans-serif.
- Cards use 8px radius or less.
- Use Tencent blue, deep navy, cyan, white, and neutral gray; avoid a one-note blue wash.

## Text limits

- Title: no more than 8 words.
- Support line: no more than 10 words.
- Example: no more than 7 words.
- If the idea does not fit, rewrite it; do not shrink the type until it becomes difficult to read.

## Rendering

Use a deterministic HTML/CSS renderer such as Playwright. Preserve stable dimensions and export one PNG per slide plus a contact sheet.

## QA gate

Before delivery:

- Confirm every file is 1080x1080.
- Inspect a contact sheet at desktop scale.
- Check text overflow, contrast, line breaks, visual repetition, background loading, and slide numbering.
- Confirm the generated art contains no accidental logos, fake UI, or unreadable text.
- Compare candidate IDs, prompts, visual signatures, and background paths; reject cross-candidate duplicates.
- Keep the product CTA on the final slide unless the content concept requires earlier context.
