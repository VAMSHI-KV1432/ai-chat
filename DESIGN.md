# Design Brief

**Purpose**: ChatGPT-like chat interface optimized for conversation clarity and minimal distraction.

## Aesthetic & Tone
Refined minimalism with dark-first design. Precision over decoration. Clean typography hierarchy, vibrant accents used sparingly for interactive elements.

## Differentiation
Dark mode reduces eye strain for extended chat sessions. Cyan accent (not generic blue) signals modern, distinctive personality. Chat bubble asymmetry (AI left/user right) mirrors natural conversation flow.

## Color Palette

| Token | OKLCH | Usage |
|-------|-------|-------|
| Background | 0.12 0 0 | Primary page bg, deep charcoal |
| Foreground | 0.95 0 0 | Text, high contrast with bg |
| Card | 0.18 0 0 | Chat bubbles, elevated surfaces |
| Border | 0.25 0 0 | Subtle dividers, input outlines |
| Muted | 0.22 0 0 | Disabled states, secondary text |
| Primary (Cyan) | 0.62 0.21 193 | Send button, active states, links |
| Accent | 0.72 0.25 189 | Highlights, loading indicators |
| Destructive | 0.65 0.19 22 | Delete, error messaging |

## Typography
- **Display**: Bricolage Grotesque, 600–700 weight. Header titles, section labels.
- **Body**: DM Sans, 400–500 weight. Chat messages, input field, UI labels.
- **Mono**: System monospace. Code blocks, technical content in chat.

## Shape Language
- Chat bubble radius: 12px (rounded but not pill-shaped)
- Input field radius: 8px (subtle softness)
- Icon buttons: full circle or 4px minimal radius
- No more than 3 distinct radii in use

## Elevation & Depth
Minimal shadow stack. Primary surface (background) → card surfaces (0.18 L, 4–6px offset). No glowing effects or complex layering.

## Structural Zones

| Zone | Background | Border | Intent |
|------|-----------|--------|--------|
| Header | card (0.18) | border (0.25) | Title, minimal controls |
| Sidebar | sidebar (0.15) | sidebar-border (0.25) | Conversation history list |
| Chat Viewport | background (0.12) | none | Main message stream |
| Input Bar | input (0.22) | border (0.25) | Sticky bottom, message composition |
| Message (AI) | card (0.18) | none | Left-aligned, white-on-dark |
| Message (User) | muted (0.22) | none | Right-aligned, secondary tone |

## Spacing & Rhythm
- Base unit: 4px grid
- Message vertical spacing: 8px between bubble groups
- Input padding: 12px horizontal, 10px vertical
- Header height: 56px
- Sidebar width (expanded): 280px

## Component Patterns
1. **Chat Bubble**: Rounded rect, padding 12px 16px, message-fade-in animation on mount
2. **Send Button**: Primary cyan, icon + text or icon-only, loading state pulse
3. **Input Field**: Dark border, subtle bg lift on focus, character count optional
4. **Sidebar Item**: Hover highlight, active indicator (left border accent), delete on long-press
5. **Loading Indicator**: Cyan pulse animation, centered in message area

## Motion
- **Message entry**: fade-in + slight translate-up (0.2s ease-out)
- **Send button loading**: subtle pulse 1.5s, infinite loop
- **Hover states**: no scale, text or bg color shift only
- **Transitions**: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

## Constraints
- No full-page gradients or animated backgrounds
- Accent color (cyan) reserved for actions and loading only
- Text contrast minimum 0.95 L on 0.12 L background (WCAG AAA)
- Sidebar collapsible on mobile (< md breakpoint)
- Input remains sticky and accessible on mobile

## Signature Detail
Cyan accent instead of default blue. Creates instant recognition and personality while maintaining productivity aesthetic.
