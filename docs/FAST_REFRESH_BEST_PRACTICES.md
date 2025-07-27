# Fast Refresh Best Practices

## Common Issues That Cause Full Reloads

### 1. Router Object in useEffect Dependencies

**❌ Problem:**
```tsx
useEffect(() => {
  // Some logic
}, [session, status, router, params.id]); // router causes full reload
```

**✅ Solution:**
```tsx
useEffect(() => {
  // Some logic
}, [session, status, params.id]); // Remove router from dependencies
```

### 2. Why This Happens

The `router` object from `next/navigation` changes reference on every render, causing Fast Refresh to perform a full reload instead of a hot update.

### 3. Alternative Solutions

If you need router functionality in useEffect, use specific router methods:

```tsx
// Instead of depending on router object
useEffect(() => {
  if (status === 'unauthenticated') {
    router.push('/auth/login');
  }
}, [status]); // Only depend on status, not router

// Or use router.replace() for redirects
useEffect(() => {
  if (shouldRedirect) {
    router.replace('/new-path');
  }
}, [shouldRedirect]); // Only depend on the condition
```

### 4. Other Common Fast Refresh Issues

- **Function declarations inside components** - Move to useCallback or outside component
- **Object literals in JSX** - Use useMemo or move outside component
- **Array literals in dependencies** - Use useMemo or stable references

### 5. Best Practices

1. **Minimize dependencies** - Only include values that actually need to trigger re-runs
2. **Use stable references** - For objects/functions, use useMemo/useCallback
3. **Avoid router in dependencies** - Router object changes reference frequently
4. **Test Fast Refresh** - Always test that your changes don't cause full reloads

### 6. Debugging Fast Refresh Issues

If you see "Fast Refresh had to perform a full reload" in console:

1. Check useEffect dependency arrays
2. Look for router objects in dependencies
3. Check for function/object literals in JSX
4. Verify component exports are stable

### 7. ESLint Rules (Recommended)

Add these rules to prevent issues:

```json
{
  "rules": {
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "error"
  }
}
```

## Recent Fixes Applied

- Fixed `app/student/courses/[id]/page.tsx` - Removed router from useEffect dependencies
- Fixed `app/student/courses/[id]/modules/[moduleId]/page.tsx` - Removed router from useEffect dependencies 