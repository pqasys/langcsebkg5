# Mobile Testing Guide

## Quick Mobile Testing Checklist

### 1. Basic Mobile Functionality Test

#### ✅ Viewport Testing
- [ ] Open Chrome DevTools (F12)
- [ ] Click the device toggle button (mobile/tablet icon)
- [ ] Test different device sizes:
  - iPhone SE (375x667)
  - iPhone 12/13 (390x844)
  - iPad (768x1024)
  - Desktop (1920x1080)

#### ✅ Navigation Testing
- [ ] Verify hamburger menu appears on mobile
- [ ] Test menu opening/closing
- [ ] Verify all navigation links work
- [ ] Test menu closing after navigation

#### ✅ Touch Interactions
- [ ] Test button taps
- [ ] Test form inputs
- [ ] Test scrolling
- [ ] Verify touch targets are at least 44px

### 2. PWA Testing

#### ✅ Installation Test
- [ ] Open the site on a mobile device
- [ ] Look for "Add to Home Screen" prompt
- [ ] Test installing the app
- [ ] Verify app launches from home screen

#### ✅ Offline Functionality
- [ ] Turn off WiFi/mobile data
- [ ] Refresh the page
- [ ] Verify offline content loads
- [ ] Test offline navigation

#### ✅ Service Worker
- [ ] Open Chrome DevTools
- [ ] Go to Application tab
- [ ] Check Service Workers section
- [ ] Verify service worker is registered

### 3. Performance Testing

#### ✅ Loading Speed
- [ ] Use Chrome DevTools Network tab
- [ ] Set throttling to "Slow 3G"
- [ ] Reload the page
- [ ] Verify load time under 5 seconds

#### ✅ Core Web Vitals
- [ ] Use Lighthouse in Chrome DevTools
- [ ] Run mobile audit
- [ ] Check scores:
  - First Contentful Paint: < 1.5s
  - Largest Contentful Paint: < 2.5s
  - Cumulative Layout Shift: < 0.1

### 4. Responsive Design Testing

#### ✅ Layout Testing
- [ ] Test all breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- [ ] Verify content doesn't overflow
- [ ] Check text readability
- [ ] Test image scaling

#### ✅ Form Testing
- [ ] Test form inputs on mobile
- [ ] Verify keyboard types correctly
- [ ] Test form validation
- [ ] Check submit button accessibility

### 5. Accessibility Testing

#### ✅ Screen Reader
- [ ] Use Chrome DevTools Accessibility tab
- [ ] Check for ARIA labels
- [ ] Test keyboard navigation
- [ ] Verify focus indicators

#### ✅ Color Contrast
- [ ] Use Lighthouse accessibility audit
- [ ] Check color contrast ratios
- [ ] Verify text is readable

## Testing URLs

### Main Pages to Test
- Homepage: `http://localhost:3000/`
- Mobile Testing: `http://localhost:3000/mobile-testing`
- Courses: `http://localhost:3000/courses`
- Institutions: `http://localhost:3000/institutions`
- Contact: `http://localhost:3000/contact`

### Authentication Pages
- Sign In: `http://localhost:3000/auth/signin`
- Sign Up: `http://localhost:3000/auth/signup`
- Forgot Password: `http://localhost:3000/forgot-password`

## Mobile Testing Tools

### Browser DevTools
```bash
# Chrome DevTools
F12 → Device Toggle → Select Device

# Firefox DevTools
F12 → Responsive Design Mode
```

### Online Testing Tools
- [BrowserStack](https://www.browserstack.com/) - Real device testing
- [LambdaTest](https://www.lambdatest.com/) - Cross-browser testing
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### Performance Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

## Common Issues & Solutions

### Issue: Touch targets too small
**Solution**: Ensure all interactive elements are at least 44px × 44px

### Issue: Text too small to read
**Solution**: Use responsive typography with minimum 16px base size

### Issue: Images not loading
**Solution**: Check image optimization and lazy loading implementation

### Issue: Forms not working on mobile
**Solution**: Verify input types and touch-friendly styling

### Issue: Performance issues
**Solution**: Optimize images, minimize JavaScript, use service worker caching

## Mobile Optimization Score

After completing all tests, your mobile optimization score should be:

- **9.5/10** - Excellent mobile optimization
- **8-9/10** - Good mobile optimization with minor issues
- **6-7/10** - Acceptable mobile optimization with room for improvement
- **< 6/10** - Needs significant mobile optimization work

## Quick Commands

```bash
# Run mobile tests
npm run test:mobile

# Run E2E tests with mobile viewport
npm run test:e2e:mobile

# Run performance tests
npm run test:performance

# Build for production
npm run build

# Start development server
npm run dev
```

## Notes

- **Always test on real devices** when possible
- **Test on slow networks** to ensure good performance
- **Test with different screen sizes** and orientations
- **Monitor Core Web Vitals** regularly
- **Keep accessibility in mind** throughout testing

---

*Use this guide to ensure your mobile optimization is working correctly.* 