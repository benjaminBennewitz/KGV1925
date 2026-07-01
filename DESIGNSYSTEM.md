---
name: Bright Botanical Heritage
version: 1.0.0
project: KGV1925 Website
description: Accessible, bright and botanical design system for Kleingartenverein am Steinberg e.V. 1925.
---

# Bright Botanical Heritage Design System

## 1. Brand Direction

The KGV1925 website uses a bright, accessible and botanical visual language. The design combines the reliability of a traditional German allotment garden association with a modern, welcoming and easy-to-use digital experience.

The visual direction is inspired by a well-tended garden in soft daylight: calm sage greens, gentle lavender accents, warm off-white surfaces and strong readable contrast. The interface should feel organized, friendly and trustworthy without becoming playful, childish or visually overloaded.

The core design principles are:

- Bright, calm and readable
- Nature-inspired but not rustic
- Modern, structured and maintainable
- Accessible for all generations
- No third-party tracking, no external font loading, no unnecessary visual noise

## 2. Visual Personality

The design should feel:

- Welcoming
- Trustworthy
- Clear
- Community-oriented
- Natural
- Calm
- Carefully maintained

The design should not feel:

- Corporate cold
- Overly decorative
- Dark or heavy
- Trendy at the cost of usability
- Like a generic association template

## 3. Color System

The color palette is based on sage green, lavender and warm garden neutrals. Sage green is used as the main structural color. Lavender is used as a soft emotional accent. Dark forest green remains the strongest contrast color for text, navigation and primary actions.

### 3.1 Core Tokens

```yaml
colors:
  background: '#fbfaf6'
  background-soft: '#f6f3ee'
  surface: '#ffffff'
  surface-soft: '#f8f6f1'
  surface-sage: '#eef5ef'
  surface-sage-strong: '#dfeade'
  surface-lavender: '#f3eff9'
  surface-lavender-strong: '#e8dff5'

  text-main: '#18211b'
  text-muted: '#48534b'
  text-soft: '#667267'
  text-inverse: '#ffffff'

  primary: '#315c45'
  primary-hover: '#244936'
  primary-active: '#1c392b'
  on-primary: '#ffffff'

  secondary: '#8f7bb8'
  secondary-hover: '#75619f'
  secondary-active: '#604e85'
  on-secondary: '#ffffff'

  accent-sage: '#a9bfa8'
  accent-sage-soft: '#eef5ef'
  accent-lavender: '#c9b8e8'
  accent-lavender-soft: '#f3eff9'
  accent-sand: '#d8bc7a'
  accent-sand-soft: '#f8efd8'

  border: '#d8ded6'
  border-soft: '#e8ece5'
  border-strong: '#9faa9f'

  focus: '#6f55a0'

  success: '#2f6f4e'
  success-soft: '#e7f3ec'
  warning: '#8a6500'
  warning-soft: '#f8efd8'
  error: '#b42318'
  error-soft: '#fde7e4'
```

### 3.2 Color Usage

| Token | Usage |
| --- | --- |
| `background` | Main page background |
| `surface` | Cards, header, modals, main content blocks |
| `surface-sage` | Calm section backgrounds, feature areas, information groups |
| `surface-lavender` | Soft highlights, event previews, secondary visual accents |
| `primary` | Primary buttons, navigation accents, important UI elements |
| `secondary` | Secondary buttons, event icons, category accents |
| `accent-sand` | Seasonal notes, subtle warnings, special announcements |
| `text-main` | Main text and headings |
| `text-muted` | Secondary body text |
| `border` | Standard dividers and card borders |
| `focus` | Visible keyboard focus state |

### 3.3 Accessibility Rules

Lavender and sage accent colors must not be used as body text colors on light backgrounds unless the contrast ratio has been checked.

Recommended text combinations:

| Background | Text |
| --- | --- |
| `background` | `text-main` |
| `surface` | `text-main` |
| `surface-sage` | `text-main` |
| `surface-lavender` | `text-main` |
| `primary` | `on-primary` |
| `secondary` | `on-secondary` |

Use `primary`, `text-main` or `text-muted` for readable text. Use lavender mainly for backgrounds, icons, decorative elements and secondary UI states.

## 4. Gradients and Decorative Layers

The design may use very soft organic gradients to create a calm garden atmosphere. These gradients should never reduce readability.

### 4.1 Hero Background

```scss
background:
  radial-gradient(circle at 12% 20%, rgba(169, 191, 168, 0.28), transparent 28rem),
  radial-gradient(circle at 85% 12%, rgba(201, 184, 232, 0.24), transparent 24rem),
  #fbfaf6;
```

