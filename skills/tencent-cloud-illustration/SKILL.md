---
name: tencent-cloud-illustration
description: Create Tencent Cloud VI-compatible, text-light image prompts and visual material for approved content opportunities, social cards, and carousel backgrounds. Use when the workflow needs image generation, background material, or visual direction.
---

# Tencent Cloud Illustration

Generate the visual material, not the final typography-heavy slide.

## Workflow

1. Read the approved candidate package and identify the single visual metaphor.
2. Choose `material-illustration`, `social-card`, `illustration`, or `carousel-system`.
3. Default to a text-free central material illustration for carousel backgrounds.
4. Define a candidate-specific `visualSignature`: metaphor, subject inventory, composition, and motion direction.
5. Apply `references/vi-guardrails.md`.
6. Write one reproducible English prompt and negative prompt per image.
7. Generate raster assets only when the user asks for final images.

## Uniqueness rule

- Reuse the brand system, never the finished background.
- Every candidate gets a new visual metaphor and a new generation request.
- Do not reuse a background path, generated image, subject arrangement, or prompt from another candidate unless the user explicitly asks for a template reuse.
- Record the unique metaphor in `visualPlan.visualSignature` and the generated file provenance in `visualPlan.backgrounds`.
- If two candidate packages have the same prompt, visual signature, or background file path, visual QA fails.

## Preferred visual language

- Bright white or light cloud-gray studio surface.
- Tencent Cloud blue and cyan accents.
- Continuous cloud-ribbon geometry and open loops.
- Refined physical objects, subtle shadows, crisp black or dark-navy outlines.
- AI agent, workflow, retrieval, policy, review, and feedback-loop metaphors.

## Avoid

- Dense text, fake dashboards, tiny UI, watermarks, accidental logos, and third-party platform logos.
- Cute mascots, purple-heavy gradients, decorative blobs, stock-photo scenes, and exaggerated 3D.
- Unverified capability, security, compliance, performance, or competitor-superiority claims.
- Recreating the source post's exact composition.

## Output contract

Return `mode`, `platform`, `imageText`, `visualPrompt`, `negativePrompt`, `altText`, and Chinese `reviewNotes`.
