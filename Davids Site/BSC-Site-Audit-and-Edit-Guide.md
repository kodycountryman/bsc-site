# Black Sheep Club Retreat — Full Site Audit & Edit Guide

**Prepared for:** David (Black Sheep Club)
**Site:** blacksheepclub.pages.dev
**Date:** March 29, 2026
**Purpose:** Section-by-section teardown with specific changes, copy rewrites, and Claude Code prompts to take this site from good to "would Stripe ship this?" level.

---

## Executive Summary

The site has strong bones: real photography, clear event details, and authentic energy. But it's leaving conversions on the table. The main issues are: weak hierarchy and pacing (the page rushes to content without earning attention), generic copy that doesn't speak to a specific pain point, no social proof, an unclear value proposition for the price, and several UX/design gaps that erode trust. Below is everything needed to fix it.

---

## 1. GLOBAL / SITEWIDE ISSUES

### 1A. Navigation is too minimal
The header just says "BSC" with nothing else. No anchor links, no CTA in the nav. Visitors who scroll down and want to jump to pricing or the schedule have no way to do it.

**Recommendation:** Add a sticky nav with anchor links (Schedule, What's Included, Pricing) and a persistent "Secure My Spot" CTA button in the top-right.

**Claude Code Prompt:**
```
Add a sticky/fixed navigation bar to the top of the page. Left side: "BSC" logo text.
Center or right: anchor links — "Schedule", "What's Included", "Pricing".
Far right: a small gold (#C5A336) "Secure My Spot" button that links to the pricing/checkout section.
The nav should be transparent on load and gain a white background with subtle shadow on scroll.
Use smooth scroll behavior for all anchor links. Keep it minimal — no hamburger menu needed
on mobile, just the logo and the CTA button. The anchor links can collapse on mobile.
```

### 1B. No favicon or meta/OG tags visible
When someone shares this link on iMessage or social, there's likely no preview image, title, or description.

**Recommendation:** Add proper Open Graph tags and a favicon.

**Claude Code Prompt:**
```
Add the following meta tags to the <head>:
- <meta property="og:title" content="Black Sheep Club Retreat — May 4-6, Odessa FL">
- <meta property="og:description" content="3 days of fellowship, workouts, recovery, and purpose with like-minded men. Limited spots.">
- <meta property="og:image" content="[URL to a hero image or group photo]">
- <meta property="og:type" content="website">
- <meta name="description" content="Black Sheep Club Retreat — May 4-6 in Odessa, FL. Fellowship, fitness, cold plunge, sauna, and finding your purpose. Limited spots available.">
Also add a favicon link tag pointing to a BSC logo icon.
```

### 1C. Typography needs a tighter system
The site uses multiple display/decorative fonts (the big block serif for "BLACK SHEEP CLUB RETREAT," a different hand-drawn style for "THE SCHEDULE," another for "COME, SIGN THE WALL."). This creates visual noise instead of a cohesive brand.

**Recommendation:** Limit to 2 fonts max. One bold display font for major headings and one clean sans-serif for body/UI. Apply consistently everywhere.

**Claude Code Prompt:**
```
Audit all font-family declarations across the site. Consolidate to exactly two fonts:
1. A bold display/heading font (keep the current strong serif if it's a single family —
   just make sure "THE SCHEDULE", "FIND THE PACKAGE", "STAY IN THE LOOP", and
   "COME, SIGN THE WALL" all use the same one)
2. A clean sans-serif for body text, labels, navigation, and UI elements
   (Inter, DM Sans, or similar)
Remove any additional decorative fonts. Create CSS custom properties for both:
--font-display and --font-body. Apply consistently.
```

### 1D. Color palette is unfocused
Gold/olive (#C5A336-ish) is the accent, but it's used inconsistently — sometimes for text, sometimes for backgrounds, sometimes for borders. Black, white, and gold should be the system.

**Claude Code Prompt:**
```
Define a strict color token system in CSS custom properties:
--color-primary: #C5A336 (gold — used for CTAs, highlights, accent borders)
--color-primary-hover: #B8962E (slightly darker gold for hover states)
--color-bg: #FFFFFF
--color-bg-alt: #FAFAF7 (warm off-white for alternating sections)
--color-text: #1A1A1A (near-black for body)
--color-text-muted: #6B6B6B (secondary text)
--color-border: #E5E5E5

Audit every color value on the site and replace with the appropriate token.
No raw hex values outside the variable definitions.
```

### 1E. No loading/performance optimizations visible
Large photos (the fellowship, wellness, recovery, freedom images) are likely unoptimized.

**Claude Code Prompt:**
```
Add loading="lazy" to all images below the fold (everything except the hero area).
Add width and height attributes to all <img> tags to prevent layout shift.
Convert images to WebP format with JPEG fallback using <picture> elements.
Add preconnect tags for any external font CDNs in the <head>.
```

---

## 2. HERO SECTION (Page 1 — Top)

### 2A. The headline doesn't sell — it just labels
"BLACK SHEEP CLUB RETREAT / 1ST EDITION" tells me the name but not why I should care. The date badge (MAY 4-6, ODESSA FL) is good but it's fighting for attention with the title instead of supporting it.

**Recommendation:** Add a value-driven subheadline below the title. Something that speaks directly to the target audience's desire or pain.

**Claude Code Prompt:**
```
Below the "BLACK SHEEP CLUB RETREAT" title and "1ST EDITION" subtitle, add a subheadline
paragraph with this text (or similar — match the voice):

"3 days with men who refuse to settle. Train hard. Recover deeper.
Leave with clarity on who you are and what you're building."

Style it as body text, ~18-20px, color: var(--color-text-muted), max-width: 600px,
centered. Add 24px of spacing between the subtitle and this new line.
```

### 2B. The countdown timer lacks context and urgency
The timer just says "RETREAT STARTS IN" — it's fine, but it doesn't create buying urgency. There's no indication of how many spots are left or why someone should act now.

**Recommendation:** Add a scarcity line below the timer.

**Claude Code Prompt:**
```
Below the countdown timer, add a small urgency banner/line of text:
"Only [X] spots remaining — this retreat will not be repeated at this price."
Style: uppercase, letter-spacing: 0.1em, font-size: 13px, color: var(--color-primary),
font-weight: 600. Center aligned. Add a subtle pulse or fade-in animation on load.
```

### 2C. No primary CTA in the hero
The hero has no button. Visitors who are ready to buy have to scroll the entire page to find "SECURE MY SPOT." That's lost conversions.

**Recommendation:** Add a primary CTA button immediately after the countdown/urgency line.

**Claude Code Prompt:**
```
Add a CTA button below the countdown timer area. Button text: "Claim Your Spot — $499"
Style: background-color: var(--color-primary), color: white, padding: 16px 40px,
font-weight: 700, letter-spacing: 0.05em, border-radius: 6px, font-size: 16px.
On hover: background-color: var(--color-primary-hover), subtle translateY(-1px)
and box-shadow lift.
Link to the pricing section (#pricing) with smooth scroll.
```

---

## 3. FOUR PILLARS SECTION (Fellowship, Wellness, Recovery, Freedom)

### 3A. Great concept, weak copy
Each pillar has a one-liner ("Get in the room with like-minded men", "Reshape what's possible for you", "Sauna, Cold Plunge, and ALL the tools", "No strict schedule, Spirit led Intention"). These are vague. They tell me features, not transformations.

**Recommendation:** Rewrite each one-liner to be benefit-driven and specific.

**Claude Code Prompt:**
```
Update the four pillar descriptions:

FELLOWSHIP:
Old: "Get in the room with like-minded men"
New: "Iron sharpens iron. Surround yourself with men who are building something real."

WELLNESS:
Old: "Reshape what's possible for you"
New: "Push your body. Quiet your mind. Discover what you're actually capable of."

RECOVERY:
Old: "Sauna, Cold Plunge, and ALL the tools"
New: "Sauna, cold plunge, breathwork, and every recovery tool to rebuild stronger."

FREEDOM:
Old: "No strict schedule, Spirit led Intention"
New: "No rigid agenda. Every moment is designed around what the group needs most."
```

### 3B. CRITICAL BUG — Images misalign when descriptions are different lengths
Right now the pillar cards (Fellowship, Wellness, Recovery, Freedom) use natural content flow, so if one description wraps to two lines and another stays on one line, the images below them start at different heights. This looks broken at certain screen widths. The fix is to give the text area a fixed height or use CSS Grid to force alignment.

**Claude Code Prompt:**
```
Fix the four pillar cards so images always align horizontally regardless of text length.

Option A (preferred — CSS Grid):
Set the pillar grid container to use CSS Grid with subgrid or a consistent structure:
.pillars-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
Each pillar card should itself be a grid:
.pillar-card {
  display: grid;
  grid-template-rows: auto minmax(48px, auto) 1fr;
  /* Row 1: heading, Row 2: description (fixed min-height), Row 3: image */
}
The minmax(48px, auto) on the description row ensures both cards in a row
reserve the same space for text, keeping images aligned.

Option B (simpler — fixed height on description):
.pillar-card .description {
  min-height: 48px; /* enough for 2 lines at body font size */
}

Option C (best — CSS Grid subgrid if browser support allows):
.pillars-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.pillar-card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3; /* heading + description + image */
}
This forces all cards in the same row to share the same row heights,
so even if one description is longer, the images stay perfectly aligned.

Test at all breakpoints — especially 768px-1024px where this issue is most visible.
On mobile (single column), the alignment doesn't matter since cards stack.
```

### 3C. Images are good but layout could be stronger
The 2x2 grid is fine, but the images are all similar in tone (outdoor group shots). Consider adding visual variety.

**Recommendation:** Add a subtle hover effect and consider slight overlap or stagger for visual interest.

**Claude Code Prompt:**
```
Add hover interaction to the four pillar image cards:
- On hover: slight scale(1.02) with overflow hidden on the container
- Add a subtle gradient overlay on each image (transparent to rgba(0,0,0,0.15) at bottom)
  so the text above has more contrast if the layout shifts
- Add a fade-in-up animation (translateY(20px) to 0, opacity 0 to 1) triggered
  when each card enters the viewport using IntersectionObserver
- Stagger the animation delay: 0ms, 100ms, 200ms, 300ms for the four cards
```

---

## 4. ACTIVITY ICONS BAR

### 4A. This is good — keep it but enhance
The icon row (Morning Routine, Workouts, Cold Plunge, Talks, Sauna, Lake Time) is a nice quick-scan element.

**Recommendation:** Give it more visual weight and make it a sticky element or section divider.

**Claude Code Prompt:**
```
Enhance the activity icons bar:
- Add a light background (var(--color-bg-alt)) with top and bottom border
  (1px solid var(--color-border))
- Increase icon size slightly and ensure consistent sizing
- Add a horizontal scroll with hidden scrollbar on mobile (flex-nowrap, overflow-x: auto)
- Consider adding a subtle scroll-triggered slide-in animation
- Increase vertical padding to 24px top and bottom
```

---

## 5. THE SCHEDULE SECTION

### 5A. The table is functional but not inspiring
A plain table for a retreat schedule feels like a corporate itinerary. This should feel exciting.

**Recommendation:** Redesign as visual timeline cards instead of a table.

**Claude Code Prompt:**
```
Replace the schedule table with a card-based timeline layout:

For each day, create a card with:
- Day label (MON 4TH, TUES 5TH, WED 6TH) as a bold header with gold left border (4px)
- Three time blocks (AM, MID, NIGHT) as rows within the card, each with:
  - Time label in bold small caps
  - Activity description
  - Subtle divider between blocks

Use a vertical timeline connector (thin gold line) between the day cards on desktop.
On mobile, stack the cards vertically with 16px gap.

Keep the same content:
MON: Travel → Intros/Fellowship/Dinner → Head to BSCH
TUES: Morning Routine/Breakfast → Fun/Talks/Runs/Workouts/Lake → Head to BSCH
WED: Morning Routine/Breakfast → Farewells → Travel Home
```

### 5B. "Head to BSCH for the night" needs context
What is BSCH? New visitors won't know. This is insider language that creates confusion.

**Claude Code Prompt:**
```
Replace all instances of "BSCH" in the schedule with "Black Sheep Club House"
on first mention, then "the Club House" for subsequent mentions.
Add a small parenthetical or tooltip: "(lakefront property with sauna, cold plunge,
and full recovery setup)" on the first mention.
```

---

## 6. MISSION / VALUES QUOTE SECTION

### 6A. The italic quote cascade is powerful but has a negative framing issue
"Leaving this retreat without truly knowing your purpose would be a complete failure" — this is meant to be motivating but reads as slightly aggressive and guilt-trippy. For a $499+ purchase, the emotional hook should pull people toward desire, not push them with shame.

**Recommendation:** Reframe from negative to aspirational.

**Claude Code Prompt:**
```
Rewrite the three-part quote cascade:

Line 1 (light/muted): "This is for men who are done going through the motions."
Line 2 (medium): "Who want to own their health, sharpen their mind,
and build something that matters."
Line 3 (bold/gold): "You'll leave this retreat knowing exactly who you are
and what you're here to do."

Keep the progressive emphasis styling (light → medium → bold gold).
The visual treatment is great — just change the words.
```

---

## 7. PRICING SECTION

### 7A. "FIND THE PACKAGE THAT FITS YOU" is generic
This heading doesn't build value before asking for money.

**Claude Code Prompt:**
```
Replace "FIND THE PACKAGE THAT FITS YOU." with:
"INVEST IN YOURSELF. CHOOSE YOUR EXPERIENCE."
Or alternatively: "TWO WAYS IN. ZERO REGRETS."
```

### 7B. Package names are strong but descriptions need work
"JUST SHOW UP" and "FULLY COMMIT" are great names. But the feature lists read flat.

**Claude Code Prompt:**
```
Rewrite the JUST SHOW UP package details:
- "Made for Tampa Locals (or find a place with friends)" →
  "Perfect if you're local to Tampa or crashing with a friend nearby"
- "Still, All the Fun" → "Full access to every workout, talk, and experience"
- "4 Meals" → "4 chef-prepared meals included"
- "Limited swag — NO accommodations" → "Limited edition retreat swag (no lodging included)"

Rewrite the FULLY COMMIT package details:
- "The Full Experience, how it's meant to be" →
  "The complete retreat — nothing to think about, nothing to plan"
- "Over $799 in swag products you'll actually want to use" →
  "$799+ in premium gear and wellness products"
- "4 Meals + Snacks" → "All meals, snacks, and drinks covered"
- "2 night accommodations at BSCH with saunas, cold plunges, health snacks,
   drinks & wellness tools" → "2 nights at the Club House — lakefront property
   with sauna, cold plunge, and full recovery setup"
```

### 7C. The price display needs more anchoring
$999 crossed out → $499 is good anchoring, but there's no context for WHY it's discounted or how long the discount lasts.

**Claude Code Prompt:**
```
Above the price, add a small badge or label:
"1ST EDITION PRICING — 50% OFF"
Style: display: inline-block, background: var(--color-primary), color: white,
padding: 4px 12px, font-size: 12px, font-weight: 700, letter-spacing: 0.08em,
border-radius: 3px, margin-bottom: 8px.

Below the $499 price, add a line:
"This price won't exist for the 2nd retreat."
Style: font-size: 14px, color: var(--color-text-muted), font-style: italic.
```

### 7D. "SECURE MY SPOT" button needs more punch
The CTA is gold text with no background — it looks like a link, not a button. For the most important action on the page, this should be the most visually prominent element.

**Claude Code Prompt:**
```
Redesign the "SECURE MY SPOT" CTA as a full-width (within the card) button:
- Background: var(--color-primary)
- Color: white
- Padding: 18px 32px
- Font-size: 16px
- Font-weight: 800
- Letter-spacing: 0.08em
- Border-radius: 6px
- Hover: darken background, subtle lift (translateY(-2px), box-shadow)
- Add a small arrow or → after the text

Below the button, add a trust line:
"✓ Secure checkout  ·  ✓ Cancel anytime before April 20"
Style: font-size: 12px, color: var(--color-text-muted), margin-top: 12px.
```

### 7E. "SOLD OUT" on Fully Commit creates dead space
If it's sold out, you're wasting half the pricing section showing something people can't buy.

**Recommendation:** Add a waitlist CTA instead.

**Claude Code Prompt:**
```
Replace the "SOLD OUT" badge on the Fully Commit package with:
- Keep the package details visible (creates FOMO for next time)
- Replace the sold out badge with: "SOLD OUT — Join the waitlist for next retreat"
- Add a small email input + "Notify Me" button inside the card
- Style the entire Fully Commit card with a subtle opacity (0.85) or a
  "SOLD OUT" diagonal ribbon in the corner to visually de-emphasize
  while still showing the value
```

---

## 8. ADD-ONS SECTION

### 8A. Add-ons are good revenue boosters — make them more enticing

**Claude Code Prompt:**
```
Enhance the add-on cards:
- "30-MIN 1-ON-1 WITH DAVID" → Add a brief line about David's background/credentials
  to justify the $97. Something like: "A private session with David to map out your
  next 90 days — fitness, business, or life. Come with a goal or just show up."
- "EARLY ACCESS & PRIORITY CHECK-IN" → Emphasize the exclusivity more:
  "Arrive early for a private walkthrough of the property with David.
  Welcome drink in hand, zero rush."

For both cards, add a subtle gold left-border (3px solid var(--color-primary))
to visually connect them to the pricing section.
```

---

## 9. SOCIAL PROOF — THE BIGGEST MISSING PIECE

### 9A. There is zero social proof on the entire page
No testimonials, no "as seen in," no follower counts, no quotes from community members. For a $499 event from someone the visitor might not know, this is a major conversion killer.

**Recommendation:** Add a testimonials/social proof section between the mission quotes and the pricing section.

**Claude Code Prompt:**
```
Add a new section between the mission quotes and the pricing section.

Section heading: "WHAT THE COMMUNITY IS SAYING" or "FROM THE HERD"

Include 3-4 testimonial cards in a horizontal scroll or grid:
Each card should have:
- Quote text (2-3 sentences)
- Name and one identifier (e.g., "Jake M. — Tampa, FL" or "Mike R. — BSC Member since 2024")
- Optional: small circular headshot

Card style:
- White background, subtle border (1px solid var(--color-border))
- Border-radius: 12px
- Padding: 32px
- Large gold opening quote mark as a decorative element

[David will need to provide actual testimonial quotes from community members.
Placeholder text for now — flag as TODO]

If no testimonials are available yet, alternatively add a section showing:
- David's Instagram follower count / community size
- A screenshot grid of DMs or comments (with permission)
- "Join [X]+ men who are already in the BSC community"
```

---

## 10. "STAY IN THE LOOP" EMAIL SECTION

### 10A. The copy is fine but could be warmer

**Claude Code Prompt:**
```
Update the email section copy:
Old heading: "STAY IN THE LOOP."
New heading: "DON'T MISS THE NEXT ONE."

Old subtext: "This is the 1st retreat. It won't be the last.
Drop your email to be first in line for what's next."
New subtext: "The 1st retreat will sell out. The 2nd will sell out faster.
Get on the list now — you'll hear about it before anyone else."

Change the button text from "NOTIFY ME" to "I'M IN"
```

### 10B. Add an incentive for email capture

**Claude Code Prompt:**
```
Below the email form, add a small value-add line:
"Plus: get David's free 7-Day Morning Routine guide when you sign up."
Style: font-size: 13px, color: var(--color-text-muted), margin-top: 8px.
(David would need to create this lead magnet — flag as a content TODO)
```

---

## 11. PHOTO GALLERY / "COME, SIGN THE WALL" SECTION

### 11A. The three photos are great but need better presentation

**Claude Code Prompt:**
```
Enhance the photo grid:
- Add a subtle hover zoom effect (scale 1.05, overflow hidden, transition 0.4s ease)
- Add a lightbox interaction — clicking a photo opens it full-screen with a close button
- Consider adding more photos (6-9 in a masonry grid) to better sell the vibe
- Add a section label above the photos: "THE VIBE" or "WHAT IT LOOKS LIKE"
  in small uppercase muted text
```

### 11B. "COME, SIGN THE WALL" is a strong closer
This is a great emotional CTA. Keep it. But add a final action button.

**Claude Code Prompt:**
```
Below "COME, SIGN THE WALL." and "BLACK SHEEP CLUB — ODESSA, FL",
add one final CTA button:
Text: "Secure My Spot — Starting at $499"
Same styling as the hero CTA button (gold background, white text, etc.)
This catches anyone who scrolled the entire page and is now ready to commit.
```

---

## 12. FOOTER

### 12A. Footer is too bare
Just copyright and social links. Missing opportunities for trust and navigation.

**Claude Code Prompt:**
```
Expand the footer into two rows:

Row 1 (main footer content, above the line):
- Left: BSC logo/wordmark
- Center: Quick links — "Schedule", "Pricing", "Contact David"
- Right: Social icons (Instagram, YouTube, Email) — keep current links

Row 2 (below the line):
- Left: "BLACK SHEEP CLUB © 2026"
- Right: "Built with intention in Odessa, FL"

Add padding: 60px top, 40px bottom. Background: #1A1A1A (dark).
Text color: #999. Links turn gold on hover.

Update the copyright year from 2025 to 2026.
```

---

## 13. MOBILE-SPECIFIC ISSUES

**Claude Code Prompt:**
```
Audit and fix the following mobile issues:

1. Ensure the countdown timer numbers don't overflow on small screens (< 375px).
   Reduce font-size on mobile if needed.

2. The pricing cards should stack vertically on mobile with full width.
   Remove the "OR" divider on mobile — use a simple "— or —" text divider instead.

3. The schedule table should convert to stacked cards on mobile
   (no horizontal scrolling tables).

4. All CTA buttons should be full-width on mobile (width: 100%).

5. Ensure tap targets are at least 44x44px for all interactive elements.

6. The email input + button should stack vertically on mobile
   (input on top, button below, both full-width).

7. Add appropriate viewport padding (16-20px) on mobile so nothing
   touches the screen edges.
```

---

## 14. ANIMATIONS & MICRO-INTERACTIONS

**Claude Code Prompt:**
```
Add tasteful scroll-triggered animations using IntersectionObserver (no heavy libraries):

1. Fade-in-up for section headings (translateY(30px) → 0, opacity 0 → 1,
   duration: 0.6s, ease-out)

2. Staggered fade-in for the four pillar cards (100ms delay between each)

3. Counter animation for the countdown timer numbers on initial load

4. Subtle parallax on the hero section (background moves slower than content)

5. The pricing cards should have a very subtle scale-up (0.98 → 1)
   when they enter the viewport

6. Smooth hover transitions on all interactive elements (transition: all 0.2s ease)

7. The "SECURE MY SPOT" button should have a subtle shimmer/shine animation
   to draw the eye — CSS only, no JS.

Keep all animations under 0.6s. Use prefers-reduced-motion media query
to disable for accessibility.
```

---

## 15. SEO & TECHNICAL

**Claude Code Prompt:**
```
Technical SEO improvements:

1. Add structured data (JSON-LD) for an Event schema:
   - name: "Black Sheep Club Retreat — 1st Edition"
   - startDate: "2026-05-04"
   - endDate: "2026-05-06"
   - location: Odessa, FL
   - offers: { price: 499, priceCurrency: USD }

2. Ensure all images have descriptive alt text
   (not empty, not "image1.jpg")

3. Add a canonical URL tag

4. Ensure heading hierarchy is correct (one H1, then H2s, etc.)

5. Add aria-labels to icon-only links (Instagram, YouTube, email)

6. Ensure the countdown timer is not the H1 —
   "BLACK SHEEP CLUB RETREAT" should be the H1
```

---

## PRIORITY ORDER FOR IMPLEMENTATION

If you're tackling these in order, here's what moves the conversion needle most:

1. **Fix pillar card image alignment bug** (Section 3B) — broken layout at certain widths
2. **Add social proof section** (Section 9) — biggest missing piece
3. **Hero CTA button** (Section 2C) — stop losing ready buyers
4. **Rewrite pricing descriptions** (Section 7B-7D) — strengthen the offer
5. **Sticky nav with CTA** (Section 1A) — persistent conversion path
6. **Reframe mission quotes** (Section 6A) — fix the negative tone
7. **Add hero subheadline** (Section 2A) — sell the transformation
8. **Mobile fixes** (Section 13) — capture mobile traffic
9. **Scroll animations** (Section 14) — polish and delight
10. **Footer expansion** (Section 12) — trust signals
11. **Email section incentive** (Section 10B) — better list building
12. **SEO/technical** (Section 15) — long-term traffic
13. **Typography/color system** (Sections 1C-1D) — design consistency

---

## CONTENT DAVID NEEDS TO PROVIDE

Before implementation, David should gather:

- **3-4 testimonials** from BSC community members (with permission to use names)
- **Actual number of remaining spots** for the scarcity messaging
- **A hero-quality group photo** for the OG image meta tag
- **His credentials/bio** in 1-2 sentences for the 1-on-1 add-on section
- **A lead magnet** (e.g., Morning Routine PDF) for the email capture incentive
- **Final cancellation policy** for the trust line under the CTA
- **Updated copyright year** (currently says 2025)

---

*Every prompt above is written to be copy-pasted directly into Claude Code. Start from the top of the priority list and work down. Each change is independent — you can ship them one at a time.*