### 4.2 Section Background

```scss
background:
  linear-gradient(135deg, rgba(238, 245, 239, 0.72), rgba(243, 239, 249, 0.56)),
  #ffffff;
```

### 4.3 Decorative Botanical Elements

Botanical illustrations may be used sparingly as soft supporting elements. They should be subtle, low-contrast and never compete with content.

Recommended decorative use cases:

- Hero illustration edges
- Empty states
- Section transitions
- Garden knowledge pages
- Event landing pages

Avoid decorative elements inside dense forms, tables or important notices.

## 5. Typography

Typography should support readability for an intergenerational audience. Text must remain large enough, calm and easy to scan.

All fonts must be loaded locally. Do not use external font services.

### 5.1 Recommended Font Pairing

| Role | Font | Usage |
| --- | --- | --- |
| Display | Fraunces | Hero headlines, decorative year marks, selected editorial headings |
| UI and Body | Inter | Navigation, body text, forms, cards, buttons, tables |

Fraunces should be used carefully. It gives the website warmth and heritage, but too much of it can reduce clarity. Inter remains the main functional font.

### 5.2 Font Fallbacks

```scss
--font-display: 'Fraunces', Georgia, serif;
--font-body: 'Inter', Arial, sans-serif;
```

### 5.3 Type Scale

```yaml
typography:
  display-xl:
    fontFamily: Fraunces
    fontSize: 64px
    fontWeight: '600'
    lineHeight: 72px
    letterSpacing: -0.03em

  headline-xl:
    fontFamily: Fraunces
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em

  headline-lg:
    fontFamily: Fraunces
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em

  headline-md:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px

  headline-sm:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px

  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px

  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px

  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px

  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.01em

  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
```

### 5.4 Mobile Typography

On small screens, large display headings should scale down carefully.

```yaml
mobile:
  display-xl:
    fontSize: 40px
    lineHeight: 48px

  headline-xl:
    fontSize: 34px
    lineHeight: 42px

  headline-lg:
    fontSize: 28px
    lineHeight: 36px

  body-lg:
    fontSize: 17px
    lineHeight: 28px
```

## 6. Layout System

The layout should be spacious and calm. Content must remain readable on desktop, tablet and mobile.

### 6.1 Grid

| Breakpoint | Columns | Margin | Gutter | Max Width |
| --- | ---: | ---: | ---: | ---: |
| Desktop | 12 | 40px | 24px | 1280px |
| Tablet | 8 | 24px | 24px | 100% |
| Mobile | 4 | 16px | 16px | 100% |

### 6.2 Spacing Scale

The system uses an 8px base scale.

```yaml
spacing:
  0: 0
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
  16: 64px
  20: 80px
  24: 96px
```

Recommended spacing:

| Area | Spacing |
| --- | ---: |
| Card padding | 24px |
| Large card padding | 32px |
| Section vertical padding | 80px |
| Hero vertical padding | 96px |
| Mobile section padding | 48px |
| Mobile card padding | 20px |

## 7. Shape System

The interface uses soft but controlled radii. It should feel modern and friendly without becoming bubbly.

```yaml
radius:
  sm: 0.375rem
  md: 0.625rem
  lg: 1rem
  xl: 1.25rem
  xxl: 1.75rem
  full: 9999px
```

| Component | Radius |
| --- | ---: |
| Small labels | `sm` |
| Buttons | `md` |
| Inputs | `md` |
| Cards | `xl` |
| Hero images | `xxl` |
| Modals | `xxl` |
| Pills | `full` |

## 8. Elevation and Borders

The design avoids heavy shadows. Depth is created with clean borders, soft ambient shadows and tonal backgrounds.

### 8.1 Shadow Tokens

```yaml
shadows:
  card: 0 18px 48px rgba(24, 33, 27, 0.08)
  card-hover: 0 24px 64px rgba(24, 33, 27, 0.12)
  header: 0 8px 28px rgba(24, 33, 27, 0.08)
  modal: 0 28px 80px rgba(24, 33, 27, 0.18)
```

### 8.2 Border Rules

Cards should usually use both a soft border and a soft shadow.

```scss
border: 1px solid #d8ded6;
box-shadow: 0 18px 48px rgba(24, 33, 27, 0.08);
```

Avoid strong grey borders. Prefer warm green-tinted neutral borders.

## 9. Components

## 9.1 Header

The desktop header is bright, sticky and calm.

Recommended structure:

- Logo left
- Main navigation centered or left-aligned after logo
- Member area button on the right
- Active navigation item with green underline
- No large dark navigation bar

