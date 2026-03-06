# RoomFlip Pivot: Subscription → Ad-based Free Model

## What to REMOVE:
1. **Google Auth / NextAuth** — Remove sign-in, sign-out, session checks, user menu, avatar
   - Delete `lib/auth.ts`
   - Remove NextAuth from `app/api/auth/[...nextauth]/route.ts`
   - Remove all `getServerSession`, `auth()`, `useSession` calls
   - Remove Google sign-in button from page.tsx
   - Remove user dropdown menu
   
2. **Stripe** — Remove all payment/subscription logic
   - Delete `app/api/stripe/checkout/route.ts`
   - Delete `app/api/stripe/webhook/route.ts`  
   - Delete `app/api/stripe/portal/route.ts`
   - Remove pricing section from landing page
   - Remove all plan checks

3. **Credit system** — Remove credit counting, limits
   - Remove credit checks from generate API
   - Remove credit display from UI
   - Remove `credits` field usage

4. **Watermark** — Remove completely
   - Remove watermark overlay logic from generate API
   - Remove watermark flag from response
   - Remove client-side canvas watermark from page.tsx

5. **History page** — Remove (was gated to paid plans)
   - Delete `app/history/page.tsx` or make it free

6. **Database user lookups in generate** — Remove user/plan checks

7. **Prisma** — Keep it (for generation logging if wanted) but don't require auth

## What to CHANGE:

### Generate API (`app/api/generate/route.ts`):
- Remove auth requirement — anyone can generate
- Remove credit check/decrement
- Remove plan-based resolution — use 2K for everyone
- Remove watermark logic
- Add simple IP-based rate limit (10/day per IP) to prevent abuse
- Keep saving generations to DB but with `userId: "anonymous"` or skip

### Landing Page (`app/page.tsx`):
- Remove Google sign-in button
- Remove user dropdown menu  
- Remove pricing section (3 tiers)
- Remove credit counter badge
- ALL 15 styles available to everyone
- Furniture upload available to everyone
- Add AdSense ad banners:
  - Top banner below hero (responsive)
  - Sidebar ad next to generation area (300x250)
  - Bottom banner above footer
- **INTERSTITIAL AD on download**: When user clicks "Download", show a full-screen ad overlay for 5 seconds with countdown, then reveal download link. Use AdSense interstitial or a custom overlay with an ad unit inside.

### Download Button behavior:
```
User clicks "Download" 
→ Full-screen overlay appears (dark bg, centered ad unit + countdown "Your download will be ready in 5...")
→ After 5 seconds, "Download Now" button appears
→ User clicks → actual download starts
→ Overlay closes
```

### AdSense Integration:
- Publisher ID: ca-pub-1599056171664080
- Meta tag already in <head>
- Ad unit component: `components/AdBanner.tsx`
- Place ads strategically (don't overwhelm but maximize revenue)

### Layout (`app/layout.tsx`):
- Remove NextAuth SessionProvider
- Keep AdSense script

### Middleware (`middleware.ts`):
- Remove auth-related rate limiting
- Keep generate rate limiting

## What to KEEP:
- All generation logic (Replicate API, prompt, model)
- All styles (make all 15 available)
- Furniture upload feature
- Before/after compare slider
- Mobile-responsive design
- SEO meta tags
- ads.txt
- The overall design and UX (just without auth elements)

## Dependencies to remove:
- next-auth (or @auth/*)
- @auth/prisma-adapter
- Remove Stripe SDK if imported

Do ALL changes. Make it work. Build must pass.
When finished, run: openclaw system event --text 'Done: RoomFlip pivoted to free ad-based model' --mode now
