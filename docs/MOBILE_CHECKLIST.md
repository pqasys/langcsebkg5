# Mobile Optimization Checklist

## Pre-Development Checklist

### ✅ Viewport & Meta Tags
- [ ] Viewport meta tag is present: `width=device-width, initial-scale=1`
- [ ] Mobile-specific meta tags are configured
- [ ] Theme color is set for mobile browsers
- [ ] Apple-specific meta tags are present

### ✅ Responsive Design Foundation
- [ ] Mobile-first CSS approach
- [ ] Tailwind CSS responsive classes used
- [ ] Breakpoints defined: sm (640px), md (768px), lg (1024px), xl (1280px)
- [ ] Flexible grid system implemented

## Component Development Checklist

### ✅ Layout & Structure
- [ ] Single column layout on mobile (grid-cols-1)
- [ ] Multi-column layout on larger screens (md:grid-cols-2, lg:grid-cols-3)
- [ ] Responsive padding: `p-4 md:p-6 lg:p-8`
- [ ] Responsive margins: `m-4 md:m-6 lg:m-8`
- [ ] Container max-width: `max-w-7xl mx-auto`

### ✅ Typography
- [ ] Responsive text sizes: `text-sm md:text-base lg:text-lg`
- [ ] Responsive headings: `text-2xl md:text-3xl lg:text-4xl`
- [ ] Line height appropriate for mobile: `leading-tight` or `leading-normal`
- [ ] Font weights optimized for mobile screens

### ✅ Navigation
- [ ] Mobile hamburger menu implemented
- [ ] Touch targets minimum 44px (iOS standard)
- [ ] Menu closes on navigation
- [ ] Keyboard navigation supported
- [ ] Focus management implemented

### ✅ Forms & Inputs
- [ ] Input fields sized for mobile (full width on mobile)
- [ ] Touch-friendly input heights
- [ ] Mobile-optimized select dropdowns
- [ ] Form validation messages mobile-friendly
- [ ] Submit buttons full width on mobile

### ✅ Images & Media
- [ ] Next.js Image component used
- [ ] Responsive images with proper sizing
- [ ] Lazy loading implemented
- [ ] Alt text provided for accessibility
- [ ] Images optimized for mobile bandwidth

### ✅ Buttons & Interactive Elements
- [ ] Minimum 44px touch targets
- [ ] Adequate spacing between interactive elements
- [ ] Clear visual feedback on touch
- [ ] Disabled states clearly indicated
- [ ] Loading states implemented

## Performance Checklist

### ✅ Loading Performance
- [ ] Critical CSS inlined
- [ ] Non-critical CSS loaded asynchronously
- [ ] JavaScript code splitting implemented
- [ ] Images optimized and compressed
- [ ] Fonts loaded with display: swap

### ✅ Mobile-Specific Optimizations
- [ ] Service worker registered
- [ ] Offline functionality implemented
- [ ] Background sync configured
- [ ] Cache strategies defined
- [ ] Push notifications supported

### ✅ Touch Interactions
- [ ] Touch gesture support implemented
- [ ] Swipe gestures handled
- [ ] Pinch/zoom support where needed
- [ ] Touch feedback provided
- [ ] Touch event handling optimized

## Testing Checklist

### ✅ Responsive Testing
- [ ] Tested on mobile viewport (375x667)
- [ ] Tested on tablet viewport (768x1024)
- [ ] Tested on desktop viewport (1920x1080)
- [ ] Landscape orientation tested
- [ ] Portrait orientation tested

### ✅ Touch Testing
- [ ] Touch targets tested on mobile device
- [ ] Swipe gestures tested
- [ ] Pinch/zoom tested where applicable
- [ ] Touch feedback verified
- [ ] Touch event handling confirmed

### ✅ Performance Testing
- [ ] Page load time under 3 seconds on 3G
- [ ] First Contentful Paint under 1.5 seconds
- [ ] Largest Contentful Paint under 2.5 seconds
- [ ] Cumulative Layout Shift under 0.1
- [ ] Time to Interactive under 3.5 seconds

### ✅ Accessibility Testing
- [ ] Screen reader compatibility tested
- [ ] Keyboard navigation verified
- [ ] Color contrast ratios checked
- [ ] Focus indicators visible
- [ ] ARIA labels implemented

## PWA Checklist

### ✅ Manifest
- [ ] Web app manifest configured
- [ ] App icons in multiple sizes
- [ ] Theme colors defined
- [ ] Display mode set to standalone
- [ ] Orientation preferences set

### ✅ Service Worker
- [ ] Service worker registered
- [ ] Offline caching implemented
- [ ] Background sync configured
- [ ] Push notifications supported
- [ ] Update handling implemented

### ✅ Installation
- [ ] App installable on mobile devices
- [ ] Splash screen configured
- [ ] App shortcuts defined
- [ ] Offline functionality working
- [ ] App updates handled gracefully

## Browser Compatibility

### ✅ Mobile Browsers
- [ ] Safari (iOS) tested
- [ ] Chrome (Android) tested
- [ ] Firefox (Android) tested
- [ ] Samsung Internet tested
- [ ] Edge (Mobile) tested

### ✅ Features Support
- [ ] Service Worker support checked
- [ ] Push API support verified
- [ ] IndexedDB support confirmed
- [ ] Touch events supported
- [ ] CSS Grid/Flexbox supported

## Final Checklist

### ✅ User Experience
- [ ] App feels native on mobile
- [ ] Touch interactions are smooth
- [ ] Loading states are clear
- [ ] Error states are user-friendly
- [ ] Offline experience is seamless

### ✅ Performance
- [ ] App loads quickly on mobile networks
- [ ] Interactions are responsive
- [ ] Battery usage is optimized
- [ ] Data usage is minimized
- [ ] Memory usage is reasonable

### ✅ Quality Assurance
- [ ] Mobile-specific tests written
- [ ] E2E tests cover mobile scenarios
- [ ] Performance tests pass
- [ ] Accessibility tests pass
- [ ] Cross-browser tests pass

## Quick Commands

### Testing Commands
```bash
# Run mobile tests
npm run test:mobile

# Run E2E tests with mobile viewport
npm run test:e2e:mobile

# Run performance tests
npm run test:performance

# Run accessibility tests
npm run test:a11y
```

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Analyze bundle size
npm run analyze

# Run lighthouse audit
npm run lighthouse
```

## Notes

- **Always test on real devices** when possible
- **Use Chrome DevTools** mobile simulation for quick testing
- **Monitor Core Web Vitals** regularly
- **Test on slow networks** to ensure good performance
- **Consider accessibility** from the start of development

---

*Use this checklist for every component and page to ensure consistent mobile optimization.* 