Header style:

```scss
background: rgba(255, 255, 255, 0.92);
border-bottom: 1px solid #e8ece5;
box-shadow: 0 8px 28px rgba(24, 33, 27, 0.08);
```

The member area button should use `primary` to make it clearly visible.

## 9.2 Buttons

### Primary Button

Used for the most important action on a page.

```scss
background: #315c45;
color: #ffffff;
border: 1px solid #315c45;
border-radius: 0.625rem;
```

### Secondary Button

Used for secondary actions with a lavender tone.

```scss
background: #f3eff9;
color: #2f2545;
border: 1px solid #c9b8e8;
border-radius: 0.625rem;
```

### Outline Button

Used when the action should remain quiet.

```scss
background: transparent;
color: #315c45;
border: 1px solid #315c45;
border-radius: 0.625rem;
```

### Focus State

All interactive elements need a clearly visible focus state.

```scss
outline: 3px solid #6f55a0;
outline-offset: 3px;
```

## 9.3 Cards

Cards are the main container element of the website. They should be bright, clean and easy to scan.

Recommended card style:

```scss
background: #ffffff;
border: 1px solid #d8ded6;
border-radius: 1.25rem;
box-shadow: 0 18px 48px rgba(24, 33, 27, 0.08);
```

Hover behavior:

```scss
transform: translateY(-2px);
box-shadow: 0 24px 64px rgba(24, 33, 27, 0.12);
```

Hover animations should be subtle and disabled or reduced when the user prefers reduced motion.

## 9.4 Feature Cards

Feature cards are used on the homepage for areas such as news, events, garden knowledge and service.

Recommended icon backgrounds:

| Card Type | Icon Background |
| --- | --- |
| News | `surface-sage` |
| Events | `surface-lavender` |
| Garden Knowledge | `surface-sage` |
| Service | `surface-lavender` |

Cards must include:

- Icon
- Short title
- One concise description
- Text link with arrow
- Large touch target on mobile

## 9.5 News Teasers

News teasers should be compact and readable.

Recommended structure:

- Optional thumbnail
- Title
- Short summary
- Date
- Category label

Category labels can use soft color backgrounds. Do not rely on color alone. Always include readable text.

## 9.6 Event Teasers

Event teasers may use lavender as the visual anchor.

Recommended structure:

- Calendar icon
- Event title
- Date
- Time
- Location if relevant
- Link to full calendar

## 9.7 Forms

Forms must be simple, accessible and predictable.

Rules:

- Labels are always visible
- No placeholder-only labels
- Minimum input height: 48px
- Clear error messages below the field
- Submit buttons are visually distinct
- Required fields are marked in text, not only by color

Input style:

```scss
background: #ffffff;
border: 1px solid #d8ded6;
border-radius: 0.625rem;
color: #18211b;
```

Focus style:

```scss
border-color: #315c45;
outline: 3px solid rgba(111, 85, 160, 0.32);
outline-offset: 2px;
```

## 9.8 Tables

Tables must remain readable for members and administrators.

Rules:

- Use high contrast text
- Avoid tiny font sizes
- Use zebra rows only very subtly
- Provide horizontal scrolling on small screens
- Keep important actions visible

Recommended table header:

```scss
background: #eef5ef;
color: #18211b;
```

## 9.9 Modals

Modals should be clear and calm.

Backdrop:

```scss
background: rgba(24, 33, 27, 0.48);
```

Modal surface:

```scss
background: #ffffff;
border: 1px solid #d8ded6;
border-radius: 1.75rem;
box-shadow: 0 28px 80px rgba(24, 33, 27, 0.18);
```

Avoid blur effects for better performance and clarity.

## 9.10 Toast Notifications

Toasts appear at the top right on desktop and full-width near the bottom on mobile.

They must include:

- Status icon
- Text label
- Optional action
- Visible status bar or icon shape

Status colors:

| Status | Color |
| --- | --- |
| Success | `success` |
| Warning | `warning` |
| Error | `error` |
| Info | `secondary` |

## 10. Homepage Composition

The desktop homepage should follow this structure:

1. Header
2. Hero section with strong headline, short introduction and primary actions
3. Trust/identity row with three short values
4. Four main feature cards
5. News and welcome/content split section
6. Statistics strip
7. Event preview or garden knowledge section
8. Footer

### 10.1 Hero Section

Hero content:

