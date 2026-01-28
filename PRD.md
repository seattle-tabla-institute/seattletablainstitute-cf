# Seattle Tabla Institute Website Revamp - PRD

## Overview
Seattle Tabla Institute (STI) needs a modern, mobile-first website that clearly
communicates its nonprofit mission, highlights youth and adult classes, and
promotes public events and media. The site must meet Google Ad Grants website
policy requirements and be easy to navigate on both desktop and mobile. This
first release prioritizes speed to launch (hodo hodo) with a static site and a
lightweight CMS for non-developer updates.

## Goals
- Launch a high-quality, mobile-friendly website that meets Google Ad Grants requirements.
- Make "Join a Class" and "Attend an Event" the primary conversions.
- Provide clear mission, nonprofit status, and program details.
- Keep the site fast, accessible, and easy to update by non-developers.

## Non-Goals (Phase 1)
- No certification program content.
- No complex integrations (social, YouTube, Google Calendar) in v1.
- No custom backend or database beyond static files and Netlify build.

## Target Audiences
- Parents and youth students (ages 5-18).
- Adult students (ages 19+).
- Community members looking for cultural events.
- Potential collaborators and partner organizations.

## Key Messages
- STI is a 501(c)(3) nonprofit dedicated to tabla education and Hindustani music.
- Youth and adult classes are available year-round, with online/hybrid options.
- Public events and artist collaborations build community and access.

## Success Metrics
- Ad Grants website approval.
- Increased class inquiries (form submissions).
- Increased event interest (email requests / mailing list signups).
- Mobile performance score >= 85 on PageSpeed Insights.
- Zero broken links across the site.

## Information Architecture (v1)
- Home
- Programs (Youth, Adult)
- Events
- Gallery
- About
- Policies
- Contact
- Student Portal (external link)

## Functional Requirements
- Clear global navigation with primary CTA "Join a Class."
- Contact form (Netlify form) for class and event inquiries.
- Program pages with schedules, locations, and pricing managed via CMS data.
- Events page populated from CMS-managed Markdown entries.
- Gallery page with CMS-managed photos and YouTube links.
- Mission, EIN, and nonprofit status prominently displayed.

## Non-Functional Requirements
- HTTPS everywhere.
- Fast load times (optimized images, minimal scripts).
- Mobile-first responsive layout.
- Accessibility basics (semantic HTML, alt text, contrast, keyboard focus).

## Content Requirements
- Mission statement and nonprofit status on Home and About.
- Youth and adult program descriptions.
- Event descriptions focused on education and community.
- Media gallery with photos and video embeds.
- Non-discrimination and class policy summaries.
- Contact details and service areas.
- Placeholder pricing and event details until final data arrives.

## Design Direction
- Fresh, modern, and education-focused.
- Warm palette with expressive typography.
- Layered background textures and subtle motion reveals.
- Avoid generic layouts; emphasize a welcoming community feel.

## CMS (Phase 1)
- Use Decap CMS (Netlify CMS) with Auth0 (Google sign-in) and Netlify Functions.
- Events managed as Markdown files in `content/events/`.
- Classes and gallery managed as JSON files in `data/`.
- Netlify build runs `scripts/build-content.js` to generate `data/events.json`.
 - Netlify Functions return a GitHub token for CMS commits to `main`.

## Build and Deployment
- Netlify runs `npm run build` on deploy.
- The build script compiles event Markdown into JSON for client rendering.
- Static assets are served from the repo root.

## Authentication
- Editors sign in with Google via Auth0.
- Auth0 callback handled by Netlify Functions at `/.netlify/functions/auth-callback`.
- Authorized emails are controlled via `CMS_ALLOWED_EMAILS`.

## Payments (v1)
- Keep PayPal for speed to launch.
- Structure CTAs so payment URLs can be swapped later.
- Stripe or Donorbox can be added in a future iteration.

## Risks and Mitigations
- Risk: Missing updated photos. Mitigation: use placeholders and swap in assets later.
- Risk: Unfinalized pricing. Mitigation: placeholders with clearly labeled TBD.
- Risk: Nonprofit name confirmation. Mitigation: use "Seattle Tabla Institute" for now.
- Risk: CMS onboarding delays. Mitigation: provide editor invites and quick training.

## Open Questions
- Final nonprofit legal name confirmation.
- Final class pricing and schedules.
- Confirm PayPal payment URLs for classes/events.
- Updated impact statistics and leadership bios.
- Final media assets and YouTube links for the gallery.
