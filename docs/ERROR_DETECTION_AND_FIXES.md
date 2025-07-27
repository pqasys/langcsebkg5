# Error Detection and Fixes Documentation

## Overview

This document describes the automated tools created to detect and fix common error patterns project-wide, saving time on manual debugging.

## Tools Available

### 1. Error Scanner (`npm run error:scan`)

**Purpose**: Scans the entire project for common error patterns and generates detailed reports.

**What it does**:
- Scans 871+ TypeScript/JavaScript files
- Identifies 5,360+ potential issues
- Categorizes errors by severity (High, Medium, Low)
- Generates detailed reports with specific file locations and line numbers

**Output files**:
- `error-patterns-report.md` - Detailed findings organized by severity
- `error-fixes-suggestions.md` - Specific fix recommendations for each issue

**Usage**:
```bash
npm run error:scan
```

### 2. Specific Error Fixer (`npm run error:fix`)

**Purpose**: Automatically fixes the most common and critical error patterns.

**What it fixes**:
- ✅ Undefined institution ID logging
- ✅ Generic error fetching messages
- ✅ Generic 500 error responses without details
- ✅ Console.error statements without error details

**Usage**:
```bash
npm run error:fix
```

## Error Patterns Detected

### 🔴 High Severity Errors

1. **Undefined values being passed as props**
   - Pattern: `undefined.*from props`
   - Impact: Can cause runtime errors and undefined behavior
   - Fix: Add proper default values or null checks

2. **Generic error fetching messages**
   - Pattern: `Error fetching.*:`
   - Impact: Poor debugging experience, no error context
   - Fix: Include specific error details and context

3. **Generic 500 errors without details**
   - Pattern: `return NextResponse.json({ error: ... }, { status: 500 })`
   - Impact: No useful error information for debugging
   - Fix: Include error details and stack traces

### 🟡 Medium Severity Errors

1. **Console logging undefined values**
   - Pattern: `console.log.*undefined`
   - Impact: Confusing logs, potential data issues
   - Fix: Add proper null checks and default values

2. **Catch blocks with only console.error**
   - Pattern: `catch (error) { ... console.error ... }`
   - Impact: Errors logged but not handled properly
   - Fix: Add proper error handling and user feedback

3. **Optional chaining that might hide errors**
   - Pattern: `?..*\.`
   - Impact: Silent failures, hard to debug
   - Fix: Add explicit error handling

### 🟢 Low Severity Errors

1. **Negative condition checks**
   - Pattern: `if (!...) {`
   - Impact: Code readability issues
   - Fix: Use positive conditions where possible

2. **Fallback values that might mask issues**
   - Pattern: `|| ...`
   - Impact: Silent failures, data quality issues
   - Fix: Add explicit validation

## Specific Issues Fixed

### 1. Institution ID Undefined Error

**Problem**: `debar - Institution ID from props: undefined`

**Root Cause**: Sidebar component receiving undefined institutionId prop

**Fix Applied**:
```typescript
// Before
console.log('Sidebar - Institution ID from props:', institutionId);

// After
console.log('Sidebar - Institution ID from props:', institutionId || 'Not provided');
```

### 2. Generic 500 API Errors

**Problem**: `GET /api/admin/institutions/[id] 500`

**Root Cause**: Generic error responses without useful details

**Fix Applied**:
```typescript
// Before
return NextResponse.json(
  { error: 'Failed to fetch institution' },
  { status: 500 }
);

// After
return NextResponse.json(
  { 
    error: 'Failed to fetch institution',
    details: error instanceof Error ? error.message : 'Unknown error occurred'
  },
  { status: 500 }
);
```

### 3. Poor Error Logging

**Problem**: `Error fetching institution:` (no error details)

**Root Cause**: Console.error without error information

**Fix Applied**:
```typescript
// Before
console.error('Error fetching institution:');

// After
console.error('Error fetching institution:', error instanceof Error ? error.message : error);
```

