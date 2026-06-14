# ✅ Liquid Glass V2 — Implementation Checklist

## Pre-Integration (5 min)

- [ ] Read `README_LIQUID_GLASS.md` for quick overview
- [ ] Review `LIQUID_GLASS_V2_SPEC.md` for technical details
- [ ] Check browser targets match (Safari 18+, Chrome 120+)

## Core Integration (10 min)

- [ ] CSS imported in `src/app/layout.tsx`
  ```tsx
  import "./globals-liquid-glass.css";
  ```

- [ ] SVG filter mounted in `src/app/layout.tsx`
  ```tsx
  import { LiquidGlassSVGFilter } from "@/components/ui/liquid-glass-svg-filter";
  // In body:
  <LiquidGlassSVGFilter />
  ```

- [ ] Manager auto-initialized (happens on first component mount)

- [ ] Run integrity check:
  ```bash
  node scripts/check-liquid-glass.js
  ```

## Testing (15 min)

### Demo Page
- [ ] Visit `/liquid-glass-demo`
- [ ] All 5 variants visible
- [ ] Move cursor → specular tracks
- [ ] Touch on mobile → specular updates
- [ ] Toggle dark mode → material adapts
- [ ] Entry animations stagger smoothly

### Comparison Page
- [ ] Visit `/liquid-glass-comparison`
- [ ] Side-by-side legacy vs V2
- [ ] Specular tracking difference visible
- [ ] Feature matrix correct

### Production Example
- [ ] Visit `/calculator-v2`
- [ ] Form steps use regular glass
- [ ] Sidebar uses thick glass
- [ ] Real-time calculations work
- [ ] Animations smooth

## Browser Testing (20 min)

### Desktop
- [ ] **Safari macOS** — gold standard
  - [ ] Refraction displacement visible
  - [ ] Specular smooth
  - [ ] Chromatic fringe visible
  - [ ] Dark mode distinct

- [ ] **Chrome/Edge**
  - [ ] All effects work
  - [ ] 60fps maintained
  - [ ] No console errors

- [ ] **Firefox**
  - [ ] Backdrop-filter works
  - [ ] SVG filter renders
  - [ ] Specular tracks

### Mobile
- [ ] **Safari iOS 18+**
  - [ ] Touch tracking works
  - [ ] Resets on touchend
  - [ ] Performance acceptable

- [ ] **Chrome Android**
  - [ ] Basic glass renders
  - [ ] Touch events work

## Performance Validation (10 min)

### Chrome DevTools
- [ ] Open Performance panel
- [ ] Record 5s of cursor movement over glass
- [ ] Check results:
  - [ ] FPS: 60 (or close)
  - [ ] Frame time: <16.67ms
  - [ ] No layout thrashing
  - [ ] GPU acceleration active

### Layers Panel
- [ ] Open Layers in DevTools
- [ ] Inspect glass element
- [ ] Should see single compositing layer
- [ ] `isolation: isolate` + `translateZ(0)` present

### Lighthouse
- [ ] Run audit on demo page
- [ ] Performance: >90
- [ ] No CLS shifts from glass
- [ ] Accessibility: 100

## Accessibility Testing (10 min)

- [ ] Keyboard navigation
  - [ ] Tab to glass elements
  - [ ] Focus rings visible
  - [ ] Enter/Space triggers actions

- [ ] Screen reader (NVDA/VoiceOver)
  - [ ] Content reads correctly
  - [ ] Decorative layers hidden
  - [ ] ARIA labels present

- [ ] Reduced motion
  - [ ] Enable in OS
  - [ ] Animations freeze
  - [ ] Glass still renders
  - [ ] Specular static at 50%/-10%

- [ ] High contrast mode
  - [ ] Content visible
  - [ ] Borders visible
  - [ ] Text readable

## Migration (as needed)

### Replace Old Component
- [ ] Find `<LiquidGlass>` usage
- [ ] Replace with `<LiquidGlassV2>`
- [ ] Update props:
  - `variant="heavy"` → `material="thick"`
  - `variant="light"` → `material="thin"`
  - Add `animate` for entry
  - Add `staggerDelay` for sequences

### Test Replaced Component
- [ ] Visual check (looks better)
- [ ] Interaction works (onPress)
- [ ] Accessibility maintained
- [ ] Performance acceptable

## Documentation (5 min)

- [ ] Update component README if exists
- [ ] Note material variant in Storybook/docs
- [ ] Add to design system documentation
- [ ] Update team about new system

## Production Deployment (before merge)

- [ ] All tests pass
  ```bash
  npm run test
  npm run test:e2e
  ```

- [ ] No TypeScript errors
  ```bash
  npx tsc --noEmit
  ```

- [ ] No lint errors
  ```bash
  npm run lint
  ```

- [ ] Bundle size acceptable
  - Check build output
  - +3.5KB gzipped is expected

- [ ] Demo pages work in production build
  ```bash
  npm run build
  npm run start
  ```

## Post-Deployment Monitoring

- [ ] Check Sentry for glass-related errors
- [ ] Monitor Core Web Vitals (Vercel Analytics)
- [ ] Watch for performance regressions
- [ ] Gather user feedback on new glass

## Rollback Plan (if needed)

1. Both systems coexist — no forced migration
2. Old `<LiquidGlass>` still works
3. Can revert component-by-component
4. No database migrations involved
5. CSS can be removed without breaking anything

## Success Criteria

✅ Demo page loads without errors  
✅ Specular tracks cursor at 60fps  
✅ All 5 variants work correctly  
✅ Dark mode material adapts  
✅ Safari iOS refraction visible  
✅ No accessibility regressions  
✅ Bundle size impact <5KB  
✅ No console errors/warnings  
✅ Lighthouse scores maintained

---

**Total Time**: ~75 minutes for complete validation  
**Risk Level**: Low (both systems coexist)  
**Rollback Time**: <5 minutes (just remove imports)

Ready to ship? ✅
