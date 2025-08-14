# Finding Test Courses for Enrollment Workflow Testing

## 🔍 **How to Find Test Courses**

### **Method 1: Check Database Directly**

Run this SQL query to find courses with `LIVE_ONLINE` marketing type:

```sql
SELECT 
    id,
    title,
    marketingType,
    status,
    maxStudents,
    base_price
FROM course 
WHERE marketingType = 'LIVE_ONLINE' 
    AND status = 'PUBLISHED'
    AND maxStudents > 0
LIMIT 5;
```

### **Method 2: Use the API**

Visit this URL to get all published courses:
```
http://localhost:3000/api/courses/public
```

Look for courses with `marketingType: "LIVE_ONLINE"`

### **Method 3: Check Course List Page**

1. Go to: `http://localhost:3000/courses`
2. Look for courses that show "Live Online" or similar indicators
3. Note the course ID from the URL

## 📋 **Test Course Requirements**

For proper testing, your test course should have:

- ✅ `marketingType: 'LIVE_ONLINE'`
- ✅ `status: 'PUBLISHED'`
- ✅ `maxStudents > 0`
- ✅ `base_price > 0`
- ✅ Associated institution

## 🧪 **Quick Test Setup**

### **Step 1: Find a Test Course**
```bash
# If you have access to the database, run:
SELECT id, title, marketingType FROM course WHERE marketingType = 'LIVE_ONLINE' LIMIT 1;
```

### **Step 2: Test the Course**
1. Replace `[course-id]` with the actual course ID
2. Visit: `http://localhost:3000/courses/[course-id]`
3. You should see an "Enroll Now" button

### **Step 3: Test Enrollment Flow**
1. Click "Enroll Now"
2. Should redirect to: `/subscription-signup?courseId=[course-id]&fromEnrollment=true`
3. Complete subscription signup
4. Should see enrollment confirmation modal

## 🔧 **If No Test Courses Exist**

If you don't have any courses with `LIVE_ONLINE` marketing type:

### **Option 1: Create a Test Course**
```sql
INSERT INTO course (
    id,
    title,
    description,
    marketingType,
    status,
    maxStudents,
    base_price,
    startDate,
    endDate,
    institutionId,
    requiresSubscription
) VALUES (
    'test-course-001',
    'Test Live Online Course',
    'This is a test course for enrollment workflow testing',
    'LIVE_ONLINE',
    'PUBLISHED',
    10,
    99.99,
    NOW(),
    DATE_ADD(NOW(), INTERVAL 30 DAY),
    '[your-institution-id]',
    true
);
```

### **Option 2: Update Existing Course**
```sql
UPDATE course 
SET marketingType = 'LIVE_ONLINE', 
    requiresSubscription = true
WHERE id = '[existing-course-id]';
```

## 📝 **Test Data Checklist**

Before testing, ensure you have:

- [ ] At least one course with `marketingType: 'LIVE_ONLINE'`
- [ ] Course is published and has available seats
- [ ] Course has a valid institution
- [ ] Course has a base price set
- [ ] You're logged in as a student user
- [ ] Server is running on `localhost:3000`

## 🚨 **Common Issues**

### **No courses found:**
- Check if courses exist in the database
- Verify the marketing type is exactly `'LIVE_ONLINE'`
- Ensure courses are published

### **Course not accessible:**
- Check if course status is `'PUBLISHED'`
- Verify course has valid institution
- Check if course has available seats

### **Enrollment button not showing:**
- Verify you're logged in as a student
- Check if course requires subscription
- Ensure course is not already enrolled