- Eyebrow: `Gemeinschaft. Natur. Zuhause.`
- Headline: `Seit 1925 verwurzelt in unserer Gemeinschaft.`
- Text: Short association introduction
- Primary CTA: `Über unseren Verein`
- Secondary CTA: `Nächste Termine`
- Hero image: Bright garden photo with rounded corners
- Floating event card with lavender icon

The hero should use soft sage and lavender background gradients.

## 11. Iconography

Icons should be simple, rounded and line-based. They may sit inside circular soft backgrounds.

Recommended icon background combinations:

```yaml
icon-backgrounds:
  sage:
    background: '#eef5ef'
    color: '#315c45'
  lavender:
    background: '#f3eff9'
    color: '#6f55a0'
  sand:
    background: '#f8efd8'
    color: '#8a6500'
```

Avoid overly detailed icons. Icons must support the text, not replace it.

## 12. Imagery

Photography should feel authentic and local. Avoid generic stock photos when real garden photos are available.

Recommended image style:

- Bright daylight
- Natural greens
- Community moments
- Garden paths
- Vereinshaus
- Seasonal plants
- Real allotment details

Image treatment:

```scss
border-radius: 1.75rem;
box-shadow: 0 24px 64px rgba(24, 33, 27, 0.12);
```

Avoid heavy filters. Images should remain natural and clear.

## 13. Accessibility

Accessibility is a core requirement from the beginning.

Rules:

- Maintain strong text contrast
- Use visible focus states
- Support keyboard navigation
- Respect reduced motion
- Use semantic HTML
- Provide alt text for meaningful images
- Avoid text inside images
- Do not rely on color alone
- Ensure touch targets are at least 44px by 44px
- Provide readable layouts down to 320px viewport width

### 13.1 Reduced Motion

```scss
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms;
    animation-iteration-count: 1;
    scroll-behavior: auto;
    transition-duration: 0.01ms;
  }
}
```

## 14. Performance Rules

The design must remain lightweight.

Rules:

- No external font services
- No third-party tracking
- No heavy animation libraries
- Optimize images as WebP or AVIF where possible
- Use responsive image sizes
- Avoid expensive blur filters
- Keep decorative assets small
- Prefer CSS gradients over large background images

## 15. CSS Custom Properties

Recommended global token setup:

```scss
:root {
  --color-background: #fbfaf6;
  --color-background-soft: #f6f3ee;
  --color-surface: #ffffff;
  --color-surface-soft: #f8f6f1;
  --color-surface-sage: #eef5ef;
  --color-surface-sage-strong: #dfeade;
  --color-surface-lavender: #f3eff9;
  --color-surface-lavender-strong: #e8dff5;

  --color-text-main: #18211b;
  --color-text-muted: #48534b;
  --color-text-soft: #667267;
  --color-text-inverse: #ffffff;

  --color-primary: #315c45;
  --color-primary-hover: #244936;
  --color-primary-active: #1c392b;
  --color-on-primary: #ffffff;

  --color-secondary: #8f7bb8;
  --color-secondary-hover: #75619f;
  --color-secondary-active: #604e85;
  --color-on-secondary: #ffffff;

  --color-accent-sage: #a9bfa8;
  --color-accent-lavender: #c9b8e8;
  --color-accent-sand: #d8bc7a;

  --color-border: #d8ded6;
  --color-border-soft: #e8ece5;
  --color-border-strong: #9faa9f;

  --color-focus: #6f55a0;
  --color-success: #2f6f4e;
  --color-warning: #8a6500;
  --color-error: #b42318;

  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Inter', Arial, sans-serif;

  --radius-sm: 0.375rem;
  --radius-md: 0.625rem;
  --radius-lg: 1rem;
  --radius-xl: 1.25rem;
  --radius-xxl: 1.75rem;
  --radius-full: 9999px;

  --shadow-card: 0 18px 48px rgba(24, 33, 27, 0.08);
  --shadow-card-hover: 0 24px 64px rgba(24, 33, 27, 0.12);
  --shadow-header: 0 8px 28px rgba(24, 33, 27, 0.08);
  --shadow-modal: 0 28px 80px rgba(24, 33, 27, 0.18);

  --container-max: 1280px;
  --gutter-desktop: 24px;
  --margin-desktop: 40px;
  --margin-tablet: 24px;
  --margin-mobile: 16px;
}
```

## 16. Implementation Notes

Use this design system as the base for global styles, layout tokens and reusable Angular components.

Recommended first components:

- App shell
- Header
- Footer
- Button
- Card
- Section wrapper
- Feature card
- News teaser
- Event teaser
- Accessible form fields

Design decisions should always support maintainability, performance, accessibility and local-first implementation.