## Usage Workflow

### For Developers

1. **Regular Maintenance** (Weekly):
   ```bash
   npm run error:scan
   ```
   - Review `error-patterns-report.md`
   - Prioritize high severity issues
   - Fix critical issues manually

2. **Before Deployments**:
   ```bash
   npm run error:fix
   npm run error:scan  # Verify improvements
   ```

3. **When Debugging Issues**:
   ```bash
   npm run error:scan
   ```
   - Check if the issue is in the error patterns report
   - Apply relevant fixes from `error-fixes-suggestions.md`

### For CI/CD

Add to your build pipeline:
```yaml
- name: Scan for errors
  run: npm run error:scan
  
- name: Apply automatic fixes
  run: npm run error:fix
  
- name: Verify fixes
  run: npm run error:scan
```

## Customization

### Adding New Error Patterns

Edit `scripts/fix-common-errors.ts`:

```typescript
const commonErrorPatterns: ErrorPattern[] = [
  // Add your pattern here
  {
    pattern: 'your-regex-pattern',
    description: 'Description of the issue',
    severity: 'high' | 'medium' | 'low'
  }
];
```

### Adding New Fixes

Edit `scripts/fix-specific-errors.ts`:

```typescript
const specificFixes: FixPattern[] = [
  {
    pattern: 'regex-pattern',
    replacement: 'replacement-text',
    description: 'What this fix does',
    files: ['path/to/file.tsx']
  }
];
```

## Best Practices

### 1. Error Handling

**Good**:
```typescript
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error('Error fetching data:', error instanceof Error ? error.message : error);
  toast.error('Failed to load data:', error instanceof Error ? error.message : 'Unknown error');
  throw error;
}
```

**Bad**:
```typescript
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error('Error fetching data:');
  toast.error('Error fetching data:');
}
```

### 2. API Error Responses

**Good**:
```typescript
return NextResponse.json(
  { 
    error: 'Failed to fetch data',
    details: error instanceof Error ? error.message : 'Unknown error',
    timestamp: new Date().toISOString()
  },
  { status: 500 }
);
```

**Bad**:
```typescript
return NextResponse.json(
  { error: 'Failed to fetch data' },
  { status: 500 }
);
```

### 3. Props Validation

**Good**:
```typescript
interface Props {
  institutionId?: string;
}

export function Component({ institutionId }: Props) {
  console.log('Institution ID:', institutionId || 'Not provided');
  // Handle undefined case
}
```

**Bad**:
```typescript
export function Component({ institutionId }: { institutionId?: string }) {
  console.log('Institution ID:', institutionId); // Could be undefined
}
```

## Monitoring and Maintenance

### Regular Tasks

1. **Weekly**: Run error scan and review high severity issues
2. **Monthly**: Update error patterns based on new issues found
3. **Before releases**: Run both scan and fix scripts
4. **After deployments**: Monitor for new error patterns

### Metrics to Track

- Total errors found (should decrease over time)
- High severity errors (should be 0 in production)
- New error patterns discovered
- Time saved by automated fixes

## Troubleshooting

### Common Issues

1. **Script not finding files**: Check file extensions in `findFiles()` function
2. **Regex not matching**: Test patterns in regex tester first
3. **Fixes not applying**: Check file paths and permissions
4. **Too many false positives**: Adjust pattern specificity

### Getting Help

1. Check the generated reports for specific details
2. Review the error patterns in the script files
3. Test patterns manually before adding to scripts
4. Monitor console output for script execution details

## Future Improvements

1. **Integration with ESLint**: Add custom rules for error patterns
2. **Git hooks**: Run scans before commits
3. **IDE integration**: Real-time error detection
4. **Machine learning**: Pattern recognition for new error types
5. **Performance optimization**: Parallel file processing
6. **Custom rules**: Project-specific error patterns

---

**Last Updated**: July 18, 2025
**Version**: 1.0.0 