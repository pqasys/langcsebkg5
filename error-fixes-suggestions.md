# Suggested Fixes

## Generic error throwing without context
**Found in 519 locations:**

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\categories\page.tsx:28
**Current:** `if (!response.ok) throw new Error('Failed to fetch categories');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\categories\page.tsx:54
**Current:** `if (!response.ok) throw new Error('Failed to delete category');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:284
**Current:** `throw new Error(`HTTP error! status: ${response.status}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:324
**Current:** `throw new Error(`HTTP error! status: ${response.status}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:353
**Current:** `throw new Error(`HTTP error! status: ${response.status}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:406
**Current:** `throw new Error(`HTTP error! status: ${response.status}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:492
**Current:** `throw new Error('Failed to delete course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:561
**Current:** `throw new Error(`HTTP error! status: ${response.status}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:604
**Current:** `throw new Error(`HTTP error! status: ${response.status}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:697
**Current:** `throw new Error('Failed to fetch initial data');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:804
**Current:** `throw new Error(`API Error: ${response.status} - ${errorText}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:825
**Current:** `throw new Error('Invalid courses data format received from server');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:830
**Current:** `throw new Error('Non-JSON response received from server');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:918
**Current:** `throw new Error('Invalid form data');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:936
**Current:** `throw new Error('Failed to save course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:984
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:991
**Current:** `throw new Error(`Course "${course.title}" is missing category information. This is a data integrity issue that needs to be resolved.`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:995
**Current:** `throw new Error(`Course "${course.title}" is missing institution information. This is a data integrity issue that needs to be resolved.`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1049
**Current:** `throw new Error('Failed to fetch course details');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1066
**Current:** `throw new Error('Failed to update weekly prices');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\enrollments\page.tsx:177
**Current:** `throw new Error('Failed to fetch enrollments');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\enrollments\page.tsx:218
**Current:** `throw new Error('Failed to update enrollment');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\page.tsx:85
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\page.tsx:93
**Current:** `throw new Error('Failed to fetch modules');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\page.tsx:124
**Current:** `throw new Error('Failed to create module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\page.tsx:165
**Current:** `throw new Error('Failed to delete module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\page.tsx:90
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\page.tsx:98
**Current:** `throw new Error('Failed to fetch module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\page.tsx:72
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\page.tsx:80
**Current:** `throw new Error('Failed to fetch module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\page.tsx:88
**Current:** `throw new Error('Failed to fetch quizzes');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\page.tsx:136
**Current:** `throw new Error('Failed to delete quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:72
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:80
**Current:** `throw new Error('Failed to fetch module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:88
**Current:** `throw new Error('Failed to fetch quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:119
**Current:** `throw new Error('Failed to update quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:68
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:76
**Current:** `throw new Error('Failed to fetch module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:84
**Current:** `throw new Error('Failed to fetch quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:116
**Current:** `throw new Error('Failed to delete quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:237
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:245
**Current:** `throw new Error('Failed to fetch module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:253
**Current:** `throw new Error('Failed to fetch quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:334
**Current:** `throw new Error('Failed to add question');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:241
**Current:** `if (!courseResponse.ok) throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:247
**Current:** `if (!moduleResponse.ok) throw new Error('Failed to fetch module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:253
**Current:** `if (!quizResponse.ok) throw new Error('Failed to fetch quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:259
**Current:** `if (!questionResponse.ok) throw new Error('Failed to fetch question');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:347
**Current:** `throw new Error('Failed to update question');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\page.tsx:94
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\page.tsx:103
**Current:** `throw new Error('Failed to fetch modules');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\dashboard\page.tsx:72
**Current:** `throw new Error(`HTTP error! status: ${response.status}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institution-monetization\page.tsx:96
**Current:** `if (!response.ok) throw new Error('Failed to fetch institutions');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institution-monetization\page.tsx:145
**Current:** `throw new Error('Failed to update institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\create\page.tsx:91
**Current:** `throw new Error(data.error || data.details || 'Failed to create institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\page.tsx:67
**Current:** `throw new Error(errorData.error || errorData.details || 'Failed to fetch institutions');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\page.tsx:74
**Current:** `throw new Error('Invalid response format: expected an array');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\page.tsx:112
**Current:** `throw new Error('Failed to update approval status');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\page.tsx:135
**Current:** `throw new Error('Failed to update status');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\courses\page.tsx:107
**Current:** `if (!response.ok) throw new Error('Failed to fetch institution courses');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\courses\page.tsx:126
**Current:** `if (!response.ok) throw new Error('Failed to fetch categories');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\courses\page.tsx:164
**Current:** `throw new Error(error.message || 'Failed to save course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\courses\page.tsx:220
**Current:** `if (!response.ok) throw new Error('Failed to delete course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\edit\page.tsx:27
**Current:** `throw new Error('Failed to fetch institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:67
**Current:** `throw new Error('Failed to update institution status');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:90
**Current:** `throw new Error('Failed to fetch institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:95
**Current:** `throw new Error('Invalid institution data received');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\permissions\page.tsx:82
**Current:** `throw new Error('Failed to fetch institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\permissions\page.tsx:90
**Current:** `throw new Error('Failed to fetch permissions');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\permissions\page.tsx:122
**Current:** `throw new Error('Failed to update permissions');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\users\page.tsx:77
**Current:** `throw new Error(errorData.message || 'Failed to fetch users');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\users\page.tsx:111
**Current:** `throw new Error(errorData.message || `Failed to ${editingUser ? 'update' : 'create'} user`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\users\page.tsx:167
**Current:** `throw new Error(errorData.message || 'Failed to delete user');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:121
**Current:** `if (!paymentsRes.ok) throw new Error('Failed to fetch payments');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:122
**Current:** `if (!institutionsRes.ok) throw new Error('Failed to fetch institutions');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:156
**Current:** `throw new Error('Failed to approve payment');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:196
**Current:** `throw new Error('Failed to disapprove payment');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\commission-tiers\page.tsx:180
**Current:** `throw new Error('Failed to save commission tier');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\commission-tiers\page.tsx:204
**Current:** `throw new Error('Failed to save subscription plan');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\commission-tiers\page.tsx:224
**Current:** `throw new Error('Failed to delete commission tier');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\commission-tiers\page.tsx:244
**Current:** `throw new Error('Failed to delete subscription plan');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\common-scripts\page.tsx:40
**Current:** `throw new Error(data.error || 'Failed to run seed script')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\common-scripts\page.tsx:73
**Current:** `throw new Error(data.error || 'Failed to run booking payment consistency script')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\common-scripts\page.tsx:102
**Current:** `throw new Error(data.error || 'Failed to run maintenance scripts')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:261
**Current:** `if (!response.ok) throw new Error('Failed to fetch institutions');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:286
**Current:** `if (!response.ok) throw new Error('Failed to fetch email settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:327
**Current:** `if (!response.ok) throw new Error('Failed to update institution settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:353
**Current:** `throw new Error(errorData.message || 'Failed to seed categories');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:388
**Current:** `throw new Error(errorData.message || 'Failed to seed tags');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:422
**Current:** `throw new Error('Failed to perform cleanup');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:476
**Current:** `throw new Error(error.message || 'Failed to save email settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:489
**Current:** `throw new Error(error.message || 'Failed to save email settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:520
**Current:** `if (!response.ok) throw new Error('Failed to send test email');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:538
**Current:** `throw new Error(errorData.message || 'Failed to fix missing students');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:558
**Current:** `if (!response.ok) throw new Error('Failed to fetch notification templates');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:580
**Current:** `if (!response.ok) throw new Error('Failed to fetch notification logs');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:594
**Current:** `if (!response.ok) throw new Error('Failed to fetch notification stats');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:610
**Current:** `throw new Error(errorData.message || 'Failed to seed notification templates');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:633
**Current:** `throw new Error(errorData.message || 'Failed to create template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:667
**Current:** `throw new Error(errorData.message || 'Failed to update template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:701
**Current:** `throw new Error(errorData.message || 'Failed to delete template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\payment-approval\page.tsx:106
**Current:** `if (!response.ok) throw new Error('Failed to fetch settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:101
**Current:** `throw new Error('Failed to load subscription plans');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:136
**Current:** `throw new Error('Failed to create subscription plan');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:170
**Current:** `throw new Error('Failed to update subscription plan');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:193
**Current:** `throw new Error('Failed to delete subscription plan');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:215
**Current:** `throw new Error('Failed to update subscription plan status');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\subscriptions\page.tsx:99
**Current:** `if (!response.ok) throw new Error('Failed to fetch subscriptions');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\subscriptions\page.tsx:114
**Current:** `if (!response.ok) throw new Error('Failed to fetch stats');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\subscriptions\page.tsx:130
**Current:** `if (!response.ok) throw new Error('Failed to update status');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\subscriptions\page.tsx:148
**Current:** `if (!response.ok) throw new Error('Failed to update plan');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\subscriptions\[id]\edit\page.tsx:75
**Current:** `if (!response.ok) throw new Error('Failed to fetch subscription');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\subscriptions\[id]\edit\page.tsx:106
**Current:** `if (!response.ok) throw new Error('Failed to update subscription');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:163
**Current:** `throw new Error(`Failed to fetch tags: ${response.status} - ${errorText}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:171
**Current:** `throw new Error('Invalid response format: expected an array of tags');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:202
**Current:** `if (!response.ok) throw new Error('Failed to fetch analytics');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:267
**Current:** `throw new Error(errorData.message || `Failed to ${isUpdating ? 'update' : 'create'} tag`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:337
**Current:** `throw new Error(error.message || 'Failed to delete tag');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\page.tsx:81
**Current:** `throw new Error('Failed to fetch users');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\page.tsx:152
**Current:** `throw new Error(errorData.message || `Failed to ${selectedUser ? 'update' : 'create'} user`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\page.tsx:189
**Current:** `throw new Error('Failed to delete user');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\[userId]\page.tsx:58
**Current:** `throw new Error(errorData.message || 'Failed to fetch user');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\[userId]\page.tsx:91
**Current:** `throw new Error(errorData.message || 'Failed to update user status');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\categories\page.tsx:28
**Current:** `if (!response.ok) throw new Error('Failed to fetch categories');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\categories\page.tsx:54
**Current:** `if (!response.ok) throw new Error('Failed to delete category');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:284
**Current:** `throw new Error(`HTTP error! status: ${response.status}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:324
**Current:** `throw new Error(`HTTP error! status: ${response.status}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:353
**Current:** `throw new Error(`HTTP error! status: ${response.status}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:406
**Current:** `throw new Error(`HTTP error! status: ${response.status}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:492
**Current:** `throw new Error('Failed to delete course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:561
**Current:** `throw new Error(`HTTP error! status: ${response.status}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:604
**Current:** `throw new Error(`HTTP error! status: ${response.status}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:697
**Current:** `throw new Error('Failed to fetch initial data');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:804
**Current:** `throw new Error(`API Error: ${response.status} - ${errorText}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:825
**Current:** `throw new Error('Invalid courses data format received from server');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:830
**Current:** `throw new Error('Non-JSON response received from server');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:918
**Current:** `throw new Error('Invalid form data');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:936
**Current:** `throw new Error('Failed to save course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:984
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:991
**Current:** `throw new Error(`Course "${course.title}" is missing category information. This is a data integrity issue that needs to be resolved.`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:995
**Current:** `throw new Error(`Course "${course.title}" is missing institution information. This is a data integrity issue that needs to be resolved.`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1049
**Current:** `throw new Error('Failed to fetch course details');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1066
**Current:** `throw new Error('Failed to update weekly prices');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\enrollments\page.tsx:177
**Current:** `throw new Error('Failed to fetch enrollments');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\enrollments\page.tsx:218
**Current:** `throw new Error('Failed to update enrollment');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\page.tsx:85
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\page.tsx:93
**Current:** `throw new Error('Failed to fetch modules');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\page.tsx:124
**Current:** `throw new Error('Failed to create module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\page.tsx:165
**Current:** `throw new Error('Failed to delete module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\page.tsx:90
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\page.tsx:98
**Current:** `throw new Error('Failed to fetch module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\page.tsx:72
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\page.tsx:80
**Current:** `throw new Error('Failed to fetch module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\page.tsx:88
**Current:** `throw new Error('Failed to fetch quizzes');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\page.tsx:136
**Current:** `throw new Error('Failed to delete quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:72
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:80
**Current:** `throw new Error('Failed to fetch module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:88
**Current:** `throw new Error('Failed to fetch quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:119
**Current:** `throw new Error('Failed to update quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:68
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:76
**Current:** `throw new Error('Failed to fetch module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:84
**Current:** `throw new Error('Failed to fetch quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:116
**Current:** `throw new Error('Failed to delete quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:237
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:245
**Current:** `throw new Error('Failed to fetch module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:253
**Current:** `throw new Error('Failed to fetch quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:334
**Current:** `throw new Error('Failed to add question');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:241
**Current:** `if (!courseResponse.ok) throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:247
**Current:** `if (!moduleResponse.ok) throw new Error('Failed to fetch module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:253
**Current:** `if (!quizResponse.ok) throw new Error('Failed to fetch quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:259
**Current:** `if (!questionResponse.ok) throw new Error('Failed to fetch question');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:347
**Current:** `throw new Error('Failed to update question');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\page.tsx:94
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\page.tsx:103
**Current:** `throw new Error('Failed to fetch modules');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institution-monetization\page.tsx:96
**Current:** `if (!response.ok) throw new Error('Failed to fetch institutions');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institution-monetization\page.tsx:145
**Current:** `throw new Error('Failed to update institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\create\page.tsx:91
**Current:** `throw new Error(data.error || data.details || 'Failed to create institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\page.tsx:67
**Current:** `throw new Error(errorData.error || errorData.details || 'Failed to fetch institutions');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\page.tsx:74
**Current:** `throw new Error('Invalid response format: expected an array');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\page.tsx:112
**Current:** `throw new Error('Failed to update approval status');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\page.tsx:135
**Current:** `throw new Error('Failed to update status');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\courses\page.tsx:107
**Current:** `if (!response.ok) throw new Error('Failed to fetch institution courses');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\courses\page.tsx:126
**Current:** `if (!response.ok) throw new Error('Failed to fetch categories');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\courses\page.tsx:164
**Current:** `throw new Error(error.message || 'Failed to save course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\courses\page.tsx:220
**Current:** `if (!response.ok) throw new Error('Failed to delete course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\edit\page.tsx:27
**Current:** `throw new Error('Failed to fetch institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:67
**Current:** `throw new Error('Failed to update institution status');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:90
**Current:** `throw new Error('Failed to fetch institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:95
**Current:** `throw new Error('Invalid institution data received');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\permissions\page.tsx:82
**Current:** `throw new Error('Failed to fetch institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\permissions\page.tsx:90
**Current:** `throw new Error('Failed to fetch permissions');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\permissions\page.tsx:122
**Current:** `throw new Error('Failed to update permissions');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\users\page.tsx:77
**Current:** `throw new Error(errorData.message || 'Failed to fetch users');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\users\page.tsx:111
**Current:** `throw new Error(errorData.message || `Failed to ${editingUser ? 'update' : 'create'} user`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\users\page.tsx:167
**Current:** `throw new Error(errorData.message || 'Failed to delete user');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:121
**Current:** `if (!paymentsRes.ok) throw new Error('Failed to fetch payments');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:122
**Current:** `if (!institutionsRes.ok) throw new Error('Failed to fetch institutions');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:156
**Current:** `throw new Error('Failed to approve payment');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:196
**Current:** `throw new Error('Failed to disapprove payment');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\commission-tiers\page.tsx:180
**Current:** `throw new Error('Failed to save commission tier');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\commission-tiers\page.tsx:204
**Current:** `throw new Error('Failed to save subscription plan');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\commission-tiers\page.tsx:224
**Current:** `throw new Error('Failed to delete commission tier');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\commission-tiers\page.tsx:244
**Current:** `throw new Error('Failed to delete subscription plan');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\common-scripts\page.tsx:40
**Current:** `throw new Error(data.error || 'Failed to run seed script')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\common-scripts\page.tsx:73
**Current:** `throw new Error(data.error || 'Failed to run booking payment consistency script')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\common-scripts\page.tsx:102
**Current:** `throw new Error(data.error || 'Failed to run maintenance scripts')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:255
**Current:** `if (!response.ok) throw new Error('Failed to fetch institutions');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:280
**Current:** `if (!response.ok) throw new Error('Failed to fetch email settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:321
**Current:** `if (!response.ok) throw new Error('Failed to update institution settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:347
**Current:** `throw new Error(errorData.message || 'Failed to seed categories');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:382
**Current:** `throw new Error(errorData.message || 'Failed to seed tags');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:416
**Current:** `throw new Error('Failed to perform cleanup');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:470
**Current:** `throw new Error(error.message || 'Failed to save email settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:483
**Current:** `throw new Error(error.message || 'Failed to save email settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:514
**Current:** `if (!response.ok) throw new Error('Failed to send test email');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:532
**Current:** `throw new Error(errorData.message || 'Failed to fix missing students');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:552
**Current:** `if (!response.ok) throw new Error('Failed to fetch notification templates');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:574
**Current:** `if (!response.ok) throw new Error('Failed to fetch notification logs');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:588
**Current:** `if (!response.ok) throw new Error('Failed to fetch notification stats');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:604
**Current:** `throw new Error(errorData.message || 'Failed to seed notification templates');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:627
**Current:** `throw new Error(errorData.message || 'Failed to create template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:661
**Current:** `throw new Error(errorData.message || 'Failed to update template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:695
**Current:** `throw new Error(errorData.message || 'Failed to delete template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\payment-approval\page.tsx:106
**Current:** `if (!response.ok) throw new Error('Failed to fetch settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:101
**Current:** `throw new Error('Failed to load subscription plans');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:136
**Current:** `throw new Error('Failed to create subscription plan');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:170
**Current:** `throw new Error('Failed to update subscription plan');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:193
**Current:** `throw new Error('Failed to delete subscription plan');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:215
**Current:** `throw new Error('Failed to update subscription plan status');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-disabled\dashboard\page.tsx:72
**Current:** `throw new Error(`HTTP error! status: ${response.status}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\subscriptions\page.tsx:99
**Current:** `if (!response.ok) throw new Error('Failed to fetch subscriptions');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\subscriptions\page.tsx:114
**Current:** `if (!response.ok) throw new Error('Failed to fetch stats');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\subscriptions\page.tsx:130
**Current:** `if (!response.ok) throw new Error('Failed to update status');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\subscriptions\page.tsx:148
**Current:** `if (!response.ok) throw new Error('Failed to update plan');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\subscriptions\[id]\edit\page.tsx:75
**Current:** `if (!response.ok) throw new Error('Failed to fetch subscription');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\subscriptions\[id]\edit\page.tsx:106
**Current:** `if (!response.ok) throw new Error('Failed to update subscription');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:163
**Current:** `throw new Error(`Failed to fetch tags: ${response.status} - ${errorText}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:171
**Current:** `throw new Error('Invalid response format: expected an array of tags');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:202
**Current:** `if (!response.ok) throw new Error('Failed to fetch analytics');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:267
**Current:** `throw new Error(errorData.message || `Failed to ${isUpdating ? 'update' : 'create'} tag`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:337
**Current:** `throw new Error(error.message || 'Failed to delete tag');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\page.tsx:81
**Current:** `throw new Error('Failed to fetch users');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\page.tsx:152
**Current:** `throw new Error(errorData.message || `Failed to ${selectedUser ? 'update' : 'create'} user`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\page.tsx:189
**Current:** `throw new Error('Failed to delete user');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\[userId]\page.tsx:58
**Current:** `throw new Error(errorData.message || 'Failed to fetch user');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\[userId]\page.tsx:91
**Current:** `throw new Error(errorData.message || 'Failed to update user status');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:348
**Current:** `throw new Error('Question ID is required for updates');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:352
**Current:** `throw new Error('Question text is required');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:356
**Current:** `throw new Error('Question type is required');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:360
**Current:** `throw new Error('Points must be between 1 and 100');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:372
**Current:** `throw new Error(`Question with ID ${questionId} not found`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\enroll\route.ts:69
**Current:** `throw new Error('Already enrolled');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\enroll\route.ts:82
**Current:** `throw new Error('Booking already exists');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\route.ts:83
**Current:** `if (!filename) throw new Error('Invalid preview URL');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\upload\route.ts:151
**Current:** `throw new Error('Institution not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\approve\route.ts:81
**Current:** `throw new Error('Failed to verify institution approval');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\upload\route.ts:78
**Current:** `throw new Error('Institution not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\upload\route.ts:140
**Current:** `throw new Error('Institution not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\webhooks\stripe\route.ts:8
**Current:** `throw new Error('STRIPE_SECRET_KEY is not set');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\webhooks\stripe\route.ts:12
**Current:** `throw new Error('STRIPE_WEBHOOK_SECRET is not set');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\enhanced\page.tsx:450
**Current:** `throw new Error(data.message || 'Registration failed');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\institution\page.tsx:151
**Current:** `throw new Error(data.message || 'Registration failed');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\page.tsx:38
**Current:** `throw new Error('Registration failed')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\signup\page.tsx:39
**Current:** `throw new Error('Registration failed')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\bookings\success\page.tsx:47
**Current:** `throw new Error('Failed to update booking')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\checkout\page.tsx:85
**Current:** `throw new Error('Payment failed');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\institution\EnrollmentStatusCard.tsx:91
**Current:** `throw new Error(error.message || 'Failed to send reminder');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\institution\MarkPaymentDialog.tsx:71
**Current:** `throw new Error('Failed to mark payment as paid');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\institution\PayoutDialog.tsx:60
**Current:** `throw new Error(error.message || 'Failed to mark payout as paid');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\LocationSelect.tsx:41
**Current:** `if (!response.ok) throw new Error('Failed to fetch locations');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\EnrollmentModal.tsx:39
**Current:** `throw new Error('Failed to calculate price');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\EnrollmentModal.tsx:73
**Current:** `throw new Error(error.message || 'Failed to enroll in course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\NotificationPreferences.tsx:129
**Current:** `throw new Error('Failed to fetch preferences');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\NotificationPreferences.tsx:162
**Current:** `throw new Error('Failed to save preferences');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\courses\[id]\page.tsx:78
**Current:** `throw new Error('Failed to fetch course')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\hooks\useCurrency.ts:33
**Current:** `throw new Error('Failed to fetch currency settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\hooks\useInstitution.ts:28
**Current:** `throw new Error('Failed to fetch institution data');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\analytics\quiz-analytics\page.tsx:84
**Current:** `if (!response.ok) throw new Error('Failed to fetch analytics');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\content-management\page.tsx:133
**Current:** `throw new Error('Failed to save content');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\content-management\page.tsx:155
**Current:** `throw new Error('Failed to delete content');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\add\page.tsx:43
**Current:** `throw new Error(error.message || 'Failed to create course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\MonthlyPricingTable.tsx:105
**Current:** `throw new Error('Failed to fetch prices');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\TimeBasedPricingRules.tsx:86
**Current:** `if (!response.ok) throw new Error('Failed to save pricing rules');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\WeeklyPricingTable.tsx:279
**Current:** `throw new Error(errorData.error || 'Failed to save prices');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:167
**Current:** `throw new Error(error.error || 'Failed to fetch courses');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:179
**Current:** `throw new Error('Invalid courses data structure received from API');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:196
**Current:** `if (!response.ok) throw new Error('Failed to fetch categories');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:259
**Current:** `throw new Error(responseData.error || 'Failed to save course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:312
**Current:** `if (!response.ok) throw new Error('Failed to delete course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:376
**Current:** `if (!response.ok) throw new Error('Failed to update course settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:98
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:136
**Current:** `if (!response.ok) throw new Error('Failed to fetch categories');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:161
**Current:** `throw new Error(errorData.error || 'Failed to update course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\enrollments\page.tsx:104
**Current:** `throw new Error('Failed to fetch enrollments');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\new\page.tsx:52
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\new\page.tsx:92
**Current:** `throw new Error('Failed to create module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\page.tsx:50
**Current:** `throw new Error('Failed to fetch modules');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\page.tsx:86
**Current:** `throw new Error('Failed to delete module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\new\page.tsx:197
**Current:** `throw new Error('Failed to create content');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\new\page.tsx:314
**Current:** `if (!uploadRes.ok) throw new Error('Failed to upload media');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\new\page.tsx:323
**Current:** `if (!response.ok) throw new Error('Failed to create quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\new\page.tsx:416
**Current:** `throw new Error(errorData || 'Failed to create exercise');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\page.tsx:85
**Current:** `throw new Error('Failed to fetch module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\page.tsx:150
**Current:** `throw new Error('Failed to delete content item');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\[contentId]\edit\page.tsx:67
**Current:** `throw new Error(`Failed to fetch content: ${response.status} - ${errorText}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\[contentId]\edit\page.tsx:157
**Current:** `throw new Error('Failed to update content');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:69
**Current:** `throw new Error('Failed to fetch module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:95
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:129
**Current:** `throw new Error('Failed to update module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\page.tsx:61
**Current:** `throw new Error('Failed to fetch module');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\page.tsx:69
**Current:** `throw new Error('Failed to fetch quizzes');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\page.tsx:105
**Current:** `throw new Error('Failed to delete quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:55
**Current:** `throw new Error('Failed to fetch quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:86
**Current:** `throw new Error('Failed to update quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:55
**Current:** `throw new Error(`Failed to fetch quiz: ${response.status} ${errorText}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:88
**Current:** `throw new Error('Failed to delete quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:66
**Current:** `throw new Error('Failed to fetch quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:155
**Current:** `throw new Error('Failed to add question');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\page.tsx:52
**Current:** `throw new Error('Failed to fetch quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\page.tsx:88
**Current:** `throw new Error('Failed to delete question');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:88
**Current:** `throw new Error('Failed to fetch quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:96
**Current:** `throw new Error('Failed to fetch question');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:244
**Current:** `throw new Error(error);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:270
**Current:** `throw new Error(error);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\page.tsx:101
**Current:** `throw new Error('Failed to fetch course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\DashboardClient.tsx:103
**Current:** `throw new Error(errorData.error || 'Failed to approve payment');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\DashboardClient.tsx:133
**Current:** `if (!response.ok) throw new Error('Failed to reject payment');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\page.tsx:89
**Current:** `if (!paymentsResponse.ok) throw new Error('Failed to fetch payments');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\page.tsx:119
**Current:** `throw new Error(errorData.error || 'Failed to approve payment');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\page.tsx:149
**Current:** `if (!response.ok) throw new Error('Failed to reject payment');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\00institution-profile.tsx:101
**Current:** `throw new Error('Failed to upload logo');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\00institution-profile.tsx:129
**Current:** `throw new Error('Failed to upload main image');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\00institution-profile.tsx:158
**Current:** `throw new Error('Failed to delete logo');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\00institution-profile.tsx:187
**Current:** `throw new Error('Failed to delete main image');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\00institution-profile.tsx:217
**Current:** `throw new Error('Failed to upload facilities');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\00institution-profile.tsx:252
**Current:** `throw new Error('Failed to update profile');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:82
**Current:** `throw new Error('Failed to fetch institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:221
**Current:** `throw new Error('Failed to upload logo');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:249
**Current:** `throw new Error('Failed to delete logo');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:278
**Current:** `throw new Error('Failed to upload main image');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:312
**Current:** `throw new Error('Failed to delete main image');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:406
**Current:** `throw new Error('Failed to update profile');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:445
**Current:** `throw new Error('Failed to upload facilities');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:471
**Current:** `throw new Error('Failed to delete facility');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\settings\page.tsx:144
**Current:** `if (!response.ok) throw new Error('Failed to fetch settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\settings\page.tsx:169
**Current:** `if (!response.ok) throw new Error('Failed to fetch logs');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\settings\page.tsx:194
**Current:** `if (!response.ok) throw new Error('Failed to update settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\setup\page.tsx:47
**Current:** `throw new Error('Failed to setup institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\page.tsx:105
**Current:** `if (!response.ok) throw new Error('Failed to fetch students');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:119
**Current:** `throw new Error('Failed to fetch student details');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:264
**Current:** `throw new Error(errorData.error || 'Failed to update enrollment dates');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution-registration\page.tsx:151
**Current:** `throw new Error(data.error || data.details || 'Failed to register institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institutions\[id]\page.tsx:47
**Current:** `throw new Error('Failed to fetch institution details')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\invoice-handlers.ts:11
**Current:** `throw new Error(error.message || 'Failed to send invoice');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\invoice-handlers.ts:27
**Current:** `throw new Error(error.message || 'Failed to download invoice');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\payment-service.ts:6
**Current:** `throw new Error('STRIPE_SECRET_KEY is not set');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\payment-service.ts:40
**Current:** `throw new Error('Enrollment not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\payment-service.ts:85
**Current:** `throw new Error('Enrollment not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\settings\page.tsx:61
**Current:** `throw new Error(errorData.message || 'Failed to fetch settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\settings\page.tsx:111
**Current:** `throw new Error(errorData.message || 'Failed to update settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\EnrollmentModal.tsx:88
**Current:** `if (!response.ok) throw new Error('Failed to fetch course details');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\EnrollmentModal.tsx:210
**Current:** `throw new Error(data.details || 'Failed to calculate price');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\EnrollmentModal.tsx:323
**Current:** `throw new Error(error.message || 'Failed to enroll in course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\PayCourseButton.tsx:96
**Current:** `throw new Error(data.error || data.details || 'Failed to process payment');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\page.tsx:70
**Current:** `if (!response.ok) throw new Error('Failed to fetch courses');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\modules\[moduleId]\page.tsx:133
**Current:** `if (!response.ok) throw new Error('Failed to fetch module details');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\modules\[moduleId]\page.tsx:192
**Current:** `if (!res.ok) throw new Error("Failed to submit exercise");`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\page.tsx:86
**Current:** `if (!response.ok) throw new Error('Failed to fetch course details');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\page.tsx:111
**Current:** `if (!response.ok) throw new Error('Failed to update progress');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\payment\page.tsx:12
**Current:** `throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\payment\page.tsx:46
**Current:** `throw new Error('Failed to create payment intent');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\profile\page.tsx:66
**Current:** `if (!response.ok) throw new Error('Failed to fetch profile');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\profile\page.tsx:93
**Current:** `throw new Error('Failed to update profile');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\profile\page.tsx:127
**Current:** `throw new Error('Failed to update password');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\settings\page.tsx:51
**Current:** `throw new Error('Failed to fetch profile');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\settings\page.tsx:85
**Current:** `throw new Error(error.message || 'Failed to update profile');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\subscription-signup\page.tsx:272
**Current:** `throw new Error('Selected plan not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\subscription-signup\page.tsx:293
**Current:** `throw new Error(error.error || 'Failed to create payment intent');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\subscription-signup\page.tsx:311
**Current:** `throw new Error('Selected plan not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\course-categories.tsx:47
**Current:** `if (!response.ok) throw new Error('Failed to fetch categories');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\course-categories.tsx:75
**Current:** `throw new Error(error || 'Failed to save category');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\course-categories.tsx:109
**Current:** `throw new Error(error || 'Failed to delete category');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\page.tsx:71
**Current:** `if (!response.ok) throw new Error('Failed to fetch data');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\page.tsx:102
**Current:** `if (!response.ok) throw new Error('Failed to update institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\page.tsx:129
**Current:** `if (!response.ok) throw new Error('Failed to update commission rate');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\page.tsx:156
**Current:** `if (!response.ok) throw new Error('Failed to update subscription plan');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\categories\AddCategoryDialog.tsx:56
**Current:** `throw new Error(error.message || 'Failed to create category');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\categories\EditCategoryDialog.tsx:74
**Current:** `throw new Error(error.message || 'Failed to update category');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\Sidebar.tsx:120
**Current:** `throw new Error(error.message || 'Failed to cleanup sample data');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CourseSearch.tsx:73
**Current:** `throw new Error(errorData.message || 'Failed to search courses');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CourseSearch.tsx:80
**Current:** `throw new Error('Invalid response format: courses array is missing');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CoursesPageClient.tsx:107
**Current:** `if (!response.ok) throw new Error('Failed to fetch courses');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CourseTagManager.tsx:57
**Current:** `throw new Error(error.error || 'Failed to fetch tags');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CourseTagManager.tsx:63
**Current:** `throw new Error('Invalid response format from server');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CourseTagManager.tsx:134
**Current:** `throw new Error(error.error || 'Failed to create tag');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\DiscountSettingsForm.tsx:41
**Current:** `throw new Error('Failed to fetch discount settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\DiscountSettingsForm.tsx:68
**Current:** `throw new Error('Failed to update discount settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:221
**Current:** `throw new Error('Failed to delete logo');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:247
**Current:** `throw new Error('Failed to delete main image');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:285
**Current:** `throw new Error(error.error || 'Failed to upload facility image');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:447
**Current:** `throw new Error(errorData.error || 'Failed to update profile');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionSidebar.tsx:115
**Current:** `if (!response.ok) throw new Error('Failed to fetch courses');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MonthlyPricingTable.tsx:162
**Current:** `throw new Error('Failed to fetch prices');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MonthlyPricingTable.tsx:227
**Current:** `throw new Error(errorData.error || 'Failed to save prices');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MonthlyPricingTable.tsx:266
**Current:** `throw new Error('Failed to fetch prices');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\providers\InstitutionProvider.tsx:36
**Current:** `throw new Error('Failed to fetch institution data');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\providers\InstitutionProvider.tsx:80
**Current:** `throw new Error('useInstitutionContext must be used within an InstitutionProvider');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ServiceWorkerProvider.tsx:228
**Current:** `throw new Error('useServiceWorkerContext must be used within a ServiceWorkerProvider');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\AdaptiveQuizInterface.tsx:95
**Current:** `if (!response.ok) throw new Error('Failed to start quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\AdaptiveQuizInterface.tsx:135
**Current:** `if (!response.ok) throw new Error('Failed to submit answer');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\NotificationPreferences.tsx:106
**Current:** `throw new Error('Failed to fetch preferences');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\NotificationPreferences.tsx:132
**Current:** `throw new Error('Failed to save preferences');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\StudentSubscriptionCard.tsx:176
**Current:** `throw new Error('Failed to upgrade subscription');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionManagementCard.tsx:177
**Current:** `throw new Error('Failed to upgrade subscription');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionManagementCard.tsx:199
**Current:** `throw new Error('Failed to cancel subscription');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\TagFilter.tsx:39
**Current:** `if (!response.ok) throw new Error('Failed to fetch tags');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\TagSelector.tsx:31
**Current:** `if (!response.ok) throw new Error('Failed to fetch tags');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useServiceWorker.ts:122
**Current:** `throw new Error('Service Worker not registered');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useServiceWorker.ts:127
**Current:** `throw new Error('Notification permission denied');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useServiceWorker.ts:262
**Current:** `throw new Error('Background sync not supported');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\automated-commission-service.ts:59
**Current:** `throw new Error('Payment not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\automated-commission-service.ts:63
**Current:** `throw new Error('Payment is not completed');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\automated-commission-service.ts:70
**Current:** `throw new Error('Institution does not have an active subscription');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\automated-commission-service.ts:79
**Current:** `throw new Error(`Commission tier not found for plan: ${subscription.planType}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\automated-commission-service.ts:196
**Current:** `throw new Error('Institution not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\automated-commission-service.ts:255
**Current:** `throw new Error('No pending commissions found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\automated-commission-service.ts:261
**Current:** `throw new Error('Payout amount exceeds pending commission amount');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\background-sync.ts:318
**Current:** `throw new Error(`Dependencies failed: ${failedDependencies.length}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\background-sync.ts:383
**Current:** `throw new Error(`HTTP ${response.status}: ${response.statusText}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\background-sync.ts:447
**Current:** `throw new Error(`Dependency not found or failed: ${dependencyId}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\cache-utils.ts:66
**Current:** `throw new Error(`HTTP error! status: ${response.status}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\content-preloader.ts:295
**Current:** `throw new Error(`HTTP ${response.status}: ${response.statusText}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\encryption.ts:89
**Current:** `throw new Error('Failed to encrypt data');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\encryption.ts:122
**Current:** `throw new Error('Failed to decrypt data');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\encryption.ts:217
**Current:** `throw new Error('Invalid encryption context');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\enrollment\state-manager.ts:116
**Current:** `throw new Error('Enrollment not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\enrollment\state-manager.ts:120
**Current:** `throw new Error(`Invalid state transition from ${enrollment.status} to ${newState}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\enrollment\state-manager.ts:152
**Current:** `throw new Error('Payment not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\enrollment\state-manager.ts:156
**Current:** `throw new Error(`Invalid state transition from ${payment.status} to ${newState}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\enrollment\state-manager.ts:188
**Current:** `throw new Error('Booking not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\enrollment\state-manager.ts:192
**Current:** `throw new Error(`Invalid state transition from ${booking.status} to ${newState}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:34
**Current:** `throw new Error('Student or course not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:86
**Current:** `throw new Error('Required data not found for quiz notification');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:128
**Current:** `throw new Error('Student not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:173
**Current:** `throw new Error('Required data not found for module notification');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:211
**Current:** `throw new Error('Student not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:249
**Current:** `throw new Error('User not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:289
**Current:** `throw new Error('User not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:325
**Current:** `throw new Error('User not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:52
**Current:** `throw new Error(`Template '${templateName}' not found or inactive`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:61
**Current:** `throw new Error(`Recipient with ID '${recipientId}' not found`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:132
**Current:** `throw new Error(`Unsupported notification type: ${data.type}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:200
**Current:** `throw new Error('SMS notifications not yet implemented');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:209
**Current:** `throw new Error('Push notifications not yet implemented');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-storage.ts:11
**Current:** `throw new Error('IndexedDB not available');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\manual-payment.ts:32
**Current:** `throw new Error('Enrollment not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\manual-payment.ts:120
**Current:** `throw new Error('Enrollment not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\service.ts:30
**Current:** `throw new Error('Enrollment not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\service.ts:48
**Current:** `throw new Error('Unsupported payment method');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\service.ts:91
**Current:** `throw new Error('PayPal integration not implemented yet');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:32
**Current:** `throw new Error('Enrollment not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:103
**Current:** `throw new Error('Enrollment not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:117
**Current:** `throw new Error('Related data not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:165
**Current:** `throw new Error('Related data not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:244
**Current:** `throw new Error('Enrollment not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:261
**Current:** `throw new Error('Related data not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\prisma.ts:26
**Current:** `throw new Error('Prisma client failed to initialize');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:124
**Current:** `throw new Error('Service worker not registered');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:129
**Current:** `throw new Error('Notification permission denied');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:236
**Current:** `throw new Error('Failed to send subscription to server');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:256
**Current:** `throw new Error('Failed to remove subscription from server');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:273
**Current:** `throw new Error('Service worker not registered');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\react-optimizer.tsx:297
**Current:** `throw new Error(`HTTP error! status: ${response.status}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\revenue-tracking-service.ts:178
**Current:** `throw new Error('Failed to calculate revenue metrics');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\revenue-tracking-service.ts:402
**Current:** `throw new Error('Failed to calculate revenue breakdown');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\revenue-tracking-service.ts:521
**Current:** `throw new Error('Failed to calculate revenue projection');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\revenue-tracking-service.ts:564
**Current:** `throw new Error('Failed to generate revenue report');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\s3.ts:28
**Current:** `throw new Error('Failed to upload file to S3');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:94
**Current:** `throw new Error('Institution not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:131
**Current:** `throw new Error(`Institution not found: ${institutionId}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:215
**Current:** `throw new Error(`Student not found: ${studentId}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:282
**Current:** `throw new Error(`Invalid plan type: ${planType}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:390
**Current:** `throw new Error('No active subscription found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:395
**Current:** `throw new Error('Cannot downgrade from STARTER plan');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:399
**Current:** `throw new Error('Cannot downgrade to ENTERPRISE plan');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:406
**Current:** `throw new Error(`Invalid plan type: ${newPlanType}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:471
**Current:** `throw new Error('No active subscription found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:526
**Current:** `throw new Error('No cancelled subscription found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:955
**Current:** `throw new Error(`Student not found: ${studentId}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:1039
**Current:** `throw new Error(`Institution not found: ${institutionId}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-payment-service.ts:8
**Current:** `throw new Error('STRIPE_SECRET_KEY is not set');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-payment-service.ts:53
**Current:** `throw new Error('Institution not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-payment-service.ts:123
**Current:** `throw new Error('Student not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-payment-service.ts:318
**Current:** `throw new Error(`Invalid plan type: ${planType}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\upload.ts:22
**Current:** `throw new Error('Invalid file type. Only JPG, PNG, GIF, and WebP images are allowed.');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\upload.ts:45
**Current:** `throw new Error(error instanceof Error ? error.message : 'Failed to upload file');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\upload.ts:59
**Current:** `throw new Error('Failed to delete file');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\public\sw.js:208
**Current:** `throw new Error('Network response not ok');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\create-course.js:30
**Current:** `throw new Error(`Failed to create course: ${courseResponse.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\create-course.js:45
**Current:** `throw new Error(`Failed to fetch tags: ${tagsResponse.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\create-course.js:56
**Current:** `throw new Error('Required tags not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\create-course.js:75
**Current:** `throw new Error(`Failed to add tag: ${r.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-mobile-tests.ts:74
**Current:** `throw new Error('Server responded with non-200 status');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-mobile-tests.ts:112
**Current:** `throw new Error('Development server failed to start');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\auth.spec.ts:62
**Current:** `throw new Error('Login failed - invalid credentials');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\global-setup.ts:418
**Current:** `throw new Error('Test users not created properly');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\global-setup.ts:427
**Current:** `throw new Error('Student profile not created properly');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\global-setup.ts:436
**Current:** `throw new Error('Test institution not created properly');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\password-test.spec.ts:18
**Current:** `throw new Error('Test admin user not found');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\server-connectivity.spec.ts:126
**Current:** `throw new Error('No working authentication routes found. Check if the development server is running correctly.');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\utils\test-helpers.ts:49
**Current:** `throw new Error(`Login failed for ${email} - invalid credentials`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\utils\test-helpers.ts:55
**Current:** `throw new Error(`Login failed for ${email} - still on login page`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\utils\test-helpers.ts:266
**Current:** `throw new Error(`Text "${text}" not found on page`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\utils\test-helpers.ts:312
**Current:** `throw new Error(`None of the selectors were found: ${selectors.join(', ')}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-device-testing.ts:299
**Current:** `throw new Error('No device configured');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-device-testing.ts:382
**Current:** `throw new Error('No device configured');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-device-testing.ts:460
**Current:** `throw new Error('No device configured');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-device-testing.ts:534
**Current:** `throw new Error('No device configured');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-device-testing.ts:599
**Current:** `throw new Error('No device configured');`
## Negative condition checks that might be unclear
**Found in 1638 locations:**

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\components\CourseForm.tsx:134
**Current:** `if (!data.categoryId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\components\CourseForm.tsx:137
**Current:** `if (!data.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\components\CourseForm.tsx:149
**Current:** `if (!data.startDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\components\CourseForm.tsx:152
**Current:** `if (!data.endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:155
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:283
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:323
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:352
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:405
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:491
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:560
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:603
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:619
**Current:** `if (!selectedCourse) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:649
**Current:** `if (!session || session.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:696
**Current:** `if (!institutionsResponse.ok || !categoriesResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:801
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:854
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:879
**Current:** `if (!isFormSubmitting && !formSubmissionRef.current) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:886
**Current:** `if (!open && hasUnsavedChanges && !isFormSubmitting && !formSubmissionRef.current) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:890
**Current:** `} else if (!open) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:935
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:954
**Current:** `if (!selectedCourse) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:983
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:990
**Current:** `if (!course.category || !course.category.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:994
**Current:** `if (!course.institution || !course.institution.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1048
**Current:** `if (!courseResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1065
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1543
**Current:** `if (!open) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1572
**Current:** `if (!open) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\enrollments\page.tsx:145
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\enrollments\page.tsx:176
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\enrollments\page.tsx:217
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\enrollments\page.tsx:289
**Current:** `if (!mounted) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\page.tsx:84
**Current:** `if (!courseResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\page.tsx:92
**Current:** `if (!modulesResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\page.tsx:123
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\page.tsx:164
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\page.tsx:89
**Current:** `if (!courseResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\page.tsx:97
**Current:** `if (!moduleResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\page.tsx:71
**Current:** `if (!courseResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\page.tsx:79
**Current:** `if (!moduleResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\page.tsx:87
**Current:** `if (!quizzesResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\page.tsx:135
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:71
**Current:** `if (!courseResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:79
**Current:** `if (!moduleResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:87
**Current:** `if (!quizResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:118
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:67
**Current:** `if (!courseResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:75
**Current:** `if (!moduleResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:83
**Current:** `if (!quizResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:115
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:218
**Current:** `if (!questionData.use_manual_irt) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:236
**Current:** `if (!courseResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:244
**Current:** `if (!moduleResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:252
**Current:** `if (!quizResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:317
**Current:** `if (!validation.isValid) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:333
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:297
**Current:** `if (!formData.use_manual_irt) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:330
**Current:** `if (!validation.isValid) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:346
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:669
**Current:** `if (!quiz || !module || !course || !question) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\page.tsx:93
**Current:** `if (!courseResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\page.tsx:102
**Current:** `if (!modulesResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\dashboard\page.tsx:71
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institution-monetization\page.tsx:86
**Current:** `if (!session || session.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\create\page.tsx:90
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\page.tsx:64
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\page.tsx:111
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\page.tsx:134
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\courses\page.tsx:162
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\courses\page.tsx:234
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\edit\page.tsx:26
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\edit\page.tsx:80
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:66
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:89
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:94
**Current:** `if (!data || typeof data.id !== 'string') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:142
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\permissions\page.tsx:66
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\permissions\page.tsx:81
**Current:** `if (!institutionResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\permissions\page.tsx:89
**Current:** `if (!permissionsResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\permissions\page.tsx:121
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\permissions\page.tsx:174
**Current:** `if (!institution || !permissions) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\users\page.tsx:55
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\users\page.tsx:75
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\users\page.tsx:109
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\users\page.tsx:165
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:155
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:195
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:239
**Current:** `if (!paymentSettings) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:245
**Current:** `if (!paymentSettings.allowInstitutionPaymentApproval) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:270
**Current:** `if (!paymentSettings.allowInstitutionPaymentApproval) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:321
**Current:** `if (!paymentSettings.allowInstitutionPaymentApproval) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\performance\page.tsx:16
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\performance\page.tsx:35
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-banks\[id]\page.tsx:178
**Current:** `if (!bank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-templates\[id]\page.tsx:98
**Current:** `if (!template) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\revenue\page.tsx:71
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\commission-tiers\page.tsx:127
**Current:** `if (!session || session.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\common-scripts\page.tsx:39
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\common-scripts\page.tsx:72
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\common-scripts\page.tsx:101
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:243
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:351
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:386
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:421
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:451
**Current:** `if (!passwordChange.currentPassword || !passwordChange.newPassword || !passwordChange.confirmPassword) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:474
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:487
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:536
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:608
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:631
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:665
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:699
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\payment-approval\page.tsx:94
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:100
**Current:** `if (!plansResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:135
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:169
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:192
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:214
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\subscriptions\page.tsx:86
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\subscriptions\[id]\edit\page.tsx:63
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\subscriptions\[id]\edit\page.tsx:135
**Current:** `if (!subscription) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:82
**Current:** `if (!isDialogOpen) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:160
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:226
**Current:** `if (!sessionData?.user?.role || sessionData.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:265
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:306
**Current:** `if (!open) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:335
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:516
**Current:** `if (!isAuthenticated) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\page.tsx:80
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\page.tsx:150
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\page.tsx:188
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\page.tsx:472
**Current:** `if (!open) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\[userId]\page.tsx:53
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\[userId]\page.tsx:89
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\[userId]\page.tsx:138
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\components\CourseForm.tsx:134
**Current:** `if (!data.categoryId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\components\CourseForm.tsx:137
**Current:** `if (!data.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\components\CourseForm.tsx:149
**Current:** `if (!data.startDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\components\CourseForm.tsx:152
**Current:** `if (!data.endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:155
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:283
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:323
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:352
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:405
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:491
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:560
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:603
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:619
**Current:** `if (!selectedCourse) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:649
**Current:** `if (!session || session.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:696
**Current:** `if (!institutionsResponse.ok || !categoriesResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:801
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:854
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:879
**Current:** `if (!isFormSubmitting && !formSubmissionRef.current) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:886
**Current:** `if (!open && hasUnsavedChanges && !isFormSubmitting && !formSubmissionRef.current) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:890
**Current:** `} else if (!open) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:935
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:954
**Current:** `if (!selectedCourse) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:983
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:990
**Current:** `if (!course.category || !course.category.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:994
**Current:** `if (!course.institution || !course.institution.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1048
**Current:** `if (!courseResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1065
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1543
**Current:** `if (!open) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1572
**Current:** `if (!open) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\enrollments\page.tsx:145
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\enrollments\page.tsx:176
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\enrollments\page.tsx:217
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\enrollments\page.tsx:289
**Current:** `if (!mounted) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\page.tsx:84
**Current:** `if (!courseResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\page.tsx:92
**Current:** `if (!modulesResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\page.tsx:123
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\page.tsx:164
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\page.tsx:89
**Current:** `if (!courseResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\page.tsx:97
**Current:** `if (!moduleResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\page.tsx:71
**Current:** `if (!courseResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\page.tsx:79
**Current:** `if (!moduleResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\page.tsx:87
**Current:** `if (!quizzesResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\page.tsx:135
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:71
**Current:** `if (!courseResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:79
**Current:** `if (!moduleResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:87
**Current:** `if (!quizResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:118
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:67
**Current:** `if (!courseResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:75
**Current:** `if (!moduleResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:83
**Current:** `if (!quizResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:115
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:218
**Current:** `if (!questionData.use_manual_irt) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:236
**Current:** `if (!courseResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:244
**Current:** `if (!moduleResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:252
**Current:** `if (!quizResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:317
**Current:** `if (!validation.isValid) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:333
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:297
**Current:** `if (!formData.use_manual_irt) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:330
**Current:** `if (!validation.isValid) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:346
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:669
**Current:** `if (!quiz || !module || !course || !question) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\page.tsx:93
**Current:** `if (!courseResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\page.tsx:102
**Current:** `if (!modulesResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institution-monetization\page.tsx:86
**Current:** `if (!session || session.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\create\page.tsx:90
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\page.tsx:64
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\page.tsx:111
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\page.tsx:134
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\courses\page.tsx:162
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\courses\page.tsx:234
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\edit\page.tsx:26
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\edit\page.tsx:80
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:66
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:89
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:94
**Current:** `if (!data || typeof data.id !== 'string') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:142
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\permissions\page.tsx:66
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\permissions\page.tsx:81
**Current:** `if (!institutionResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\permissions\page.tsx:89
**Current:** `if (!permissionsResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\permissions\page.tsx:121
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\permissions\page.tsx:174
**Current:** `if (!institution || !permissions) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\users\page.tsx:55
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\users\page.tsx:75
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\users\page.tsx:109
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\users\page.tsx:165
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:155
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:195
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:239
**Current:** `if (!paymentSettings) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:245
**Current:** `if (!paymentSettings.allowInstitutionPaymentApproval) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:270
**Current:** `if (!paymentSettings.allowInstitutionPaymentApproval) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:321
**Current:** `if (!paymentSettings.allowInstitutionPaymentApproval) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\performance\page.tsx:16
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\performance\page.tsx:35
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-banks\[id]\page.tsx:178
**Current:** `if (!bank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-templates\[id]\page.tsx:98
**Current:** `if (!template) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\commission-tiers\page.tsx:127
**Current:** `if (!session || session.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\common-scripts\page.tsx:39
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\common-scripts\page.tsx:72
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\common-scripts\page.tsx:101
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:237
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:345
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:380
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:415
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:445
**Current:** `if (!passwordChange.currentPassword || !passwordChange.newPassword || !passwordChange.confirmPassword) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:468
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:481
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:530
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:602
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:625
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:659
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:693
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\payment-approval\page.tsx:94
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:100
**Current:** `if (!plansResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:135
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:169
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:192
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:214
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-disabled\dashboard\page.tsx:71
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\revenue\page.tsx:71
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\subscriptions\page.tsx:86
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\subscriptions\[id]\edit\page.tsx:63
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\subscriptions\[id]\edit\page.tsx:135
**Current:** `if (!subscription) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:82
**Current:** `if (!isDialogOpen) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:160
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:226
**Current:** `if (!sessionData?.user?.role || sessionData.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:265
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:306
**Current:** `if (!open) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:335
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:516
**Current:** `if (!isAuthenticated) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\page.tsx:80
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\page.tsx:150
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\page.tsx:188
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\page.tsx:472
**Current:** `if (!open) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\[userId]\page.tsx:53
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\[userId]\page.tsx:89
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\[userId]\page.tsx:138
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\advertising\route.ts:9
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\advertising\route.ts:256
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\route.ts:12
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\route.ts:37
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\route.ts:44
**Current:** `if (!name || !description) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\[categoryId]\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\[categoryId]\route.ts:25
**Current:** `if (!category) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\[categoryId]\route.ts:50
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\[categoryId]\route.ts:60
**Current:** `if (!name || !description) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\[categoryId]\route.ts:74
**Current:** `if (!existingCategory) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\[categoryId]\route.ts:110
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\[categoryId]\route.ts:124
**Current:** `if (!category) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\cleanup\route.ts:10
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\cleanup-sample-data\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\cleanup-sample-data\route.ts:26
**Current:** `if (!result.success) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\commissions\calculate\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\commissions\calculate\route.ts:58
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\commissions\calculate\route.ts:67
**Current:** `if (!institutionId || !startDate || !endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\priority\route.ts:18
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\priority\route.ts:132
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\priority\route.ts:139
**Current:** `if (!courseId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\priority\route.ts:170
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\route.ts:13
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\route.ts:162
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\route.ts:187
**Current:** `if (!title || !institutionId || !categoryId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\enrollments\route.ts:14
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\enrollments\route.ts:31
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\enrollments\route.ts:150
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\enrollments\route.ts:156
**Current:** `if (!enrollmentId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\enrollments\route.ts:168
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\route.ts:15
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\route.ts:32
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\route.ts:108
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\route.ts:117
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\route.ts:124
**Current:** `if (!title) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\content\route.ts:15
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\content\route.ts:24
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\content\route.ts:36
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\content\route.ts:65
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\content\route.ts:74
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\content\route.ts:86
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\content\route.ts:98
**Current:** `if (!title || !type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\analytics\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:30
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:42
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:82
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:99
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:111
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:129
**Current:** `if (!title) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:203
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:218
**Current:** `if (!quizId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:230
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:242
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:257
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\analytics\route.ts:11
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:30
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:42
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:57
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:89
**Current:** `if (!type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:171
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:188
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:200
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:215
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:260
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:277
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:289
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:304
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:347
**Current:** `if (!questionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:355
**Current:** `if (!type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:371
**Current:** `if (!existingQuestion) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:446
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:463
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:475
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:490
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:500
**Current:** `if (!questionIds) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:12
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:29
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:41
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:56
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:76
**Current:** `if (!question) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:110
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:127
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:139
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:154
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:169
**Current:** `if (!existingQuestion) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:202
**Current:** `if (!type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:287
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:304
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:316
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:331
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:346
**Current:** `if (!existingQuestion) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:12
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:29
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:41
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:63
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:86
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:103
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:115
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:130
**Current:** `if (!existingQuiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:148
**Current:** `if (!title) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:193
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:210
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:222
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:237
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:14
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:23
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:56
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:83
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:92
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:104
**Current:** `if (!existingModule) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:111
**Current:** `if (!data.title) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:180
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:189
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:201
**Current:** `if (!existingModule) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\route.ts:15
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\route.ts:57
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\route.ts:108
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\route.ts:190
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\enrollments\[id]\dates\route.ts:14
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\enrollments\[id]\dates\route.ts:22
**Current:** `if (!confirmed) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\enrollments\[id]\dates\route.ts:38
**Current:** `if (!startDate || !endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\enrollments\[id]\dates\route.ts:108
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\fix-missing-students\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\health\missing-students\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institution-monetization\route.ts:9
**Current:** `if (!session || session.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institution-monetization\[id]\route.ts:12
**Current:** `if (!session || session.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:15
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:81
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:86
**Current:** `if (!session.user.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:113
**Current:** `if (!name || !email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:262
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:269
**Current:** `if (!id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\settings\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\settings\route.ts:19
**Current:** `if (!session.user.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\commission-rate\route.ts:13
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\commission-rate\route.ts:34
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\commission-rate\route.ts:86
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\commission-rate\route.ts:119
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\commission-rate\route.ts:126
**Current:** `if (!newRate || !reason) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\commission-rate\route.ts:137
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\courses\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\courses\route.ts:45
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\courses\route.ts:89
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\courses\route.ts:120
**Current:** `if (!categoryId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\courses\route.ts:132
**Current:** `if (!category) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\courses\route.ts:144
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\facilities\route.ts:18
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\facilities\route.ts:22
**Current:** `if (!session.user.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\facilities\route.ts:29
**Current:** `if (!facilities.length) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\logo\route.ts:36
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\logo\route.ts:40
**Current:** `if (!session.user.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\logo\route.ts:49
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\logo\route.ts:56
**Current:** `if (!logo) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\main-image\route.ts:38
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\main-image\route.ts:45
**Current:** `if (!mainImageFile) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\permissions\route.ts:14
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\permissions\route.ts:34
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\permissions\route.ts:46
**Current:** `if (!permissions) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\permissions\route.ts:74
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\permissions\route.ts:94
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\route.ts:18
**Current:** `if (!session.user.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\route.ts:35
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\route.ts:86
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\route.ts:90
**Current:** `if (!session.user.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\route.ts:117
**Current:** `if (!country || !state || !city) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\route.ts:144
**Current:** `if (!currentInstitution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\settings\route.ts:16
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\settings\route.ts:25
**Current:** `if (!session.user.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\status\route.ts:12
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\users\route.ts:16
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\users\route.ts:66
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\users\route.ts:85
**Current:** `if (!name || !email || !password || !role) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\users\[userId]\route.ts:15
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\users\[userId]\route.ts:34
**Current:** `if (!name || !email || !role) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\users\[userId]\route.ts:107
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\payments\approve\[paymentId]\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\payments\approve\[paymentId]\route.ts:46
**Current:** `if (!payment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\payments\disapprove\[paymentId]\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\payments\disapprove\[paymentId]\route.ts:48
**Current:** `if (!payment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\payments\pending-count\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\payments\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\payments\route.ts:91
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\payments\route.ts:97
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\performance\health\route.ts:10
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\performance\metrics\route.ts:10
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\performance\route.ts:10
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\process-fallbacks\route.ts:11
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\process-fallbacks\route.ts:20
**Current:** `if (!user || user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\route.ts:24
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\[id]\add-question\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\[id]\export\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\[id]\import\route.ts:9
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\[id]\remove-question\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\[id]\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\[id]\route.ts:20
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\[id]\route.ts:39
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-templates\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-templates\route.ts:19
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-templates\[id]\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-templates\[id]\route.ts:20
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-templates\[id]\route.ts:42
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\revenue\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\revenue\route.ts:19
**Current:** `if (!startDate || !endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\revenue\route.ts:65
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\revenue\route.ts:71
**Current:** `if (!startDate || !endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\scripts\booking-payment-consistency\route.ts:16
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\scripts\maintenance\route.ts:14
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\scripts\seed\route.ts:15
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\commission-tiers\route.ts:9
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\commission-tiers\route.ts:34
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\commission-tiers\route.ts:67
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\commission-tiers\[id]\route.ts:12
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\email\route.ts:11
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\email\route.ts:19
**Current:** `if (!settings) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\email\route.ts:48
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\email\route.ts:69
**Current:** `if (!host || !port || !username || !fromEmail || !fromName) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\email\route.ts:93
**Current:** `if (!currentSettings) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\email\route.ts:102
**Current:** `if (!isValidPassword) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\email\route.ts:111
**Current:** `} else if (!currentSettings) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\email\test\route.ts:11
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\email\test\route.ts:20
**Current:** `if (!emailSettings) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\error-scanning\route.ts:13
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\error-scanning\route.ts:20
**Current:** `if (!action || !scriptType) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\error-scanning\route.ts:128
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\seed-templates\route.ts:10
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\send\route.ts:11
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\send\route.ts:33
**Current:** `if (!recipientEmail || !recipientName || !type || !title || !content) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\send\route.ts:47
**Current:** `if (!template) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\stats\route.ts:10
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\route.ts:11
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\route.ts:76
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\route.ts:97
**Current:** `if (!name || !type || !title || !content || !category) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\[id]\route.ts:13
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\[id]\route.ts:24
**Current:** `if (!template) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\[id]\route.ts:81
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\[id]\route.ts:106
**Current:** `if (!existingTemplate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\[id]\route.ts:195
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\[id]\route.ts:207
**Current:** `if (!existingTemplate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\payment-approval\route.ts:11
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\payment-approval\route.ts:23
**Current:** `if (!settings) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\payment-approval\route.ts:116
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\run-all-maintenance-scripts\route.ts:10
**Current:** `if (!session?.user?.email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\run-all-maintenance-scripts\route.ts:19
**Current:** `if (!user || user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\seed-categories\route.ts:104
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\seed-categories\route.ts:121
**Current:** `if (!existingCategory) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\seed-tags\route.ts:80
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\seed-tags\route.ts:97
**Current:** `if (!existingTag) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\subscription-plans\route.ts:9
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\subscription-plans\route.ts:114
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\subscription-plans\route.ts:177
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\subscription-plans\route.ts:242
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\subscription-plans\route.ts:252
**Current:** `if (!id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\subscription-plans\[id]\route.ts:12
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\subscription-plans\[id]\route.ts:81
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\stats\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\[id]\plan\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\[id]\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\[id]\route.ts:22
**Current:** `if (!user || user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\[id]\route.ts:40
**Current:** `if (!subscription) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\[id]\route.ts:61
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\[id]\route.ts:70
**Current:** `if (!user || user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\[id]\route.ts:78
**Current:** `if (!planType || !status || !billingCycle || amount === undefined) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\tags\route.ts:9
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\tags\route.ts:18
**Current:** `if (!categoryId && !title) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\tags\route.ts:75
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\tags\route.ts:82
**Current:** `if (!name) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\test-session\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\users\route.ts:9
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\users\[userId]\route.ts:14
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\users\[userId]\route.ts:37
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\users\[userId]\route.ts:75
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\users\[userId]\route.ts:96
**Current:** `if (!name || !email || !role) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\users\[userId]\route.ts:174
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\users\[userId]\status\route.ts:15
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\users\[userId]\status\route.ts:38
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\analytics\leads\route.ts:52
**Current:** `if (!institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\check-password-reset\route.ts:11
**Current:** `if (!session?.user?.email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\check-password-reset\route.ts:30
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\check-password-reset\route.ts:59
**Current:** `if (!session?.user?.email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\check-password-reset\route.ts:69
**Current:** `if (!newPassword) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\check-password-reset\route.ts:81
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\check-password-reset\route.ts:89
**Current:** `if (!user.forcePasswordReset) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\custom-signin\route.ts:14
**Current:** `if (!email || !password) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\custom-signin\route.ts:29
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\custom-signin\route.ts:37
**Current:** `if (!isPasswordValid) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\password-reset\route.ts:14
**Current:** `if (!email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\password-reset\route.ts:26
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\password-reset\route.ts:106
**Current:** `if (!token || !email || !newPassword) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\password-reset\route.ts:118
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\redirect-after-signin\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\register\institution\route.ts:15
**Current:** `if (!name || !email || !password || !description || !country || !city || !address) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\register\route.ts:16
**Current:** `if (!name || !email || !password || !role) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\register\route.ts:153
**Current:** `if (!studentTier) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\user\route.ts:12
**Current:** `if (!session?.user?.email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\user\route.ts:29
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\validate-session\route.ts:9
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\bookings\route.ts:17
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\bookings\route.ts:31
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\bookings\route.ts:48
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\bookings\route.ts:110
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\bookings\update\route.ts:15
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\bookings\update\route.ts:22
**Current:** `if (!sessionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\bookings\update\route.ts:29
**Current:** `if (!stripeSession) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\bookings\update\route.ts:47
**Current:** `if (!booking) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route.ts:15
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route.ts:66
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route.ts:97
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route_new.ts:15
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route_new.ts:66
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route_new.ts:97
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\enroll\route.ts:17
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\enroll\route.ts:29
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\monthly-pricing\route.ts:12
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\monthly-pricing\route.ts:46
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\pricing\route.ts:12
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\pricing\route.ts:33
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\pricing\route.ts:80
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\pricing\route.ts:96
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\pricing-rules\route.ts:13
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\pricing-rules\route.ts:34
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\pricing-rules\route.ts:72
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\route.ts:12
**Current:** `if (!courseId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\route.ts:21
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\route.ts:28
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\route.ts:73
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\route.ts:78
**Current:** `if (!courseId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\route.ts:101
**Current:** `if (!title || !description || !categoryId || !institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\route.ts:183
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\route.ts:188
**Current:** `if (!courseId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\tags\route.ts:15
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\tags\route.ts:46
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\tags\route.ts:52
**Current:** `if (!tagId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\tags\route.ts:107
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\tags\route.ts:114
**Current:** `if (!tagId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\cron\trial-expiration\route.ts:11
**Current:** `if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\quiz\route.ts:9
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\quiz\route.ts:19
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\stats\route.ts:9
**Current:** `if (!session?.user || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\stats\route.ts:18
**Current:** `if (!institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\stats\route.ts:48
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\categories\route.ts:25
**Current:** `if (!types || types.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\collaboration\stats\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\collaboration\stats\route.ts:20
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\commission-rate\route.ts:9
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\commission-rate\route.ts:32
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\commission-rate\route.ts:80
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\commission-rate\route.ts:93
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\route.ts:33
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\route.ts:140
**Current:** `if (!acc[module.course_id]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\route.ts:148
**Current:** `if (!acc[courseTag.courseId]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\route.ts:199
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\route.ts:328
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\update-weekly-prices\route.ts:9
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\dates\route.ts:12
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\dates\route.ts:20
**Current:** `if (!startDate || !endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\dates\route.ts:52
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\dates\route.ts:101
**Current:** `if (!revalidateResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\enrollments\route.ts:12
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\enrollments\route.ts:24
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\enrollments\route.ts:94
**Current:** `if (!acc[payment.enrollmentId]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\route.ts:15
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\route.ts:25
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\route.ts:37
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\route.ts:100
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\route.ts:110
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\route.ts:122
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\route.ts:45
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\route.ts:55
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\route.ts:67
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\route.ts:79
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\route.ts:91
**Current:** `if (!title || !type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\route.ts:168
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\route.ts:178
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\route.ts:190
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\route.ts:202
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\[contentId]\route.ts:15
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\[contentId]\route.ts:38
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\[contentId]\route.ts:53
**Current:** `if (!content) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\[contentId]\route.ts:71
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\[contentId]\route.ts:89
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\[contentId]\route.ts:97
**Current:** `if (!title || !type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\[contentId]\route.ts:130
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\[contentId]\route.ts:148
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\route.ts:15
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\route.ts:25
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\route.ts:37
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\route.ts:49
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\route.ts:78
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\route.ts:88
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\route.ts:100
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\route.ts:112
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\route.ts:119
**Current:** `if (!type || !question || !answer) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:14
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:24
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:36
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:48
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:60
**Current:** `if (!exercise) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:79
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:89
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:101
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:113
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:125
**Current:** `if (!existingExercise) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:132
**Current:** `if (!type || !question || !answer) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:166
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:176
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:188
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:200
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:212
**Current:** `if (!existingExercise) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:14
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:24
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:36
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:149
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:155
**Current:** `if (!canCreateQuizzes) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:165
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:177
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:189
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:248
**Current:** `if (!validation.isValid) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:322
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:328
**Current:** `if (!canEditQuizzes) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:338
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:350
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:362
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:389
**Current:** `if (!quizId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:426
**Current:** `if (!validation.isValid) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:439
**Current:** `if (!existingQuiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:516
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:522
**Current:** `if (!canDeleteQuizzes) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:532
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:544
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:556
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:563
**Current:** `if (!quizId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:575
**Current:** `if (!existingQuiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:15
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:26
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:38
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:50
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:84
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:94
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:106
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:118
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:130
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:161
**Current:** `if (!type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:215
**Current:** `if (!use_manual_irt || !irt_difficulty || !irt_discrimination || !irt_guessing) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:12
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:22
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:34
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:46
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:58
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:70
**Current:** `if (!question) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:87
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:97
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:109
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:121
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:133
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:145
**Current:** `if (!existingQuestion) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:175
**Current:** `if (!type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:229
**Current:** `if (!use_manual_irt || !irt_difficulty || !irt_discrimination || !irt_guessing) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:337
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:347
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:359
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:371
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:383
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:395
**Current:** `if (!question) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:12
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:22
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:34
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:46
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:65
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:112
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:122
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:134
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:146
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:158
**Current:** `if (!existingQuiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:14
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:24
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:36
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:48
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:128
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:138
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:150
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:162
**Current:** `if (!existingModule) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:169
**Current:** `if (!data.title) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:219
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:229
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:241
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\monthly-prices\route.ts:13
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\monthly-prices\route.ts:28
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\monthly-prices\route.ts:92
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\monthly-prices\route.ts:111
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\route.ts:36
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\route.ts:53
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\route.ts:142
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\route.ts:185
**Current:** `if (!existingCourse) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\route.ts:283
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\route.ts:295
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\weekly-prices\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\weekly-prices\route.ts:30
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\weekly-prices\route.ts:94
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\weekly-prices\route.ts:113
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\current\route.ts:10
**Current:** `if (!session?.user?.email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\current\route.ts:24
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\enrollments\[id]\dates\route.ts:12
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\enrollments\[id]\dates\route.ts:20
**Current:** `if (!startDate || !endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\enrollments\[id]\dates\route.ts:57
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\enrollments\[id]\invoice\route.ts:16
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\enrollments\[id]\invoice\route.ts:45
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\enrollments\[id]\invoice\route.ts:96
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\enrollments\[id]\invoice\route.ts:125
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\enrollments\[id]\mark-paid\route.ts:14
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\enrollments\[id]\mark-paid\route.ts:25
**Current:** `if (!institutionAdmin) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\enrollments\[id]\mark-paid\route.ts:43
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\enrollments\[id]\reminder\route.ts:16
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\enrollments\[id]\reminder\route.ts:50
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\info\route.ts:9
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\info\route.ts:38
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payments\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payments\route.ts:25
**Current:** `if (!institutionUser) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payments\route.ts:99
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payments\route.ts:105
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payments\[paymentId]\approve\route.ts:14
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payments\[paymentId]\approve\route.ts:29
**Current:** `if (!institutionUser) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payments\[paymentId]\approve\route.ts:55
**Current:** `if (!payment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payments\[paymentId]\approve\route.ts:68
**Current:** `if (!canApprove) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payments\[paymentId]\reject\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payments\[paymentId]\reject\route.ts:28
**Current:** `if (!institutionUser) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payments\[paymentId]\reject\route.ts:43
**Current:** `if (!payment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payouts\route.ts:9
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payouts\route.ts:19
**Current:** `if (!institutionAdmin) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payouts\route.ts:58
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payouts\route.ts:68
**Current:** `if (!institutionAdmin) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payouts\route.ts:74
**Current:** `if (!payoutId || !status) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payouts\route.ts:88
**Current:** `if (!payout) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\facilities\route.ts:16
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\facilities\route.ts:34
**Current:** `if (!user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\facilities\route.ts:46
**Current:** `if (!files || files.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\facilities\route.ts:155
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\facilities\route.ts:169
**Current:** `if (!user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\facilities\route.ts:176
**Current:** `if (!imageUrl) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\facilities\route.ts:186
**Current:** `if (!institution?.facilities) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\main-image\route.ts:35
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\main-image\route.ts:41
**Current:** `if (!institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\main-image\route.ts:48
**Current:** `if (!mainImageFile) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\route.ts:15
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\route.ts:29
**Current:** `if (!user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\route.ts:64
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\route.ts:107
**Current:** `if (!session?.user?.email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\route.ts:115
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\route.ts:165
**Current:** `if (!institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\route.ts:174
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\bulk-delete\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\bulk-delete\route.ts:20
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\bulk-export\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\bulk-export\route.ts:20
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\bulk-update\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\bulk-update\route.ts:20
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\bulk-update\route.ts:31
**Current:** `if (!updates || typeof updates !== 'object') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\import\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\import\route.ts:20
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\import\route.ts:27
**Current:** `if (!file) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\route.ts:20
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\route.ts:79
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\route.ts:89
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\route.ts:96
**Current:** `if (!name) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\copy\route.ts:13
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\copy\route.ts:23
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\copy\route.ts:53
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\export\route.ts:12
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\export\route.ts:46
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\import\route.ts:12
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\import\route.ts:20
**Current:** `if (!file) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\import\route.ts:44
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk\route.ts:12
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk\route.ts:42
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk\route.ts:73
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk\route.ts:83
**Current:** `if (!updates || typeof updates !== 'object') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk\route.ts:107
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk-delete\route.ts:13
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk-delete\route.ts:23
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk-delete\route.ts:53
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\route.ts:13
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\route.ts:23
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\route.ts:48
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\route.ts:85
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\route.ts:95
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\route.ts:119
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\route.ts:136
**Current:** `if (!question_text || !question_type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\share\route.ts:13
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\share\route.ts:23
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\share\route.ts:43
**Current:** `if (!sharingLevel) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\share\route.ts:65
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:13
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:23
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:49
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:60
**Current:** `if (!question) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:78
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:88
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:113
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:126
**Current:** `if (!existingQuestion) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:143
**Current:** `if (!question_text || !question_type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:176
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:186
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:211
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:224
**Current:** `if (!existingQuestion) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\route.ts:27
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\route.ts:50
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\route.ts:61
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\route.ts:68
**Current:** `if (!name) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\route.ts:103
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\route.ts:114
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\route.ts:9
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\route.ts:19
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\route.ts:47
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\route.ts:54
**Current:** `if (!name || !description || !question_type || !template_data) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\route.ts:64
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\copy\route.ts:12
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\copy\route.ts:19
**Current:** `if (!questionBankId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\copy\route.ts:29
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\copy\route.ts:44
**Current:** `if (!template) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\copy\route.ts:56
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\route.ts:12
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\route.ts:22
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\route.ts:37
**Current:** `if (!template) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\route.ts:55
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\route.ts:70
**Current:** `if (!template) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\route.ts:99
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\route.ts:111
**Current:** `if (!template) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\copy\route.ts:13
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\copy\route.ts:23
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\copy\route.ts:52
**Current:** `if (!question) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\copy\route.ts:69
**Current:** `if (!userQuestionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\copy-to-course\route.ts:13
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\copy-to-course\route.ts:23
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\copy-to-course\route.ts:31
**Current:** `if (!courseId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\copy-to-course\route.ts:59
**Current:** `if (!question) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\copy-to-course\route.ts:76
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\copy-to-course\route.ts:103
**Current:** `if (!courseQuestionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\rate\route.ts:13
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\rate\route.ts:21
**Current:** `if (!rating || rating < 1 || rating > 5) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\rate\route.ts:45
**Current:** `if (!question) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\quizzes\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\quizzes\route.ts:18
**Current:** `if (!session.user.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\discount\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\discount\route.ts:17
**Current:** `if (!session.user.role || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\discount\route.ts:29
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\discount\route.ts:46
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\discount\route.ts:67
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\discount\route.ts:74
**Current:** `if (!session.user.role || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\discount\route.ts:125
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\payment-approval\route.ts:11
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\payment-approval\route.ts:29
**Current:** `if (!institutionUser || !institutionUser.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\payment-approval\route.ts:41
**Current:** `if (!adminSettings) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\route.ts:9
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\route.ts:21
**Current:** `if (!institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\route.ts:51
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\route.ts:76
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\route.ts:83
**Current:** `if (!institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\setup\route.ts:10
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\setup\route.ts:31
**Current:** `if (!name || !email || !description || !country || !city || !address) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\setup\route.ts:44
**Current:** `if (!user || !user.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:20
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\stats\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\stats\route.ts:26
**Current:** `if (!institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\students\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\students\route.ts:30
**Current:** `if (!user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\students\[id]\route.ts:12
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\students\[id]\route.ts:49
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\billing-history\route.ts:9
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\billing-history\route.ts:18
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\billing-history\route.ts:27
**Current:** `if (!subscription) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\payment\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\payment\route.ts:18
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\payment\route.ts:34
**Current:** `if (!plan) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:19
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:39
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:102
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:110
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:161
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:169
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:176
**Current:** `if (!action) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:248
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:256
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\upgrade\route.ts:11
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\upgrade\route.ts:31
**Current:** `if (!currentSubscription || currentSubscription.status !== 'ACTIVE') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscriptions\cancel\route.ts:11
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscriptions\cancel\route.ts:21
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscriptions\route.ts:11
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscriptions\route.ts:21
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscriptions\route.ts:52
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscriptions\route.ts:72
**Current:** `if (!user?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\upload\route.ts:12
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\upload\route.ts:22
**Current:** `if (!file || !type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\upload\route.ts:45
**Current:** `if (!formInstitutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\upload\route.ts:53
**Current:** `if (!session.user.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\upload\route.ts:67
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\upload\route.ts:127
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\upload\route.ts:134
**Current:** `if (!imageUrl) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\upload\route.ts:150
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\approval\route.ts:13
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\approval\route.ts:33
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\approve\route.ts:12
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\approve\route.ts:19
**Current:** `if (!id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\approve\route.ts:29
**Current:** `if (!currentInstitution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\approve\route.ts:80
**Current:** `if (!verifiedInstitution?.isApproved) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:80
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:85
**Current:** `if (!isInstitutionUser && !isAdmin) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:86
**Current:** `if (!institution.isApproved || institution.status !== 'ACTIVE') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:144
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:155
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:261
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\upload\route.ts:18
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\upload\route.ts:26
**Current:** `if (!file || !type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\upload\route.ts:77
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\upload\route.ts:109
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\upload\route.ts:116
**Current:** `if (!imageUrl) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\upload\route.ts:139
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\locations\route.ts:47
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\locations\route.ts:61
**Current:** `if (!countryCode) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\locations\route.ts:67
**Current:** `if (!countryCode || !stateCode) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\preferences\route.ts:9
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\preferences\route.ts:76
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\preferences\route.ts:134
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\route.ts:9
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\route.ts:86
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\send\route.ts:17
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\send\route.ts:35
**Current:** `if (!title || !body) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\send\route.ts:170
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\subscribe\route.ts:16
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\subscribe\route.ts:22
**Current:** `if (!endpoint || !keys) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\subscribe\route.ts:98
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\unsubscribe\route.ts:8
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\unsubscribe\route.ts:14
**Current:** `if (!endpoint) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\revalidate\route.ts:10
**Current:** `if (!path) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\search\route.ts:116
**Current:** `if (!query || typeof query !== 'string') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\route.ts:97
**Current:** `if (!acc[payment.enrollmentId]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\enroll\route.ts:22
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\enroll\route.ts:43
**Current:** `if (!courseCheck) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\enroll\route.ts:91
**Current:** `if (!course?.maxStudents || !course?.base_price) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\enroll\route.ts:105
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\enroll\route.ts:108
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\enroll\route.ts:126
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\quizzes\[quizId]\attempts\route.ts:12
**Current:** `if (!session || session.user.role !== 'STUDENT') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\quizzes\[quizId]\attempts\route.ts:31
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\quizzes\[quizId]\start\route.ts:15
**Current:** `if (!session || session.user.role !== 'STUDENT') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\quizzes\[quizId]\start\route.ts:36
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\quizzes\[quizId]\start\route.ts:48
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\quizzes\[quizId]\submit\route.ts:13
**Current:** `if (!session || session.user.role !== 'STUDENT') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\quizzes\[quizId]\submit\route.ts:29
**Current:** `if (!attempt) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\quizzes\[quizId]\submit\route.ts:48
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\quizzes\[quizId]\submit\route.ts:67
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\route.ts:46
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\route.ts:78
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\payment\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\payment\route.ts:28
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\route.ts:29
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\achievements\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\achievements\route.ts:19
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\courses\route.ts:10
**Current:** `if (!session?.user?.email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\courses\route.ts:19
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\quiz-stats\route.ts:9
**Current:** `if (!session || session.user.role !== 'STUDENT') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\recent-modules\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\recent-modules\route.ts:19
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:15
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:24
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\stats\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\stats\route.ts:19
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:26
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:39
**Current:** `if (!courseId || !startDate || !endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:57
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:140
**Current:** `if (!weeklyPrices || weeklyPrices.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:144
**Current:** `if (!course.base_price || course.base_price <= 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:169
**Current:** `if (!weeklyPrice) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:202
**Current:** `if (!monthlyPrices || monthlyPrices.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:206
**Current:** `if (!course.base_price || course.base_price <= 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:230
**Current:** `if (!course.base_price || course.base_price <= 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:250
**Current:** `if (!course.base_price || course.base_price <= 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:264
**Current:** `if (!totalPrice || totalPrice <= 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\route.ts:19
**Current:** `if (!courseId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\route.ts:34
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\route.ts:79
**Current:** `if (!priceResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\exercises\[exerciseId]\submit\route.ts:13
**Current:** `if (!session || session.user.role !== 'STUDENT') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\exercises\[exerciseId]\submit\route.ts:36
**Current:** `if (!exercise) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\exercises\[exerciseId]\submit\route.ts:48
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\exercises\[exerciseId]\submit\route.ts:74
**Current:** `if (!existingProgress) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\learning-path\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\learning-path\route.ts:22
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\learning-path\route.ts:111
**Current:** `if (!previousProgress || !previousProgress.contentCompleted || !previousProgress.exercisesCompleted || !previousProgress.quizCompleted) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\notifications\route.ts:96
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\notifications\route.ts:108
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\notifications\route.ts:122
**Current:** `if (!preferences) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\notifications\route.ts:144
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\notifications\route.ts:186
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\payments\initiate\route.ts:11
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\payments\initiate\route.ts:35
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\payments\initiate\route.ts:54
**Current:** `if (!booking) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\payments\process\[paymentId]\route.ts:15
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\payments\process\[paymentId]\route.ts:35
**Current:** `if (!payment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\payments\process\[paymentId]\route.ts:155
**Current:** `if (!validation.isValid) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\profile\password\route.ts:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\profile\password\route.ts:23
**Current:** `if (!currentPassword || !newPassword) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\profile\password\route.ts:35
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\profile\password\route.ts:41
**Current:** `if (!isPasswordValid) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\profile\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\profile\route.ts:37
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\profile\route.ts:122
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\profile\route.ts:134
**Current:** `if (!name || !email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress\route.ts:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:23
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:41
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:58
**Current:** `if (!quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:75
**Current:** `if (!attempt) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:115
**Current:** `if (!question) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:204
**Current:** `if (!shouldContinue) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:254
**Current:** `if (!nextQuestion) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\recommendations\route.ts:9
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\billing-history\route.ts:9
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\billing-history\route.ts:19
**Current:** `if (!user?.student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\billing-history\route.ts:30
**Current:** `if (!subscription) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\payment\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\payment\route.ts:18
**Current:** `if (!user?.student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\payment\route.ts:34
**Current:** `if (!plan) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:11
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:21
**Current:** `if (!user?.student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:45
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:54
**Current:** `if (!user?.student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:80
**Current:** `if (!plan) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:168
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:177
**Current:** `if (!user?.student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:184
**Current:** `if (!action) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:195
**Current:** `if (!currentSubscription) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:359
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:368
**Current:** `if (!user?.student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:379
**Current:** `if (!subscription) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\upgrade\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\upgrade\route.ts:27
**Current:** `if (!user?.student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\upgrade\route.ts:38
**Current:** `if (!currentSubscription) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\subscriptions\create\route.ts:9
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\subscriptions\create\route.ts:17
**Current:** `if (!planId || price === undefined || !paymentMethod) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\analytics\route.ts:9
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\route.ts:17
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\route.ts:170
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\route.ts:175
**Current:** `if (!name) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\route.ts:197
**Current:** `if (!parentTag) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\[id]\route.ts:23
**Current:** `if (!tag) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\[id]\route.ts:46
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\[id]\route.ts:51
**Current:** `if (!name) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\[id]\route.ts:60
**Current:** `if (!existingTag) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\[id]\route.ts:92
**Current:** `if (!parentTag) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\[id]\route.ts:146
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\[id]\route.ts:163
**Current:** `if (!tag) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\user\settings\route.ts:12
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\user\settings\route.ts:40
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\user\settings\route.ts:62
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\user\settings\route.ts:73
**Current:** `if (!name || !email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\user\settings\route.ts:109
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\user\settings\route.ts:117
**Current:** `if (!isValidPassword) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\webhooks\stripe\route.ts:7
**Current:** `if (!process.env.STRIPE_SECRET_KEY) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\webhooks\stripe\route.ts:11
**Current:** `if (!process.env.STRIPE_WEBHOOK_SECRET) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\webhooks\stripe\route.ts:24
**Current:** `if (!signature) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\enhanced\page.tsx:351
**Current:** `if (!formData.password) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\enhanced\page.tsx:365
**Current:** `if (!formData.selectedPlan) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\enhanced\page.tsx:408
**Current:** `if (!formData.password) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\enhanced\page.tsx:413
**Current:** `if (!formData.selectedPlan) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\enhanced\page.tsx:449
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\institution\page.tsx:99
**Current:** `if (!selectedCountry) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\institution\page.tsx:107
**Current:** `if (!selectedState) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\institution\page.tsx:112
**Current:** `if (!selectedCity) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\institution\page.tsx:150
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\page.tsx:37
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\signup\page.tsx:38
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\awaiting-approval\page.tsx:19
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\awaiting-approval\page.tsx:68
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\bookings\success\page.tsx:35
**Current:** `if (!sessionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\bookings\success\page.tsx:46
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\bookings\success\page.tsx:72
**Current:** `if (!booking) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\checkout\page.tsx:34
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\checkout\page.tsx:84
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\checkout\page.tsx:112
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\checkout\page.tsx:116
**Current:** `if (!planData) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\content\ContentCreator.tsx:111
**Current:** `if (!fileType) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\content\ContentCreator.tsx:143
**Current:** `if (!moduleId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\institution\EnrollmentStatusCard.tsx:89
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\institution\MarkPaymentDialog.tsx:70
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\institution\PayoutDialog.tsx:58
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\EnrollmentModal.tsx:38
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\EnrollmentModal.tsx:71
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\LearningPath.tsx:165
**Current:** `if (!data) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\NotificationPreferences.tsx:124
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\NotificationPreferences.tsx:161
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\PaymentForm.tsx:21
**Current:** `if (!stripe || !elements) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\ProgressVisualization.tsx:147
**Current:** `if (!data) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\courses\[id]\page.tsx:77
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\dashboard\page.tsx:13
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\forgot-password\page.tsx:29
**Current:** `if (!email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\hooks\useCurrency.ts:32
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\hooks\useInstitution.ts:20
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\hooks\useInstitution.ts:27
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\analytics\InstitutionAnalyticsClient.tsx:76
**Current:** `if (!session || session.user?.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\analytics\page.tsx:9
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\analytics\quiz-analytics\page.tsx:106
**Current:** `if (!analytics) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\collaboration\page.tsx:98
**Current:** `if (!stats) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\add\page.tsx:41
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\CourseForm.tsx:259
**Current:** `if (!formData.categoryId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\CourseForm.tsx:264
**Current:** `if (!formData.framework) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\CourseForm.tsx:269
**Current:** `if (!formData.level) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\CourseForm.tsx:274
**Current:** `if (!formData.startDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\CourseForm.tsx:279
**Current:** `if (!formData.endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\CourseForm.tsx:284
**Current:** `if (!formData.maxStudents) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\CourseForm.tsx:289
**Current:** `if (!formData.base_price) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\CourseForm.tsx:296
**Current:** `if (!selectedCourse && courses) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\InstitutionCourseForm.tsx:106
**Current:** `if (!selectedCourse) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\InstitutionCourseForm.tsx:178
**Current:** `if (!formData.maxStudents) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\MonthlyPricingTable.tsx:96
**Current:** `if (!hasFetched && initialPrices.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\MonthlyPricingTable.tsx:104
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\WeeklyPricingTable.tsx:160
**Current:** `if (!isTableEditable && editableWeeks.size === 0 && !hasBasePriceChanged) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\WeeklyPricingTable.tsx:277
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:164
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:212
**Current:** `if (!institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:257
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:323
**Current:** `if (!open && hasUnsavedChanges) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:327
**Current:** `if (!open) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:391
**Current:** `if (!selectedCourseForSettings) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:832
**Current:** `if (!selectedCourseForSettings) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:854
**Current:** `if (!selectedCourseForSettings) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:1029
**Current:** `if (!selectedCourse) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:1048
**Current:** `if (!open) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:1077
**Current:** `if (!open) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:97
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:158
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:179
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:235
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:294
**Current:** `if (!open) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:324
**Current:** `if (!open) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\enrollments\page.tsx:103
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\new\page.tsx:51
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\new\page.tsx:72
**Current:** `if (!formData.skills || formData.skills.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\new\page.tsx:91
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\page.tsx:49
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\page.tsx:85
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\new\page.tsx:196
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\new\page.tsx:388
**Current:** `if (!exercise.question || !exercise.answer) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\new\page.tsx:414
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\page.tsx:84
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\page.tsx:149
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\page.tsx:306
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\[contentId]\edit\page.tsx:64
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\[contentId]\edit\page.tsx:156
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\[contentId]\edit\page.tsx:178
**Current:** `if (!content) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:68
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:94
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:109
**Current:** `if (!skills || skills.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:128
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:144
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\page.tsx:60
**Current:** `if (!moduleResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\page.tsx:68
**Current:** `if (!quizzesResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\page.tsx:104
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:54
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:85
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:52
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:87
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:65
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:154
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\page.tsx:51
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\page.tsx:87
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:87
**Current:** `if (!quizResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:95
**Current:** `if (!questionResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:242
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:268
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:587
**Current:** `if (!quiz || !question) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\page.tsx:97
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\DashboardClient.tsx:101
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\page.tsx:10
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\page.tsx:311
**Current:** `if (!enrollment || !student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\layout.tsx:19
**Current:** `if (!session?.user || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\layout.tsx:31
**Current:** `if (!institution?.isApproved) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\page.tsx:117
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\page.tsx:172
**Current:** `if (!paymentSettings.allowInstitutionPaymentApproval) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\00institution-profile.tsx:100
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\00institution-profile.tsx:128
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\00institution-profile.tsx:157
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\00institution-profile.tsx:186
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\00institution-profile.tsx:216
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\00institution-profile.tsx:251
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:80
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:220
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:248
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:277
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:311
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:339
**Current:** `if (!formData.country) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:342
**Current:** `if (!formData.state) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:405
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:442
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:470
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:837
**Current:** `if (!showAnalytics && !analytics) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\page.tsx:9
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\page.tsx:363
**Current:** `if (!importFile) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:335
**Current:** `if (!importFile) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:452
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:325
**Current:** `if (!questionBank) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\quizzes\page.tsx:181
**Current:** `if (!selectedCourseForQuiz || !selectedModuleForQuiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\settings\page.tsx:125
**Current:** `if (!session?.user?.role || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\setup\page.tsx:10
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\setup\page.tsx:19
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\setup\page.tsx:46
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:118
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:234
**Current:** `if (!confirmed) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:262
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:308
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:445
**Current:** `if (!open) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution-registration\page.tsx:150
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institutions\[id]\page.tsx:43
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\invoice-handlers.ts:9
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\invoice-handlers.ts:25
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\migrations\commission-setup.ts:19
**Current:** `if (!existingCommission) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\migrations\commission-setup.ts:95
**Current:** `if (!existingPayout) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\payment-service.ts:5
**Current:** `if (!process.env.STRIPE_SECRET_KEY) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\payment-service.ts:39
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\payment-service.ts:84
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\reminder-scheduler.ts:83
**Current:** `if (!existingReminder) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\mobile-testing\page.tsx:160
**Current:** `if (!isClient) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\reset-password\page.tsx:44
**Current:** `if (!data.forcePasswordReset) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\reset-password\page.tsx:227
**Current:** `if (!token || !email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\settings\page.tsx:59
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\settings\page.tsx:85
**Current:** `if (!formData.currentPassword) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\settings\page.tsx:109
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\EnrollmentModal.tsx:162
**Current:** `if (!isOpen) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\EnrollmentModal.tsx:321
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\PayCourseButton.tsx:66
**Current:** `if (!session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\PayCourseButton.tsx:71
**Current:** `if (!selectedPaymentMethod) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\PayCourseButton.tsx:95
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\payment\success\page.tsx:11
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\payment\success\page.tsx:34
**Current:** `if (!payment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\modules\[moduleId]\page.tsx:209
**Current:** `if (!module || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\page.tsx:130
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\payment\page.tsx:11
**Current:** `if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\payment\page.tsx:31
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\payment\page.tsx:45
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\payment\page.tsx:85
**Current:** `if (!paymentData) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\layout.tsx:15
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\payments\history\page.tsx:13
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\payments\page.tsx:16
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\payments\process\[paymentId]\page.tsx:20
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\payments\process\[paymentId]\page.tsx:49
**Current:** `if (!payment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\profile\page.tsx:92
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\profile\page.tsx:126
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\settings\page.tsx:50
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\settings\page.tsx:83
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\settings\page.tsx:118
**Current:** `if (!profile) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\subscription-signup\page.tsx:263
**Current:** `if (!selectedPlan || !session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\subscription-signup\page.tsx:271
**Current:** `if (!plan) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\subscription-signup\page.tsx:291
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\subscription-signup\page.tsx:310
**Current:** `if (!plan) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\course-categories.tsx:73
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\course-categories.tsx:107
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\CourseForm.tsx:123
**Current:** `if (!data.categoryId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\CourseForm.tsx:126
**Current:** `if (!data.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\CourseForm.tsx:138
**Current:** `if (!data.startDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\CourseForm.tsx:141
**Current:** `if (!data.endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\layout.tsx:38
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\layout.tsx:65
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\page.tsx:177
**Current:** `if (!data) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\AdminNotificationAnalytics.tsx:120
**Current:** `if (!chartsLoaded || !ChartComponents) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\categories\AddCategoryDialog.tsx:54
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\categories\EditCategoryDialog.tsx:72
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\Sidebar.tsx:118
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ClientOnlyAdvancedMobileDashboard.tsx:22
**Current:** `if (!isClient || !AdvancedMobileDashboard) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CourseSearch.tsx:71
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CourseTagManager.tsx:55
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CourseTagManager.tsx:132
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\DiscountSettingsForm.tsx:40
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\DiscountSettingsForm.tsx:67
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\EnhancedCourseCard.tsx:128
**Current:** `if (!course.priorityScore) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:77
**Current:** `if (!formData.country) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:80
**Current:** `if (!formData.state) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:83
**Current:** `if (!formData.city) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:220
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:246
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:283
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:445
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionSubscriptionCard.tsx:224
**Current:** `if (!subscriptionData) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\LeadTracking.tsx:127
**Current:** `if (!showAnalytics) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\LeadTracking.tsx:143
**Current:** `if (!analytics) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MainNav.tsx:41
**Current:** `if (!session?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MobileTestingInterface.tsx:133
**Current:** `if (!testReport) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MonthlyPricingTable.tsx:161
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MonthlyPricingTable.tsx:225
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MonthlyPricingTable.tsx:265
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\OfflineDataManager.tsx:68
**Current:** `if (!isOnline) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\OptimizedImage.tsx:41
**Current:** `if (!src) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\PaymentForm.tsx:63
**Current:** `if (!cardNumber || !expiryDate || !cvv || !cardholderName) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\providers\InstitutionProvider.tsx:35
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ServiceWorkerProvider.tsx:143
**Current:** `if (!isOnline) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\AdvancedQuizInterface.tsx:188
**Current:** `if (!multipleAnswers[currentQuestion.id]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\NotificationPreferences.tsx:101
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\NotificationPreferences.tsx:131
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\PaymentForm.tsx:25
**Current:** `if (!stripe || !elements) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\QuizInterface.tsx:144
**Current:** `if (!startAttemptCalledRef && !attempt && !loading && !error) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\QuizInterface.tsx:237
**Current:** `if (!attempt) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\StudentSubscriptionCard.tsx:224
**Current:** `if (!subscriptionData) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\StudentSubscriptionCard.tsx:175
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\StudentSubscriptionCard.tsx:223
**Current:** `if (!subscription) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionManagementCard.tsx:176
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionManagementCard.tsx:198
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionManagementCard.tsx:247
**Current:** `if (!subscription) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionOverviewCard.tsx:105
**Current:** `if (!subscription || !subscription.planType) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionPaymentForm.tsx:42
**Current:** `if (!stripe || !elements) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ui\dialog.tsx:135
**Current:** `if (!newOpen && hasUnsavedChanges && !isSubmitting && !isFormSubmitting) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ui\icon-picker.tsx:80
**Current:** `if (!newOpen) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ui\password-input.tsx:17
**Current:** `if (!value) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ui\rating.tsx:23
**Current:** `if (!disabled) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ui\rating.tsx:29
**Current:** `if (!disabled) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ui\rating.tsx:35
**Current:** `if (!disabled && onChange) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useServiceWorker.ts:121
**Current:** `if (!state.registration) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useServiceWorker.ts:126
**Current:** `if (!permission) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useServiceWorker.ts:152
**Current:** `if (!state.registration) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useServiceWorker.ts:176
**Current:** `if (!state.registration) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useServiceWorker.ts:261
**Current:** `if (!isSupported) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\advanced-caching.ts:52
**Current:** `if (!AdvancedCaching.instance) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\advanced-caching.ts:157
**Current:** `} else if (!this.isProcessingQueue) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\api-optimizer.ts:22
**Current:** `if (!APIOptimizer.instance) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\audit-logger.ts:36
**Current:** `if (!AuditLogger.instance) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\auth.ts:33
**Current:** `if (!credentials?.email || !credentials?.password) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\auth.ts:46
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\auth.ts:55
**Current:** `if (!isPasswordValid) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\automated-commission-service.ts:58
**Current:** `if (!payment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\automated-commission-service.ts:69
**Current:** `if (!subscription || subscription.status !== 'ACTIVE') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\automated-commission-service.ts:78
**Current:** `if (!commissionTier) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\automated-commission-service.ts:195
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\background-sync.ts:109
**Current:** `if (!BackgroundSync.instance) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\background-sync.ts:230
**Current:** `if (!this.isSyncing) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\background-sync.ts:382
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\background-sync.ts:418
**Current:** `if (!this.isSyncing) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\background-sync.ts:446
**Current:** `if (!dependency) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\cache-utils.ts:16
**Current:** `if (!Cache.instance) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\cache-utils.ts:65
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\cache.ts:19
**Current:** `if (!item) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\cdn-optimizer.ts:43
**Current:** `if (!this.config.domain) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\cdn-optimizer.ts:65
**Current:** `if (!this.config.domain || !this.config.imageOptimization) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\cdn-optimizer.ts:184
**Current:** `if (!this.config.apiKey || !this.config.zoneId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\constants\payment-config.ts:74
**Current:** `if (!settings.ALLOW_INSTITUTION_PAYMENT_APPROVAL) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\constants\payment-config.ts:84
**Current:** `if (!paymentMethod) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\constants\payment-config.ts:96
**Current:** `if (!paymentMethod) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\content-access.ts:36
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\content-access.ts:51
**Current:** `if (!enrollment.hasContentAccess) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\content-preloader.ts:80
**Current:** `if (!ContentPreloader.instance) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\content-preloader.ts:202
**Current:** `if (!this.isPreloading) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\content-preloader.ts:245
**Current:** `if (!strategy.enabled) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\content-preloader.ts:294
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\email.ts:19
**Current:** `if (!EmailService.instance) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\email.ts:58
**Current:** `if (!host || !user || !pass) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\email.ts:85
**Current:** `if (!this.transporter) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\encryption.ts:32
**Current:** `if (!EncryptionService.instance) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\enhanced-cache.ts:19
**Current:** `if (!entry) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\enhanced-database-optimizer.ts:71
**Current:** `if (!options.forceRefresh) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\enrollment\state-manager.ts:115
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\enrollment\state-manager.ts:151
**Current:** `if (!payment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\enrollment\state-manager.ts:187
**Current:** `if (!booking) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\load-balancer.ts:243
**Current:** `if (!server || server.health !== 'healthy' || !server.isActive) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\load-balancer.ts:460
**Current:** `if (!server) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\logger.ts:92
**Current:** `if (!this.isDevelopment && level >= LogLevel.ERROR) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:33
**Current:** `if (!student?.user || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:85
**Current:** `if (!student?.user || !quiz || !module || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:127
**Current:** `if (!student?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:172
**Current:** `if (!student?.user || !module || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:210
**Current:** `if (!student?.user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:248
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:288
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:324
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-scheduler.ts:241
**Current:** `if (!lastReminder) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:29
**Current:** `if (!NotificationService.instance) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:51
**Current:** `if (!template) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:60
**Current:** `if (!recipient) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-analytics.ts:79
**Current:** `if (!OfflineAnalytics.instance) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-analytics.ts:311
**Current:** `if (!success) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-analytics.ts:484
**Current:** `if (!sessionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-storage.ts:331
**Current:** `if (!this.db) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\manual-payment.ts:31
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\manual-payment.ts:119
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\reminder-scheduler.ts:75
**Current:** `if (!existingReminder) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\service.ts:29
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:31
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:102
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:116
**Current:** `if (!student || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:164
**Current:** `if (!enrollment || !course || !institution || !student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:243
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:260
**Current:** `if (!student || !course || !institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\performance-integration.ts:347
**Current:** `if (!this.config.cdn.enabled) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\performance-integration.ts:356
**Current:** `if (!this.config.cdn.enabled) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\performance-monitor.ts:103
**Current:** `if (!entry.hadRecentInput) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\performance-monitor.ts:244
**Current:** `if (!sessionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\permissions.ts:44
**Current:** `if (!permissions) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\permissions.ts:105
**Current:** `if (!user?.institution?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\prisma.ts:15
**Current:** `if (!global.prisma) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\prisma.ts:24
**Current:** `if (!prisma) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:81
**Current:** `if (!PushNotificationService.instance) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:123
**Current:** `if (!this.registration) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:128
**Current:** `if (!permission) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:155
**Current:** `if (!this.subscription) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:178
**Current:** `if (!this.registration) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:235
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:255
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:272
**Current:** `if (!this.registration) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\rate-limiter.ts:31
**Current:** `if (!RateLimiter.instance) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\rate-limiter.ts:53
**Current:** `if (!config) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\rate-limiter.ts:117
**Current:** `if (!current || current.resetTime <= now) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\rate-limiter.ts:318
**Current:** `if (!allowed) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\react-optimizer.tsx:296
**Current:** `if (!response.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\redis-cache.ts:79
**Current:** `if (!this.redisDisabled) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\redis-cache.ts:86
**Current:** `if (!this.redisDisabled) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\redis-cache.ts:93
**Current:** `if (!this.redisDisabled) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\redis-cache.ts:103
**Current:** `if (!this.redisDisabled) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:93
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:130
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:214
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:281
**Current:** `if (!plan) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:389
**Current:** `if (!currentSubscription || currentSubscription.status !== 'ACTIVE') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:405
**Current:** `if (!newPlan) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:470
**Current:** `if (!subscription || subscription.status !== 'ACTIVE') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:525
**Current:** `if (!subscription || subscription.status !== 'CANCELLED') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:592
**Current:** `if (!subscription) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:634
**Current:** `if (!subscription) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:895
**Current:** `if (!institution?.subscription || institution.subscription.status !== 'ACTIVE') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:954
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:963
**Current:** `if (!expiredTrial) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:1038
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-payment-service.ts:7
**Current:** `if (!process.env.STRIPE_SECRET_KEY) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-payment-service.ts:52
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-payment-service.ts:58
**Current:** `if (!customerId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-payment-service.ts:122
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-payment-service.ts:128
**Current:** `if (!customerId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-payment-service.ts:317
**Current:** `if (!plan) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\validation\booking-payment-validator.ts:60
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\validation\booking-payment-validator.ts:119
**Current:** `if (!booking) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\validation\booking-payment-validator.ts:233
**Current:** `if (!booking) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\validation\booking-payment-validator.ts:239
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\validation\booking-payment-validator.ts:245
**Current:** `if (!payment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\websocket.ts:21
**Current:** `if (!WebSocketService.instance) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\websocket.ts:109
**Current:** `if (!this.io) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\websocket.ts:115
**Current:** `if (!userSockets || userSockets.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\websocket.ts:127
**Current:** `if (!this.io) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\websocket.ts:138
**Current:** `if (!this.io) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\websocket.ts:149
**Current:** `if (!this.io) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\middleware.ts:40
**Current:** `if (!token) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\middleware.ts:49
**Current:** `if (!token) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\middleware.ts:63
**Current:** `if (!token) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\prisma\seed.ts:521
**Current:** `if (!existingProgress) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\add-language-categories.ts:231
**Current:** `if (!existingCategory) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\audit-fix-booking-payment-consistency.ts:24
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\audit-fix-booking-payment-consistency.ts:35
**Current:** `if (!latestPayment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-approval-settings.ts:111
**Current:** `if (!canApprove) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-approval-settings.ts:112
**Current:** `if (!adminSettings?.allowInstitutionPaymentApproval) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-email-settings.ts:13
**Current:** `if (!emailSettings) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-email-settings.ts:92
**Current:** `if (!emailSettings.fromEmail || !emailSettings.username || !emailSettings.password) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-payment-statuses.ts:24
**Current:** `if (!acc[status]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\cleanup-duplicates.ts:20
**Current:** `if (!acc[key]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\cleanup-orphaned-records.ts:66
**Current:** `if (!dryRun) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\cleanup-orphaned-records.ts:122
**Current:** `if (!dryRun) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\cleanup-orphaned-records.ts:148
**Current:** `if (!dryRun) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\cleanup-orphaned-records.ts:170
**Current:** `if (!dryRun) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\cleanup-orphaned-records.ts:192
**Current:** `if (!dryRun) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\cleanup-orphaned-records.ts:207
**Current:** `if (!acc[record.type]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\cleanup-sample-data.ts:142
**Current:** `if (!result.success) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\create-course.js:28
**Current:** `if (!courseResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\create-course.js:43
**Current:** `if (!tagsResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\create-course.js:55
**Current:** `if (!webDevTag || !programmingTag) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\create-course.js:73
**Current:** `if (!r.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\create-course.js:89
**Current:** `if (!process.env.ADMIN_TOKEN) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\create-e2e-test-users.ts:65
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\create-sample-subscriptions.ts:16
**Current:** `if (!institutionUser?.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\create-test-adaptive-quiz.ts:17
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\create-test-adaptive-quiz.ts:23
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-booking-payment-inconsistency.ts:45
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-booking-payment-inconsistency.ts:149
**Current:** `if (!booking) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-common-errors.ts:127
**Current:** `if (!acc[error.pattern.severity]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-empty-commission-tier-ids.ts:13
**Current:** `if (!starterTier) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-empty-student-tier-ids.ts:13
**Current:** `if (!basicTier) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-ionos-smtp.ts:14
**Current:** `if (!emailSettings) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-missing-student-records.ts:34
**Current:** `if (!existingStudent) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-missing-student-records.ts:85
**Current:** `if (!student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-notification-templates.ts:20
**Current:** `if (!anyUser) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-notification-templates.ts:48
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-specific-booking.ts:18
**Current:** `if (!booking) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-specific-booking.ts:48
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-specific-booking.ts:61
**Current:** `if (!latestPayment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\manage-payment-approval-transition.ts:29
**Current:** `if (!adminSettings) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\manage-payment-approval-transition.ts:83
**Current:** `if (!adminSettings.allowInstitutionPaymentApproval) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\manage-payment-approval-transition.ts:167
**Current:** `if (!acc[payment.institutionName]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\migrate-institution-subscriptions-to-plans.ts:45
**Current:** `if (!plan) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\migrate-legacy-categories.ts:123
**Current:** `if (!targetCategory) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\migrate-legacy-categories.ts:221
**Current:** `if (!acc[categoryName]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\reassign-orphaned-modules.ts:24
**Current:** `if (!acc[m.course_id]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\reassign-orphaned-modules.ts:112
**Current:** `if (!acc[module.course_id]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\reassign-orphaned-modules.ts:166
**Current:** `if (!dryRun) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\recover-deleted-records.ts:24
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\recover-deleted-records.ts:60
**Current:** `if (!payment && enrollment.paymentStatus !== 'PENDING') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\recover-deleted-records.ts:96
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-mobile-tests.ts:152
**Current:** `if (!this.config.parallel) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-mobile-tests.ts:241
**Current:** `if (!groups[device]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\scan-errors.ts:256
**Current:** `if (!acc[result.pattern.severity]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\scan-errors.ts:265
**Current:** `if (!acc[result.pattern.category]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\scan-errors.ts:289
**Current:** `if (!acc[result.pattern.name]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\seed-categories.ts:109
**Current:** `if (!existingCategory) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\seed-modules.ts:15
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\seed-tags.ts:271
**Current:** `if (!existingCourse) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\setup-default-permissions.ts:19
**Current:** `if (!existingPermissions) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-admin-email.ts:13
**Current:** `if (!emailSettings) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-admin-settings-auth.ts:16
**Current:** `if (!adminUser) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-analytics-fix.ts:33
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-auth-request.ts:23
**Current:** `if (!admin1) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-course-modules.ts:22
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-login.ts:15
**Current:** `if (!admin1) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-login.ts:31
**Current:** `if (!admin2) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-notifications.ts:39
**Current:** `if (!testUser) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-password-hash.ts:23
**Current:** `if (!admin1) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-password-hash.ts:59
**Current:** `if (!admin2) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-quiz-api.ts:18
**Current:** `if (!institutionUser) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-quiz-api.ts:53
**Current:** `if (!institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-quiz-api.ts:77
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-quiz-api.ts:80
**Current:** `if (!category) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-quiz-api.ts:119
**Current:** `if (!module) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-subscription-plans.ts:106
**Current:** `if (!sub.subscriptionPlan) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\update-categories.ts:139
**Current:** `if (!coursesUsingCategory) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\update-payment-settings.ts:15
**Current:** `if (!adminSettings) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\verify-booking-payment-status.ts:18
**Current:** `if (!booking) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\verify-booking-payment-status.ts:40
**Current:** `if (!enrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\verify-booking-payment-status.ts:99
**Current:** `if (!isBookingConsistent || !isEnrollmentConsistent) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\debug-homepage.spec.ts:57
**Current:** `if (!bodyVisibleAfterWait) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\global-setup.ts:244
**Current:** `if (!existingStudent) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\global-setup.ts:320
**Current:** `if (!institution || !category) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\global-setup.ts:386
**Current:** `if (!existingEnrollment) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\global-setup.ts:417
**Current:** `if (!admin || !student || !institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\global-setup.ts:426
**Current:** `if (!studentProfile) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\global-setup.ts:435
**Current:** `if (!testInstitution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\global-setup.ts:444
**Current:** `if (!testCourse) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\password-test.spec.ts:16
**Current:** `if (!user) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\quick-homepage.spec.ts:38
**Current:** `if (!bodyVisible) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\global-teardown.ts:95
**Current:** `if (!groups[device]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\integration\auth.test.ts:49
**Current:** `if (!existingUser) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\integration\setup.ts:95
**Current:** `if (!institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\integration\setup.ts:114
**Current:** `if (!adminUser) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\integration\setup.ts:130
**Current:** `if (!category) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\integration\setup.ts:144
**Current:** `if (!course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-device-testing.ts:298
**Current:** `if (!this.currentDevice) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-device-testing.ts:307
**Current:** `if (!viewport) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-device-testing.ts:381
**Current:** `if (!this.currentDevice) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-device-testing.ts:388
**Current:** `if (!device.touchSupport) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-device-testing.ts:459
**Current:** `if (!this.currentDevice) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-device-testing.ts:475
**Current:** `if (!registration) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-device-testing.ts:533
**Current:** `if (!this.currentDevice) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-device-testing.ts:598
**Current:** `if (!this.currentDevice) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-device-testing.ts:721
**Current:** `if (!groups[deviceName]) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\performance\load-test-processor.js:97
**Current:** `if (!context.vars.metrics) {`
## Fallback values that might mask issues
**Found in 2468 locations:**

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\components\CourseForm.tsx:140
**Current:** `if (!data.base_price || isNaN(Number(data.base_price)) || Number(data.base_price) < 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\components\CourseForm.tsx:143
**Current:** `if (!data.duration || isNaN(Number(data.duration)) || Number(data.duration) <= 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\components\CourseForm.tsx:146
**Current:** `if (!data.maxStudents || isNaN(Number(data.maxStudents)) || Number(data.maxStudents) <= 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\components\CourseForm.tsx:461
**Current:** `<SelectValue>{frameworkInfo.label || 'Select framework'}</SelectValue>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\components\CourseForm.tsx:552
**Current:** `value={formData.priority || '0'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\components\CourseForm.tsx:570
**Current:** `checked={formData.isFeatured || false}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\components\CourseForm.tsx:586
**Current:** `checked={formData.isSponsored || false}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\components\CourseForm.tsx:641
**Current:** `disabled={isSubmitting || Object.keys(errors).length > 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:328
**Current:** `setInstitutions(data.institutions || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:360
**Current:** `const categoriesData = Array.isArray(data) ? data : (data.categories || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:410
**Current:** `setCourses(data.courses || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:517
**Current:** `if (institutionId === 'all' || !institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:521
**Current:** `setSelectedInstitution(institution || null);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:565
**Current:** `setCourses(data.courses || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:608
**Current:** `setCourses(data.courses || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:649
**Current:** `if (!session || session.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:696
**Current:** `if (!institutionsResponse.ok || !categoriesResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:990
**Current:** `if (!course.category || !course.category.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:994
**Current:** `if (!course.institution || !course.institution.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1004
**Current:** `})) || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1010
**Current:** `base_price: course.base_price?.toString() || '0',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1011
**Current:** `pricingPeriod: course.pricingPeriod || 'FULL_COURSE',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1013
**Current:** `framework: course.framework || 'CEFR',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1022
**Current:** `priority: (course.priority || 0).toString(),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1023
**Current:** `isFeatured: course.isFeatured || false,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1024
**Current:** `isSponsored: course.isSponsored || false`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1052
**Current:** `const currentYear = course.weeklyPrices?.[0]?.year || new Date().getFullYear();`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1244
**Current:** `{isLoading || loadingStates.isFetching ? (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1288
**Current:** `<span>{course._count?.bookings || 0} bookings</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1296
**Current:** `backgroundColor: ct.tag.color || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1315
**Current:** `title={`View Enrollments (${course._count?.enrollments || 0})`}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1321
**Current:** `<p>View Enrollments ({course._count?.enrollments || 0})</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1393
**Current:** `backgroundColor: ct.tag.color || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1414
**Current:** `title={`View Enrollments (${course._count?.enrollments || 0})`}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1420
**Current:** `<p>View Enrollments ({course._count?.enrollments || 0})</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1500
**Current:** `open={isAddModalOpen || isEditModalOpen}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1558
**Current:** `initialPrices={selectedCourse.weeklyPrices || []}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1559
**Current:** `basePrice={selectedCourse.base_price || parseFloat(formData.base_price) || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1587
**Current:** `initialPrices={selectedCourse.monthlyPrices || []}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1588
**Current:** `basePrice={selectedCourse.base_price || parseFloat(formData.base_price) || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\enrollments\page.tsx:181
**Current:** `setEnrollments(data.enrollments || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\enrollments\page.tsx:211
**Current:** `status: updateStatus || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\enrollments\page.tsx:212
**Current:** `paymentStatus: updatePaymentStatus || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\enrollments\page.tsx:368
**Current:** `{enrollments.filter(e => e.status === 'ACTIVE' || e.status === 'ENROLLED').length}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\enrollments\page.tsx:381
**Current:** `{enrollments.filter(e => e.paymentStatus === 'COMPLETED' || e.paymentStatus === 'PAID').length}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\page.tsx:271
**Current:** `onChange={(e) => setCreateFormData({ ...createFormData, estimated_duration: parseInt(e.target.value) || 0 })}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\page.tsx:308
**Current:** `{module.description || 'No description'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\page.tsx:131
**Current:** `if (error || !module || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\page.tsx:134
**Current:** `<p className="text-red-500 mb-4">{error || 'Module not found'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\page.tsx:182
**Current:** `<p className="text-muted-foreground">{module.description || 'No description provided'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\page.tsx:288
**Current:** `<Badge variant="outline">Order: {item.order_index || 'N/A'}</Badge>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\page.tsx:313
**Current:** `<Badge variant="outline">Order: {exercise.order_index || 'N/A'}</Badge>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\page.tsx:337
**Current:** `{quiz.description || 'No description'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:149
**Current:** `if (error || !quiz || !module || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:152
**Current:** `<p className="text-red-500 mb-4">{error || 'Quiz not found'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:238
**Current:** `onChange={(e) => updateQuizField('passing_score', parseInt(e.target.value) || 0)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:249
**Current:** `value={quiz.time_limit || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:260
**Current:** `value={quiz.description || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:170
**Current:** `if (error || !quiz || !module || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:173
**Current:** `<p className="text-red-500 mb-4">{error || 'Quiz not found'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:173
**Current:** `if (params.difficulty < -4 || params.difficulty > 4) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:177
**Current:** `if (params.discrimination < 0.1 || params.discrimination > 3) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:181
**Current:** `if (params.guessing < 0 || params.guessing > 1) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:276
**Current:** `type: template.type || prev.type,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:277
**Current:** `question: template.template_config?.question || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:278
**Current:** `points: template.template_config?.points || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:279
**Current:** `options: template.template_config?.options || ['', '', '', ''],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:280
**Current:** `correct_answer: template.template_config?.correct_answer || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:281
**Current:** `explanation: template.template_config?.explanation || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:282
**Current:** `difficulty: template.difficulty || 'MEDIUM',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:283
**Current:** `category: template.category || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:284
**Current:** `hints: template.template_config?.hints || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:285
**Current:** `question_config: template.template_config || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:286
**Current:** `media_url: template.template_config?.media_url || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:287
**Current:** `media_type: template.template_config?.media_type || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:288
**Current:** `question_options: template.template_config?.question_options || []`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:311
**Current:** `difficulty: questionData.irt_difficulty || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:312
**Current:** `discrimination: questionData.irt_discrimination || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:313
**Current:** `guessing: questionData.irt_guessing || 0.25`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:485
**Current:** `value={questionData.question_config?.leftItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:503
**Current:** `value={questionData.question_config?.rightItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:527
**Current:** `value={questionData.question_config?.dragItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:545
**Current:** `value={questionData.question_config?.dropZones?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:599
**Current:** `value={questionData.question_config?.orderItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:653
**Current:** `<span className="font-medium">Difficulty:</span> {questionData.irt_difficulty?.toFixed(2) || '0.00'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:656
**Current:** `<span className="font-medium">Discrimination:</span> {questionData.irt_discrimination?.toFixed(2) || '1.00'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:659
**Current:** `<span className="font-medium">Guessing:</span> {questionData.irt_guessing?.toFixed(2) || '0.25'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:680
**Current:** `value={questionData.irt_difficulty || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:681
**Current:** `onChange={(e) => updateQuestionField('irt_difficulty', parseFloat(e.target.value) || 0)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:697
**Current:** `value={questionData.irt_discrimination || 1}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:698
**Current:** `onChange={(e) => updateQuestionField('irt_discrimination', parseFloat(e.target.value) || 1)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:714
**Current:** `value={questionData.irt_guessing || 0.25}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:715
**Current:** `onChange={(e) => updateQuestionField('irt_guessing', parseFloat(e.target.value) || 0.25)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:744
**Current:** `if (error || !quiz || !module || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:747
**Current:** `<p className="text-red-500 mb-4">{error || 'Quiz not found'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:854
**Current:** `onChange={(e) => updateQuestionField('points', parseInt(e.target.value) || 1)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:174
**Current:** `if (params.difficulty < -4 || params.difficulty > 4) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:178
**Current:** `if (params.discrimination < 0.1 || params.discrimination > 3) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:182
**Current:** `if (params.guessing < 0 || params.guessing > 1) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:270
**Current:** `correct_answer: questionData.correct_answer || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:271
**Current:** `explanation: questionData.explanation || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:272
**Current:** `difficulty: questionData.difficulty || 'MEDIUM',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:273
**Current:** `category: questionData.category || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:274
**Current:** `hints: questionData.hints || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:275
**Current:** `question_config: questionData.question_config || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:276
**Current:** `media_url: questionData.media_url || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:277
**Current:** `media_type: questionData.media_type || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:278
**Current:** `question_options: questionData.questionOptions || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:279
**Current:** `irt_difficulty: questionData.irt_difficulty || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:280
**Current:** `irt_discrimination: questionData.irt_discrimination || 1.0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:281
**Current:** `irt_guessing: questionData.irt_guessing || 0.25,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:282
**Current:** `use_manual_irt: questionData.use_manual_irt || false`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:523
**Current:** `value={formData.question_config?.leftItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:541
**Current:** `value={formData.question_config?.rightItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:566
**Current:** `value={formData.question_config?.dragItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:584
**Current:** `value={formData.question_config?.dropZones?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:638
**Current:** `value={formData.question_config?.orderItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:669
**Current:** `if (!quiz || !module || !course || !question) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:784
**Current:** `onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 1 })}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:850
**Current:** `<span className="font-medium">Difficulty:</span> {formData.irt_difficulty?.toFixed(2) || '0.00'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:853
**Current:** `<span className="font-medium">Discrimination:</span> {formData.irt_discrimination?.toFixed(2) || '1.00'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:856
**Current:** `<span className="font-medium">Guessing:</span> {formData.irt_guessing?.toFixed(2) || '0.25'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:877
**Current:** `value={formData.irt_difficulty || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:878
**Current:** `onChange={(e) => setFormData({ ...formData, irt_difficulty: parseFloat(e.target.value) || 0 })}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:894
**Current:** `value={formData.irt_discrimination || 1}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:895
**Current:** `onChange={(e) => setFormData({ ...formData, irt_discrimination: parseFloat(e.target.value) || 1 })}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:911
**Current:** `value={formData.irt_guessing || 0.25}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:912
**Current:** `onChange={(e) => setFormData({ ...formData, irt_guessing: parseFloat(e.target.value) || 0.25 })}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\page.tsx:112
**Current:** `_count: courseData._count || {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\page.tsx:115
**Current:** `courseTags: courseData.courseTags?.length || 0`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\page.tsx:147
**Current:** `if (loading || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\page.tsx:206
**Current:** `<p className="text-muted-foreground">{course.description || 'No description provided'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\page.tsx:350
**Current:** `<span className="font-semibold">{course.modules?.length || 0}</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\dashboard\page.tsx:39
**Current:** `if (status === 'unauthenticated' || !session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\dashboard\page.tsx:52
**Current:** `if (status !== 'authenticated' || !session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\dashboard\page.tsx:100
**Current:** `if (status === 'unauthenticated' || !session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\dashboard\page.tsx:174
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalUsers || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\dashboard\page.tsx:193
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalInstitutions || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\dashboard\page.tsx:212
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalCourses || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\dashboard\page.tsx:231
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">${stats?.statistics?.totalRevenue?.toLocaleString() || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\dashboard\page.tsx:250
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalEnrollments || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\dashboard\page.tsx:269
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">${stats?.statistics?.totalCommission?.toLocaleString() || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institution-monetization\page.tsx:86
**Current:** `if (!session || session.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\create\page.tsx:91
**Current:** `throw new Error(data.error || data.details || 'Failed to create institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\page.tsx:67
**Current:** `throw new Error(errorData.error || errorData.details || 'Failed to fetch institutions');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\page.tsx:231
**Current:** `src={institution.logoUrl || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\courses\page.tsx:164
**Current:** `throw new Error(error.message || 'Failed to save course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\courses\page.tsx:207
**Current:** `})) || []`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\courses\page.tsx:455
**Current:** `courseId={editingCourse?.id.toString() || 'new'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\courses\page.tsx:492
**Current:** `backgroundColor: ct.tag.color || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\courses\page.tsx:565
**Current:** `backgroundColor: ct.tag.color || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\edit\page.tsx:34
**Current:** `logoUrl: data.logoUrl || '', // Ensure logoUrl is available`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\edit\page.tsx:35
**Current:** `mainImageUrl: data.mainImageUrl || '', // Ensure mainImageUrl is available`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:94
**Current:** `if (!data || typeof data.id !== 'string') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:169
**Current:** `src={institution?.logoUrl || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:185
**Current:** `View Courses ({institution._count?.courses || 0})`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:209
**Current:** `{institution.status === 'ACTIVE' || institution.isApproved ? 'Suspend' : 'Activate'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:232
**Current:** `<p className="text-gray-600">{institution.description || 'No description provided'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:237
**Current:** `<p className="text-gray-600">{institution.country || 'Not specified'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:241
**Current:** `<p className="text-gray-600">{institution.city || 'Not specified'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:245
**Current:** `<p className="text-gray-600">{institution.state || 'Not specified'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:249
**Current:** `<p className="text-gray-600">{institution.postcode || 'Not specified'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:254
**Current:** `<p className="text-gray-600">{institution.address || 'Not specified'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:258
**Current:** `<p className="text-gray-600">{institution.telephone || 'Not specified'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:299
**Current:** `{institution.website || 'Not provided'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:305
**Current:** `{institution.institutionEmail || 'Not provided'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:311
**Current:** `{institution.telephone || 'Not provided'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:317
**Current:** `{institution.contactName || 'Not provided'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:323
**Current:** `{institution.contactJobTitle || 'Not provided'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:329
**Current:** `{institution.contactPhone || 'Not provided'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:335
**Current:** `{institution.contactEmail || 'Not provided'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:381
**Current:** `{(!institution.facilities || institution.facilities.length === 0) && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\page.tsx:398
**Current:** `{institution.description || 'No description provided'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\permissions\page.tsx:66
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\permissions\page.tsx:147
**Current:** `const permissionsToUpdate = categoryPermissions[category] || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\permissions\page.tsx:174
**Current:** `if (!institution || !permissions) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\users\page.tsx:55
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\users\page.tsx:77
**Current:** `throw new Error(errorData.message || 'Failed to fetch users');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\users\page.tsx:111
**Current:** `throw new Error(errorData.message || `Failed to ${editingUser ? 'update' : 'create'} user`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\users\page.tsx:167
**Current:** `throw new Error(errorData.message || 'Failed to delete user');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:170
**Current:** `toast.success(result.message || 'Payment approved successfully');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:210
**Current:** `toast.success(result.message || 'Payment disapproved successfully');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:382
**Current:** `const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:383
**Current:** `const matchesInstitution = selectedInstitution === 'all' || payment.institution.id === selectedInstitution;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:384
**Current:** `const matchesPaymentMethod = selectedPaymentMethod === 'all' || payment.paymentMethod === selectedPaymentMethod;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:388
**Current:** `const pendingPayments = filteredPayments.filter(p => p.status === 'PENDING' || p.status === 'PROCESSING');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:394
**Current:** `if (status === 'loading' || loading) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:651
**Current:** `<TableRow key={payment.id} className={(payment.status === 'PENDING' || payment.status === 'PROCESSING') ? 'bg-orange-50 dark:bg-orange-900/10' : ''}>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:669
**Current:** `{(payment.status === 'PENDING' || payment.status === 'PROCESSING') && requiresAdminApprovalDueToWithdrawnRights(payment) && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:692
**Current:** `{payment.referenceNumber || 'N/A'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:727
**Current:** `{(payment.status === 'PENDING' || payment.status === 'PROCESSING') && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:876
**Current:** `<p><strong>Reference:</strong> {selectedPaymentForDetails.referenceNumber || 'N/A'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:877
**Current:** `<p><strong>Booking ID:</strong> {selectedPaymentForDetails.bookingId || 'N/A'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\performance\page.tsx:35
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-banks\page.tsx:98
**Current:** `if (!editingBank || !formData.name.trim()) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-banks\page.tsx:151
**Current:** `description: bank.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-banks\page.tsx:152
**Current:** `category: bank.category || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-banks\page.tsx:161
**Current:** `const matchesCategory = !selectedCategory || bank.category === selectedCategory;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-banks\page.tsx:301
**Current:** `{bank.description || 'No description'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-banks\page.tsx:338
**Current:** `{bank.questions_count || 0} questions`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-banks\[id]\page.tsx:122
**Current:** `a.download = `${bank?.name || 'question-bank'}.json`;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-banks\[id]\page.tsx:144
**Current:** `if (!data.questions || !Array.isArray(data.questions)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-banks\[id]\page.tsx:191
**Current:** `<span className="text-xs text-muted-foreground">{bank.questions_count || 0} questions</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-templates\page.tsx:124
**Current:** `if (!editingTemplate || !formData.name.trim()) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-templates\page.tsx:177
**Current:** `description: template.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-templates\page.tsx:179
**Current:** `template_config: template.template_config || {},`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-templates\page.tsx:180
**Current:** `category: template.category || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-templates\page.tsx:190
**Current:** `const matchesType = !selectedType || selectedType === 'all' || template.type === selectedType;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-templates\page.tsx:191
**Current:** `const matchesDifficulty = !selectedDifficulty || selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-templates\page.tsx:362
**Current:** `{template.description || 'No description'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-templates\page.tsx:432
**Current:** `{searchTerm || selectedType !== 'all' || selectedDifficulty !== 'all'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-templates\[id]\page.tsx:162
**Current:** `<Input value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''} onChange={e => setFormData({ ...formData, tags: e.target.value })} />`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\commission-tiers\page.tsx:127
**Current:** `if (!session || session.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\commission-tiers\page.tsx:254
**Current:** `return plan?.icon || <Building2 className="w-4 h-4" />;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\commission-tiers\page.tsx:741
**Current:** `planType: plan?.planType || 'STARTER',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\commission-tiers\page.tsx:742
**Current:** `name: plan?.name || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\commission-tiers\page.tsx:743
**Current:** `monthlyPrice: plan?.monthlyPrice || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\commission-tiers\page.tsx:744
**Current:** `annualPrice: plan?.annualPrice || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\commission-tiers\page.tsx:746
**Current:** `features: plan?.features || {}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\common-scripts\page.tsx:40
**Current:** `throw new Error(data.error || 'Failed to run seed script')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\common-scripts\page.tsx:73
**Current:** `throw new Error(data.error || 'Failed to run booking payment consistency script')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\common-scripts\page.tsx:102
**Current:** `throw new Error(data.error || 'Failed to run maintenance scripts')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\common-scripts\page.tsx:107
**Current:** `text: data.message || 'All maintenance scripts executed successfully.'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\common-scripts\page.tsx:299
**Current:** `<div className="text-sm">Inconsistent Bookings: {maintenanceResults.auditFix?.inconsistentBookings || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\common-scripts\page.tsx:300
**Current:** `<div className="text-sm">Fixed Bookings: {maintenanceResults.auditFix?.fixedBookings || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\common-scripts\page.tsx:301
**Current:** `<div className="text-sm">Inconsistent Enrollments: {maintenanceResults.auditFix?.inconsistentEnrollments || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\common-scripts\page.tsx:302
**Current:** `<div className="text-sm">Fixed Enrollments: {maintenanceResults.auditFix?.fixedEnrollments || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\common-scripts\page.tsx:306
**Current:** `<div className="text-sm">Orphaned Enrollments Found: {maintenanceResults.cleanup?.orphanedEnrollments || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\common-scripts\page.tsx:307
**Current:** `<div className="text-sm">Deleted Enrollments: {maintenanceResults.cleanup?.deletedEnrollments || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\common-scripts\page.tsx:315
**Current:** `{maintenanceResults.combinedLogs?.join('\n') || 'No logs available'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\notifications\templates\page.tsx:165
**Current:** `toast.error(error.message || 'Failed to create template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\notifications\templates\page.tsx:190
**Current:** `toast.error(error.message || 'Failed to update template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\notifications\templates\page.tsx:212
**Current:** `toast.error(error.message || 'Failed to delete template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\notifications\templates\page.tsx:238
**Current:** `subject: template.subject || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\notifications\templates\page.tsx:264
**Current:** `const matchesType = filterType === 'all' || template.type === filterType;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\notifications\templates\page.tsx:265
**Current:** `const matchesCategory = filterCategory === 'all' || template.category === filterCategory;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:243
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:353
**Current:** `throw new Error(errorData.message || 'Failed to seed categories');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:388
**Current:** `throw new Error(errorData.message || 'Failed to seed tags');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:451
**Current:** `if (!passwordChange.currentPassword || !passwordChange.newPassword || !passwordChange.confirmPassword) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:476
**Current:** `throw new Error(error.message || 'Failed to save email settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:489
**Current:** `throw new Error(error.message || 'Failed to save email settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:538
**Current:** `throw new Error(errorData.message || 'Failed to fix missing students');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:610
**Current:** `throw new Error(errorData.message || 'Failed to seed notification templates');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:633
**Current:** `throw new Error(errorData.message || 'Failed to create template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:667
**Current:** `throw new Error(errorData.message || 'Failed to update template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:701
**Current:** `throw new Error(errorData.message || 'Failed to delete template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:718
**Current:** `subject: template.subject || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:1450
**Current:** `<p className="text-2xl font-bold text-blue-900">{notificationStats.overview?.total || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:1459
**Current:** `<p className="text-2xl font-bold text-green-900">{notificationStats.overview?.successRate || 0}%</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:1468
**Current:** `<p className="text-2xl font-bold text-purple-900">{notificationStats.templates?.active || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:1477
**Current:** `<p className="text-2xl font-bold text-orange-900">{notificationStats.byType?.email || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:1623
**Current:** `Created by {template.createdByUser?.name || 'Unknown'} on {new Date(template.createdAt).toLocaleDateString()}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:1636
**Current:** `<Dialog open={!!(showTemplateForm || editingTemplate)} onOpenChange={(open) => !open && handleCancelTemplateEdit()}>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:1916
**Current:** `<p className="mt-1 text-sm">{viewingTemplate.createdByUser?.name || 'Unknown'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:2225
**Current:** `<p className="text-2xl font-bold text-blue-900">{cleanupResults.students || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:2234
**Current:** `<p className="text-2xl font-bold text-blue-900">{cleanupResults.studentAchievements || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:2243
**Current:** `<p className="text-2xl font-bold text-blue-900">{cleanupResults.notificationPreferences || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:2260
**Current:** `<p className="text-2xl font-bold text-green-900">{cleanupResults.enrollments || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:2269
**Current:** `<p className="text-2xl font-bold text-green-900">{cleanupResults.completions || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:2278
**Current:** `<p className="text-2xl font-bold text-green-900">{cleanupResults.bookings || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:2295
**Current:** `<p className="text-2xl font-bold text-purple-900">{cleanupResults.moduleProgress || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:2304
**Current:** `<p className="text-2xl font-bold text-purple-900">{cleanupResults.progress || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:2313
**Current:** `<p className="text-2xl font-bold text-purple-900">{cleanupResults.learningSessions || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:2330
**Current:** `<p className="text-2xl font-bold text-orange-900">{cleanupResults.quizAttempts || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:2339
**Current:** `<p className="text-2xl font-bold text-orange-900">{cleanupResults.quizResponses || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:2356
**Current:** `<p className="text-2xl font-bold text-red-900">{cleanupResults.payments || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:2365
**Current:** `<p className="text-2xl font-bold text-red-900">{cleanupResults.payouts || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:2374
**Current:** `<p className="text-2xl font-bold text-red-900">{cleanupResults.commissionLogs || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:2390
**Current:** `{Object.values(cleanupResults).reduce((sum: number, count: any) => sum + (count || 0), 0)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:2471
**Current:** `{scriptResults[script.id].message || scriptResults[script.id].error}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:2533
**Current:** `{scriptResults[script.id].message || scriptResults[script.id].error}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\payment-approval\page.tsx:94
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\payment-approval\page.tsx:152
**Current:** `toast.error(error.message || 'Failed to save settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\payment-approval\page.tsx:210
**Current:** `if (!originalSettings || !impact) return false;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\payment-approval\page.tsx:230
**Current:** `if (status === 'loading' || loading) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\payment-approval\page.tsx:269
**Current:** `disabled={!hasChanges || saving}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:104
**Current:** `setPlans(plansData.plans || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:317
**Current:** `onChange={(e) => setCreateFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:348
**Current:** `onChange={(e) => setCreateFormData(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 0 }))}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:358
**Current:** `onChange={(e) => setCreateFormData(prev => ({ ...prev, maxCourses: parseInt(e.target.value) || 0 }))}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:368
**Current:** `onChange={(e) => setCreateFormData(prev => ({ ...prev, maxTeachers: parseInt(e.target.value) || 0 }))}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:568
**Current:** `const updatedPlan = { ...plan, price: parseFloat(e.target.value) || 0 };`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:580
**Current:** `const updatedPlan = { ...plan, maxStudents: parseInt(e.target.value) || 0 };`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\subscription-plans\page.tsx:592
**Current:** `const updatedPlan = { ...plan, maxCourses: parseInt(e.target.value) || 0 };`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\subscriptions\[id]\edit\page.tsx:255
**Current:** `({formData.planType || 'No plan'} plan)`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:100
**Current:** `description: editingTag.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:101
**Current:** `parentId: editingTag.parentId || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:102
**Current:** `color: editingTag.color || '#000000',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:103
**Current:** `icon: editingTag.icon || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:226
**Current:** `if (!sessionData?.user?.role || sessionData.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:237
**Current:** `parentId: formData.parentId || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:267
**Current:** `throw new Error(errorData.message || `Failed to ${isUpdating ? 'update' : 'create'} tag`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:337
**Current:** `throw new Error(error.message || 'Failed to delete tag');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:434
**Current:** `return iconMap[iconName] || Tag;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:464
**Current:** `<IconComponent className="w-4 h-4" style={{ color: tag.color || 'currentColor' }} />`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:475
**Current:** `<TableCell className="text-gray-600">{tag.description || '-'}</TableCell>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:477
**Current:** `<span className="font-medium">{tag._count?.courseTags || 0}</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:480
**Current:** `<span className="font-medium">{tag._count?.children || 0}</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:595
**Current:** `value={formData.parentId || 'none'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:647
**Current:** `onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\page.tsx:110
**Current:** `name: user.name || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\page.tsx:138
**Current:** `password: password || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\page.tsx:152
**Current:** `throw new Error(errorData.message || `Failed to ${selectedUser ? 'update' : 'create'} user`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\page.tsx:362
**Current:** `<h3 className="font-semibold text-sm sm:text-base line-clamp-1">{user.name || 'Unnamed User'}</h3>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\page.tsx:383
**Current:** `name: user.name || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\page.tsx:417
**Current:** `<h3 className="font-semibold text-sm sm:text-base line-clamp-1">{user.name || 'Unnamed User'}</h3>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\page.tsx:440
**Current:** `name: user.name || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\[userId]\page.tsx:58
**Current:** `throw new Error(errorData.message || 'Failed to fetch user');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\[userId]\page.tsx:91
**Current:** `throw new Error(errorData.message || 'Failed to update user status');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\[userId]\page.tsx:190
**Current:** `<dd className="mt-1 text-sm text-gray-900">{user.name || 'Not provided'}</dd>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\components\CourseForm.tsx:140
**Current:** `if (!data.base_price || isNaN(Number(data.base_price)) || Number(data.base_price) < 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\components\CourseForm.tsx:143
**Current:** `if (!data.duration || isNaN(Number(data.duration)) || Number(data.duration) <= 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\components\CourseForm.tsx:146
**Current:** `if (!data.maxStudents || isNaN(Number(data.maxStudents)) || Number(data.maxStudents) <= 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\components\CourseForm.tsx:461
**Current:** `<SelectValue>{frameworkInfo.label || 'Select framework'}</SelectValue>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\components\CourseForm.tsx:552
**Current:** `value={formData.priority || '0'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\components\CourseForm.tsx:570
**Current:** `checked={formData.isFeatured || false}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\components\CourseForm.tsx:586
**Current:** `checked={formData.isSponsored || false}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\components\CourseForm.tsx:641
**Current:** `disabled={isSubmitting || Object.keys(errors).length > 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:328
**Current:** `setInstitutions(data.institutions || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:360
**Current:** `const categoriesData = Array.isArray(data) ? data : (data.categories || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:410
**Current:** `setCourses(data.courses || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:517
**Current:** `if (institutionId === 'all' || !institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:521
**Current:** `setSelectedInstitution(institution || null);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:565
**Current:** `setCourses(data.courses || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:608
**Current:** `setCourses(data.courses || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:649
**Current:** `if (!session || session.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:696
**Current:** `if (!institutionsResponse.ok || !categoriesResponse.ok) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:990
**Current:** `if (!course.category || !course.category.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:994
**Current:** `if (!course.institution || !course.institution.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1004
**Current:** `})) || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1010
**Current:** `base_price: course.base_price?.toString() || '0',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1011
**Current:** `pricingPeriod: course.pricingPeriod || 'FULL_COURSE',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1013
**Current:** `framework: course.framework || 'CEFR',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1022
**Current:** `priority: (course.priority || 0).toString(),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1023
**Current:** `isFeatured: course.isFeatured || false,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1024
**Current:** `isSponsored: course.isSponsored || false`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1052
**Current:** `const currentYear = course.weeklyPrices?.[0]?.year || new Date().getFullYear();`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1244
**Current:** `{isLoading || loadingStates.isFetching ? (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1288
**Current:** `<span>{course._count?.bookings || 0} bookings</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1296
**Current:** `backgroundColor: ct.tag.color || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1315
**Current:** `title={`View Enrollments (${course._count?.enrollments || 0})`}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1321
**Current:** `<p>View Enrollments ({course._count?.enrollments || 0})</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1393
**Current:** `backgroundColor: ct.tag.color || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1414
**Current:** `title={`View Enrollments (${course._count?.enrollments || 0})`}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1420
**Current:** `<p>View Enrollments ({course._count?.enrollments || 0})</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1500
**Current:** `open={isAddModalOpen || isEditModalOpen}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1558
**Current:** `initialPrices={selectedCourse.weeklyPrices || []}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1559
**Current:** `basePrice={selectedCourse.base_price || parseFloat(formData.base_price) || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1587
**Current:** `initialPrices={selectedCourse.monthlyPrices || []}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1588
**Current:** `basePrice={selectedCourse.base_price || parseFloat(formData.base_price) || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\enrollments\page.tsx:181
**Current:** `setEnrollments(data.enrollments || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\enrollments\page.tsx:211
**Current:** `status: updateStatus || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\enrollments\page.tsx:212
**Current:** `paymentStatus: updatePaymentStatus || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\enrollments\page.tsx:368
**Current:** `{enrollments.filter(e => e.status === 'ACTIVE' || e.status === 'ENROLLED').length}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\enrollments\page.tsx:381
**Current:** `{enrollments.filter(e => e.paymentStatus === 'COMPLETED' || e.paymentStatus === 'PAID').length}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\page.tsx:271
**Current:** `onChange={(e) => setCreateFormData({ ...createFormData, estimated_duration: parseInt(e.target.value) || 0 })}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\page.tsx:308
**Current:** `{module.description || 'No description'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\page.tsx:131
**Current:** `if (error || !module || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\page.tsx:134
**Current:** `<p className="text-red-500 mb-4">{error || 'Module not found'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\page.tsx:182
**Current:** `<p className="text-muted-foreground">{module.description || 'No description provided'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\page.tsx:288
**Current:** `<Badge variant="outline">Order: {item.order_index || 'N/A'}</Badge>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\page.tsx:313
**Current:** `<Badge variant="outline">Order: {exercise.order_index || 'N/A'}</Badge>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\page.tsx:337
**Current:** `{quiz.description || 'No description'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:149
**Current:** `if (error || !quiz || !module || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:152
**Current:** `<p className="text-red-500 mb-4">{error || 'Quiz not found'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:238
**Current:** `onChange={(e) => updateQuizField('passing_score', parseInt(e.target.value) || 0)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:249
**Current:** `value={quiz.time_limit || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:260
**Current:** `value={quiz.description || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:170
**Current:** `if (error || !quiz || !module || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:173
**Current:** `<p className="text-red-500 mb-4">{error || 'Quiz not found'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:173
**Current:** `if (params.difficulty < -4 || params.difficulty > 4) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:177
**Current:** `if (params.discrimination < 0.1 || params.discrimination > 3) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:181
**Current:** `if (params.guessing < 0 || params.guessing > 1) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:276
**Current:** `type: template.type || prev.type,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:277
**Current:** `question: template.template_config?.question || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:278
**Current:** `points: template.template_config?.points || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:279
**Current:** `options: template.template_config?.options || ['', '', '', ''],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:280
**Current:** `correct_answer: template.template_config?.correct_answer || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:281
**Current:** `explanation: template.template_config?.explanation || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:282
**Current:** `difficulty: template.difficulty || 'MEDIUM',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:283
**Current:** `category: template.category || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:284
**Current:** `hints: template.template_config?.hints || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:285
**Current:** `question_config: template.template_config || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:286
**Current:** `media_url: template.template_config?.media_url || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:287
**Current:** `media_type: template.template_config?.media_type || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:288
**Current:** `question_options: template.template_config?.question_options || []`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:311
**Current:** `difficulty: questionData.irt_difficulty || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:312
**Current:** `discrimination: questionData.irt_discrimination || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:313
**Current:** `guessing: questionData.irt_guessing || 0.25`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:485
**Current:** `value={questionData.question_config?.leftItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:503
**Current:** `value={questionData.question_config?.rightItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:527
**Current:** `value={questionData.question_config?.dragItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:545
**Current:** `value={questionData.question_config?.dropZones?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:599
**Current:** `value={questionData.question_config?.orderItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:653
**Current:** `<span className="font-medium">Difficulty:</span> {questionData.irt_difficulty?.toFixed(2) || '0.00'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:656
**Current:** `<span className="font-medium">Discrimination:</span> {questionData.irt_discrimination?.toFixed(2) || '1.00'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:659
**Current:** `<span className="font-medium">Guessing:</span> {questionData.irt_guessing?.toFixed(2) || '0.25'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:680
**Current:** `value={questionData.irt_difficulty || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:681
**Current:** `onChange={(e) => updateQuestionField('irt_difficulty', parseFloat(e.target.value) || 0)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:697
**Current:** `value={questionData.irt_discrimination || 1}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:698
**Current:** `onChange={(e) => updateQuestionField('irt_discrimination', parseFloat(e.target.value) || 1)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:714
**Current:** `value={questionData.irt_guessing || 0.25}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:715
**Current:** `onChange={(e) => updateQuestionField('irt_guessing', parseFloat(e.target.value) || 0.25)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:744
**Current:** `if (error || !quiz || !module || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:747
**Current:** `<p className="text-red-500 mb-4">{error || 'Quiz not found'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:854
**Current:** `onChange={(e) => updateQuestionField('points', parseInt(e.target.value) || 1)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:174
**Current:** `if (params.difficulty < -4 || params.difficulty > 4) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:178
**Current:** `if (params.discrimination < 0.1 || params.discrimination > 3) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:182
**Current:** `if (params.guessing < 0 || params.guessing > 1) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:270
**Current:** `correct_answer: questionData.correct_answer || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:271
**Current:** `explanation: questionData.explanation || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:272
**Current:** `difficulty: questionData.difficulty || 'MEDIUM',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:273
**Current:** `category: questionData.category || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:274
**Current:** `hints: questionData.hints || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:275
**Current:** `question_config: questionData.question_config || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:276
**Current:** `media_url: questionData.media_url || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:277
**Current:** `media_type: questionData.media_type || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:278
**Current:** `question_options: questionData.questionOptions || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:279
**Current:** `irt_difficulty: questionData.irt_difficulty || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:280
**Current:** `irt_discrimination: questionData.irt_discrimination || 1.0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:281
**Current:** `irt_guessing: questionData.irt_guessing || 0.25,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:282
**Current:** `use_manual_irt: questionData.use_manual_irt || false`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:523
**Current:** `value={formData.question_config?.leftItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:541
**Current:** `value={formData.question_config?.rightItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:566
**Current:** `value={formData.question_config?.dragItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:584
**Current:** `value={formData.question_config?.dropZones?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:638
**Current:** `value={formData.question_config?.orderItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:669
**Current:** `if (!quiz || !module || !course || !question) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:784
**Current:** `onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 1 })}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:850
**Current:** `<span className="font-medium">Difficulty:</span> {formData.irt_difficulty?.toFixed(2) || '0.00'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:853
**Current:** `<span className="font-medium">Discrimination:</span> {formData.irt_discrimination?.toFixed(2) || '1.00'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:856
**Current:** `<span className="font-medium">Guessing:</span> {formData.irt_guessing?.toFixed(2) || '0.25'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:877
**Current:** `value={formData.irt_difficulty || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:878
**Current:** `onChange={(e) => setFormData({ ...formData, irt_difficulty: parseFloat(e.target.value) || 0 })}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:894
**Current:** `value={formData.irt_discrimination || 1}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:895
**Current:** `onChange={(e) => setFormData({ ...formData, irt_discrimination: parseFloat(e.target.value) || 1 })}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:911
**Current:** `value={formData.irt_guessing || 0.25}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:912
**Current:** `onChange={(e) => setFormData({ ...formData, irt_guessing: parseFloat(e.target.value) || 0.25 })}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\page.tsx:112
**Current:** `_count: courseData._count || {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\page.tsx:115
**Current:** `courseTags: courseData.courseTags?.length || 0`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\page.tsx:147
**Current:** `if (loading || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\page.tsx:206
**Current:** `<p className="text-muted-foreground">{course.description || 'No description provided'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\page.tsx:350
**Current:** `<span className="font-semibold">{course.modules?.length || 0}</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institution-monetization\page.tsx:86
**Current:** `if (!session || session.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\create\page.tsx:91
**Current:** `throw new Error(data.error || data.details || 'Failed to create institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\page.tsx:67
**Current:** `throw new Error(errorData.error || errorData.details || 'Failed to fetch institutions');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\page.tsx:231
**Current:** `src={institution.logoUrl || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\courses\page.tsx:164
**Current:** `throw new Error(error.message || 'Failed to save course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\courses\page.tsx:207
**Current:** `})) || []`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\courses\page.tsx:455
**Current:** `courseId={editingCourse?.id.toString() || 'new'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\courses\page.tsx:492
**Current:** `backgroundColor: ct.tag.color || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\courses\page.tsx:565
**Current:** `backgroundColor: ct.tag.color || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\edit\page.tsx:34
**Current:** `logoUrl: data.logoUrl || '', // Ensure logoUrl is available`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\edit\page.tsx:35
**Current:** `mainImageUrl: data.mainImageUrl || '', // Ensure mainImageUrl is available`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:94
**Current:** `if (!data || typeof data.id !== 'string') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:169
**Current:** `src={institution?.logoUrl || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:185
**Current:** `View Courses ({institution._count?.courses || 0})`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:209
**Current:** `{institution.status === 'ACTIVE' || institution.isApproved ? 'Suspend' : 'Activate'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:232
**Current:** `<p className="text-gray-600">{institution.description || 'No description provided'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:237
**Current:** `<p className="text-gray-600">{institution.country || 'Not specified'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:241
**Current:** `<p className="text-gray-600">{institution.city || 'Not specified'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:245
**Current:** `<p className="text-gray-600">{institution.state || 'Not specified'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:249
**Current:** `<p className="text-gray-600">{institution.postcode || 'Not specified'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:254
**Current:** `<p className="text-gray-600">{institution.address || 'Not specified'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:258
**Current:** `<p className="text-gray-600">{institution.telephone || 'Not specified'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:299
**Current:** `{institution.website || 'Not provided'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:305
**Current:** `{institution.institutionEmail || 'Not provided'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:311
**Current:** `{institution.telephone || 'Not provided'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:317
**Current:** `{institution.contactName || 'Not provided'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:323
**Current:** `{institution.contactJobTitle || 'Not provided'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:329
**Current:** `{institution.contactPhone || 'Not provided'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:335
**Current:** `{institution.contactEmail || 'Not provided'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:381
**Current:** `{(!institution.facilities || institution.facilities.length === 0) && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\page.tsx:398
**Current:** `{institution.description || 'No description provided'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\permissions\page.tsx:66
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\permissions\page.tsx:147
**Current:** `const permissionsToUpdate = categoryPermissions[category] || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\permissions\page.tsx:174
**Current:** `if (!institution || !permissions) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\users\page.tsx:55
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\users\page.tsx:77
**Current:** `throw new Error(errorData.message || 'Failed to fetch users');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\users\page.tsx:111
**Current:** `throw new Error(errorData.message || `Failed to ${editingUser ? 'update' : 'create'} user`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\users\page.tsx:167
**Current:** `throw new Error(errorData.message || 'Failed to delete user');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:170
**Current:** `toast.success(result.message || 'Payment approved successfully');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:210
**Current:** `toast.success(result.message || 'Payment disapproved successfully');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:382
**Current:** `const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:383
**Current:** `const matchesInstitution = selectedInstitution === 'all' || payment.institution.id === selectedInstitution;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:384
**Current:** `const matchesPaymentMethod = selectedPaymentMethod === 'all' || payment.paymentMethod === selectedPaymentMethod;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:388
**Current:** `const pendingPayments = filteredPayments.filter(p => p.status === 'PENDING' || p.status === 'PROCESSING');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:394
**Current:** `if (status === 'loading' || loading) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:651
**Current:** `<TableRow key={payment.id} className={(payment.status === 'PENDING' || payment.status === 'PROCESSING') ? 'bg-orange-50 dark:bg-orange-900/10' : ''}>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:669
**Current:** `{(payment.status === 'PENDING' || payment.status === 'PROCESSING') && requiresAdminApprovalDueToWithdrawnRights(payment) && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:692
**Current:** `{payment.referenceNumber || 'N/A'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:727
**Current:** `{(payment.status === 'PENDING' || payment.status === 'PROCESSING') && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:876
**Current:** `<p><strong>Reference:</strong> {selectedPaymentForDetails.referenceNumber || 'N/A'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:877
**Current:** `<p><strong>Booking ID:</strong> {selectedPaymentForDetails.bookingId || 'N/A'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\performance\page.tsx:35
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-banks\page.tsx:98
**Current:** `if (!editingBank || !formData.name.trim()) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-banks\page.tsx:151
**Current:** `description: bank.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-banks\page.tsx:152
**Current:** `category: bank.category || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-banks\page.tsx:161
**Current:** `const matchesCategory = !selectedCategory || bank.category === selectedCategory;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-banks\page.tsx:301
**Current:** `{bank.description || 'No description'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-banks\page.tsx:338
**Current:** `{bank.questions_count || 0} questions`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-banks\[id]\page.tsx:122
**Current:** `a.download = `${bank?.name || 'question-bank'}.json`;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-banks\[id]\page.tsx:144
**Current:** `if (!data.questions || !Array.isArray(data.questions)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-banks\[id]\page.tsx:191
**Current:** `<span className="text-xs text-muted-foreground">{bank.questions_count || 0} questions</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-templates\page.tsx:124
**Current:** `if (!editingTemplate || !formData.name.trim()) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-templates\page.tsx:177
**Current:** `description: template.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-templates\page.tsx:179
**Current:** `template_config: template.template_config || {},`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-templates\page.tsx:180
**Current:** `category: template.category || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-templates\page.tsx:190
**Current:** `const matchesType = !selectedType || selectedType === 'all' || template.type === selectedType;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-templates\page.tsx:191
**Current:** `const matchesDifficulty = !selectedDifficulty || selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-templates\page.tsx:362
**Current:** `{template.description || 'No description'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-templates\page.tsx:432
**Current:** `{searchTerm || selectedType !== 'all' || selectedDifficulty !== 'all'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-templates\[id]\page.tsx:162
**Current:** `<Input value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''} onChange={e => setFormData({ ...formData, tags: e.target.value })} />`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\commission-tiers\page.tsx:127
**Current:** `if (!session || session.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\commission-tiers\page.tsx:254
**Current:** `return plan?.icon || <Building2 className="w-4 h-4" />;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\commission-tiers\page.tsx:741
**Current:** `planType: plan?.planType || 'STARTER',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\commission-tiers\page.tsx:742
**Current:** `name: plan?.name || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\commission-tiers\page.tsx:743
**Current:** `monthlyPrice: plan?.monthlyPrice || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\commission-tiers\page.tsx:744
**Current:** `annualPrice: plan?.annualPrice || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\commission-tiers\page.tsx:746
**Current:** `features: plan?.features || {}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\common-scripts\page.tsx:40
**Current:** `throw new Error(data.error || 'Failed to run seed script')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\common-scripts\page.tsx:73
**Current:** `throw new Error(data.error || 'Failed to run booking payment consistency script')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\common-scripts\page.tsx:102
**Current:** `throw new Error(data.error || 'Failed to run maintenance scripts')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\common-scripts\page.tsx:107
**Current:** `text: data.message || 'All maintenance scripts executed successfully.'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\common-scripts\page.tsx:299
**Current:** `<div className="text-sm">Inconsistent Bookings: {maintenanceResults.auditFix?.inconsistentBookings || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\common-scripts\page.tsx:300
**Current:** `<div className="text-sm">Fixed Bookings: {maintenanceResults.auditFix?.fixedBookings || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\common-scripts\page.tsx:301
**Current:** `<div className="text-sm">Inconsistent Enrollments: {maintenanceResults.auditFix?.inconsistentEnrollments || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\common-scripts\page.tsx:302
**Current:** `<div className="text-sm">Fixed Enrollments: {maintenanceResults.auditFix?.fixedEnrollments || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\common-scripts\page.tsx:306
**Current:** `<div className="text-sm">Orphaned Enrollments Found: {maintenanceResults.cleanup?.orphanedEnrollments || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\common-scripts\page.tsx:307
**Current:** `<div className="text-sm">Deleted Enrollments: {maintenanceResults.cleanup?.deletedEnrollments || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\common-scripts\page.tsx:315
**Current:** `{maintenanceResults.combinedLogs?.join('\n') || 'No logs available'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\notifications\templates\page.tsx:165
**Current:** `toast.error(error.message || 'Failed to create template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\notifications\templates\page.tsx:190
**Current:** `toast.error(error.message || 'Failed to update template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\notifications\templates\page.tsx:212
**Current:** `toast.error(error.message || 'Failed to delete template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\notifications\templates\page.tsx:238
**Current:** `subject: template.subject || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\notifications\templates\page.tsx:264
**Current:** `const matchesType = filterType === 'all' || template.type === filterType;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\notifications\templates\page.tsx:265
**Current:** `const matchesCategory = filterCategory === 'all' || template.category === filterCategory;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:237
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:347
**Current:** `throw new Error(errorData.message || 'Failed to seed categories');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:382
**Current:** `throw new Error(errorData.message || 'Failed to seed tags');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:445
**Current:** `if (!passwordChange.currentPassword || !passwordChange.newPassword || !passwordChange.confirmPassword) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:470
**Current:** `throw new Error(error.message || 'Failed to save email settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:483
**Current:** `throw new Error(error.message || 'Failed to save email settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:532
**Current:** `throw new Error(errorData.message || 'Failed to fix missing students');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:604
**Current:** `throw new Error(errorData.message || 'Failed to seed notification templates');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:627
**Current:** `throw new Error(errorData.message || 'Failed to create template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:661
**Current:** `throw new Error(errorData.message || 'Failed to update template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:695
**Current:** `throw new Error(errorData.message || 'Failed to delete template');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:712
**Current:** `subject: template.subject || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:1367
**Current:** `<p className="text-2xl font-bold text-blue-900">{notificationStats.overview?.total || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:1376
**Current:** `<p className="text-2xl font-bold text-green-900">{notificationStats.overview?.successRate || 0}%</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:1385
**Current:** `<p className="text-2xl font-bold text-purple-900">{notificationStats.templates?.active || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:1394
**Current:** `<p className="text-2xl font-bold text-orange-900">{notificationStats.byType?.email || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:1540
**Current:** `Created by {template.createdByUser?.name || 'Unknown'} on {new Date(template.createdAt).toLocaleDateString()}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:1553
**Current:** `<Dialog open={!!(showTemplateForm || editingTemplate)} onOpenChange={(open) => !open && handleCancelTemplateEdit()}>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:1833
**Current:** `<p className="mt-1 text-sm">{viewingTemplate.createdByUser?.name || 'Unknown'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:2142
**Current:** `<p className="text-2xl font-bold text-blue-900">{cleanupResults.students || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:2151
**Current:** `<p className="text-2xl font-bold text-blue-900">{cleanupResults.studentAchievements || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:2160
**Current:** `<p className="text-2xl font-bold text-blue-900">{cleanupResults.notificationPreferences || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:2177
**Current:** `<p className="text-2xl font-bold text-green-900">{cleanupResults.enrollments || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:2186
**Current:** `<p className="text-2xl font-bold text-green-900">{cleanupResults.completions || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:2195
**Current:** `<p className="text-2xl font-bold text-green-900">{cleanupResults.bookings || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:2212
**Current:** `<p className="text-2xl font-bold text-purple-900">{cleanupResults.moduleProgress || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:2221
**Current:** `<p className="text-2xl font-bold text-purple-900">{cleanupResults.progress || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:2230
**Current:** `<p className="text-2xl font-bold text-purple-900">{cleanupResults.learningSessions || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:2247
**Current:** `<p className="text-2xl font-bold text-orange-900">{cleanupResults.quizAttempts || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:2256
**Current:** `<p className="text-2xl font-bold text-orange-900">{cleanupResults.quizResponses || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:2273
**Current:** `<p className="text-2xl font-bold text-red-900">{cleanupResults.payments || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:2282
**Current:** `<p className="text-2xl font-bold text-red-900">{cleanupResults.payouts || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:2291
**Current:** `<p className="text-2xl font-bold text-red-900">{cleanupResults.commissionLogs || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:2307
**Current:** `{Object.values(cleanupResults).reduce((sum: number, count: any) => sum + (count || 0), 0)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\payment-approval\page.tsx:94
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\payment-approval\page.tsx:152
**Current:** `toast.error(error.message || 'Failed to save settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\payment-approval\page.tsx:210
**Current:** `if (!originalSettings || !impact) return false;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\payment-approval\page.tsx:230
**Current:** `if (status === 'loading' || loading) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\payment-approval\page.tsx:269
**Current:** `disabled={!hasChanges || saving}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:104
**Current:** `setPlans(plansData.plans || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:317
**Current:** `onChange={(e) => setCreateFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:348
**Current:** `onChange={(e) => setCreateFormData(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 0 }))}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:358
**Current:** `onChange={(e) => setCreateFormData(prev => ({ ...prev, maxCourses: parseInt(e.target.value) || 0 }))}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:368
**Current:** `onChange={(e) => setCreateFormData(prev => ({ ...prev, maxTeachers: parseInt(e.target.value) || 0 }))}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:568
**Current:** `const updatedPlan = { ...plan, price: parseFloat(e.target.value) || 0 };`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:580
**Current:** `const updatedPlan = { ...plan, maxStudents: parseInt(e.target.value) || 0 };`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\subscription-plans\page.tsx:592
**Current:** `const updatedPlan = { ...plan, maxCourses: parseInt(e.target.value) || 0 };`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-disabled\dashboard\page.tsx:39
**Current:** `if (status === 'unauthenticated' || !session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-disabled\dashboard\page.tsx:52
**Current:** `if (status !== 'authenticated' || !session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-disabled\dashboard\page.tsx:100
**Current:** `if (status === 'unauthenticated' || !session) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-disabled\dashboard\page.tsx:174
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalUsers || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-disabled\dashboard\page.tsx:193
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalInstitutions || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-disabled\dashboard\page.tsx:212
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalCourses || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-disabled\dashboard\page.tsx:231
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">${stats?.statistics?.totalRevenue?.toLocaleString() || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-disabled\dashboard\page.tsx:250
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalEnrollments || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-disabled\dashboard\page.tsx:269
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">${stats?.statistics?.totalCommission?.toLocaleString() || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\subscriptions\[id]\edit\page.tsx:255
**Current:** `({formData.planType || 'No plan'} plan)`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:100
**Current:** `description: editingTag.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:101
**Current:** `parentId: editingTag.parentId || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:102
**Current:** `color: editingTag.color || '#000000',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:103
**Current:** `icon: editingTag.icon || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:226
**Current:** `if (!sessionData?.user?.role || sessionData.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:237
**Current:** `parentId: formData.parentId || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:267
**Current:** `throw new Error(errorData.message || `Failed to ${isUpdating ? 'update' : 'create'} tag`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:337
**Current:** `throw new Error(error.message || 'Failed to delete tag');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:434
**Current:** `return iconMap[iconName] || Tag;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:464
**Current:** `<IconComponent className="w-4 h-4" style={{ color: tag.color || 'currentColor' }} />`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:475
**Current:** `<TableCell className="text-gray-600">{tag.description || '-'}</TableCell>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:477
**Current:** `<span className="font-medium">{tag._count?.courseTags || 0}</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:480
**Current:** `<span className="font-medium">{tag._count?.children || 0}</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:595
**Current:** `value={formData.parentId || 'none'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:647
**Current:** `onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\page.tsx:110
**Current:** `name: user.name || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\page.tsx:138
**Current:** `password: password || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\page.tsx:152
**Current:** `throw new Error(errorData.message || `Failed to ${selectedUser ? 'update' : 'create'} user`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\page.tsx:362
**Current:** `<h3 className="font-semibold text-sm sm:text-base line-clamp-1">{user.name || 'Unnamed User'}</h3>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\page.tsx:383
**Current:** `name: user.name || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\page.tsx:417
**Current:** `<h3 className="font-semibold text-sm sm:text-base line-clamp-1">{user.name || 'Unnamed User'}</h3>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\page.tsx:440
**Current:** `name: user.name || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\[userId]\page.tsx:58
**Current:** `throw new Error(errorData.message || 'Failed to fetch user');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\[userId]\page.tsx:91
**Current:** `throw new Error(errorData.message || 'Failed to update user status');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\[userId]\page.tsx:190
**Current:** `<dd className="mt-1 text-sm text-gray-900">{user.name || 'Not provided'}</dd>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\advertising\route.ts:9
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\advertising\route.ts:139
**Current:** `priorityScore += (course.institution.commissionRate || 0) * 10;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\advertising\route.ts:146
**Current:** `priorityScore += planBonus[course.institution.subscriptionPlan as keyof typeof planBonus] || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\advertising\route.ts:151
**Current:** `estimatedRevenue: (course._count.bookings * course.base_price) || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\advertising\route.ts:152
**Current:** `commissionRevenue: (course._count.bookings * course.base_price * (course.institution.commissionRate || 0) / 100) || 0`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\advertising\route.ts:189
**Current:** `total: totalRevenue._sum.amount || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\advertising\route.ts:190
**Current:** `commission: commissionRevenue._sum.amount || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\advertising\route.ts:192
**Current:** `((commissionRevenue._sum.amount || 0) / totalRevenue._sum.amount * 100) : 0`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\advertising\route.ts:256
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\route.ts:12
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\route.ts:37
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\route.ts:44
**Current:** `if (!name || !description) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\[categoryId]\route.ts:50
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\[categoryId]\route.ts:60
**Current:** `if (!name || !description) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\[categoryId]\route.ts:110
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\cleanup\route.ts:10
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\commissions\calculate\route.ts:67
**Current:** `if (!institutionId || !startDate || !endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\priority\route.ts:18
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\priority\route.ts:62
**Current:** `priorityScore += updatedCourse.priority || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\priority\route.ts:65
**Current:** `priorityScore += (updatedCourse.institution.commissionRate || 0) * 10;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\priority\route.ts:73
**Current:** `priorityScore += planBonus[updatedCourse.institution.subscriptionPlan] || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\priority\route.ts:132
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\route.ts:13
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\route.ts:22
**Current:** `const page = parseInt(searchParams.get('page') || '1');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\route.ts:23
**Current:** `const limit = parseInt(searchParams.get('limit') || '10');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\route.ts:187
**Current:** `if (!title || !institutionId || !categoryId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\route.ts:196
**Current:** `if (base_price === undefined || base_price === null || isNaN(Number(base_price))) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\route.ts:222
**Current:** `pricingPeriod: pricingPeriod || 'WEEKLY',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\route.ts:225
**Current:** `framework: framework || 'GENERAL',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\route.ts:226
**Current:** `level: level || 'BEGINNER',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\route.ts:227
**Current:** `duration: parseInt(duration) || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\route.ts:228
**Current:** `status: status || 'draft',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\route.ts:231
**Current:** `maxStudents: parseInt(maxStudents) || 30,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\enrollments\route.ts:14
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\enrollments\route.ts:39
**Current:** `const page = parseInt(searchParams.get('page') || '1');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\enrollments\route.ts:40
**Current:** `const limit = parseInt(searchParams.get('limit') || '50');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\enrollments\route.ts:150
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\enrollments\route.ts:216
**Current:** `ipAddress: request.headers.get('x-forwarded-for') || 'unknown'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\route.ts:15
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\route.ts:108
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\route.ts:136
**Current:** `const newOrder = order || (lastModule ? lastModule.order_index + 1 : 1);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\route.ts:144
**Current:** `description: description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\route.ts:145
**Current:** `level: level || 'BEGINNER',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\content\route.ts:15
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\content\route.ts:65
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\content\route.ts:96
**Current:** `const order_index = parseInt(formData.get('order_index') as string) || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\content\route.ts:98
**Current:** `if (!title || !type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\content\route.ts:102
**Current:** `let content = url || '';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\content\route.ts:117
**Current:** `const newOrder = order_index || (lastContent ? lastContent.order_index + 1 : 1);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\analytics\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:144
**Current:** `description: description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:161
**Current:** `correct_answer: question.correct_answer || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:162
**Current:** `points: question.points || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:163
**Current:** `difficulty: question.difficulty || 'MEDIUM',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:164
**Current:** `category: question.category || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:165
**Current:** `explanation: question.explanation || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:166
**Current:** `hints: question.hints || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\analytics\route.ts:11
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\analytics\route.ts:40
**Current:** `? completedAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / completedAttempts.length`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\analytics\route.ts:43
**Current:** `? completedAttempts.reduce((sum, a) => sum + (a.timeSpent || 0), 0) / completedAttempts.length`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\analytics\route.ts:46
**Current:** `? (completedAttempts.filter(a => (a.percentage || 0) >= 70).length / completedAttempts.length) * 100`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\analytics\route.ts:81
**Current:** `const score = attempt.percentage || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:82
**Current:** `if (!questionText || questionText.trim().length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:96
**Current:** `if (points < 1 || points > 100) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:120
**Current:** `correct_answer: correct_answer?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:121
**Current:** `points: points || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:122
**Current:** `explanation: explanation?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:126
**Current:** `hints: hints || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:141
**Current:** `option_type: opt.option_type || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:142
**Current:** `content: opt.content || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:143
**Current:** `media_url: opt.media_url || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:351
**Current:** `if (!questionText || questionText.trim().length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:359
**Current:** `if (points < 1 || points > 100) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:382
**Current:** `correct_answer: correct_answer?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:383
**Current:** `points: points || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:384
**Current:** `explanation: explanation?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:388
**Current:** `hints: hints || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:408
**Current:** `option_type: opt.option_type || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:409
**Current:** `content: opt.content || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:410
**Current:** `media_url: opt.media_url || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:195
**Current:** `if (!questionText || questionText.trim().length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:209
**Current:** `if (points < 1 || points > 100) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:225
**Current:** `correct_answer: correct_answer?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:226
**Current:** `points: points || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:227
**Current:** `explanation: explanation?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:231
**Current:** `hints: hints || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:251
**Current:** `option_type: opt.option_type || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:252
**Current:** `content: opt.content || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:253
**Current:** `media_url: opt.media_url || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:160
**Current:** `description: description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:161
**Current:** `quiz_type: quiz_type || existingQuiz.quiz_type,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:162
**Current:** `difficulty: difficulty || existingQuiz.difficulty,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:163
**Current:** `passing_score: passing_score || existingQuiz.passing_score,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:14
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:83
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:120
**Current:** `description: data.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:121
**Current:** `level: data.level || existingModule.level,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:122
**Current:** `estimated_duration: data.estimated_duration || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:123
**Current:** `vocabulary_list: data.vocabulary_list || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:124
**Current:** `grammar_points: data.grammar_points || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:125
**Current:** `cultural_notes: data.cultural_notes || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:180
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\route.ts:130
**Current:** `const base_price = parseFloat(data.base_price) || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\route.ts:139
**Current:** `duration: parseInt(data.duration) || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\route.ts:151
**Current:** `maxStudents: parseInt(data.maxStudents) || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\route.ts:152
**Current:** `pricingPeriod: data.pricingPeriod || 'FULL_COURSE',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\enrollments\[id]\dates\route.ts:14
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\enrollments\[id]\dates\route.ts:30
**Current:** `if (!reason || reason.trim() === '') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\enrollments\[id]\dates\route.ts:38
**Current:** `if (!startDate || !endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\enrollments\[id]\dates\route.ts:50
**Current:** `if (isNaN(start.getTime()) || isNaN(end.getTime())) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\enrollments\[id]\dates\route.ts:172
**Current:** `userEmail: session.user.email || 'unknown',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\enrollments\[id]\dates\route.ts:179
**Current:** `notes: notes || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\enrollments\[id]\dates\route.ts:185
**Current:** `ipAddress: request.headers.get('x-forwarded-for') || 'unknown',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\enrollments\[id]\dates\route.ts:186
**Current:** `userAgent: request.headers.get('user-agent') || 'unknown',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\fix-missing-students\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\health\missing-students\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institution-monetization\route.ts:9
**Current:** `if (!session || session.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institution-monetization\route.ts:54
**Current:** `return sum + (booking.amount || 0);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institution-monetization\route.ts:66
**Current:** `priorityScore += planBonus[institution.subscriptionPlan as keyof typeof planBonus] || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institution-monetization\route.ts:67
**Current:** `priorityScore += (institution.commissionRate || 0) * 5;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institution-monetization\[id]\route.ts:12
**Current:** `if (!session || session.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institution-monetization\[id]\route.ts:28
**Current:** `if (commissionRate !== undefined && (commissionRate < 0 || commissionRate > 100)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\create-simple\route.ts:128
**Current:** `ipAddress: request.ip || 'unknown',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\create-simple\route.ts:129
**Current:** `userAgent: request.headers.get('user-agent') || 'unknown',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:86
**Current:** `if (!session.user.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:113
**Current:** `if (!name || !email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:146
**Current:** `description: description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:147
**Current:** `country: country || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:148
**Current:** `city: city || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:149
**Current:** `state: state || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:150
**Current:** `postcode: postcode || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:151
**Current:** `address: address || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:152
**Current:** `telephone: telephone || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:153
**Current:** `contactName: contactName || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:154
**Current:** `contactJobTitle: contactJobTitle || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:155
**Current:** `contactPhone: contactPhone || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:156
**Current:** `contactEmail: contactEmail || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:157
**Current:** `institutionEmail: institutionEmail || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:158
**Current:** `website: website || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:262
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\settings\route.ts:19
**Current:** `if (!session.user.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\commission-rate\route.ts:13
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\commission-rate\route.ts:23
**Current:** `if (typeof newRate !== 'number' || newRate < 0 || newRate > 100) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\commission-rate\route.ts:86
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\commission-rate\route.ts:119
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\commission-rate\route.ts:126
**Current:** `if (!newRate || !reason) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\courses\route.ts:164
**Current:** `maxStudents: parseInt(maxStudents) || 30,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\facilities\route.ts:22
**Current:** `if (!session.user.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\logo\route.ts:40
**Current:** `if (!session.user.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\main-image\route.ts:38
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\route.ts:18
**Current:** `if (!session.user.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\route.ts:90
**Current:** `if (!session.user.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\route.ts:117
**Current:** `if (!country || !state || !city) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\settings\route.ts:25
**Current:** `if (!session.user.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\settings\route.ts:37
**Current:** `if (!currency || !VALID_CURRENCIES.includes(currency)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\settings\route.ts:45
**Current:** `if (typeof commissionRate !== 'number' || commissionRate < 0 || commissionRate > 100) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\settings\route.ts:83
**Current:** `reason: body.reason || 'Updated by admin',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\status\route.ts:12
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\users\route.ts:85
**Current:** `if (!name || !email || !password || !role) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\users\[userId]\route.ts:34
**Current:** `if (!name || !email || !role) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\payments\disapprove\[paymentId]\route.ts:73
**Current:** `disapprovalReason: reason || 'Disapproved by administrator',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\payments\route.ts:127
**Current:** `bookingId: bookingId || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\performance\health\route.ts:10
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\performance\metrics\route.ts:10
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\performance\route.ts:10
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\process-fallbacks\route.ts:20
**Current:** `if (!user || user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\route.ts:24
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\[id]\add-question\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\[id]\export\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\[id]\import\route.ts:9
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\[id]\import\route.ts:27
**Current:** `points: q.points || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\[id]\import\route.ts:29
**Current:** `difficulty: q.difficulty || 'MEDIUM',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\[id]\remove-question\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\[id]\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\[id]\route.ts:20
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-banks\[id]\route.ts:39
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-templates\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-templates\route.ts:19
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-templates\[id]\route.ts:8
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-templates\[id]\route.ts:20
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\question-templates\[id]\route.ts:42
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\revenue\route.ts:17
**Current:** `const reportType = searchParams.get('type') || 'metrics';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\revenue\route.ts:19
**Current:** `if (!startDate || !endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\revenue\route.ts:71
**Current:** `if (!startDate || !endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\commission-tiers\route.ts:9
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\commission-tiers\route.ts:34
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\commission-tiers\route.ts:67
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\commission-tiers\[id]\route.ts:12
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\email\route.ts:11
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\email\route.ts:48
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\email\route.ts:69
**Current:** `if (!host || !port || !username || !fromEmail || !fromName) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\email\test\route.ts:11
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\error-scanning\route.ts:13
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\error-scanning\route.ts:20
**Current:** `if (!action || !scriptType) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\error-scanning\route.ts:91
**Current:** `details: execError.stderr || execError.message`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\error-scanning\route.ts:128
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\general\route.ts:11
**Current:** `return NextResponse.json({ fileUploadMaxSizeMB: settings.fileUploadMaxSizeMB || 10 });`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\seed-templates\route.ts:10
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\send\route.ts:11
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\send\route.ts:33
**Current:** `if (!recipientEmail || !recipientName || !type || !title || !content) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\send\route.ts:57
**Current:** `recipientId: recipientId || 'test',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\stats\route.ts:10
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\route.ts:11
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\route.ts:50
**Current:** `createdByUser: userMap.get(template.createdBy) || {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\route.ts:55
**Current:** `updatedByUser: template.updatedBy ? (userMap.get(template.updatedBy) || {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\route.ts:76
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\route.ts:97
**Current:** `if (!name || !type || !title || !content || !category) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\route.ts:146
**Current:** `createdByUser: user || {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\route.ts:148
**Current:** `name: session.user.name || 'Admin User',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\route.ts:149
**Current:** `email: session.user.email || 'admin@example.com'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\[id]\route.ts:13
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\[id]\route.ts:52
**Current:** `createdByUser: userMap.get(template.createdBy) || {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\[id]\route.ts:57
**Current:** `updatedByUser: template.updatedBy ? (userMap.get(template.updatedBy) || {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\[id]\route.ts:81
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\[id]\route.ts:165
**Current:** `createdByUser: userMap.get(updatedTemplate.createdBy) || {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\[id]\route.ts:170
**Current:** `updatedByUser: updatedTemplate.updatedBy ? (userMap.get(updatedTemplate.updatedBy) || {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\[id]\route.ts:195
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\payment-approval\route.ts:11
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\payment-approval\route.ts:81
**Current:** `(!payment.paymentMethod ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\payment-approval\route.ts:116
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\payment-approval\route.ts:153
**Current:** `if (isDisablingInstitutionApproval || isAddingExemptions || isRestrictingMethods) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\payment-approval\route.ts:176
**Current:** `(!payment.paymentMethod ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\run-all-maintenance-scripts\route.ts:19
**Current:** `if (!user || user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\run-all-maintenance-scripts\route.ts:171
**Current:** `results.combinedLogs.push(`Deleted orphaned enrollment ${enrollment.id} (Student: ${enrollment.student?.name || 'Unknown'}, Course: ${enrollment.course?.title || 'Unknown'})`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\seed-categories\route.ts:104
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\seed-tags\route.ts:80
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\subscription-plans\route.ts:9
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\subscription-plans\route.ts:114
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\subscription-plans\route.ts:177
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\subscription-plans\route.ts:242
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\subscription-plans\[id]\route.ts:12
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\subscription-plans\[id]\route.ts:81
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:29
**Current:** `prisma?.user.count() || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:30
**Current:** `prisma?.course.count() || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:31
**Current:** `prisma?.institution.count() || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:32
**Current:** `prisma?.studentCourseEnrollment.count() || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:33
**Current:** `prisma?.studentCourseCompletion.count() || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:48
**Current:** `const totalRevenue = totalRevenueResult._sum.institutionAmount || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:91
**Current:** `}) || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:145
**Current:** `const paymentAmount = payment?.amount || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:146
**Current:** `const commissionRate = institution?.commissionRate || 10; // Default 10%`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:152
**Current:** `course: course || { id: '', title: 'Unknown Course', institutionId: '' },`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:153
**Current:** `institution: institution || { id: '', name: 'Unknown Institution', commissionRate: 10 },`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:154
**Current:** `student: student || { id: '', name: 'Unknown Student', email: '' },`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\route.ts:72
**Current:** `commissionRate: commissionTier?.commissionRate || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\route.ts:73
**Current:** `revenueGenerated: revenueGenerated._sum.amount || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\stats\route.ts:92
**Current:** `commissionRate: institution.subscription?.commissionTier?.commissionRate || 0`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\[id]\plan\route.ts:19
**Current:** `if (!planType || !['STARTER', 'PROFESSIONAL', 'ENTERPRISE'].includes(planType)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\[id]\plan\route.ts:23
**Current:** `if (!billingCycle || !['MONTHLY', 'ANNUAL'].includes(billingCycle)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\[id]\route.ts:22
**Current:** `if (!user || user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\[id]\route.ts:70
**Current:** `if (!user || user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\[id]\route.ts:78
**Current:** `if (!planType || !status || !billingCycle || amount === undefined) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\tags\route.ts:9
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\tags\route.ts:75
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\users\route.ts:9
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\users\[userId]\route.ts:96
**Current:** `if (!name || !email || !role) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\users\[userId]\route.ts:174
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\users\[userId]\route.ts:181
**Current:** `if (!role || !['ADMIN', 'INSTITUTION', 'STUDENT'].includes(role)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\users\[userId]\status\route.ts:47
**Current:** `if (!status || !['ACTIVE', 'SUSPENDED'].includes(status)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\analytics\leads\route.ts:20
**Current:** `id: body.id || crypto.randomUUID(),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\analytics\leads\route.ts:30
**Current:** `ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\analytics\leads\route.ts:102
**Current:** `referrerCounts[domain] = (referrerCounts[domain] || 0) + 1;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\analytics\performance\route.ts:25
**Current:** `ipAddress: request.headers.get('x-forwarded-for') || request.ip,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\analytics\performance\route.ts:49
**Current:** `const limit = parseInt(searchParams.get('limit') || '50');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\analytics\performance\route.ts:104
**Current:** `const totalTime = apiEvents.reduce((sum, event) => sum + (event.data?.responseTime || 0), 0);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\check-password-reset\route.ts:119
**Current:** `ipAddress: request.headers.get('x-forwarded-for') || 'unknown',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\check-password-reset\route.ts:120
**Current:** `userAgent: request.headers.get('user-agent') || 'unknown',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\check-session\route.ts:15
**Current:** `user: session?.user || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\custom-signin\route.ts:14
**Current:** `if (!email || !password) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\custom-signin\route.ts:53
**Current:** `institutionId: user.institution?.id || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\custom-signin\route.ts:55
**Current:** `institutionApproved: user.institution?.isApproved || false,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\force-session\route.ts:10
**Current:** `const cookies = request.headers.get('cookie') || '';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\password-reset\route.ts:78
**Current:** `await auditLogger.passwordReset(user.id, request.headers.get('x-forwarded-for') || 'unknown');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\password-reset\route.ts:106
**Current:** `if (!token || !email || !newPassword) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\password-reset\route.ts:151
**Current:** `request.headers.get('x-forwarded-for') || 'unknown'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\register\institution\route.ts:15
**Current:** `if (!name || !email || !password || !description || !country || !city || !address) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\register\route.ts:16
**Current:** `if (!name || !email || !password || !role) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\register\route.ts:292
**Current:** `subscriptionPlan: subscriptionPlan || 'none',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\categories\[id]\route.ts:16
**Current:** `parentId: parentId || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\by-country\route.ts:42
**Current:** `country: institutionMap.get(group.institutionId) || 'Unknown',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\public\route.ts:72
**Current:** `priorityScore += (course.institution.commissionRate || 0) * 10;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\public\route.ts:91
**Current:** `priorityScore += planBonus[subscriptionPlan as keyof typeof planBonus] || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\public\route.ts:102
**Current:** `const commissionRate = course.institution.commissionRate || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route.ts:66
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route.ts:108
**Current:** `base_price: parseFloat(base_price || '0'),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route.ts:114
**Current:** `maxStudents: parseInt(maxStudents || '15'),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route.ts:116
**Current:** `pricingPeriod: pricingPeriod || 'WEEKLY',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route.ts:117
**Current:** `framework: framework || 'CEFR',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route_new.ts:66
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route_new.ts:108
**Current:** `base_price: parseFloat(base_price || '0'),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route_new.ts:114
**Current:** `maxStudents: parseInt(maxStudents || '15'),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route_new.ts:116
**Current:** `pricingPeriod: pricingPeriod || 'WEEKLY',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route_new.ts:117
**Current:** `framework: framework || 'CEFR',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\search\route.ts:10
**Current:** `const query = searchParams.get('query') || '';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\search\route.ts:13
**Current:** `const tagIds = searchParams.get('tagIds')?.split(',').filter(Boolean) || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\search\route.ts:19
**Current:** `const page = parseInt(searchParams.get('page') || '1');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\search\route.ts:20
**Current:** `const limit = parseInt(searchParams.get('limit') || '10');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\search\route.ts:68
**Current:** `if (minPrice || maxPrice) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\enroll\route.ts:40
**Current:** `const start = new Date(startDate || new Date().toISOString());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\enroll\route.ts:41
**Current:** `const end = new Date(endDate || course.endDate);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\enroll\route.ts:93
**Current:** `startDate: new Date(startDate || new Date().toISOString()),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\enroll\route.ts:94
**Current:** `endDate: new Date(endDate || course.endDate),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\enroll\route.ts:197
**Current:** `error: error.message || 'Failed to enroll in course',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\enroll\route.ts:200
**Current:** `{ status: error.message === 'Already enrolled' || error.message === 'Booking already exists' ? 400 : 500 }`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\monthly-pricing\route.ts:17
**Current:** `const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\pricing\route.ts:86
**Current:** `const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\route.ts:101
**Current:** `if (!title || !description || !categoryId || !institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\cron\trial-expiration\route.ts:11
**Current:** `if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\quiz\route.ts:24
**Current:** `const quizId = searchParams.get('quizId') || 'all';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\quiz\route.ts:25
**Current:** `const timeRange = searchParams.get('timeRange') || '30d';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\quiz\route.ts:97
**Current:** `? completedAttempts.reduce((sum, attempt) => sum + (attempt.time_spent || 0), 0) / completedAttempts.length / 60`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\quiz\route.ts:116
**Current:** `? completed.reduce((sum, a) => sum + (a.time_spent || 0), 0) / completed.length / 60`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\quiz\route.ts:155
**Current:** `? adaptiveAttempts.reduce((sum, a) => sum + (a.ability_estimate || 0), 0) / adaptiveAttempts.length`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\quiz\route.ts:158
**Current:** `? adaptiveAttempts.reduce((sum, a) => sum + (a.confidence_level || 0), 0) / adaptiveAttempts.length`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\quiz\route.ts:162
**Current:** `const reason = attempt.termination_reason || 'UNKNOWN';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\quiz\route.ts:163
**Current:** `acc[reason] = (acc[reason] || 0) + 1;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\quiz\route.ts:186
**Current:** `? dayAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / dayAttempts.length`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\stats\route.ts:9
**Current:** `if (!session?.user || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\stats\route.ts:63
**Current:** `return paymentSum + (payment.amount || 0);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\stats\route.ts:77
**Current:** `priorityScore += planBonus[institution.subscriptionPlan as keyof typeof planBonus] || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\stats\route.ts:78
**Current:** `priorityScore += (institution.commissionRate || 0) * 5;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\categories\route.ts:25
**Current:** `if (!types || types.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\collaboration\stats\route.ts:148
**Current:** `averageRating: averageRating._avg.rating || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\commission-rate\route.ts:19
**Current:** `if (typeof newRate !== 'number' || newRate < 0 || newRate > 100) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\route.ts:164
**Current:** `courseTags: courseTagsMap[course.id] || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\route.ts:166
**Current:** `bookings: bookingCountsMap[course.id] || 0`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\route.ts:168
**Current:** `modules: modulesMap[course.id] || []`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\route.ts:226
**Current:** `tags: body.tags || []`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\route.ts:259
**Current:** `status: validatedData.status || 'DRAFT',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\dates\route.ts:20
**Current:** `if (!startDate || !endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\dates\route.ts:30
**Current:** `if (isNaN(start.getTime()) || isNaN(end.getTime())) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\enrollments\route.ts:104
**Current:** `const enrollmentPayments = paymentMap[enrollment.id] || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\enrollments\route.ts:116
**Current:** `firstName: student.name.split(' ')[0] || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\enrollments\route.ts:117
**Current:** `lastName: student.name.split(' ').slice(1).join(' ') || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\route.ts:15
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\route.ts:100
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\route.ts:135
**Current:** `const newOrder = order || (lastModule ? lastModule.order_index + 1 : 1);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\route.ts:144
**Current:** `level: level || 'CEFR_A1',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\route.ts:45
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\route.ts:91
**Current:** `if (!title || !type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\route.ts:168
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\[contentId]\route.ts:97
**Current:** `if (!title || !type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\[contentId]\route.ts:109
**Current:** `content: url || '', // Save URL to content field`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\[contentId]\route.ts:111
**Current:** `order_index: order_index || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\route.ts:15
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\route.ts:78
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\route.ts:119
**Current:** `if (!type || !question || !answer) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\route.ts:129
**Current:** `const newOrder = order_index || (lastExercise ? lastExercise.order_index + 1 : 1);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\route.ts:138
**Current:** `options: options || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:14
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:79
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:132
**Current:** `if (!type || !question || !answer) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:144
**Current:** `options: options || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:146
**Current:** `order_index: order_index || existingExercise.order_index,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:166
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:14
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:69
**Current:** `if (!questionText || questionText.trim().length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:73
**Current:** `if (points && (points < 1 || points > 100)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:84
**Current:** `if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:87
**Current:** `if (!question.correct_answer || question.correct_answer.trim().length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:93
**Current:** `if (!question.correct_answer || !['true', 'false', 'TRUE', 'FALSE'].includes(question.correct_answer)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:99
**Current:** `if (!question.correct_answer || question.correct_answer.trim().length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:105
**Current:** `if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:108
**Current:** `if (!question.correct_answer || question.correct_answer.trim().length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:119
**Current:** `if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:122
**Current:** `if (!question.correct_answer || question.correct_answer.trim().length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:128
**Current:** `if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:131
**Current:** `if (!question.correct_answer || question.correct_answer.trim().length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:149
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:215
**Current:** `if (!title || title.trim().length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:219
**Current:** `if (!Array.isArray(questions) || questions.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:223
**Current:** `if (passing_score && (passing_score < 0 || passing_score > 100)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:231
**Current:** `if (max_attempts && (max_attempts < 1 || max_attempts > 10)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:260
**Current:** `description: description?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:261
**Current:** `passing_score: passing_score || 70,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:262
**Current:** `time_limit: time_limit || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:263
**Current:** `mediaUrl: mediaUrl || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:267
**Current:** `category: category?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:269
**Current:** `instructions: instructions?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:290
**Current:** `correct_answer: q.correct_answer?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:291
**Current:** `points: q.points || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:294
**Current:** `difficulty: q.difficulty || 'MEDIUM',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:295
**Current:** `category: q.category?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:297
**Current:** `explanation: q.explanation?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:322
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:393
**Current:** `if (!title || title.trim().length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:397
**Current:** `if (!Array.isArray(questions) || questions.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:401
**Current:** `if (passing_score && (passing_score < 0 || passing_score > 100)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:409
**Current:** `if (max_attempts && (max_attempts < 1 || max_attempts > 10)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:450
**Current:** `description: description?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:451
**Current:** `passing_score: passing_score || 70,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:452
**Current:** `time_limit: time_limit || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:453
**Current:** `mediaUrl: mediaUrl || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:457
**Current:** `category: category?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:459
**Current:** `instructions: instructions?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:484
**Current:** `correct_answer: q.correct_answer?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:485
**Current:** `points: q.points || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:488
**Current:** `difficulty: q.difficulty || 'MEDIUM',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:489
**Current:** `category: q.category?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:491
**Current:** `explanation: q.explanation?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:516
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:15
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:84
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:157
**Current:** `if (!question || question.trim().length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:186
**Current:** `if (normalizedType === 'MULTIPLE_CHOICE' && (!options || !Array.isArray(options) || options.length < 2)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:190
**Current:** `if (normalizedType === 'MATCHING' && (!question_config?.leftItems || !question_config?.rightItems)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:194
**Current:** `if (normalizedType === 'DRAG_AND_DROP' && (!question_config?.dragItems || !question_config?.dropZones)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:202
**Current:** `if (normalizedType === 'ORDERING' && (!question_config?.orderItems || question_config.orderItems.length < 2)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:206
**Current:** `if (points && (points < 1 || points > 100)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:215
**Current:** `if (!use_manual_irt || !irt_difficulty || !irt_discrimination || !irt_guessing) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:294
**Current:** `points: points || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:297
**Current:** `difficulty: difficulty || 'MEDIUM',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:302
**Current:** `order_index: order_index || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:317
**Current:** `option_type: option.option_type || 'TEXT',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:320
**Current:** `order_index: option.order_index || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:321
**Current:** `is_correct: option.is_correct || false,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:322
**Current:** `points: option.points || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:12
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:87
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:171
**Current:** `if (!questionText || questionText.trim().length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:200
**Current:** `if (normalizedType === 'MULTIPLE_CHOICE' && (!options || !Array.isArray(options) || options.length < 2)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:204
**Current:** `if (normalizedType === 'MATCHING' && (!question_config?.leftItems || !question_config?.rightItems)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:208
**Current:** `if (normalizedType === 'DRAG_AND_DROP' && (!question_config?.dragItems || !question_config?.dropZones)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:216
**Current:** `if (normalizedType === 'ORDERING' && (!question_config?.orderItems || question_config.orderItems.length < 2)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:220
**Current:** `if (points && (points < 1 || points > 100)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:229
**Current:** `if (!use_manual_irt || !irt_difficulty || !irt_discrimination || !irt_guessing) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:307
**Current:** `correct_answer: correct_answer?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:308
**Current:** `points: points || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:309
**Current:** `explanation: explanation?.trim() || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:310
**Current:** `difficulty: difficulty || 'MEDIUM',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:311
**Current:** `category: category || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:312
**Current:** `hints: hints || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:314
**Current:** `media_url: media_url || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:315
**Current:** `media_type: media_type || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:337
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:12
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:112
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:14
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:128
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:179
**Current:** `description: data.description || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:181
**Current:** `estimated_duration: data.estimated_duration || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:182
**Current:** `vocabulary_list: data.vocabulary_list || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:183
**Current:** `grammar_points: data.grammar_points || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:184
**Current:** `cultural_notes: data.cultural_notes || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:185
**Current:** `is_published: data.is_published || false,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\route.ts:219
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\monthly-prices\route.ts:97
**Current:** `const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\route.ts:117
**Current:** `tag: tag || null`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\route.ts:173
**Current:** `tags: tags || []`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\weekly-prices\route.ts:99
**Current:** `const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\enrollments\[id]\dates\route.ts:20
**Current:** `if (!startDate || !endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\enrollments\[id]\dates\route.ts:30
**Current:** `if (isNaN(start.getTime()) || isNaN(end.getTime())) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\info\route.ts:42
**Current:** `const logoUrl = institution.logoUrl || institution.logo;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payments\route.ts:134
**Current:** `bookingId: bookingId || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payouts\route.ts:74
**Current:** `if (!payoutId || !status) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\facilities\route.ts:46
**Current:** `if (!files || files.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\main-image\route.ts:35
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\route.ts:126
**Current:** `const contentType = request.headers.get('content-type') || '';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\bulk-delete\route.ts:27
**Current:** `if (!bankIds || !Array.isArray(bankIds) || bankIds.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\bulk-export\route.ts:27
**Current:** `if (!bankIds || !Array.isArray(bankIds) || bankIds.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\bulk-update\route.ts:27
**Current:** `if (!bankIds || !Array.isArray(bankIds) || bankIds.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\bulk-update\route.ts:31
**Current:** `if (!updates || typeof updates !== 'object') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\import\route.ts:45
**Current:** `if (!importData.name || !importData.questions || !Array.isArray(importData.questions)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\import\route.ts:53
**Current:** `description: importData.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\import\route.ts:54
**Current:** `category: importData.category || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\import\route.ts:55
**Current:** `tags: importData.tags || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\import\route.ts:56
**Current:** `is_public: importData.is_public || false,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\import\route.ts:69
**Current:** `options: questionData.options || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\import\route.ts:71
**Current:** `explanation: questionData.explanation || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\import\route.ts:72
**Current:** `difficulty: questionData.difficulty || 'MEDIUM',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\import\route.ts:73
**Current:** `category: questionData.category || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\import\route.ts:74
**Current:** `tags: questionData.tags || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\import\route.ts:75
**Current:** `points: questionData.points || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\route.ts:105
**Current:** `tags: tags || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\route.ts:106
**Current:** `is_public: is_public || false,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\export\route.ts:17
**Current:** `const format = searchParams.get('format') || 'json';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\export\route.ts:96
**Current:** ``"${Array.isArray(q.options) ? q.options.join('|') : q.options || ''}"`,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\export\route.ts:97
**Current:** ``"${q.correct_answer || ''}"`,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\export\route.ts:98
**Current:** ``"${q.explanation || ''}"`,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\import\route.ts:18
**Current:** `const format = formData.get('format') as string || 'json';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\import\route.ts:55
**Current:** `questions = jsonData.questions || jsonData || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\import\route.ts:70
**Current:** `const value = values[index] || '';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\import\route.ts:91
**Current:** `question.points = parseInt(value) || 1;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\import\route.ts:114
**Current:** `if (!Array.isArray(questions) || questions.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\import\route.ts:125
**Current:** `correct_answer: q.correct_answer || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\import\route.ts:126
**Current:** `explanation: q.explanation || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\import\route.ts:127
**Current:** `difficulty_level: q.difficulty_level || 'MEDIUM',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\import\route.ts:128
**Current:** `points: parseInt(q.points) || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk\route.ts:18
**Current:** `if (!Array.isArray(questionIds) || questionIds.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk\route.ts:79
**Current:** `if (!Array.isArray(questionIds) || questionIds.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk\route.ts:83
**Current:** `if (!updates || typeof updates !== 'object') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk-delete\route.ts:31
**Current:** `if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\route.ts:136
**Current:** `if (!question_text || !question_type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\route.ts:144
**Current:** `options: options || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\route.ts:147
**Current:** `difficulty: difficulty || 'MEDIUM',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\route.ts:149
**Current:** `tags: tags || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\route.ts:150
**Current:** `points: points || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\share\route.ts:39
**Current:** `if (!questionIds || !Array.isArray(questionIds) || questionIds.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\share\route.ts:106
**Current:** `allowCopy: allowCopy || false,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\share\route.ts:107
**Current:** `allowModify: allowModify || false`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\share\route.ts:109
**Current:** `shared_message: message || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\share\route.ts:121
**Current:** `message: message || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\share\route.ts:122
**Current:** `allow_copy: allowCopy || false,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\share\route.ts:123
**Current:** `allow_modify: allowModify || false,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:143
**Current:** `if (!question_text || !question_type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:152
**Current:** `options: options || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:155
**Current:** `difficulty: difficulty || 'MEDIUM',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:157
**Current:** `tags: tags || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:158
**Current:** `points: points || 1`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\route.ts:78
**Current:** `tags: tags || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\route.ts:79
**Current:** `is_public: is_public || false,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\route.ts:54
**Current:** `if (!name || !description || !question_type || !template_data) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\rate\route.ts:21
**Current:** `if (!rating || rating < 1 || rating > 5) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\quizzes\route.ts:79
**Current:** `acc[q.quiz_type] = (acc[q.quiz_type] || 0) + 1;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\quizzes\route.ts:83
**Current:** `const most_popular_type_key = Object.keys(most_popular_type).reduce((a, b) => (most_popular_type[a] > most_popular_type[b] ? a : b), Object.keys(most_popular_type)[0] || '');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\quizzes\route.ts:84
**Current:** `const recent_activity = quizzes.reduce((sum, q) => sum + (q.total_attempts || 0), 0);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\quizzes\route.ts:86
**Current:** `? Math.round((quizzes.reduce((sum, q) => sum + (q.total_completions || 0), 0) / quizzes.length) * 100)`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\quizzes\route.ts:93
**Current:** `most_popular_type: most_popular_type_key || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\quizzes\route.ts:124
**Current:** `id: module?.id || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\quizzes\route.ts:125
**Current:** `title: module?.title || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\quizzes\route.ts:127
**Current:** `id: course?.id || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\quizzes\route.ts:128
**Current:** `title: course?.title || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\discount\route.ts:17
**Current:** `if (!session.user.role || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\discount\route.ts:74
**Current:** `if (!session.user.role || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\discount\route.ts:92
**Current:** `if (typeof startingRate !== 'number' || startingRate < 0 || startingRate > 100) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\discount\route.ts:99
**Current:** `if (typeof incrementRate !== 'number' || incrementRate < 0 || incrementRate > 100) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\discount\route.ts:106
**Current:** `if (typeof incrementPeriodWeeks !== 'number' || incrementPeriodWeeks < 1) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\discount\route.ts:113
**Current:** `if (typeof maxDiscountCap !== 'number' || maxDiscountCap < 0 || maxDiscountCap > 100) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\payment-approval\route.ts:29
**Current:** `if (!institutionUser || !institutionUser.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\route.ts:60
**Current:** `effectiveCommissionRate = institution.subscription.commissionTier.commissionRate || institution.commissionRate;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\setup\route.ts:10
**Current:** `if (!session || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\setup\route.ts:31
**Current:** `if (!name || !email || !description || !country || !city || !address) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\setup\route.ts:44
**Current:** `if (!user || !user.institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:123
**Current:** `shared_by: course?.institution?.name || 'Unknown Institution',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:126
**Current:** `id: quiz?.id || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:127
**Current:** `name: quiz?.title || 'Quiz Question',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:128
**Current:** `description: quiz?.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:129
**Current:** `category: question.category || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:132
**Current:** `id: course?.institution?.id || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:133
**Current:** `name: course?.institution?.name || 'Unknown',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:137
**Current:** `id: course?.institution?.id || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:138
**Current:** `name: course?.institution?.name || 'Unknown Institution',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:139
**Current:** `country: course?.institution?.country || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:141
**Current:** `usage_count: question.times_asked || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:142
**Current:** `rating: question.success_rate || 0`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\stats\route.ts:79
**Current:** `}).then(result => result._sum.institutionAmount || 0),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\stats\route.ts:163
**Current:** `paymentAmount: enrollment.payments[0]?.institutionAmount || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\stats\route.ts:164
**Current:** `totalAmount: enrollment.payments[0]?.amount || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\stats\route.ts:165
**Current:** `commissionAmount: enrollment.payments[0]?.commissionAmount || 0`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\students\route.ts:115
**Current:** `acc + (student.enrollments?.length || 0), 0) / (students.length || 1)`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\students\route.ts:123
**Current:** `status: student.status?.toLowerCase() || 'active',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\students\route.ts:124
**Current:** `enrolledCourses: student.enrollments?.length || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\students\route.ts:125
**Current:** `completedCourses: student.completions?.length || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\students\[id]\route.ts:82
**Current:** `progress: enrollment.progress || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\students\[id]\route.ts:88
**Current:** `grade: completion.grade || 'N/A',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\billing-history\route.ts:33
**Current:** `const page = parseInt(searchParams.get('page') || '1');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\billing-history\route.ts:34
**Current:** `const limit = parseInt(searchParams.get('limit') || '20');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\payment\route.ts:25
**Current:** `if (!planType || !['STARTER', 'PROFESSIONAL', 'ENTERPRISE'].includes(planType)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:57
**Current:** `amount: institution.subscription.commissionTier?.price || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:58
**Current:** `currency: institution.subscription.commissionTier?.currency || 'USD',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:59
**Current:** `features: institution.subscription.commissionTier?.features || {},`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:117
**Current:** `if (!planType || !['STARTER', 'PROFESSIONAL', 'ENTERPRISE'].includes(planType)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:184
**Current:** `if (!planType || !['STARTER', 'PROFESSIONAL', 'ENTERPRISE'].includes(planType)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:190
**Current:** `billingCycle || 'MONTHLY',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:196
**Current:** `if (!planType || !['STARTER', 'PROFESSIONAL'].includes(planType)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:261
**Current:** `const reason = searchParams.get('reason') || 'Subscription cancelled by user';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\upgrade\route.ts:19
**Current:** `if (!planType || !['PROFESSIONAL', 'ENTERPRISE'].includes(planType)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\upgrade\route.ts:31
**Current:** `if (!currentSubscription || currentSubscription.status !== 'ACTIVE') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscriptions\route.ts:58
**Current:** `if (!planType || !['STARTER', 'PROFESSIONAL', 'ENTERPRISE'].includes(planType)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscriptions\route.ts:62
**Current:** `if (!billingCycle || !['MONTHLY', 'ANNUAL'].includes(billingCycle)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\upload\route.ts:22
**Current:** `if (!file || !type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution-registration\route.ts:78
**Current:** `email: validatedData.institutionEmail || validatedData.email,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution-registration\route.ts:79
**Current:** `website: validatedData.website || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution-registration\route.ts:85
**Current:** `postcode: validatedData.postcode || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution-registration\route.ts:90
**Current:** `contactEmail: validatedData.contactEmail || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution-registration\route.ts:139
**Current:** `ipAddress: request.ip || 'unknown',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution-registration\route.ts:140
**Current:** `userAgent: request.headers.get('user-agent') || 'unknown',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\route.ts:11
**Current:** `const limit = parseInt(searchParams.get('limit') || '0');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\approve\route.ts:12
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:65
**Current:** `...(isInstitutionUser || isAdmin ? {} : { status: 'PUBLISHED' })`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:86
**Current:** `if (!institution.isApproved || institution.status !== 'ACTIVE') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:96
**Current:** `coursesCount: institution.courses?.length || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:97
**Current:** `courses: institution.courses?.map(c => ({ id: c.id, title: c.title, status: c.status })) || []`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:120
**Current:** `courses: institution.courses || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:171
**Current:** `const contentType = request.headers.get('content-type') || '';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\status\route.ts:14
**Current:** `if (!session || session.user.role?.toUpperCase() !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\status\route.ts:44
**Current:** `isApproved: status === 'APPROVED' || status === 'ACTIVE' ? true : undefined`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\upload\route.ts:26
**Current:** `if (!file || !type) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\locations\route.ts:64
**Current:** `return NextResponse.json(statesByCountry[countryCode] || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\locations\route.ts:67
**Current:** `if (!countryCode || !stateCode) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\locations\route.ts:71
**Current:** `return NextResponse.json(citiesByState[key] || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\preferences\route.ts:82
**Current:** `if (!preferences || !Array.isArray(preferences)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\preferences\route.ts:140
**Current:** `if (!action || !templateIds || !Array.isArray(templateIds)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\route.ts:14
**Current:** `const page = parseInt(searchParams.get('page') || '1');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\route.ts:15
**Current:** `const limit = parseInt(searchParams.get('limit') || '20');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\route.ts:58
**Current:** `read: stats.find(s => s.status === 'READ')?._count.status || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\route.ts:59
**Current:** `unread: stats.find(s => s.status === 'UNREAD')?._count.status || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\route.ts:60
**Current:** `sent: stats.find(s => s.status === 'SENT')?._count.status || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\route.ts:61
**Current:** `failed: stats.find(s => s.status === 'FAILED')?._count.status || 0`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\route.ts:92
**Current:** `if (!notificationIds || !Array.isArray(notificationIds) || !action) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\send\route.ts:9
**Current:** `//   process.env.VAPID_SUBJECT || 'mailto:admin@fluentish.com',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\send\route.ts:10
**Current:** `//   process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\send\route.ts:11
**Current:** `//   process.env.VAPID_PRIVATE_KEY || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\send\route.ts:35
**Current:** `if (!title || !body) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\send\route.ts:43
**Current:** `in: userIds || [session.user.id] // If no userIds specified, send to current user`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\send\route.ts:60
**Current:** `icon: icon || '/icon.svg',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\send\route.ts:61
**Current:** `badge: badge || '/icon.svg',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\send\route.ts:85
**Current:** `process.env.VAPID_SUBJECT || 'mailto:admin@fluentish.com',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\send\route.ts:86
**Current:** `process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\send\route.ts:87
**Current:** `process.env.VAPID_PRIVATE_KEY || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\send\route.ts:175
**Current:** `const page = parseInt(searchParams.get('page') || '1');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\send\route.ts:176
**Current:** `const limit = parseInt(searchParams.get('limit') || '20');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\subscribe\route.ts:8
**Current:** `//   process.env.VAPID_SUBJECT || 'mailto:admin@fluentish.com',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\subscribe\route.ts:9
**Current:** `//   process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\subscribe\route.ts:10
**Current:** `//   process.env.VAPID_PRIVATE_KEY || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\subscribe\route.ts:22
**Current:** `if (!endpoint || !keys) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\subscribe\route.ts:52
**Current:** `process.env.VAPID_SUBJECT || 'mailto:admin@fluentish.com',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\subscribe\route.ts:53
**Current:** `process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\subscribe\route.ts:54
**Current:** `process.env.VAPID_PRIVATE_KEY || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\search\route.ts:55
**Current:** `if (validatedParams.minPrice !== undefined || validatedParams.maxPrice !== undefined) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\search\route.ts:57
**Current:** `min: validatedParams.minPrice || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\search\route.ts:58
**Current:** `max: validatedParams.maxPrice || 999999`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\search\route.ts:62
**Current:** `if (validatedParams.minDuration !== undefined || validatedParams.maxDuration !== undefined) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\search\route.ts:64
**Current:** `min: validatedParams.minDuration || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\search\route.ts:65
**Current:** `max: validatedParams.maxDuration || 999999`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\search\route.ts:69
**Current:** `if (validatedParams.startDateFrom || validatedParams.startDateTo) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\search\route.ts:116
**Current:** `if (!query || typeof query !== 'string') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\route.ts:124
**Current:** `progress: enrollment?.progress || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\route.ts:127
**Current:** `hasOutstandingPayment: !!payment && payment.some(p => p.status === 'PENDING' || p.status === 'PROCESSING'),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\route.ts:136
**Current:** `price: booking?.amount || payment?.[0]?.amount || course.base_price,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\enroll\route.ts:91
**Current:** `if (!course?.maxStudents || !course?.base_price) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\quizzes\[quizId]\attempts\route.ts:12
**Current:** `if (!session || session.user.role !== 'STUDENT') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\quizzes\[quizId]\start\route.ts:15
**Current:** `if (!session || session.user.role !== 'STUDENT') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\quizzes\[quizId]\submit\route.ts:13
**Current:** `if (!session || session.user.role !== 'STUDENT') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\route.ts:108
**Current:** `const quizCompleted = studentProgress?.quiz_completed || false;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\route.ts:121
**Current:** `mediaUrl: q.mediaUrl || null`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\route.ts:122
**Current:** `})) || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\route.ts:123
**Current:** `student_progress: studentProgress || {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\payment\route.ts:54
**Current:** `const amount = booking?.amount || enrollment.course.base_price;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\route.ts:98
**Current:** `status: enrollments[0]?.status || 'ACTIVE',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\route.ts:100
**Current:** `startDate: enrollments[0]?.startDate || course.startDate,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\route.ts:101
**Current:** `endDate: enrollments[0]?.endDate || course.endDate,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\courses\route.ts:88
**Current:** `_count: countData?._count || { content_items: 0, exercises: 0, quizzes: 0 }`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\quiz-stats\route.ts:9
**Current:** `if (!session || session.user.role !== 'STUDENT') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\quiz-stats\route.ts:74
**Current:** `const scores = attempts.map(attempt => attempt.percentage || 0);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\quiz-stats\route.ts:103
**Current:** `const attemptDate = new Date(attempt.completed_at || attempt.started_at);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\quiz-stats\route.ts:124
**Current:** `quizTitle: quiz?.title || 'Unknown Quiz',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\quiz-stats\route.ts:125
**Current:** `courseTitle: course?.title || 'Unknown Course',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\quiz-stats\route.ts:126
**Current:** `moduleTitle: module?.title || 'Unknown Module',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\quiz-stats\route.ts:135
**Current:** `passed: attempt.percentage ? attempt.percentage >= (quiz?.passing_score || 0) : false`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\recent-modules\route.ts:72
**Current:** `moduleTitle: module?.title || 'Unknown Module',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\recent-modules\route.ts:73
**Current:** `courseTitle: course?.title || 'Unknown Course',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\recent-modules\route.ts:81
**Current:** `lastStudyDate: progress.lastStudyDate?.toISOString() || progress.lastAccessedAt?.toISOString() || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:103
**Current:** `? enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:156
**Current:** `moduleTitle: module?.title || 'Unknown Module',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:157
**Current:** `courseTitle: course?.title || 'Unknown Course',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:169
**Current:** `totalCourses: totalEnrolled || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:170
**Current:** `completedCourses: totalCompleted || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:171
**Current:** `inProgressCourses: inProgress || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:172
**Current:** `averageProgress: Math.round((averageProgress || 0) * 100),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:173
**Current:** `activeCourses: enrollments.filter(e => e.status === 'ACTIVE').length || 0`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:181
**Current:** `title: course?.title || 'Unknown Course',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:182
**Current:** `progress: e.progress || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:184
**Current:** `startDate: e.startDate || e.createdAt,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:185
**Current:** `endDate: e.endDate || course?.endDate || new Date().toISOString(),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:187
**Current:** `name: institutions.find(i => i.id === course?.institutionId)?.name || 'Unknown Institution'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:196
**Current:** `title: course?.title || 'Unknown Course',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\stats\route.ts:126
**Current:** `? Math.round(quizAttempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / quizAttempts.length)`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:39
**Current:** `if (!courseId || !startDate || !endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:103
**Current:** `if (!isValid(start) || !isValid(end)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:140
**Current:** `if (!weeklyPrices || weeklyPrices.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:144
**Current:** `if (!course.base_price || course.base_price <= 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:202
**Current:** `if (!monthlyPrices || monthlyPrices.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:206
**Current:** `if (!course.base_price || course.base_price <= 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:230
**Current:** `if (!course.base_price || course.base_price <= 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:250
**Current:** `if (!course.base_price || course.base_price <= 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\calculate-price\route.ts:264
**Current:** `if (!totalPrice || totalPrice <= 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\route.ts:63
**Current:** `const cookies = request.headers.get('cookie') || '';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\route.ts:74
**Current:** `startDate: startDate || new Date().toISOString(),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\route.ts:75
**Current:** `endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\route.ts:84
**Current:** `details: error.details || 'Could not calculate the course price'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\route.ts:99
**Current:** `startDate: new Date(startDate || new Date().toISOString()),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\enrollments\route.ts:100
**Current:** `endDate: new Date(endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\exercises\[exerciseId]\submit\route.ts:13
**Current:** `if (!session || session.user.role !== 'STUDENT') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\exercises\[exerciseId]\submit\route.ts:20
**Current:** `if (userAnswer === undefined || isCorrect === undefined) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\learning-path\route.ts:15
**Current:** `const studentId = searchParams.get('studentId') || session.user.id;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\learning-path\route.ts:89
**Current:** `timeSpent = progress.timeSpent || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\learning-path\route.ts:90
**Current:** `quizScore = progress.quizScore || undefined;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\learning-path\route.ts:95
**Current:** `} else if (progress.contentCompleted || progress.exercisesCompleted || progress.quizCompleted) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\learning-path\route.ts:111
**Current:** `if (!previousProgress || !previousProgress.contentCompleted || !previousProgress.exercisesCompleted || !previousProgress.quizCompleted) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\learning-path\route.ts:127
**Current:** `estimatedTime: module.estimated_duration || 30, // Default 30 minutes`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\learning-path\route.ts:128
**Current:** `difficulty: module.level || 'beginner',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\learning-path\route.ts:131
**Current:** `lastAccessed: progress?.lastStudyDate?.toISOString() || progress?.lastAccessedAt?.toISOString()`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\learning-path\route.ts:156
**Current:** `description: currentCourse.description || 'Continue your learning journey',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\learning-path\route.ts:165
**Current:** `institution: currentCourse.institution?.name || 'Unknown Institution'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\learning-path\route.ts:266
**Current:** `progress: enrollment.progress || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\notifications\route.ts:46
**Current:** `return data.email_notifications || data.push_notifications || data.sms_notifications;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\payments\process\[paymentId]\route.ts:111
**Current:** `amount: payment.metadata?.institutionAmount || (payment.amount - (payment.amount * payment.enrollment.course.institution.commissionRate / 100)),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\payments\process\[paymentId]\route.ts:186
**Current:** `details: error.message || 'An unexpected error occurred',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\profile\password\route.ts:23
**Current:** `if (!currentPassword || !newPassword) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\profile\password\route.ts:39
**Current:** `const isPasswordValid = await bcrypt.compare(currentPassword, user.password || '');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\profile\route.ts:134
**Current:** `if (!name || !email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress\route.ts:143
**Current:** `courses.reduce((acc, course) => acc + course.progress, 0) / courses.length || 0`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:15
**Current:** `const studentId = searchParams.get('studentId') || session.user.id;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:16
**Current:** `const timeRange = searchParams.get('timeRange') || '30d';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:95
**Current:** `course: course || null`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:147
**Current:** `const progressDate = new Date(p.lastStudyDate || p.lastAccessedAt);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:156
**Current:** `const timeSpent = dayProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:162
**Current:** `? Math.round(dayQuizzes.reduce((sum, q) => sum + (q.percentage || 0), 0) / dayQuizzes.length)`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:191
**Current:** `const progressDate = new Date(p.lastStudyDate || p.lastAccessedAt);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:200
**Current:** `const totalTime = weekProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:202
**Current:** `? Math.round(weekQuizzes.reduce((sum, q) => sum + (q.percentage || 0), 0) / weekQuizzes.length)`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:243
**Current:** `const courseTitle = progress.module?.course?.title || 'Unknown Course';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:256
**Current:** `subject.timeSpent += progress.timeSpent || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:277
**Current:** `const totalTimeSpent = moduleProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:283
**Current:** `? Math.round(quizAttempts.reduce((sum, q) => sum + (q.percentage || 0), 0) / quizAttempts.length)`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:31
**Current:** `hints: question.hints ? (Array.isArray(question.hints) ? question.hints : JSON.parse(question.hints || '[]')) : []`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:94
**Current:** `const adaptiveConfig = quiz.adaptive_config as any || {};`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:95
**Current:** `const initialAbility = adaptiveConfig.initial_ability || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:124
**Current:** `difficulty: question.irt_difficulty || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:125
**Current:** `discrimination: question.irt_discrimination || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:126
**Current:** `guessing: question.irt_guessing || 0.25`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:146
**Current:** `difficulty: response.question.irt_difficulty || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:147
**Current:** `discrimination: response.question.irt_discrimination || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:148
**Current:** `guessing: response.question.irt_guessing || 0.25`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:168
**Current:** `timeSpent: responseTime || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:187
**Current:** `adaptive_history: [...(attempt.adaptive_history as any[] || []), {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:238
**Current:** `difficulty: q.irt_difficulty || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:239
**Current:** `discrimination: q.irt_discrimination || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:240
**Current:** `guessing: q.irt_guessing || 0.25`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:242
**Current:** `category: q.category || 'general',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:312
**Current:** `distance: Math.abs((q.irt_difficulty || 0) - initialAbility)`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:316
**Current:** `return questionsWithDistance[0]?.question || questions[0];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:329
**Current:** `const correctPairs = JSON.parse(question.correct_answer || '[]');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\recommendations\route.ts:15
**Current:** `const limit = parseInt(searchParams.get('limit') || '6');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\billing-history\route.ts:36
**Current:** `const page = parseInt(searchParams.get('page') || '1');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\billing-history\route.ts:37
**Current:** `const limit = parseInt(searchParams.get('limit') || '20');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\payment\route.ts:25
**Current:** `if (!planType || !['BASIC', 'PREMIUM', 'PRO'].includes(planType)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:61
**Current:** `if (!planType || !['BASIC', 'PREMIUM', 'PRO'].includes(planType)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:84
**Current:** `const calculatedAmount = amount || (billingCycle === 'ANNUAL' ? plan.annualPrice : plan.monthlyPrice);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:203
**Current:** `if (!planType || !['BASIC', 'PREMIUM', 'PRO'].includes(planType)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:224
**Current:** `billingCycle: billingCycle || currentSubscription.billingCycle,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:241
**Current:** `newBillingCycle: billingCycle || currentSubscription.billingCycle,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:243
**Current:** `reason: body.reason || 'Plan upgrade'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:249
**Current:** `if (!planType || !['BASIC', 'PREMIUM'].includes(planType)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:286
**Current:** `reason: body.reason || 'Plan downgrade'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:384
**Current:** `const reason = searchParams.get('reason') || 'Subscription cancelled by user';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\upgrade\route.ts:17
**Current:** `if (!planType || !['BASIC', 'PREMIUM', 'PRO'].includes(planType)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\upgrade\route.ts:61
**Current:** `billingCycle: billingCycle || currentSubscription.billingCycle,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\subscriptions\create\route.ts:17
**Current:** `if (!planId || price === undefined || !paymentMethod) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\analytics\route.ts:9
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\public\route.ts:8
**Current:** `const limit = parseInt(searchParams.get('limit') || '50');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\route.ts:170
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\route.ts:213
**Current:** `featured: featured || false,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\route.ts:214
**Current:** `priority: priority || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\[id]\route.ts:46
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\[id]\route.ts:146
**Current:** `if (!session || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\test-session\route.ts:10
**Current:** `const cookies = request.headers.get('cookie') || '';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\test-session-establishment\route.ts:16
**Current:** `const cookies = request.headers.get('cookie') || '';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\user\settings\route.ts:73
**Current:** `if (!name || !email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\webhooks\stripe\route.ts:42
**Current:** `if (type === 'institution_subscription' || type === 'student_subscription') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\webhooks\stripe\route.ts:52
**Current:** `if (type === 'institution_subscription' || type === 'student_subscription') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\enhanced\page.tsx:450
**Current:** `throw new Error(data.message || 'Registration failed');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\enhanced\page.tsx:697
**Current:** `{plan.id === 'BASIC' || plan.id === 'STARTER' ? (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\enhanced\page.tsx:699
**Current:** `) : plan.id === 'PREMIUM' || plan.id === 'PROFESSIONAL' ? (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\enhanced\page.tsx:1060
**Current:** `(formData.role === 'STUDENT' || formData.description);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\institution\page.tsx:151
**Current:** `throw new Error(data.message || 'Registration failed');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\awaiting-approval\page.tsx:57
**Current:** `if (status === 'loading' || loading) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\content\ContentCreator.tsx:105
**Current:** `if (!files || files.length === 0) return;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\content\ContentCreator.tsx:185
**Current:** `alt={block.metadata?.alt || 'Content image'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\content\ContentCreator.tsx:202
**Current:** `value={block.metadata?.alt || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\content\ContentCreator.tsx:235
**Current:** `value={block.metadata?.url || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\content\ContentCreator.tsx:258
**Current:** `value={block.metadata?.alt || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\content\ContentCreator.tsx:274
**Current:** `value={block.metadata?.language || 'javascript'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\institution\EnrollmentStatusCard.tsx:91
**Current:** `throw new Error(error.message || 'Failed to send reminder');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\institution\MarkPaymentDialog.tsx:110
**Current:** `{trigger || <Button>Mark as Paid</Button>}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\institution\PayoutDialog.tsx:60
**Current:** `throw new Error(error.message || 'Failed to mark payout as paid');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:37
**Current:** `const [selectedCountry, setSelectedCountry] = useState(initialData?.country || '');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:38
**Current:** `const [selectedState, setSelectedState] = useState(initialData?.state || '');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:43
**Current:** `name: initialData?.name || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:44
**Current:** `email: initialData?.email || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:45
**Current:** `institutionEmail: initialData?.institutionEmail || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:46
**Current:** `description: initialData?.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:47
**Current:** `country: initialData?.country || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:48
**Current:** `state: initialData?.state || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:49
**Current:** `city: initialData?.city || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:50
**Current:** `address: initialData?.address || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:51
**Current:** `postcode: initialData?.postcode || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:52
**Current:** `telephone: initialData?.telephone || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:53
**Current:** `contactName: initialData?.contactName || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:54
**Current:** `contactJobTitle: initialData?.contactJobTitle || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:55
**Current:** `contactPhone: initialData?.contactPhone || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:56
**Current:** `contactEmail: initialData?.contactEmail || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:57
**Current:** `website: initialData?.website || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\InstitutionForm.tsx:198
**Current:** `disabled={!selectedCountry || !selectedState}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\LocationSelect.tsx:52
**Current:** `if (type === 'country' || (type === 'state' && countryCode) || (type === 'city' && countryCode && stateCode)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\LocationSelect.tsx:61
**Current:** `disabled={disabled || loading}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\NotificationBell.tsx:194
**Current:** `{getNotificationIcon(notification.template?.category || 'default')}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\NotificationBell.tsx:199
**Current:** `{notification.template?.title || notification.title}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\NotificationDashboard.tsx:342
**Current:** `{notification.template?.title || notification.title}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\PaymentMethodSelector.tsx:44
**Current:** `const [selected, setSelected] = useState<string>(selectedMethod || '');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\EnrollmentModal.tsx:23
**Current:** `if (!startDate || !endDate) return;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\EnrollmentModal.tsx:73
**Current:** `throw new Error(error.message || 'Failed to enroll in course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\EnrollmentModal.tsx:123
**Current:** `min={startDate || new Date().toISOString().split('T')[0]}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\EnrollmentModal.tsx:142
**Current:** `<Button type="submit" disabled={isLoading || !startDate || !endDate || calculatedPrice <= 0}>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\NotificationPreferences.tsx:547
**Current:** `disabled={!isDirty || isSaving}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\PaymentForm.tsx:21
**Current:** `if (!stripe || !elements) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\PaymentForm.tsx:36
**Current:** `toast.error(error.message || 'Payment failed. Please try again.');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\PaymentForm.tsx:61
**Current:** `<Button type="submit" disabled={!stripe || isProcessing}>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\courses\[id]\page.tsx:133
**Current:** `if (error || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\courses\[id]\page.tsx:138
**Current:** `<p className="text-gray-600 mb-4">{error || 'The course you are looking for does not exist.'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\courses\[id]\page.tsx:169
**Current:** `{course.institution?.name || 'Institution not available'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\courses\[id]\page.tsx:252
**Current:** `{course.institution?.name || 'Institution not available'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\courses\[id]\page.tsx:275
**Current:** `<dd className="mt-1 text-sm text-gray-900">{course.category?.name || 'Not specified'}</dd>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\forgot-password\page.tsx:50
**Current:** `setError(data.error || 'Failed to send password reset email');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\analytics\InstitutionAnalyticsClient.tsx:76
**Current:** `if (!session || session.user?.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\analytics\InstitutionAnalyticsClient.tsx:196
**Current:** `{analytics?.totalViews || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\analytics\InstitutionAnalyticsClient.tsx:210
**Current:** `{analytics?.totalContacts || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\analytics\InstitutionAnalyticsClient.tsx:238
**Current:** `{analytics?.totalWebsiteClicks || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\analytics\InstitutionAnalyticsClient.tsx:361
**Current:** `{(!analytics?.topReferrers || analytics.topReferrers.length === 0) && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\analytics\InstitutionAnalyticsClient.tsx:405
**Current:** `{(!analytics?.recentEvents || analytics.recentEvents.length === 0) && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\collaboration\page.tsx:345
**Current:** `{stats.monthlyStats[stats.monthlyStats.length - 1]?.shared || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\collaboration\page.tsx:351
**Current:** `{stats.monthlyStats[stats.monthlyStats.length - 1]?.received || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\collaboration\page.tsx:357
**Current:** `{stats.monthlyStats[stats.monthlyStats.length - 1]?.copied || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\content-management\page.tsx:123
**Current:** `courseId: selectedContent?.courseId || courses[0]?.id,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\content-management\page.tsx:202
**Current:** `const matchesType = filterType === 'all' || item.type === filterType;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\content-management\page.tsx:203
**Current:** `const matchesStatus = filterStatus === 'all' || item.status === filterStatus;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\content-management\page.tsx:244
**Current:** `{(isCreating || selectedContent) && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\content-management\page.tsx:255
**Current:** `initialContent={selectedContent?.blocks || []}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\content-management\page.tsx:319
**Current:** `{searchTerm || filterType !== 'all' || filterStatus !== 'all'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\add\page.tsx:43
**Current:** `throw new Error(error.message || 'Failed to create course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\CourseForm.tsx:127
**Current:** `const formData = initialFormData || {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\CourseForm.tsx:552
**Current:** `{(formData.pricingPeriod === 'WEEKLY' || formData.pricingPeriod === 'MONTHLY') && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\InstitutionCourseForm.tsx:65
**Current:** `const hasPricingChanges = formData.base_price !== initialFormData.base_price ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\InstitutionCourseForm.tsx:83
**Current:** `level: (selectedCourse.level || '').toUpperCase(),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\InstitutionCourseForm.tsx:84
**Current:** `status: (selectedCourse.status || 'DRAFT').toUpperCase(),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\InstitutionCourseForm.tsx:90
**Current:** `maxStudents: selectedCourse.maxStudents?.toString() || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\InstitutionCourseForm.tsx:96
**Current:** `})) || []`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\InstitutionCourseForm.tsx:439
**Current:** `value={formData.maxStudents || '15'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\MonthlyPricingTable.tsx:210
**Current:** `if (!bulkEditValue || isNaN(Number(bulkEditValue))) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\MonthlyPricingTable.tsx:322
**Current:** `disabled={loading || isLoading}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\MonthlyPricingTable.tsx:336
**Current:** `disabled={loading || isLoading}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\MonthlyPricingTable.tsx:347
**Current:** `disabled={loading || isLoading}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\MonthlyPricingTable.tsx:515
**Current:** `disabled={loading || isLoading}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\MonthlyPricingTable.tsx:524
**Current:** `disabled={loading || isLoading}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\WeeklyPricingTable.tsx:224
**Current:** `if (!bulkEditValue || isNaN(Number(bulkEditValue))) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\WeeklyPricingTable.tsx:279
**Current:** `throw new Error(errorData.error || 'Failed to save prices');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:126
**Current:** `institutionId: session?.user?.institutionId || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:167
**Current:** `throw new Error(error.error || 'Failed to fetch courses');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:174
**Current:** `const coursesArray = Array.isArray(data) ? data : data.courses || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:259
**Current:** `throw new Error(responseData.error || 'Failed to save course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:282
**Current:** `description: course.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:284
**Current:** `framework: course.framework || 'CEFR',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:291
**Current:** `pricingPeriod: course.pricingPeriod || 'FULL_COURSE',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:343
**Current:** `institutionId: session?.user?.institutionId || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:452
**Current:** `const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:453
**Current:** `const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:567
**Current:** `institutionId: session?.user?.institutionId || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:649
**Current:** `<span>{course.category?.name || 'Uncategorized'}</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:708
**Current:** `<span>{course.category?.name || 'Uncategorized'}</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:776
**Current:** `value={selectedCourseForSettings?.pricingPeriod || 'FULL_COURSE'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:796
**Current:** `value={selectedCourseForSettings?.maxStudents || 15}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:931
**Current:** `<p className="text-sm text-gray-500">{module.description || 'No description'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:1003
**Current:** `institutionId: session?.user?.institutionId || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:1025
**Current:** `institutionId={session?.user?.institutionId || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:1063
**Current:** `initialPrices={selectedCourseForPricing.weeklyPrices || []}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:1064
**Current:** `basePrice={selectedCourseForPricing.base_price || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:1092
**Current:** `initialPrices={selectedCourseForPricing.monthlyPrices || []}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:1093
**Current:** `basePrice={selectedCourseForPricing.base_price || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:76
**Current:** `institutionId: session?.user?.institutionId || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:106
**Current:** `description: data.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:110
**Current:** `framework: data.framework || 'CEFR',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:121
**Current:** `})) || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:122
**Current:** `pricingPeriod: data.pricingPeriod || 'FULL_COURSE',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:123
**Current:** `institutionId: session?.user?.institutionId || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:161
**Current:** `throw new Error(errorData.error || 'Failed to update course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:280
**Current:** `institutionId={session?.user?.institutionId || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:309
**Current:** `initialPrices={selectedCourseForPricing.weeklyPrices || []}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:310
**Current:** `basePrice={selectedCourseForPricing.base_price || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:339
**Current:** `initialPrices={selectedCourseForPricing.monthlyPrices || []}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:340
**Current:** `basePrice={selectedCourseForPricing.base_price || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\enrollments\page.tsx:107
**Current:** `setEnrollments(data || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\enrollments\page.tsx:120
**Current:** `if (!bookings || bookings.length === 0) return '0/0 paid';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\enrollments\page.tsx:133
**Current:** `const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\new\page.tsx:72
**Current:** `if (!formData.skills || formData.skills.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\new\page.tsx:85
**Current:** `framework: course?.framework || 'CEFR',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\page.tsx:163
**Current:** `{module.description || 'No description'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\new\page.tsx:158
**Current:** `if (file.type.startsWith('image/') || file.type.startsWith('video/')) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\new\page.tsx:294
**Current:** `if (!quiz.title || quiz.questions.some(q => !q.question || (q.type === 'MULTIPLE_CHOICE' && (q.options.length < 2 || q.options.some(opt => !opt))))) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\new\page.tsx:316
**Current:** `mediaUrl = uploaded.url || uploaded.fileUrl || '';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\new\page.tsx:388
**Current:** `if (!exercise.question || !exercise.answer) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\new\page.tsx:416
**Current:** `throw new Error(errorData || 'Failed to create exercise');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\new\page.tsx:601
**Current:** `{filePreview && (formData.type === 'IMAGE' || formData.type === 'VIDEO') && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\new\page.tsx:803
**Current:** `{(q.options || []).map((pair: { left: string; right: string }, pIdx: number) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\new\page.tsx:823
**Current:** `const newPairs = [...(q.options || []), { left: '', right: '' }];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\page.tsx:111
**Current:** `if (!item.content || item.content.trim() === '') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\page.tsx:188
**Current:** `const fileName = content.split('/').pop() || 'Unknown file';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\page.tsx:345
**Current:** `{!module.contentItems || module.contentItems.length === 0 ? (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\page.tsx:360
**Current:** `{item.description || 'No description'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\page.tsx:432
**Current:** `{quiz.quizQuestions?.length || 0} questions`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\[contentId]\edit\page.tsx:76
**Current:** `description: data.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\[contentId]\edit\page.tsx:118
**Current:** `if (file.type.startsWith('image/') || file.type.startsWith('video/')) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\[contentId]\edit\page.tsx:275
**Current:** `{selectedFileName || 'Choose File'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\[contentId]\edit\page.tsx:312
**Current:** `value={formData.url || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\[contentId]\edit\page.tsx:363
**Current:** `onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:75
**Current:** `description: data.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:78
**Current:** `estimated_duration: data.estimated_duration || 30,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:79
**Current:** `vocabulary_list: data.vocabulary_list || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:80
**Current:** `grammar_points: data.grammar_points || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:81
**Current:** `cultural_notes: data.cultural_notes || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:82
**Current:** `is_published: data.is_published || false`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:109
**Current:** `if (!skills || skills.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:122
**Current:** `framework: course?.framework || 'CEFR',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:116
**Current:** `if (error || !quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:119
**Current:** `<p className="text-red-500 mb-4">{error || 'Quiz not found'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:204
**Current:** `onChange={(e) => updateQuizField('passing_score', parseInt(e.target.value) || 0)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:215
**Current:** `value={quiz.time_limit || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:228
**Current:** `onChange={(e) => updateQuizField('max_attempts', parseInt(e.target.value) || 1)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:238
**Current:** `value={quiz.description || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:130
**Current:** `if (error || !quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:133
**Current:** `<p className="text-red-500 mb-4">{error || 'Quiz not found'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:101
**Current:** `const options = questionData.options || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:102
**Current:** `if (options.length < 2 || options.some(opt => !opt.trim())) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:110
**Current:** `const dragItems = questionData.question_config?.dragItems || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:111
**Current:** `const dropZones = questionData.question_config?.dropZones || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:112
**Current:** `const correctMapping = questionData.correct_answer || '';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:192
**Current:** `const currentOptions = questionData.options || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:200
**Current:** `const currentOptions = questionData.options || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:208
**Current:** `const currentOptions = questionData.options || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:226
**Current:** `const options = questionData.options || ['', ''];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:359
**Current:** `value={questionData.question_config?.leftItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:377
**Current:** `value={questionData.question_config?.rightItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:401
**Current:** `value={questionData.question_config?.dragItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:419
**Current:** `value={questionData.question_config?.dropZones?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:440
**Current:** `value={questionData.correct_answer || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:491
**Current:** `value={questionData.question_config?.orderItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:522
**Current:** `if (error || !quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:525
**Current:** `<p className="text-red-500 mb-4">{error || 'Quiz not found'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:606
**Current:** `onChange={(e) => updateQuestionField('points', parseInt(e.target.value) || 1)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\page.tsx:126
**Current:** `if (error || !quiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\page.tsx:129
**Current:** `<p className="text-red-500 mb-4">{error || 'Quiz not found'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\page.tsx:207
**Current:** `{(question.type === 'MULTIPLE_CHOICE' || question.type === 'TRUE_FALSE') &&`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\page.tsx:232
**Current:** `{(question.type === 'SHORT_ANSWER' || question.type === 'ESSAY' || question.type === 'FILL_IN_BLANK') &&`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:128
**Current:** `type: questionData.type || 'MULTIPLE_CHOICE',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:129
**Current:** `question: questionData.question || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:130
**Current:** `points: questionData.points || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:132
**Current:** `correct_answer: questionData.correct_answer || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:133
**Current:** `explanation: questionData.explanation || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:134
**Current:** `difficulty: questionData.difficulty || 'MEDIUM',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:135
**Current:** `category: questionData.category || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:136
**Current:** `hints: questionData.hints || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:138
**Current:** `media_url: questionData.media_url || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:139
**Current:** `media_type: questionData.media_type || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:198
**Current:** `const dragItems = formData.question_config?.dragItems || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:199
**Current:** `const dropZones = formData.question_config?.dropZones || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:200
**Current:** `const correctMapping = formData.correct_answer || '';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:419
**Current:** `value={formData.question_config?.leftItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:437
**Current:** `value={formData.question_config?.rightItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:461
**Current:** `value={formData.question_config?.dragItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:479
**Current:** `value={formData.question_config?.dropZones?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:500
**Current:** `value={formData.correct_answer || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:551
**Current:** `value={formData.question_config?.orderItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:587
**Current:** `if (!quiz || !question) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:676
**Current:** `onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 1 })}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\page.tsx:185
**Current:** `if (error || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\page.tsx:190
**Current:** `<p className="text-gray-600 mb-6">{error || 'The requested course could not be found.'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\page.tsx:271
**Current:** `<div className="text-2xl font-bold text-orange-600">{course._count?.bookings || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\page.tsx:283
**Current:** `Modules ({course.modules?.length || 0})`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\page.tsx:380
**Current:** `<span>Framework: {course.framework || 'CEFR'}</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\page.tsx:413
**Current:** `backgroundColor: ct.tag.color || '#6b7280',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\DashboardClient.tsx:103
**Current:** `throw new Error(errorData.error || 'Failed to approve payment');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\DashboardClient.tsx:328
**Current:** `{(student.enrollmentCount || 0)} courses`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\page.tsx:74
**Current:** `}).then(result => result._sum.institutionAmount || 0),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\page.tsx:198
**Current:** `const institutionAmount = payment?.metadata?.institutionAmount ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\page.tsx:203
**Current:** `paymentAmount: payment?.amount || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\page.tsx:205
**Current:** `commissionAmount: payment?.metadata?.commissionAmount || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\page.tsx:206
**Current:** `paymentStatus: payment?.status || 'NO_PAYMENT',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\page.tsx:207
**Current:** `paymentMethod: payment?.paymentMethod || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\page.tsx:309
**Current:** `const student = studentMap.get(enrollment?.studentId || '');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\page.tsx:311
**Current:** `if (!enrollment || !student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\layout.tsx:19
**Current:** `if (!session?.user || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\page.tsx:119
**Current:** `throw new Error(errorData.error || 'Failed to approve payment');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\page.tsx:169
**Current:** `if (!paymentSettings || !institutionId) return false;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\page.tsx:207
**Current:** `const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\page.tsx:211
**Current:** `if (status === 'loading' || loading) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\page.tsx:244
**Current:** `{filteredPayments.filter(p => p.status === 'PENDING' || p.status === 'PROCESSING').length}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\page.tsx:372
**Current:** `{(payment.status === 'PENDING' || payment.status === 'PROCESSING') && canApprovePayment(payment) && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\page.tsx:399
**Current:** `{(payment.status === 'PENDING' || payment.status === 'PROCESSING') && !canApprovePayment(payment) && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\PaymentsClient.tsx:145
**Current:** `${payment.amount.toFixed(2)} {payment.currency || 'USD'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\PaymentsClient.tsx:151
**Current:** `${payment.metadata?.commissionAmount?.toFixed(2) || '0.00'} (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\PaymentsClient.tsx:152
**Current:** `{payment.metadata?.commissionRate || '0'}%)`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\PaymentsClient.tsx:158
**Current:** `${payment.metadata?.institutionAmount?.toFixed(2) || payment.amount.toFixed(2)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\00institution-profile.tsx:371
**Current:** `)) || (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\00institution-profile.tsx:387
**Current:** `disabled={!formData.country || !formData.state}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\00institution-profile.tsx:623
**Current:** `{(formData.facilities?.length || 0) < 5 && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:117
**Current:** `name: institutionData.name || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:118
**Current:** `description: institutionData.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:119
**Current:** `address: institutionData.address || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:120
**Current:** `city: institutionData.city || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:121
**Current:** `state: institutionData.state || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:122
**Current:** `country: institutionData.country || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:123
**Current:** `postcode: institutionData.postcode || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:124
**Current:** `email: institutionData.email || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:125
**Current:** `website: institutionData.website || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:126
**Current:** `institutionEmail: institutionData.institutionEmail || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:127
**Current:** `telephone: institutionData.telephone || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:128
**Current:** `contactName: institutionData.contactName || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:129
**Current:** `contactJobTitle: institutionData.contactJobTitle || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:130
**Current:** `contactPhone: institutionData.contactPhone || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:131
**Current:** `contactEmail: institutionData.contactEmail || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:132
**Current:** `logoUrl: institutionData.logoUrl || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:133
**Current:** `mainImageUrl: institutionData.mainImageUrl || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:135
**Current:** `setSelectedCountry(institutionData.country || '');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:136
**Current:** `setSelectedState(institutionData.state || '');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:137
**Current:** `setLogoPreview(institutionData.logoUrl || null);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:138
**Current:** `setMainImagePreview(institutionData.mainImageUrl || null);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:270
**Current:** `formData.append('institutionId', institution?.id || '');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\page.tsx:124
**Current:** `const matchesCategory = !selectedCategory || bank.category === selectedCategory;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\page.tsx:222
**Current:** `if (!editingBank || !formData.name.trim()) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\page.tsx:436
**Current:** `description: bank.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\page.tsx:437
**Current:** `category: bank.category || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\page.tsx:455
**Current:** `const matchesCategory = !selectedCategory || bank.category === selectedCategory;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\page.tsx:469
**Current:** `const matchesCategory = !selectedCategory || bank.category === selectedCategory;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\page.tsx:610
**Current:** `onChange={(e) => setImportFile(e.target.files?.[0] || null)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\page.tsx:738
**Current:** `<p className="text-2xl font-bold">{questionBanks.reduce((sum, bank) => sum + (bank.question_count || 0), 0)}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\page.tsx:879
**Current:** `{bank.description || 'No description'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\page.tsx:981
**Current:** `{bank.question_count || 0} questions`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\page.tsx:1152
**Current:** `{searchTerm || selectedCategory`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:152
**Current:** `const matchesType = selectedType === 'all' || question.question_type === selectedType;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:153
**Current:** `const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty_level === selectedDifficulty;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:154
**Current:** `const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:248
**Current:** `if (!editingQuestion || !formData.question_text.trim()) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:370
**Current:** `explanation: question.explanation || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:372
**Current:** `category: question.category || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:390
**Current:** `const matchesType = selectedType === 'all' || question.question_type === selectedType;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:391
**Current:** `const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty_level === selectedDifficulty;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:392
**Current:** `const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:406
**Current:** `const matchesType = selectedType === 'all' || question.question_type === selectedType;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:407
**Current:** `const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty_level === selectedDifficulty;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:408
**Current:** `const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:481
**Current:** `{questionBank.description || 'No description'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:503
**Current:** `onChange={(e) => setImportFile(e.target.files?.[0] || null)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:609
**Current:** `onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 1 })}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:783
**Current:** `{QUESTION_TYPES.find(t => t.value === type)?.label || type}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:887
**Current:** `{QUESTION_TYPES.find(t => t.value === question.question_type)?.label || question.question_type}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:1044
**Current:** `onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 1 })}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:1105
**Current:** `{searchTerm || selectedType !== 'all' || selectedDifficulty !== 'all' || selectedCategory !== 'all'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:138
**Current:** `const matchesType = selectedType === 'all' || question.question_type === selectedType;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:139
**Current:** `const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:140
**Current:** `const matchesSharing = selectedSharingLevel === 'all' ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:277
**Current:** `const matchesType = selectedType === 'all' || question.question_type === selectedType;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:278
**Current:** `const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:279
**Current:** `const matchesSharing = selectedSharingLevel === 'all' ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:296
**Current:** `const matchesType = selectedType === 'all' || question.question_type === selectedType;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:297
**Current:** `const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:298
**Current:** `const matchesSharing = selectedSharingLevel === 'all' ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:590
**Current:** `{QUESTION_TYPES.find(t => t.value === type)?.label || type}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:694
**Current:** `{QUESTION_TYPES.find(t => t.value === question.question_type)?.label || question.question_type}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:787
**Current:** `{searchTerm || selectedType !== 'all' || selectedDifficulty !== 'all' || selectedSharingLevel !== 'all'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-templates\page.tsx:244
**Current:** `const matchesType = selectedType === 'all' || template.question_type === selectedType;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-templates\page.tsx:245
**Current:** `const matchesDifficulty = selectedDifficulty === 'all' || template.template_data.difficulty_level === selectedDifficulty;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-templates\page.tsx:246
**Current:** `const matchesCategory = selectedCategory === 'all' || template.template_data.tags.includes(selectedCategory);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-templates\page.tsx:347
**Current:** `{QUESTION_TYPES.find(t => t.value === type)?.label || type}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-templates\page.tsx:464
**Current:** `{searchTerm || selectedType !== 'all'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-templates\page.tsx:581
**Current:** `template_data: { ...prev.template_data, points: parseInt(e.target.value) || 1 }`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\quizzes\page.tsx:114
**Current:** `setQuizzes(data.quizzes || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\quizzes\page.tsx:115
**Current:** `setStats(data.stats || null);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\quizzes\page.tsx:133
**Current:** `const coursesArray = Array.isArray(data) ? data : data.courses || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\quizzes\page.tsx:181
**Current:** `if (!selectedCourseForQuiz || !selectedModuleForQuiz) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\quizzes\page.tsx:216
**Current:** `const matchesType = selectedType === 'all' || quiz.quiz_type === selectedType;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\quizzes\page.tsx:217
**Current:** `const matchesDifficulty = selectedDifficulty === 'all' || quiz.difficulty === selectedDifficulty;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\quizzes\page.tsx:218
**Current:** `const matchesCourse = selectedCourse === 'all' || quiz.module.course.id === selectedCourse;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\quizzes\page.tsx:322
**Current:** `<Button onClick={handleCreateQuizSubmit} disabled={!selectedCourseForQuiz || !selectedModuleForQuiz}>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\quizzes\page.tsx:465
**Current:** `{searchTerm || selectedType !== 'all' || selectedDifficulty !== 'all' || selectedCourse !== 'all'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\settings\page.tsx:125
**Current:** `if (!session?.user?.role || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\settings\page.tsx:449
**Current:** `{log.changedByUser?.name || 'System'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\shared-questions\page.tsx:170
**Current:** `const matchesType = selectedType === 'all' || question.question_type === selectedType;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\shared-questions\page.tsx:171
**Current:** `const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\shared-questions\page.tsx:172
**Current:** `const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\shared-questions\page.tsx:173
**Current:** `const matchesInstitution = selectedInstitution === 'all' || question.institution.id === selectedInstitution;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\shared-questions\page.tsx:333
**Current:** `{QUESTION_TYPES.find(t => t.value === type)?.label || type}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\shared-questions\page.tsx:379
**Current:** `{institution?.name || 'Unknown'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\shared-questions\page.tsx:459
**Current:** `{QUESTION_TYPES.find(t => t.value === question.question_type)?.label || question.question_type}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\shared-questions\page.tsx:611
**Current:** `{searchTerm || selectedType !== 'all' || selectedDifficulty !== 'all' || selectedCategory !== 'all' || selectedInstitution !== 'all'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\page.tsx:120
**Current:** `const matchesStatus = statusFilter === 'all' || student.status === statusFilter;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:106
**Current:** `if (!session?.user?.role || (session.user.role !== 'INSTITUTION' && session.user.role !== 'ADMIN')) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:136
**Current:** `if (isNaN(start.getTime()) || isNaN(end.getTime())) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:167
**Current:** `const originalStartDate = new Date(student?.enrolledCourses.find(c => c.id === editingEnrollment.id)?.start_date || '').toISOString().split('T')[0];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:168
**Current:** `const originalEndDate = new Date(student?.enrolledCourses.find(c => c.id === editingEnrollment.id)?.end_date || '').toISOString().split('T')[0];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:169
**Current:** `const hasDateChanges = newDates.startDate !== originalStartDate || newDates.endDate !== originalEndDate;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:224
**Current:** `if (!editingEnrollment || !editingEnrollment.dates) return;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:229
**Current:** `if (!reason || reason.trim() === '') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:264
**Current:** `throw new Error(errorData.error || 'Failed to update enrollment dates');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:343
**Current:** `{ label: student?.name || 'Student Details', href: `/institution/students/${params.id}` }`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:509
**Current:** `value={editingEnrollment?.dates?.startDate || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:520
**Current:** `value={editingEnrollment?.dates?.endDate || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:523
**Current:** `min={editingEnrollment?.dates?.startDate || new Date().toISOString().split('T')[0]}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:530
**Current:** `value={editingEnrollment?.reason || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:549
**Current:** `value={editingEnrollment?.notes || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:563
**Current:** `checked={editingEnrollment?.confirmed || false}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:583
**Current:** `disabled={savingDates || !!dateError || !hasChanges || !editingEnrollment?.reason || !editingEnrollment?.confirmed}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:584
**Current:** `className={(!hasChanges || !editingEnrollment?.reason || !editingEnrollment?.confirmed) ? 'opacity-50 cursor-not-allowed' : ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution-registration\page.tsx:151
**Current:** `throw new Error(data.error || data.details || 'Failed to register institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institutions\[id]\page.tsx:81
**Current:** `if (error || !institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institutions\[id]\page.tsx:87
**Current:** `<p className="text-gray-600 mb-6">{error || 'The institution you are looking for does not exist.'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institutions\[id]\page.tsx:118
**Current:** `src={institution.mainImage || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institutions\[id]\page.tsx:137
**Current:** `src={institution.logo || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institutions\[id]\page.tsx:219
**Current:** `Available Courses ({institution.courses?.filter(course => course.status === 'ACTIVE' || course.status === 'PUBLISHED').length || 0})`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institutions\[id]\page.tsx:222
**Current:** `{institution.courses?.filter(course => course.status === 'ACTIVE' || course.status === 'PUBLISHED').length > 0 ? (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institutions\[id]\page.tsx:224
**Current:** `{institution.courses?.filter(course => course.status === 'ACTIVE' || course.status === 'PUBLISHED').map((course) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\layout.tsx:31
**Current:** `metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://fluentish.com'),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\layout.tsx:101
**Current:** `google: process.env.GOOGLE_VERIFICATION_CODE || "your-google-verification-code",`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\layout.tsx:102
**Current:** `yandex: process.env.YANDEX_VERIFICATION_CODE || "your-yandex-verification-code",`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\layout.tsx:103
**Current:** `bing: process.env.BING_VERIFICATION_CODE || "your-bing-verification-code"`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\invoice-handlers.ts:11
**Current:** `throw new Error(error.message || 'Failed to send invoice');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\invoice-handlers.ts:27
**Current:** `throw new Error(error.message || 'Failed to download invoice');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\migrations\commission-setup.ts:104
**Current:** `paymentMethod: payment.metadata?.paymentMethod || 'UNKNOWN',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\payment-service.ts:100
**Current:** `const amount = booking?.amount || enrollment.course.base_price;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\payment-service.ts:116
**Current:** `paymentId: metadata.referenceNumber || `MANUAL_${Date.now()}`,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\payment-service.ts:128
**Current:** `paymentId: metadata.referenceNumber || `MANUAL_${Date.now()}`,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\payment-service.ts:147
**Current:** `paymentId: metadata.referenceNumber || `MANUAL_${Date.now()}`,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\payment-service.ts:239
**Current:** `paymentError: paymentIntent.last_payment_error?.message || 'Payment failed',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\utils.ts:54
**Current:** `return commonCurrencySymbols[currencyCode] || currencyCode;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\utils.ts:120
**Current:** `name: new Intl.DisplayNames(['en'], { type: 'currency' }).of(currencyCode) || currencyCode,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\utils.ts:122
**Current:** `decimalSeparator: parts.find(part => part.type === 'decimal')?.value || '.',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\utils.ts:123
**Current:** `groupSeparator: parts.find(part => part.type === 'group')?.value || ',',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\utils.ts:124
**Current:** `fractionDigits: parts.find(part => part.type === 'fraction')?.value.length || 2,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\utils.ts:130
**Current:** `symbol: commonCurrencySymbols[currencyCode] || currencyCode,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\offline\page.tsx:311
**Current:** `{!isOnline && (syncStatus.pendingActions > 0 || syncStatus.pendingProgress > 0 || syncStatus.pendingQuizzes > 0) && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\reset-password\page.tsx:114
**Current:** `setError(data.error || 'Failed to update password');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\reset-password\page.tsx:227
**Current:** `if (!token || !email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\robots.ts:4
**Current:** `const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fluentish.com'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\settings\page.tsx:61
**Current:** `throw new Error(errorData.message || 'Failed to fetch settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\settings\page.tsx:111
**Current:** `throw new Error(errorData.message || 'Failed to update settings');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\settings\page.tsx:215
**Current:** `<p><span className="font-medium">Member Since:</span> {new Date(settings?.createdAt || '').toLocaleDateString()}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\sitemap.ts:4
**Current:** `const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fluentish.com'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\EnrollmentModal.tsx:103
**Current:** `if (!isValid(courseStartDate) || !isValid(courseEndDate)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\EnrollmentModal.tsx:201
**Current:** `pricingPeriod: pricingPeriod || course?.pricingPeriod || 'FULL_COURSE'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\EnrollmentModal.tsx:210
**Current:** `throw new Error(data.details || 'Failed to calculate price');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\EnrollmentModal.tsx:221
**Current:** `if (!date || !isValid(date) || !course) return;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\EnrollmentModal.tsx:280
**Current:** `if (!date || !isValid(date) || !selectedStartDate || !course) return;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\EnrollmentModal.tsx:323
**Current:** `throw new Error(error.message || 'Failed to enroll in course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\EnrollmentModal.tsx:354
**Current:** `const pricingPeriod = enrollmentDetails?.pricingPeriod || course.pricingPeriod;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\EnrollmentModal.tsx:410
**Current:** `{isLoading || !course ? (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\EnrollmentModal.tsx:421
**Current:** `<p><strong>Institution:</strong> {course.institution?.name || 'Not assigned'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\EnrollmentModal.tsx:423
**Current:** `<p><strong>Pricing Model:</strong> {(enrollmentDetails?.pricingPeriod || course.pricingPeriod || 'FULL_COURSE').replace('_', ' ')}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\EnrollmentModal.tsx:509
**Current:** `disabled={isLoading || !termsAccepted || !enrollmentDetails}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\MobileStudentNav.tsx:50
**Current:** `const isActive = pathname === item.href ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\PayCourseButton.tsx:59
**Current:** `}>(initialPaymentStatus || { status: 'idle' });`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\PayCourseButton.tsx:88
**Current:** `amount: enrollmentDetails?.price || amount,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\PayCourseButton.tsx:96
**Current:** `throw new Error(data.error || data.details || 'Failed to process payment');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\PayCourseButton.tsx:194
**Current:** `<p><span className="font-medium">Amount:</span> {formatCurrency(enrollmentDetails?.price || amount)}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\PayCourseButton.tsx:261
**Current:** `{(selectedPaymentMethod === 'BANK_TRANSFER' || selectedPaymentMethod === 'OFFLINE') && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\PayCourseButton.tsx:305
**Current:** `disabled={isLoading || paymentStatus.status === 'success' || !selectedPaymentMethod || !session}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\StudentDashboardNav.tsx:84
**Current:** `const isActive = pathname === item.href ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\page.tsx:165
**Current:** `const needsPayment = course.status === 'PENDING_PAYMENT' || course.hasOutstandingPayment;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\page.tsx:168
**Current:** `const hasPendingPayment = course.payment?.status === 'PROCESSING' || course.payment?.status === 'INITIATED';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\page.tsx:250
**Current:** `amount={course.enrollmentDetails?.price || course.payment?.amount || course.base_price || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\page.tsx:252
**Current:** `institutionName={course.institution?.name || 'Not assigned'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\modules\[moduleId]\page.tsx:209
**Current:** `if (!module || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\modules\[moduleId]\page.tsx:416
**Current:** `attempts={quizAttempts[quiz.id] || []}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\page.tsx:259
**Current:** `return !progress.contentCompleted || !progress.exercisesCompleted || !progress.quizCompleted;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\page.tsx:320
**Current:** `progress={module.progress[0] || {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\payment\page.tsx:61
**Current:** `if (status === 'loading' || loading) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\page.tsx:414
**Current:** `{courses.filter(c => c.status === 'ACTIVE' || c.status === 'IN_PROGRESS').slice(0, 3).map((course) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\page_backup.tsx:415
**Current:** `{courses.filter(c => c.status === 'ACTIVE' || c.status === 'IN_PROGRESS').slice(0, 3).map((course) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\payments\history\page.tsx:56
**Current:** `{payment.enrollment?.course.title || 'Course Payment'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\payments\history\page.tsx:86
**Current:** `{payment.enrollment?.course.institution.name || 'N/A'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\payments\history\page.tsx:96
**Current:** `institutionName={payment.enrollment.course.institution?.name || 'N/A'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\payments\page.tsx:82
**Current:** `{formatCurrency(paymentStats._sum.amount || 0)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\payments\page.tsx:121
**Current:** `{payment.enrollment?.course.title || 'Course Payment'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\payments\page.tsx:143
**Current:** `{payment.enrollment?.course.institution.name || 'N/A'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\payments\page.tsx:153
**Current:** `institutionName={payment.enrollment.course.institution?.name || 'N/A'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\progress\page.tsx:144
**Current:** `setCourses(data.courses || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\progress\page.tsx:145
**Current:** `setStats(data.stats || {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\progress\page.tsx:160
**Current:** `setRecentModules(modulesData || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\progress\page.tsx:168
**Current:** `setAchievements(achievementsData || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\settings\page.tsx:85
**Current:** `throw new Error(error.message || 'Failed to update profile');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\settings\page.tsx:196
**Current:** `value={profile.phone || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\settings\page.tsx:206
**Current:** `value={profile.address || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\settings\page.tsx:217
**Current:** `value={profile.bio || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\subscription-signup\page.tsx:263
**Current:** `if (!selectedPlan || !session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\subscription-signup\page.tsx:293
**Current:** `throw new Error(error.error || 'Failed to create payment intent');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\test-auth\page.tsx:31
**Current:** `<p><strong>Institution ID:</strong> {session.user.institutionId || 'None'}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\course-categories.tsx:75
**Current:** `throw new Error(error || 'Failed to save category');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\course-categories.tsx:94
**Current:** `description: category.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\course-categories.tsx:109
**Current:** `throw new Error(error || 'Failed to delete category');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\CourseForm.tsx:129
**Current:** `if (!data.base_price || isNaN(Number(data.base_price)) || Number(data.base_price) < 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\CourseForm.tsx:132
**Current:** `if (!data.duration || isNaN(Number(data.duration)) || Number(data.duration) <= 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\CourseForm.tsx:135
**Current:** `if (!data.maxStudents || isNaN(Number(data.maxStudents)) || Number(data.maxStudents) <= 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\CourseForm.tsx:450
**Current:** `<SelectValue>{frameworkInfo.label || 'Select framework'}</SelectValue>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\CourseForm.tsx:541
**Current:** `value={formData.priority || '0'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\CourseForm.tsx:559
**Current:** `checked={formData.isFeatured || false}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\CourseForm.tsx:575
**Current:** `checked={formData.isSponsored || false}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\CourseForm.tsx:630
**Current:** `disabled={isSubmitting || Object.keys(errors).length > 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\layout.tsx:27
**Current:** `: pathname.startsWith('/admin/tags') || pathname.startsWith('/admin/courses')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\layout.tsx:57
**Current:** `if (status === 'loading' || institutionLoading) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\layout.tsx:65
**Current:** `if (!session?.user || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\page.tsx:319
**Current:** `isFeatured: course.institution.isFeatured || false,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\page.tsx:320
**Current:** `commissionRate: course.institution.commissionRate || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\page.tsx:321
**Current:** `subscriptionPlan: course.institution.subscriptionPlan || 'BASIC'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\AdminNotificationAnalytics.tsx:120
**Current:** `if (!chartsLoaded || !ChartComponents) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\categories\AddCategoryDialog.tsx:56
**Current:** `throw new Error(error.message || 'Failed to create category');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\categories\AddCategoryDialog.tsx:121
**Current:** `disabled={loading || !hasUnsavedChanges}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\categories\EditCategoryDialog.tsx:74
**Current:** `throw new Error(error.message || 'Failed to update category');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\categories\EditCategoryDialog.tsx:139
**Current:** `disabled={loading || !hasUnsavedChanges}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\QuestionPreview.tsx:169
**Current:** `<label key={option.id || index} className="flex items-center space-x-3 cursor-pointer">`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\QuestionPreview.tsx:217
**Current:** `<label key={option.id || index} className="flex items-center space-x-3 cursor-pointer">`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\Sidebar.tsx:59
**Current:** `console.log('Sidebar - Institution ID from props:', institutionId || 'Not provided');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\Sidebar.tsx:120
**Current:** `throw new Error(error.message || 'Failed to cleanup sample data');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\Sidebar.tsx:168
**Current:** `const isCoursesPage = pathname.startsWith('/admin/courses') || pathname.includes('/admin/institutions/') && pathname.endsWith('/courses');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\Sidebar.tsx:170
**Current:** `const isTagsPage = pathname.startsWith('/admin/tags') || pathname.includes('/admin/institutions/') && pathname.endsWith('/tags');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedMobileDashboard.tsx:223
**Current:** `<p className="text-2xl font-bold">{analyticsData?.summary?.offlineSessions || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedMobileDashboard.tsx:252
**Current:** `{syncStats?.successRate?.toFixed(1) || 0}%`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedMobileDashboard.tsx:256
**Current:** `<Button onClick={handleManualSync} disabled={isLoading || !isOnline}>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedMobileDashboard.tsx:282
**Current:** `{cacheStats?.cacheDetails?.[0]?.hitRate?.toFixed(1) || 0}%`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedMobileDashboard.tsx:288
**Current:** `{analyticsData?.summary?.performanceMetrics?.averageLoadTime?.toFixed(0) || 0}ms`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedMobileDashboard.tsx:294
**Current:** `{preloadStats?.queueSize || 0} items`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:68
**Current:** `const [query, setQuery] = useState(searchParams.get('q') || '');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:100
**Current:** `setSuggestions(data.data || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:139
**Current:** `setResults(data.data.results || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:140
**Current:** `setTotalResults(data.data.total || 0);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:141
**Current:** `setCurrentPage(data.data.page || 1);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:142
**Current:** `setFacets(data.data.facets || null);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:186
**Current:** `if (debouncedQuery || Object.keys(filters).length > 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:294
**Current:** `value={filters.category || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:315
**Current:** `value={filters.level || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:336
**Current:** `value={filters.institution || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:358
**Current:** `value={filters.priceRange || [0, 1000]}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:366
**Current:** `<span>{formatCurrency(filters.priceRange?.[0] || 0)}</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:367
**Current:** `<span>{formatCurrency(filters.priceRange?.[1] || 1000)}</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:377
**Current:** `value={filters.duration || [0, 100]}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:385
**Current:** `<span>{filters.duration?.[0] || 0}h</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:386
**Current:** `<span>{filters.duration?.[1] || 100}h</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:395
**Current:** `value={filters.framework || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvertisingBanner.tsx:105
**Current:** `{icon || config.icon}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvertisingBanner.tsx:107
**Current:** `{badge || config.badge}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvertisingBanner.tsx:182
**Current:** `students: course.enrollmentCount || 150,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvertisingBanner.tsx:200
**Current:** `students: institution.studentCount || 500,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvertisingBanner.tsx:201
**Current:** `courses: institution.courseCount || 25,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvertisingBanner.tsx:214
**Current:** `title={offer.title || "Special Learning Offer"}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvertisingBanner.tsx:215
**Current:** `description={offer.description || "Take advantage of our limited-time offer and accelerate your language learning journey with exclusive discounts."}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvertisingBanner.tsx:216
**Current:** `ctaText={offer.ctaText || "Get Offer"}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvertisingBanner.tsx:217
**Current:** `ctaLink={offer.ctaLink || "/offers"}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvertisingBanner.tsx:218
**Current:** `highlight={offer.discount || "Save 20%"}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ClientOnlyAdvancedMobileDashboard.tsx:22
**Current:** `if (!isClient || !AdvancedMobileDashboard) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\course\ModuleProgressCard.tsx:36
**Current:** `const [notes, setNotes] = React.useState(progress.notes || '');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\course\ModuleProgressCard.tsx:37
**Current:** `const [difficultyRating, setDifficultyRating] = React.useState(progress.difficultyRating || 0);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\course\ModuleProgressCard.tsx:38
**Current:** `const [feedback, setFeedback] = React.useState(progress.feedback || '');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\course\ModuleProgressCard.tsx:232
**Current:** `{notes || feedback ? 'Edit Notes & Feedback' : 'Add Notes & Feedback'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CourseCard.tsx:156
**Current:** `borderColor: courseTag.tag.color || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CourseCard.tsx:157
**Current:** `color: courseTag.tag.color || undefined`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CourseSearch.tsx:73
**Current:** `throw new Error(errorData.message || 'Failed to search courses');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CourseSearch.tsx:79
**Current:** `if (!data.courses || !Array.isArray(data.courses)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CoursesPageClient.tsx:171
**Current:** `const courseTagIds = course.courseTags?.map(ct => ct.tag.id) || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CoursesPageClient.tsx:208
**Current:** `.filter(course => course.isPremiumPlacement || course.isFeaturedPlacement)`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CourseTagManager.tsx:57
**Current:** `throw new Error(error.error || 'Failed to fetch tags');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CourseTagManager.tsx:134
**Current:** `throw new Error(error.error || 'Failed to create tag');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CourseTagManager.tsx:168
**Current:** `backgroundColor: tag.color || 'hsl(var(--secondary))',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\EnhancedCourseCard.tsx:184
**Current:** `{(course.isPremiumPlacement || course.isFeaturedPlacement) && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\EnhancedCourseCard.tsx:262
**Current:** `backgroundColor: courseTag.tag.color || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\EnhancedCourseCard.tsx:308
**Current:** `{isHovered && (course.isPremiumPlacement || course.isFeaturedPlacement) && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ForcePasswordResetCheck.tsx:32
**Current:** `if (status === 'loading' || status === 'unauthenticated') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\HomePageClient.tsx:276
**Current:** `Welcome back, {session.user.name || session.user.email}!`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\HomePageClient.tsx:838
**Current:** `return countryCodeMap[countryName] || '🌍';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ImageUpload.tsx:49
**Current:** `disabled: uploading || existingImages.length >= maxFiles`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ImageUpload.tsx:60
**Current:** `${uploading || existingImages.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:33
**Current:** `name: initialData.name || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:34
**Current:** `email: initialData.email || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:35
**Current:** `description: initialData.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:36
**Current:** `address: initialData.address || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:37
**Current:** `city: initialData.city || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:38
**Current:** `state: initialData.state || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:39
**Current:** `country: initialData.country || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:40
**Current:** `postcode: initialData.postcode || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:41
**Current:** `website: initialData.website || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:42
**Current:** `institutionEmail: initialData.institutionEmail || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:43
**Current:** `telephone: initialData.telephone || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:44
**Current:** `contactName: initialData.contactName || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:45
**Current:** `contactJobTitle: initialData.contactJobTitle || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:46
**Current:** `contactPhone: initialData.contactPhone || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:47
**Current:** `contactEmail: initialData.contactEmail || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:48
**Current:** `logoUrl: initialData.logoUrl || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:49
**Current:** `mainImageUrl: initialData.mainImageUrl || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:285
**Current:** `throw new Error(error.error || 'Failed to upload facility image');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:447
**Current:** `throw new Error(errorData.error || 'Failed to update profile');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:455
**Current:** `facilities: updatedData.facilities || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:595
**Current:** `)) || (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:611
**Current:** `disabled={!formData.country || !formData.state}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:621
**Current:** `)) || (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:847
**Current:** `{(formData.facilities?.length || 0) < 5 && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionSidebar.tsx:117
**Current:** `setCourses(data.courses || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionSidebar.tsx:171
**Current:** `const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionSubscriptionCard.tsx:124
**Current:** `setLogs(data.logs || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionSubscriptionCard.tsx:144
**Current:** `reason: reason || undefined`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionSubscriptionCard.tsx:167
**Current:** `toast.error(error.error || 'Action failed');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionSubscriptionCard.tsx:265
**Current:** `{planFeatures[subscriptionData.currentPlan as keyof typeof planFeatures]?.name || subscriptionData.currentPlan}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionSubscriptionCard.tsx:329
**Current:** `disabled={!selectedPlan || actionLoading}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionSubscriptionCard.tsx:382
**Current:** `disabled={!selectedPlan || actionLoading}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionSubscriptionCard.tsx:482
**Current:** `disabled={!selectedPlan || actionLoading}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionSubscriptionCard.tsx:535
**Current:** `<TableCell>{item.paymentMethod || 'N/A'}</TableCell>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionSubscriptionCard.tsx:536
**Current:** `<TableCell>{item.invoiceNumber || 'N/A'}</TableCell>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionSubscriptionCard.tsx:584
**Current:** `{(log.oldAmount || log.newAmount) && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\InstitutionsPageClient.tsx:50
**Current:** `setInstitutions(data.institutions || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\InstitutionsPageClient.tsx:84
**Current:** `return (b.commissionRate || 0) - (a.commissionRate || 0);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\InstitutionsPageClient.tsx:86
**Current:** `return (b._count?.courses || 0) - (a._count?.courses || 0);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\InstitutionsPageClient.tsx:221
**Current:** `<span className="font-medium">{institution._count?.courses || 0}</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\InstitutionsPageClient.tsx:229
**Current:** `<span className="font-medium">{institution._count?.students || 0}</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\InstitutionsPageClient.tsx:237
**Current:** `<span className="font-medium">{institution.commissionRate || 0}%</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\LeadTracking.tsx:64
**Current:** `if (typeof window === 'undefined' || typeof navigator === 'undefined' || typeof document === 'undefined' || typeof sessionStorage === 'undefined') return;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\LeadTracking.tsx:73
**Current:** `sessionId: sessionStorage.getItem('sessionId') || crypto.randomUUID()`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\LeadTracking.tsx:262
**Current:** `sessionId: sessionStorage.getItem('sessionId') || crypto.randomUUID(),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MobileOptimizer.tsx:33
**Current:** `if (typeof window === 'undefined' || typeof navigator === 'undefined') return;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MobileOptimizer.tsx:35
**Current:** `const isMobileDevice = window.innerWidth < 768 ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MobileOptimizer.tsx:58
**Current:** `if (typeof window === 'undefined' || typeof navigator === 'undefined') return;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MobileOptimizer.tsx:178
**Current:** `const isSmallScreen = isMobile || isTablet;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MobileOptimizer.tsx:248
**Current:** `return fallback || (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MobileOptimizer.tsx:273
**Current:** `if (typeof window === 'undefined' || typeof navigator === 'undefined') return;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MobileTestingInterface.tsx:220
**Current:** `disabled={isRunning || selectedDevices.size === 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MonthlyPricingTable.tsx:189
**Current:** `const newPriceValue = parseInt(newPrice.replace(/[^\d]/g, '')) || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MonthlyPricingTable.tsx:227
**Current:** `throw new Error(errorData.error || 'Failed to save prices');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MonthlyPricingTable.tsx:307
**Current:** `if (!bulkEditValue || isNaN(Number(bulkEditValue))) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MonthlyPricingTable.tsx:550
**Current:** `const isEditable = isTableEditable || editableMonths.has(index + 1);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MonthlyPricingTable.tsx:557
**Current:** `<TableRow key={price.date || `month-${index}`} className={isCustomPrice ? 'bg-yellow-50' : ''}>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MonthlyPricingTable.tsx:569
**Current:** `<TableCell>{formatCurrencyWithSymbol(price.baseTotal || 0)}</TableCell>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MonthlyPricingTable.tsx:571
**Current:** `<span className="text-green-600 font-medium">{price.discount || 0}%</span>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MonthlyPricingTable.tsx:631
**Current:** `disabled={isSaving || !hasChanges}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\Navbar.tsx:43
**Current:** `const isApproved = session.user.institutionApproved || institution?.isApproved`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\Navbar.tsx:245
**Current:** `(session.user.institutionApproved || institution?.isApproved) ? (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\Navbar.tsx:371
**Current:** `(session.user.institutionApproved || institution?.isApproved) ? (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\OfflineDataManager.tsx:247
**Current:** `disabled={!isOnline || isSyncing}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\OfflineDataManager.tsx:294
**Current:** `<div className="font-medium">{course.title || course.name || `Course ${index + 1}`}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\OfflineDataManager.tsx:318
**Current:** `<div className="font-medium">{category.name || category.title || `Category ${index + 1}`}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\optimized\ImageOptimizer.tsx:85
**Current:** `const responsiveSizes = sizes || generateResponsiveSizes(actualDimensions.width, fill);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\optimized\ImageOptimizer.tsx:88
**Current:** `const [isInView, setIsInView] = useState(!lazy || priority);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\optimized\ImageOptimizer.tsx:102
**Current:** `if (!lazy || priority || isInView) return;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\optimized\ImageOptimizer.tsx:168
**Current:** `if (placeholder === 'empty' || hasError) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\OptimizedImage.tsx:71
**Current:** `style={fill ? undefined : { width: width || dimensions.width, height: height || dimensions.height }}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\OptimizedImage.tsx:89
**Current:** `style={fill ? undefined : { width: width || dimensions.width, height: height || dimensions.height }}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\OptimizedImage.tsx:99
**Current:** `width={!fill ? (width || dimensions.width) : undefined}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\OptimizedImage.tsx:100
**Current:** `height={!fill ? (height || dimensions.height) : undefined}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\PaymentForm.tsx:38
**Current:** `const match = matches && matches[0] || '';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\PaymentForm.tsx:63
**Current:** `if (!cardNumber || !expiryDate || !cvv || !cardholderName) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\PaymentForm.tsx:185
**Current:** `disabled={isProcessing || isLoading}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\PaymentForm.tsx:187
**Current:** `{isProcessing || isLoading ? (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\PerformanceMonitor.tsx:15
**Current:** `if (typeof window === 'undefined' || typeof document === 'undefined') return;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\PromotionalSidebar.tsx:167
**Current:** `items.sort((a, b) => (b.priority || 0) - (a.priority || 0));`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\providers\InstitutionProvider.tsx:24
**Current:** `if (status !== 'authenticated' || session?.user?.role !== 'INSTITUTION' || !session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SearchPageClient.tsx:80
**Current:** `duration: `${result.metadata?.duration || 0} hours`,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SearchPageClient.tsx:82
**Current:** `tags: result.metadata?.tags || []`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SearchPageClient.tsx:83
**Current:** `})) || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ServiceWorkerProvider.tsx:237
**Current:** `if (isOnline || !isServiceWorkerReady) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ServiceWorkerProvider.tsx:261
**Current:** `if (!isServiceWorkerReady || typeof window === 'undefined') return;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ServiceWorkerProvider.tsx:290
**Current:** `if (totalPending === 0 || !isOnline) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SimpleNotifications.tsx:151
**Current:** `if (!mounted || status === 'loading') return null;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SimpleNotifications.tsx:205
**Current:** `{getNotificationIcon(notification.template?.category || 'default')}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SimpleNotifications.tsx:210
**Current:** `{notification.template?.title || notification.title}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\StructuredData.tsx:108
**Current:** `name: course.institution?.name || 'Fluentish',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\StructuredData.tsx:128
**Current:** `name: course.institution?.name || 'Fluentish'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\StructuredData.tsx:131
**Current:** `coursePrerequisites: course.prerequisites || 'No prerequisites required',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\StructuredData.tsx:132
**Current:** `educationalCredentialAwarded: course.certificate || 'Course Completion Certificate',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\StructuredData.tsx:133
**Current:** `teaches: course.language || 'Language Skills',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\StructuredData.tsx:134
**Current:** `inLanguage: course.language || 'English',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\StructuredData.tsx:158
**Current:** `logo: institution.logo || 'https://fluentish.com/images/default-institution-logo.png',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\StructuredData.tsx:190
**Current:** `})) || []`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\AdaptiveQuizInterface.tsx:119
**Current:** `if (!selectedAnswer || !state.currentQuestion) return;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\AdaptiveQuizInterface.tsx:268
**Current:** `value={selectedAnswer || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\AdaptiveQuizInterface.tsx:434
**Current:** `disabled={!selectedAnswer || state.loading}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\AdvancedQuizInterface.tsx:118
**Current:** `if (!quiz.time_limit || isPaused || isSubmitted) return;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\AdvancedQuizInterface.tsx:210
**Current:** `const currentAnswers = prev[questionId] || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\AdvancedQuizInterface.tsx:389
**Current:** `value={currentAnswer || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\AdvancedQuizInterface.tsx:402
**Current:** `value={currentAnswer || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\AdvancedQuizInterface.tsx:421
**Current:** `value={currentAnswer?.[index] || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\AdvancedQuizInterface.tsx:423
**Current:** `const newAnswers = { ...currentAnswer } || {};`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\AdvancedQuizInterface.tsx:456
**Current:** `{currentAnswer?.[dragItems[index]] || zone}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\AdvancedQuizInterface.tsx:510
**Current:** `checked={multipleAnswers[question.id]?.includes(option) || false}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\AdvancedQuizInterface.tsx:532
**Current:** `const percentage = attempt.percentage || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\ExerciseInterface.tsx:171
**Current:** `value={matchingAnswers[index] || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\ExerciseInterface.tsx:265
**Current:** `setMatchingAnswers(new Array(exercise.options?.length || 0).fill(''));`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\NotificationPreferences.tsx:301
**Current:** `disabled={!isDirty || isSaving}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\PaymentForm.tsx:25
**Current:** `if (!stripe || !elements) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\PaymentForm.tsx:34
**Current:** `setError(submitError.message || 'An error occurred while submitting payment');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\PaymentForm.tsx:48
**Current:** `setError(confirmError.message || 'Payment failed');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\PaymentForm.tsx:93
**Current:** `disabled={!stripe || isProcessing}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\QuizCard.tsx:75
**Current:** `const canRetry = quiz.allow_retry && (!quiz.max_attempts || attempts.length < quiz.max_attempts);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\QuizCard.tsx:108
**Current:** `toast.error(error || 'Failed to start quiz');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\QuizCard.tsx:184
**Current:** `const dateToFormat = latestAttempt.completedAt || latestAttempt.startedAt;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\QuizCard.tsx:212
**Current:** `<Progress value={latestAttempt.percentage || 0} className="h-2" />`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\QuizInterface.tsx:127
**Current:** `if (!quiz.time_limit || isPaused || isSubmitted) return;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\QuizInterface.tsx:152
**Current:** `if (loading || attempt || startAttemptCalledRef) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\QuizInterface.tsx:291
**Current:** `setSelectedAnswer(answers[question.id] || '');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\QuizInterface.tsx:292
**Current:** `setTextAnswer(answers[question.id] || '');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\QuizInterface.tsx:381
**Current:** `{(question.type === 'FILL_IN_BLANK' || question.type === 'SHORT_ANSWER') && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\QuizProgress.tsx:187
**Current:** `<div className={`text-lg font-bold ${getScoreColor(attempt.percentage || 0)}`}>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\QuizProgress.tsx:194
**Current:** `{formatDate(attempt.completedAt || attempt.startedAt)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\QuizProgress.tsx:221
**Current:** `<span className={`font-medium ${getScoreColor(attempt.percentage || 0)}`}>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\QuizProgress.tsx:229
**Current:** `value={attempt.percentage || 0}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\StudentSubscriptionCard.tsx:122
**Current:** `setLogs(data.logs || []);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\StudentSubscriptionCard.tsx:142
**Current:** `reason: reason || undefined`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\StudentSubscriptionCard.tsx:165
**Current:** `toast.error(error.error || 'Action failed');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\StudentSubscriptionCard.tsx:265
**Current:** `{planFeatures[subscriptionData.currentPlan as keyof typeof planFeatures]?.name || subscriptionData.currentPlan}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\StudentSubscriptionCard.tsx:331
**Current:** `disabled={!selectedPlan || actionLoading}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\StudentSubscriptionCard.tsx:384
**Current:** `disabled={!selectedPlan || actionLoading}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\StudentSubscriptionCard.tsx:484
**Current:** `disabled={!selectedPlan || actionLoading}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\StudentSubscriptionCard.tsx:537
**Current:** `<TableCell>{item.paymentMethod || 'N/A'}</TableCell>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\StudentSubscriptionCard.tsx:538
**Current:** `<TableCell>{item.invoiceNumber || 'N/A'}</TableCell>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\StudentSubscriptionCard.tsx:586
**Current:** `{(log.oldAmount || log.newAmount) && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\StudentSubscriptionCard.tsx:206
**Current:** `return planDetails[planType]?.icon || <User className="w-5 h-5" />;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\StudentSubscriptionCard.tsx:210
**Current:** `return planDetails[planType]?.color || 'text-gray-600';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionManagementCard.tsx:230
**Current:** `return planDetails[planType]?.icon || <Building2 className="w-5 h-5" />;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionManagementCard.tsx:234
**Current:** `return planDetails[planType]?.color || 'text-gray-600';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionOverviewCard.tsx:105
**Current:** `if (!subscription || !subscription.planType) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionPaymentForm.tsx:42
**Current:** `if (!stripe || !elements) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionPaymentForm.tsx:53
**Current:** `setError(submitError.message || 'An error occurred while submitting payment');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionPaymentForm.tsx:54
**Current:** `onError(submitError.message || 'Payment submission failed');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionPaymentForm.tsx:68
**Current:** `setError(confirmError.message || 'Payment failed');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionPaymentForm.tsx:69
**Current:** `onError(confirmError.message || 'Payment failed');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionPaymentForm.tsx:143
**Current:** `disabled={isProcessing || isLoading}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionPaymentForm.tsx:150
**Current:** `disabled={!stripe || isProcessing || isLoading}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionPaymentForm.tsx:153
**Current:** `{isProcessing || isLoading ? (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionPlanSelector.tsx:284
**Current:** `{plan.id === 'BASIC' || plan.id === 'STARTER' ? (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionPlanSelector.tsx:286
**Current:** `) : plan.id === 'PREMIUM' || plan.id === 'PROFESSIONAL' ? (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionPlanSelector.tsx:379
**Current:** `disabled={!selectedPlan || isLoading}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\TagFilter.tsx:96
**Current:** `backgroundColor: tag.color || 'hsl(var(--secondary))',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\TagFilter.tsx:191
**Current:** `borderColor: tag.color || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\TagFilter.tsx:192
**Current:** `color: tag.color || undefined`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\TagSelector.tsx:38
**Current:** `priority: CATEGORY_TAGS.includes(tag.name) ? 100 : (tag.priority || 0)`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\TagSelector.tsx:45
**Current:** `return (b.priority || 0) - (a.priority || 0);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ui\color-picker.tsx:62
**Current:** `const [customColor, setCustomColor] = React.useState(value || '#000000');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ui\color-picker.tsx:65
**Current:** `setCustomColor(value || '#000000');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ui\enhanced-switch.tsx:134
**Current:** `const colors = colorClasses[activeColor as keyof typeof colorClasses] || colorClasses.green`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ui\image-container.tsx:52
**Current:** `const isPlaceholder = imageSrc === placeholderUrl || imageSrc.startsWith('/api/placeholder/');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ui\image-container.tsx:68
**Current:** `{(isPlaceholder || isLocalUpload) ? (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ui\image-container.tsx:93
**Current:** `sizes={sizes || defaultSize}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ui\progress.tsx:22
**Current:** `style={{ transform: `translateX(-${100 - (value || 0)}%)` }}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ui\use-toast.ts:107
**Current:** `t.id === toastId || toastId === undefined`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ui\use-toast.tsx:108
**Current:** `t.id === toastId || toastId === undefined`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useOfflineData.ts:258
**Current:** `setConnectionType(connection?.effectiveType || 'unknown');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useOfflineData.ts:261
**Current:** `setConnectionType(connection.effectiveType || 'unknown');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useOfflineData.ts:295
**Current:** `isSlowConnection: connectionType === 'slow-2g' || connectionType === '2g'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useServiceWorker.ts:24
**Current:** `if (typeof window === 'undefined' || typeof navigator === 'undefined') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useServiceWorker.ts:103
**Current:** `if (typeof window === 'undefined' || !('Notification' in window)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useServiceWorker.ts:288
**Current:** `const syncData = JSON.parse(localStorage.getItem('syncData') || '{}');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useSessionSync.ts:52
**Current:** `isLoading: status === 'loading' || isForceSyncing,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useTouchGestures.ts:156
**Current:** `if (velocity >= swipeConfig.velocity || swipeConfig.velocity === undefined) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useTouchGestures.ts:159
**Current:** `} else if (angle >= 135 || angle <= -135 && callbacks.onSwipeLeft) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\advanced-caching.ts:148
**Current:** `priority: options.priority || 'deferred'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\advanced-caching.ts:162
**Current:** `console.log(`Cache invalidation queued: ${options.type} - ${options.target} (${options.reason || 'no reason'})`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\advanced-caching.ts:167
**Current:** `if (this.isProcessingQueue || this.invalidationQueue.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\advanced-caching.ts:288
**Current:** `strategy: config?.strategy || 'unknown',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\advanced-caching.ts:291
**Current:** `maxEntries: config?.maxEntries || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\advanced-caching.ts:292
**Current:** `maxAge: config?.maxAge || 0`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\api-optimizer.ts:87
**Current:** ``${this.metrics.get(requestId)?.duration || 0}ms` : 'unknown',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\api-optimizer.ts:91
**Current:** `'ETag': etag || `"${Date.now()}"`,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\api-optimizer.ts:103
**Current:** `response.headers.set('X-Query-Count', `${metrics.queryCount || 0}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\api-optimizer.ts:104
**Current:** `response.headers.set('X-Cache-Hits', `${metrics.cacheHits || 0}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\api-optimizer.ts:105
**Current:** `response.headers.set('X-Cache-Misses', `${metrics.cacheMisses || 0}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\audit-logger.ts:66
**Current:** `console.log(`🔍 AUDIT: ${data.action} on ${data.resource} by ${data.userId || 'anonymous'} (${data.severity})`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\audit-logger.ts:84
**Current:** `const severity = action === 'LOGIN_FAILED' || action === 'ACCOUNT_LOCKED' ? 'HIGH' : 'LOW';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\audit-logger.ts:132
**Current:** `const severity = action === 'DELETE' || action === 'BULK_DELETE' ? 'HIGH' : 'MEDIUM';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\audit-logger.ts:244
**Current:** `if (startDate || endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\audit-logger.ts:292
**Current:** `if (startDate || endDate) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\audit-logger.ts:380
**Current:** `log.userId || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\audit-logger.ts:383
**Current:** `log.resourceId || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\audit-logger.ts:386
**Current:** `log.ipAddress || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\auth.ts:8
**Current:** `const secret = process.env.NEXTAUTH_SECRET || 'your-fallback-secret-key-change-in-production';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\auth.ts:33
**Current:** `if (!credentials?.email || !credentials?.password) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\auth.ts:64
**Current:** `institutionId: user.institution?.id || null,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\auth.ts:66
**Current:** `institutionApproved: user.institution?.isApproved || false`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\automated-commission-service.ts:69
**Current:** `if (!subscription || subscription.status !== 'ACTIVE') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\automated-commission-service.ts:96
**Current:** `currency: payment.currency || 'USD',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\automated-commission-service.ts:219
**Current:** `return sum + (payment.institutionCommission?.amount || 0);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\automated-commission-service.ts:343
**Current:** `total: monthlyCommissions._sum.amount || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\automated-commission-service.ts:347
**Current:** `total: yearlyCommissions._sum.amount || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\automated-commission-service.ts:351
**Current:** `total: totalCommissions._sum.amount || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\background-sync.ts:471
**Current:** `this.syncHistory = history?.data || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\background-sync.ts:526
**Current:** `const current = statsByType.get(item.type) || { success: 0, failed: 0, total: 0 };`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\cdn-optimizer.ts:65
**Current:** `if (!this.config.domain || !this.config.imageOptimization) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\cdn-optimizer.ts:184
**Current:** `if (!this.config.apiKey || !this.config.zoneId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\cdn-optimizer.ts:228
**Current:** `provider: (process.env.CDN_PROVIDER as any) || 'vercel',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\cdn-optimizer.ts:229
**Current:** `domain: process.env.CDN_DOMAIN || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\cdn-optimizer.ts:332
**Current:** `} else if (pathname.match(/\.(html|htm)$/i) || pathname === '/') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\content-preloader.ts:211
**Current:** `if (this.isPreloading || this.preloadQueue.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\content-preloader.ts:303
**Current:** `const currentCount = this.userBehavior.frequentlyAccessed.get(item.url) || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\content-preloader.ts:311
**Current:** `const timeAccess = this.userBehavior.timeBasedAccess.get(item.url) || new Array(24).fill(0);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\content-preloader.ts:321
**Current:** `const patterns = this.userBehavior.navigationPatterns.get(from) || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\content-preloader.ts:346
**Current:** `return behavior?.data || null;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\database-optimizer.ts:353
**Current:** `totalRevenue: totalRevenue._sum.amount || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\email.ts:53
**Current:** `const port = parseInt(process.env.SMTP_PORT || '587');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\email.ts:58
**Current:** `if (!host || !user || !pass) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\email.ts:93
**Current:** `const fromEmail = settings?.fromEmail || process.env.SMTP_FROM_EMAIL || 'noreply@yourdomain.com';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\email.ts:94
**Current:** `const fromName = settings?.fromName || process.env.SMTP_FROM_NAME || 'Your Platform';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\email.ts:187
**Current:** `<li>Error: ${paymentDetails.error || 'Unknown error'}</li>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\encryption.ts:27
**Current:** `const masterKeyString = process.env.ENCRYPTION_MASTER_KEY || this.generateMasterKey();`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\encryption.ts:130
**Current:** `const generatedSalt = salt || crypto.randomBytes(32).toString('hex');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\enhanced-database-optimizer.ts:69
**Current:** `const cacheKey = options.cacheKey || `courses:${JSON.stringify(where)}:${JSON.stringify(include)}`;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\enhanced-database-optimizer.ts:134
**Current:** `await redisCache.set(cacheKey, courses, options.ttl || CACHE_TTL.MEDIUM);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\enhanced-database-optimizer.ts:308
**Current:** `if (minPrice !== undefined || maxPrice !== undefined) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\enrollment\state-manager.ts:90
**Current:** `const isPaymentStateValid = !latestPayment ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\enrollment\state-manager.ts:93
**Current:** `const isBookingStateValid = !latestBooking ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\framework-utils.ts:130
**Current:** `return frameworkMappings[sourceFramework].equivalentLevels[level] || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\framework-utils.ts:151
**Current:** `return levelInfo?.label || level;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\load-balancer.ts:243
**Current:** `if (!server || server.health !== 'healthy' || !server.isActive) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\load-balancer.ts:277
**Current:** `const userAgent = request.headers.get('user-agent') || '';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\logger.ts:42
**Current:** `this.logLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\logger.ts:128
**Current:** `ip: req.ip || req.headers.get('x-forwarded-for') || 'unknown',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\logger.ts:129
**Current:** `userAgent: req.headers.get('user-agent') || 'unknown',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:33
**Current:** `if (!student?.user || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:85
**Current:** `if (!student?.user || !quiz || !module || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:172
**Current:** `if (!student?.user || !module || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:252
**Current:** `const studentName = user.student?.name || user.institution?.name || 'User';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:292
**Current:** `const studentName = user.student?.name || 'Student';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification-integration.ts:328
**Current:** `const userName = user.student?.name || user.institution?.name || 'User';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:189
**Current:** `subject: data.subject || data.title,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:225
**Current:** `createdBy: data.createdBy || data.recipientId`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:272
**Current:** `name: enrollmentDetails.studentName || 'Student',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:275
**Current:** `duration: enrollmentDetails.duration || '8 weeks',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:276
**Current:** `startDate: enrollmentDetails.startDate || new Date().toLocaleDateString()`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:318
**Current:** `name: paymentDetails.studentName || 'Student',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:320
**Current:** `referenceNumber: paymentDetails.referenceNumber || paymentId,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:830
**Current:** `name: completionDetails.studentName || 'Student',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:876
**Current:** `name: quizDetails.studentName || 'Student',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:934
**Current:** `name: achievementDetails.studentName || 'Student',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:976
**Current:** `name: statusChange.studentName || 'Student',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:981
**Current:** `reason: statusChange.reason || 'System update'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:1042
**Current:** `name: updateDetails.userName || 'User',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:1045
**Current:** `details: updateDetails.description || 'Your account has been updated'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:1082
**Current:** `name: paymentDetails.userName || 'Student',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:1086
**Current:** `courseName: paymentDetails.courseName || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:1087
**Current:** `subscriptionPlan: paymentDetails.subscriptionPlan || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:1123
**Current:** `name: moduleDetails.studentName || 'Student',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\notification.ts:1203
**Current:** `name: streakDetails.studentName || 'Student',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-analytics.ts:232
**Current:** `const currentCount = this.metrics.mostAccessedContent.get(contentType) || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-analytics.ts:238
**Current:** `const currentCount = this.metrics.offlineActions.get(action) || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-analytics.ts:284
**Current:** `title: title || page`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-analytics.ts:414
**Current:** `return events?.data || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-analytics.ts:440
**Current:** `return metrics?.data || null;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-analytics.ts:494
**Current:** `return localStorage.getItem('user_id') || undefined;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-storage.ts:10
**Current:** `if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-storage.ts:79
**Current:** `priority: action.priority || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-storage.ts:226
**Current:** `request.onsuccess = () => resolve(request.result?.data || null);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-storage.ts:261
**Current:** `priority: item.priority || 1,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-storage.ts:301
**Current:** `if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-storage.ts:315
**Current:** `if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\offline-storage.ts:322
**Current:** `return db?.size || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\manual-payment.ts:48
**Current:** `instructions: metadata.instructions || 'Please contact the institution for payment instructions',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\manual-payment.ts:49
**Current:** `contactInfo: metadata.contactInfo || enrollment.course.institution.contactEmail,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\manual-payment.ts:50
**Current:** `dueDate: metadata.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\manual-payment.ts:136
**Current:** `bankDetails: metadata.bankDetails || enrollment.course.institution.bankDetails,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\manual-payment.ts:137
**Current:** `dueDate: metadata.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\manual-payment.ts:151
**Current:** `bankDetails: metadata.bankDetails || enrollment.course.institution.bankDetails,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\reminder-scheduler.ts:58
**Current:** `const dueDate = new Date(payment.paymentDetails?.dueDate || payment.createdAt);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\service.ts:12
**Current:** `this.stripe = new Stripe(stripeConfig?.config.secretKey || '', {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:116
**Current:** `if (!student || !course) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:124
**Current:** `paymentError: paymentIntent.last_payment_error?.message || 'Payment failed',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:135
**Current:** `error: paymentIntent.last_payment_error?.message || 'Payment failed',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:164
**Current:** `if (!enrollment || !course || !institution || !student) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:260
**Current:** `if (!student || !course || !institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:276
**Current:** `const amount = booking?.amount || enrollment.course.base_price;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:292
**Current:** `paymentId: metadata.referenceNumber || `MANUAL_${Date.now()}`,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:304
**Current:** `paymentId: metadata.referenceNumber || `MANUAL_${Date.now()}`,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:337
**Current:** `paymentId: metadata.referenceNumber || `MANUAL_${Date.now()}`,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:350
**Current:** `referenceNumber: metadata.referenceNumber || `MANUAL_${Date.now()}`,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:366
**Current:** `referenceNumber: metadata.referenceNumber || `MANUAL_${Date.now()}`,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment-service.ts:377
**Current:** `metadata.processedBy || 'SYSTEM'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\performance-integration.ts:216
**Current:** `this.loadBalancer?.getStats() || null`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\performance-integration.ts:302
**Current:** `const ttl = options.ttl || this.config.redis.ttl.medium;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\performance-integration.ts:303
**Current:** `const assetType = options.assetType || AssetType.API;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\performance-integration.ts:478
**Current:** `redisCache.set(key, data, ttl || 300)`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\performance-monitor.ts:236
**Current:** `return localStorage.getItem('userId') || undefined;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:7
**Current:** `publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:8
**Current:** `privateKey: process.env.VAPID_PRIVATE_KEY || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:9
**Current:** `subject: process.env.VAPID_SUBJECT || 'mailto:admin@fluentish.com',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:10
**Current:** `audience: process.env.NEXT_PUBLIC_SITE_URL || 'https://fluentish.com'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:89
**Current:** `if (!('serviceWorker' in navigator) || !('PushManager' in window)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:267
**Current:** `return localStorage.getItem('userId') || null;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:278
**Current:** `icon: notification.icon || '/icon.svg',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:279
**Current:** `badge: notification.badge || '/icon.svg',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:344
**Current:** `return notifications || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\push-notifications.ts:355
**Current:** `return history || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\quiz\adaptive-algorithm.ts:142
**Current:** `return questionInfo[0]?.question || null;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\rate-limiter.ts:117
**Current:** `if (!current || current.resetTime <= now) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\rate-limiter.ts:291
**Current:** `const ip = req.headers['x-forwarded-for'] ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\rate-limiter.ts:292
**Current:** `req.headers['x-real-ip'] ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\rate-limiter.ts:293
**Current:** `req.connection?.remoteAddress ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\rate-limiter.ts:294
**Current:** `req.socket?.remoteAddress ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\rate-limiter.ts:301
**Current:** `const userId = req.user?.id || 'anonymous';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\react-optimizer.tsx:367
**Current:** `return this.props.fallback || (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\redis-cache.ts:6
**Current:** `host: process.env.REDIS_HOST || 'localhost',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\redis-cache.ts:7
**Current:** `port: parseInt(process.env.REDIS_PORT || '6379'),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\redis-cache.ts:9
**Current:** `db: parseInt(process.env.REDIS_DB || '0'),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\redis-cache.ts:249
**Current:** `const current = await this.get<number>(key) || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\revenue-tracking-service.ts:155
**Current:** `const current = revenueByInstitution.get(institutionName) || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\s3.ts:5
**Current:** `region: process.env.AWS_REGION || 'us-east-1',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\s3.ts:7
**Current:** `accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\s3.ts:8
**Current:** `secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\s3.ts:15
**Current:** `Bucket: process.env.AWS_BUCKET_NAME || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\search.ts:255
**Current:** `description: course.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\search.ts:523
**Current:** `termCounts.set(word, (termCounts.get(word) || 0) + 1);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\seo-config.ts:389
**Current:** `const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fluentish.com';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\seo-config.ts:433
**Current:** `return seoConfigs[pageName] || seoConfigs.home;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\seo-config.ts:445
**Current:** `name: course.institution?.name || 'Fluentish',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:103
**Current:** `return institution.commissionRate || 20; // Default fallback rate`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:155
**Current:** `const isFallback = institution.subscription?.metadata?.isFallback || false;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:174
**Current:** `})) || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:180
**Current:** `features: institution.subscription?.commissionTier?.features as Record<string, any> || {},`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:227
**Current:** `const isFallback = currentSubscription?.metadata?.isFallback || false;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:246
**Current:** `})) || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:251
**Current:** `features: currentSubscription?.features as Record<string, any> || {},`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:285
**Current:** `const calculatedAmount = amount || (billingCycle === 'ANNUAL' ? plan.annualPrice : plan.monthlyPrice);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:389
**Current:** `if (!currentSubscription || currentSubscription.status !== 'ACTIVE') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:435
**Current:** `reason || 'Plan downgrade'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:470
**Current:** `if (!subscription || subscription.status !== 'ACTIVE') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:497
**Current:** `reason || 'Subscription cancelled'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:525
**Current:** `if (!subscription || subscription.status !== 'CANCELLED') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:605
**Current:** `oldPlan: log.oldPlan || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:606
**Current:** `newPlan: log.newPlan || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:607
**Current:** `oldAmount: log.oldAmount || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:608
**Current:** `newAmount: log.newAmount || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:609
**Current:** `oldBillingCycle: log.oldBillingCycle || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:610
**Current:** `newBillingCycle: log.newBillingCycle || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:611
**Current:** `reason: log.reason || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:647
**Current:** `oldPlan: log.oldPlan || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:648
**Current:** `newPlan: log.newPlan || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:649
**Current:** `oldAmount: log.oldAmount || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:650
**Current:** `newAmount: log.newAmount || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:651
**Current:** `oldBillingCycle: log.oldBillingCycle || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:652
**Current:** `newBillingCycle: log.newBillingCycle || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:653
**Current:** `reason: log.reason || undefined,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:895
**Current:** `if (!institution?.subscription || institution.subscription.status !== 'ACTIVE') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:936
**Current:** `revenueGenerated: revenueGenerated._sum.amount || 0`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:1044
**Current:** `if (!expiredTrial || expiredTrial.status !== 'TRIAL' || expiredTrial.endDate > new Date()) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-payment-service.ts:60
**Current:** `email: institution.users[0]?.email || 'institution@example.com',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-payment-service.ts:450
**Current:** `error: paymentIntent.last_payment_error?.message || 'Payment failed',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-payment-service.ts:473
**Current:** `reason: paymentIntent.last_payment_error?.message || 'Payment failed',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-payment-service.ts:493
**Current:** `reason: paymentIntent.last_payment_error?.message || 'Payment failed',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-plan-manager.ts:33
**Current:** `description: plan.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-plan-manager.ts:37
**Current:** `features: plan.features as string[] || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-plan-manager.ts:64
**Current:** `description: plan.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-plan-manager.ts:68
**Current:** `features: plan.features as string[] || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-plan-manager.ts:103
**Current:** `description: plan.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-plan-manager.ts:107
**Current:** `features: plan.features as string[] || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-plan-manager.ts:143
**Current:** `description: plan.description || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-plan-manager.ts:147
**Current:** `features: plan.features as string[] || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\tag-utils.ts:89
**Current:** `tag.name.toLowerCase() === categoryName.toLowerCase() ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\upload.ts:21
**Current:** `if (!fileExtension || !['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\websocket.ts:30
**Current:** `origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\websocket.ts:115
**Current:** `if (!userSockets || userSockets.length === 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\public\sw.js:121
**Current:** `if (request.method !== 'GET' || !url.protocol.startsWith('http')) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\public\sw.js:149
**Current:** `return request.destination === 'image' ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\public\sw.js:438
**Current:** `return history || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\public\sw.js:480
**Current:** `const urlToOpen = event.notification.data?.url || '/';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\add-prioritization-fields.ts:23
**Current:** `console.log(`   Current commission rate: ${testInstitution?.commissionRate || 'N/A'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\auto-fix-common-issues.ts:204
**Current:** `file.endsWith('.tsx') || file.endsWith('.ts')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\auto-fix-common-issues.ts:231
**Current:** `if (result.fixes.length > 0 || result.errors.length > 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\auto-recover-records.ts:128
**Current:** `if (remainingOrphanedPayments > 0 || remainingOrphanedEnrollments > 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\auto-recover-records.ts:133
**Current:** `if (bookingsWithoutPayment > 0 || bookingsWithoutEnrollment > 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\automated-commission-cron.ts:113
**Current:** `planType: inst.subscription?.planType || 'NONE',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\automated-commission-cron.ts:224
**Current:** `const task = args[0] || 'all';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-approval-settings.ts:81
**Current:** `console.log(`     - Payment Method: ${payment.paymentMethod || 'Not specified'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-approval-settings.ts:107
**Current:** `(!payment.paymentMethod ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-approval-settings.ts:130
**Current:** `console.log(`  - Exempted Institutions: ${adminSettings?.institutionPaymentApprovalExemptions?.length || 0}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-approval-settings.ts:152
**Current:** `(!payment.paymentMethod ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-dashboard-data.ts:67
**Current:** `console.log(`    Course: ${enrollment?.course?.title || 'Unknown'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-dashboard-data.ts:68
**Current:** `console.log(`    Student ID: ${enrollment?.studentId || 'Unknown'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-dashboard-data.ts:71
**Current:** `console.log(`    Student Name: ${student?.name || user?.name || 'Unknown'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-dashboard-data.ts:72
**Current:** `console.log(`    Institution: ${enrollment?.course?.institution?.name || 'Unknown'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-dashboard-data.ts:113
**Current:** `console.log(`    Course: ${enrollment.course?.title || 'Unknown'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-dashboard-data.ts:117
**Current:** `console.log(`    Student Name: ${student?.name || user?.name || 'Unknown'} (${student?.email || user?.email || 'No email'})`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-dashboard-data.ts:120
**Current:** `console.log(`    Institution: ${enrollment.course?.institution?.name || 'Unknown'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-dashboard-data.ts:186
**Current:** `console.log(`    Institution: ${course.institution?.name || 'Unknown'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-dashboard-data.ts:187
**Current:** `console.log(`    Base Price: $${course.base_price || 0}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-db-directly.ts:42
**Current:** `console.log(`Length: ${abcSchool.mainImageUrl?.length || 'N/A'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-email-settings.ts:33
**Current:** `console.log(`SMTP_HOST:      ${process.env.SMTP_HOST || 'Not set'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-email-settings.ts:34
**Current:** `console.log(`SMTP_PORT:      ${process.env.SMTP_PORT || 'Not set'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-email-settings.ts:35
**Current:** `console.log(`SMTP_USER:      ${process.env.SMTP_USER || 'Not set'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-email-settings.ts:37
**Current:** `console.log(`SMTP_SECURE:    ${process.env.SMTP_SECURE || 'Not set'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-email-settings.ts:38
**Current:** `console.log(`SMTP_FROM_EMAIL: ${process.env.SMTP_FROM_EMAIL || 'Not set'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-email-settings.ts:39
**Current:** `console.log(`SMTP_FROM_NAME: ${process.env.SMTP_FROM_NAME || 'Not set'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-email-settings.ts:92
**Current:** `if (!emailSettings.fromEmail || !emailSettings.username || !emailSettings.password) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-email-settings.ts:109
**Current:** `if (emailSettings.host && emailSettings.host.includes('outlook') || emailSettings.host.includes('hotmail')) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-env.ts:28
**Current:** `console.log(`✅ ${varName}: ${varName.includes('SECRET') || varName.includes('KEY') ? '***SET***' : value}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-env.ts:38
**Current:** `console.log(`✅ ${varName}: ${varName.includes('SECRET') || varName.includes('KEY') ? '***SET***' : value}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-env.ts:45
**Current:** `console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || 'Not set'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-env.ts:47
**Current:** `console.log(`DATABASE_URL: ${process.env.DATABASE_URL || 'Not set'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-env.ts:50
**Current:** `console.log(`\nEnvironment: ${process.env.NODE_ENV || 'development'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-env.ts:59
**Current:** `console.log(`- Port: ${url.port || 'default'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-institution-images.ts:25
**Current:** `console.log(`   Logo URL: ${institution.logoUrl || 'NULL'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-institution-images.ts:26
**Current:** `console.log(`   Main Image URL: ${institution.mainImageUrl || 'NULL'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-payment-statuses.ts:36
**Current:** `console.log(`       - Payment Method: ${payment.paymentMethod || 'Not specified'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-payment-statuses.ts:50
**Current:** `const pendingPayments = payments.filter(p => p.status === 'PENDING' || p.status === 'PROCESSING');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-payment-statuses.ts:64
**Current:** `p.status === 'PENDING' || p.status === 'PROCESSING'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-payment-statuses.ts:73
**Current:** `console.log(`    - Payment Method: ${payment.paymentMethod || 'Not specified'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\cleanup-orphaned-courses.ts:72
**Current:** `const remainingCount = (remainingOrphaned as any[])[0]?.count || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\cleanup-orphaned-enrollments.ts:34
**Current:** `console.log(`   Course: ${enrollment.course?.title || 'Unknown'} (${enrollment.courseId})`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\cleanup-orphaned-records.ts:218
**Current:** `console.log(`  Title: ${record.title || 'N/A'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\create-course.js:55
**Current:** `if (!webDevTag || !programmingTag) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\debug-subscription-data.ts:23
**Current:** `console.log(`  ${index + 1}. Institution: ${sub.institution?.name || 'Unknown'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\debug-subscription-data.ts:24
**Current:** `console.log(`     Tier: ${sub.commissionTier?.name || 'NULL'} (ID: ${sub.commissionTierId})`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\debug-subscription-data.ts:42
**Current:** `console.log(`  ${index + 1}. Student: ${sub.student?.name || 'Unknown'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\debug-subscription-data.ts:43
**Current:** `console.log(`     Tier: ${sub.studentTier?.name || 'NULL'} (ID: ${sub.studentTierId})`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-api-toast-imports.js:13
**Current:** `} else if (file.endsWith('.ts') || file.endsWith('.tsx')) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-booking-payment-inconsistency.ts:54
**Current:** `console.log(`   Payment status: ${latestPayment?.status || 'NO_PAYMENT'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-common-errors.ts:190
**Current:** `suggestions += `// Use: institutionId || null\n`;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-common-errors.ts:197
**Current:** `suggestions += `// Use: console.error('Error fetching institution:', error.message || error)\n`;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-common-errors.ts:243
**Current:** `acc[error.pattern.severity] = (acc[error.pattern.severity] || 0) + 1;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-common-errors.ts:248
**Current:** `console.log(`🔴 High severity: ${bySeverity.high || 0}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-common-errors.ts:249
**Current:** `console.log(`🟡 Medium severity: ${bySeverity.medium || 0}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-common-errors.ts:250
**Current:** `console.log(`🟢 Low severity: ${bySeverity.low || 0}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-console-errors.ts:38
**Current:** `} else if (item.endsWith('.tsx') || item.endsWith('.ts')) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-console-errors.ts:52
**Current:** `const hasToastImport = content.includes("import { toast } from 'sonner'") ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-console-errors.ts:111
**Current:** `if (result.fixes.length > 0 || result.errors.length > 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-server-console-errors.ts:38
**Current:** `} else if (item.endsWith('.ts') || item.endsWith('.tsx')) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-server-console-errors.ts:57
**Current:** `const hasLoggerImport = content.includes("import { logger") ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-server-console-errors.ts:129
**Current:** `if (result.fixes.length > 0 || result.errors.length > 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-specific-errors.ts:17
**Current:** `replacement: "console.log('Sidebar - Institution ID from props:', institutionId || 'Not provided');",`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-unlinked-records.ts:43
**Current:** `if (institutionSubs.length > 0 || studentSubs.length > 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-unused-imports.ts:38
**Current:** `} else if (item.endsWith('.ts') || item.endsWith('.tsx')) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-unused-imports.ts:115
**Current:** `if (result.fixes.length > 0 || result.errors.length > 0) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\irt-parameter-guide.ts:300
**Current:** `if (params.difficulty < -4 || params.difficulty > 4) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\irt-parameter-guide.ts:305
**Current:** `if (params.discrimination < 0.1 || params.discrimination > 3) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\irt-parameter-guide.ts:310
**Current:** `if (params.guessing < 0 || params.guessing > 1) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\manage-payment-approval-transition.ts:71
**Current:** `(!payment.paymentMethod ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\manage-payment-approval-transition.ts:138
**Current:** `console.log(`     - Payment Method: ${payment.paymentMethod || 'Not specified'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\manage-payment-approval-transition.ts:185
**Current:** `console.log(`   - Admin Only Reason: ${payments.find(p => p.reason !== 'Requires admin approval')?.reason || 'N/A'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\reassign-orphaned-modules.ts:33
**Current:** `const courseModules = modulesByCourse[course.id] || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\recover-deleted-records.ts:40
**Current:** `console.log(`    Student: ${student?.name || 'Unknown'} (${booking.studentId})`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\recover-deleted-records.ts:41
**Current:** `console.log(`    Course: ${course?.title || 'Unknown'} (${booking.courseId})`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\recover-deleted-records.ts:76
**Current:** `console.log(`    Student: ${student?.name || 'Unknown'} (${enrollment.studentId})`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\recover-deleted-records.ts:77
**Current:** `console.log(`    Course: ${course?.title || 'Unknown'} (${enrollment.courseId})`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\recover-deleted-records.ts:110
**Current:** `console.log(`    Institution: ${institution?.name || 'Unknown'} (${payment.institutionId})`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-bug-detection.ts:77
**Current:** `acc + (suite.specs?.length || 0), 0) || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-bug-detection.ts:111
**Current:** `if (suiteName.includes('Fast Refresh') || testName.includes('webpack')) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-bug-detection.ts:114
**Current:** `} else if (suiteName.includes('Navigation') || testName.includes('routing')) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-bug-detection.ts:117
**Current:** `} else if (suiteName.includes('API') || testName.includes('data loading')) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-bug-detection.ts:120
**Current:** `} else if (suiteName.includes('UI') || testName.includes('rendering')) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-bug-detection.ts:149
**Current:** `return suggestions[category] || 'Review the failing test and implement appropriate fixes';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-bug-detection.ts:268
**Current:** `file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-bug-detection.ts:311
**Current:** `acc[issue.category] = (acc[issue.category] || 0) + 1;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-mobile-tests.ts:234
**Current:** `averageDuration: results.reduce((sum, r) => sum + (r.duration || 0), 0) / total`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-mobile-tests.ts:258
**Current:** `averageDuration: deviceResults.reduce((sum, r) => sum + (r.duration || 0), 0) / total`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-mobile-tests.ts:265
**Current:** `r.title.toLowerCase().includes('performance') ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-mobile-tests.ts:271
**Current:** `averageLoadTime: performanceTests.reduce((sum, r) => sum + (r.duration || 0), 0) / performanceTests.length,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-mobile-tests.ts:273
**Current:** `(r.duration || 0) > (slowest.duration || 0) ? r : slowest`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-mobile-tests.ts:276
**Current:** `(r.duration || 0) < (fastest.duration || 0) ? r : fastest`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-mobile-tests.ts:293
**Current:** `const slowTests = results.filter(r => (r.duration || 0) > 5000);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\scan-errors.ts:197
**Current:** `const lineContent = lines[lineNumber - 1] || '';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\scan-errors.ts:336
**Current:** `criticalIssues: bySeverity.critical?.slice(0, 10) || [],`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\seed-courses.ts:135
**Current:** `autoTags.has(tag.name.toLowerCase()) ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\seed-courses.ts:136
**Current:** `autoTags.has(tag.slug?.toLowerCase() || '')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\seed-tags.ts:294
**Current:** `return courseTitle.includes(tagName) || courseDescription.includes(tagName);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\setup-promotional-sidebar.ts:213
**Current:** `description: inst.description || `${inst.name} - Premium language education`,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\setup-promotional-sidebar.ts:240
**Current:** `console.log(`   ${index + 1}. ${type}: ${item.title || item.name}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-admin-settings-auth.ts:207
**Current:** `priorityScore += (inst.commissionRate || 0);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-analytics-fix.ts:48
**Current:** `return paymentSum + (payment.amount || 0);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-analytics-fix.ts:62
**Current:** `priorityScore += planBonus[institution.subscriptionPlan as keyof typeof planBonus] || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-analytics-fix.ts:63
**Current:** `priorityScore += (institution.commissionRate || 0) * 5;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-approval-filtering.ts:33
**Current:** `console.log(`   Found ${searchResults.courses?.length || 0} courses in search`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-approval-filtering.ts:46
**Current:** `console.log(`   Successfully fetched ${institution.name} with ${institution.courses?.length || 0} courses`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-approval-filtering.ts:53
**Current:** `const nonApprovedInstitution = institutions.find((inst: any) => !inst.isApproved || inst.status !== 'ACTIVE');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-architecture-redundancy.ts:21
**Current:** `console.log(`    Features: ${Object.keys(tier.features || {}).filter(key => tier.features[key] === true).join(', ')}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-architecture-redundancy.ts:54
**Current:** `console.log(`    Subscription Plan: ${sub.subscriptionPlan?.name || 'None'} (from SubscriptionPlan table)`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-architecture-redundancy.ts:69
**Current:** `const starterFeatures = Object.keys(starterTier.features || {}).filter(key => starterTier.features[key] === true);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-architecture-redundancy.ts:73
**Current:** `const professionalFeatures = Object.keys(professionalTier.features || {}).filter(key => professionalTier.features[key] === true);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-architecture-redundancy.ts:77
**Current:** `const enterpriseFeatures = Object.keys(enterpriseTier.features || {}).filter(key => enterpriseTier.features[key] === true);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-auth.ts:57
**Current:** `console.log(`Institution: ${institutionUser.institution?.name || 'Not linked'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-commission-visibility.ts:69
**Current:** `const roleName = role || 'UNAUTHENTICATED';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-commission-visibility.ts:109
**Current:** `const roleName = userRole || 'UNAUTHENTICATED';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-commission-visibility.ts:110
**Current:** `const shouldShow = (userRole === 'ADMIN' || userRole === 'INSTITUTION');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-enhanced-subscription-plans.ts:63
**Current:** `console.log(`    Plan: ${sub.planType} - ${sub.subscriptionPlan?.name || 'No linked plan'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-enhanced-subscription-plans.ts:78
**Current:** `const starterFeatures = Object.keys(starterTier.features || {}).filter(key => starterTier.features[key] === true);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-enhanced-subscription-plans.ts:83
**Current:** `const professionalFeatures = Object.keys(professionalTier.features || {}).filter(key => professionalTier.features[key] === true);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-enhanced-subscription-plans.ts:88
**Current:** `const enterpriseFeatures = Object.keys(enterpriseTier.features || {}).filter(key => enterpriseTier.features[key] === true);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-enhanced-subscription-plans.ts:113
**Current:** `console.log(`✅ Subscription plans API: ${plansData.plans?.length || 0} plans returned`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-institution-monetization.ts:53
**Current:** `priorityScore += planBonus[inst.subscriptionPlan as keyof typeof planBonus] || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-institution-monetization.ts:56
**Current:** `priorityScore += (inst.commissionRate || 0) * 5;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-institution-monetization.ts:144
**Current:** `inst.isFeatured || inst.isPremiumListing || inst.isSponsoredListing`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-lead-tracking-integration.ts:136
**Current:** `if (response.status === 200 || response.status === 401) { // 401 is expected for protected routes`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-mobile-simple.ts:54
**Current:** `responsive: { passed: bodyWidth <= (viewport?.width || 0), value: bodyWidth },`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-mobile-simple.ts:55
**Current:** `touchSupport: { passed: !device.isMobile || touchSupport, value: touchSupport },`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-mobile-simple.ts:86
**Current:** `console.log(`   - ${test}: ${data.passed ? '✅' : '❌'} ${data.value || data.duration}ms`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-performance.ts:90
**Current:** `const stats = endpointStats.get(result.endpoint) || {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-prioritization-system.ts:49
**Current:** `priorityScore += (course.institution.commissionRate || 0) * 10;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-prioritization-system.ts:68
**Current:** `priorityScore += planBonus[subscriptionPlan as keyof typeof planBonus] || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-prioritization-system.ts:79
**Current:** `const commissionRate = course.institution.commissionRate || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-prioritization-system.ts:94
**Current:** `subscriptionTier: course.institution.subscription?.commissionTier?.planType || 'NONE'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-prioritization-system.ts:114
**Current:** `const isHighCommission = (course.commissionRate || 0) >= 20;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-prioritization-system.ts:115
**Current:** `const isVeryHighCommission = (course.commissionRate || 0) >= 25;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-prioritization-system.ts:117
**Current:** `return isPremiumPlacement || isFeaturedPlacement || isHighCommission;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-prioritization-system.ts:124
**Current:** `const highCommissionCount = advertisingEligible.filter(c => (c.commissionRate || 0) >= 20).length;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-prioritization-system.ts:125
**Current:** `const veryHighCommissionCount = advertisingEligible.filter(c => (c.commissionRate || 0) >= 25).length;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-prioritization-system.ts:155
**Current:** `const totalRev = totalRevenue._sum.amount || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-prioritization-system.ts:156
**Current:** `const commissionRev = commissionRevenue._sum.commissionAmount || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-prioritization-system.ts:179
**Current:** `const plan = stat.subscriptionPlan || 'BASIC';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-prioritization-system.ts:203
**Current:** `const rate = stat.commissionRate || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-prioritization-system.ts:270
**Current:** `console.log(`   Priority score: ${firstCourse.priorityScore || 'N/A'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-prioritization-system.ts:271
**Current:** `console.log(`   Commission band: ${firstCourse.commissionRateBand?.band || 'N/A'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-prioritization-system.ts:272
**Current:** `console.log(`   Effective subscription plan: ${firstCourse.effectiveSubscriptionPlan || 'N/A'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-quiz-api.ts:73
**Current:** `institutionId: institutionId || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-quiz-api.ts:98
**Current:** `institutionId: institutionId || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-quiz-api.ts:99
**Current:** `categoryId: category?.id || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-quiz-api.ts:124
**Current:** `course_id: course?.id || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-quiz-api.ts:147
**Current:** `module_id: module?.id || 'test-module-id',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-quiz-api.ts:186
**Current:** `module_id: module?.id || 'test-module-id'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-quiz-api.ts:204
**Current:** `console.log(`- Institution ID: ${institutionId || 'Test Institution'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-quiz-api.ts:205
**Current:** `console.log(`- Course: ${course?.title || 'Test Course'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-quiz-api.ts:206
**Current:** `console.log(`- Module: ${module?.title || 'Test Module'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-simplified-pricing-model.ts:63
**Current:** `console.log(`     Subscription Plan: ${sub.subscriptionPlan?.name || 'None'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-subscription-flow.ts:64
**Current:** `console.log(`  - ${log.action}: ${log.oldPlan || 'N/A'} → ${log.newPlan || 'N/A'} (${log.reason})`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-subscription-flow.ts:73
**Current:** `console.log(`  - ${log.action}: ${log.oldPlan || 'N/A'} → ${log.newPlan || 'N/A'} (${log.reason})`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-subscription-flow.ts:119
**Current:** `console.log(`  - ${student.userId} (${student.id}) - Created: ${student.created_at?.toISOString() || 'N/A'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-subscription-plans.ts:7
**Current:** `url: process.env.DATABASE_URL || 'mysql://root:@localhost:3306/langcsebkg4a'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-subscription-plans.ts:104
**Current:** `console.log(`   - ${sub.institution.name}: ${sub.subscriptionPlan?.name || sub.planType} ($${sub.subscriptionPlan?.price || sub.amount})`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-subscription-plans.ts:133
**Current:** `if (error.message.includes('Unknown database') || error.message.includes('ECONNREFUSED')) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-updated-priority-algorithm.ts:51
**Current:** `priorityScore += (course.institution.commissionRate || 0) * 10;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-updated-priority-algorithm.ts:70
**Current:** `priorityScore += planBonus[subscriptionPlan as keyof typeof planBonus] || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-updated-priority-algorithm.ts:73
**Current:** `const commissionRate = course.institution.commissionRate || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-updated-priority-algorithm.ts:88
**Current:** `subscriptionTier: course.institution.subscription?.commissionTier?.planType || 'NONE'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-updated-priority-algorithm.ts:106
**Current:** `acc[course.commissionBand] = (acc[course.commissionBand] || 0) + 1;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-updated-priority-algorithm.ts:136
**Current:** `acc[course.subscriptionTier] = (acc[course.subscriptionTier] || 0) + 1;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-updated-priority-algorithm.ts:149
**Current:** `const commissionPoints = (course.commissionRate || 0) * 10;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-updated-priority-algorithm.ts:158
**Current:** `const planPoints = planBonus[course.subscriptionPlan as keyof typeof planBonus] || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-updated-priority-algorithm.ts:189
**Current:** `console.log(`   Priority score: ${firstCourse.priorityScore || 'N/A'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-updated-priority-algorithm.ts:190
**Current:** `console.log(`   Commission band: ${firstCourse.commissionRateBand?.band || 'N/A'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-updated-priority-algorithm.ts:191
**Current:** `console.log(`   Effective subscription plan: ${firstCourse.effectiveSubscriptionPlan || 'N/A'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-updated-priority-algorithm.ts:207
**Current:** `console.log(`   - Very high commission courses (≥25%): ${bandStats['VERY_HIGH'] || 0}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-updated-priority-algorithm.ts:208
**Current:** `console.log(`   - High commission courses (≥20%): ${bandStats['HIGH'] || 0}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\verify-booking-payment-status.ts:99
**Current:** `if (!isBookingConsistent || !isEnrollmentConsistent) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\comprehensive-bug-detection.spec.ts:193
**Current:** `expect(currentUrl.includes('/auth/') || currentUrl.includes('/login')).toBe(true);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\global-setup.ts:320
**Current:** `if (!institution || !category) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\global-setup.ts:417
**Current:** `if (!admin || !student || !institution) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\mobile-performance-report.spec.ts:27
**Current:** `if (box && (box.width < 44 || box.height < 44)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\responsive.spec.ts:18
**Current:** `const viewportWidth = page.viewportSize()?.width || 0;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\responsive.spec.ts:167
**Current:** `width: page.viewportSize()?.height || 667,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\responsive.spec.ts:168
**Current:** `height: page.viewportSize()?.width || 375`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\responsive.spec.ts:175
**Current:** `width: page.viewportSize()?.height || 375,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\responsive.spec.ts:176
**Current:** `height: page.viewportSize()?.width || 667`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\server-connectivity.spec.ts:32
**Current:** `if (bodyText?.includes('404') || bodyText?.includes('not found')) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\utils\test-helpers.ts:90
**Current:** `const hasUserContent = document.body.textContent?.includes('Welcome') ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\utils\test-helpers.ts:273
**Current:** `return await this.page.textContent(selector) || '';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\utils\test-helpers.ts:349
**Current:** `const hasAuth = document.body.textContent?.includes('Welcome') ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\global-teardown.ts:46
**Current:** `duration: results.reduce((sum: number, r: any) => sum + (r.duration || 0), 0),`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-device-testing.ts:341
**Current:** `if (rect.width < minSize || rect.height < minSize) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-e2e.spec.ts:120
**Current:** `const viewportHeight = page.viewportSize()?.height || 800;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-e2e.spec.ts:163
**Current:** `return Array.from(imgs).filter(img => !img.complete || img.naturalWidth === 0).length;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\mobile-e2e.spec.ts:184
**Current:** `firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\performance\load-test-processor.js:35
**Current:** `requestParams.headers = requestParams.headers || {};`
## Generic error fetching messages without proper error handling
**Found in 319 locations:**

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:302
**Current:** `toast.error('Error fetching institution:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching institution:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:330
**Current:** `toast.error('Error fetching institutions:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching institutions:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:370
**Current:** `console.error('Error fetching categories:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching categories:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:371
**Current:** `toast.error('Error fetching categories:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching categories:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:833
**Current:** `toast.error('Error fetching courses:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching courses:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\page.tsx:98
**Current:** `toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\page.tsx:103
**Current:** `toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\page.tsx:93
**Current:** `toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\page.tsx:108
**Current:** `toast.error('Error fetching quiz analytics:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching quiz analytics:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:93
**Current:** `toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:89
**Current:** `toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:258
**Current:** `toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:285
**Current:** `toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\page.tsx:123
**Current:** `toast.error('Error fetching course:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching course:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institution-monetization\page.tsx:102
**Current:** `toast.error('Error fetching institutions:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching institutions:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\page.tsx:79
**Current:** `toast.error('Error fetching institutions:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching institutions:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\courses\page.tsx:115
**Current:** `toast.error('Error fetching institution courses:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching institution courses:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\courses\page.tsx:131
**Current:** `toast.error('Error fetching categories:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching categories:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\edit\page.tsx:41
**Current:** `toast.error('Error fetching institution:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching institution:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\permissions\page.tsx:95
**Current:** `toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\users\page.tsx:83
**Current:** `toast.error('Error fetching users:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching users:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:136
**Current:** `toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-banks\page.tsx:60
**Current:** `toast.error('Error fetching question banks:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching question banks:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-templates\page.tsx:86
**Current:** `toast.error('Error fetching question templates:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching question templates:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\revenue\page.tsx:109
**Current:** `console.error('Error fetching revenue data:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching revenue data:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\commission-tiers\page.tsx:151
**Current:** `toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\notifications\templates\page.tsx:143
**Current:** `toast.error('Error fetching templates:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching templates:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:275
**Current:** `toast.error('Error fetching institutions:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching institutions:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:291
**Current:** `toast.error('Error fetching email settings:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching email settings:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:563
**Current:** `toast.error('Error fetching notification templates:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching notification templates:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:584
**Current:** `toast.error('Error fetching notification logs:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching notification logs:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:598
**Current:** `toast.error('Error fetching notification stats:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching notification stats:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:759
**Current:** `console.error('Error fetching scripts:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching scripts:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\payment-approval\page.tsx:114
**Current:** `toast.error('Error fetching settings:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching settings:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\subscriptions\page.tsx:103
**Current:** `console.error('Error fetching subscriptions:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching subscriptions:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\subscriptions\page.tsx:118
**Current:** `console.error('Error fetching stats:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching stats:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\subscriptions\[id]\edit\page.tsx:87
**Current:** `console.error('Error fetching subscription:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching subscription:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:185
**Current:** `console.error('Error fetching tags:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching tags:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:206
**Current:** `console.error('Error fetching analytics:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching analytics:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\page.tsx:86
**Current:** `console.error('Error fetching users:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching users:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\[userId]\page.tsx:66
**Current:** `console.error('Error fetching user:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching user:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:302
**Current:** `toast.error('Error fetching institution:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching institution:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:330
**Current:** `toast.error('Error fetching institutions:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching institutions:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:370
**Current:** `console.error('Error fetching categories:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching categories:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:371
**Current:** `toast.error('Error fetching categories:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching categories:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:833
**Current:** `toast.error('Error fetching courses:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching courses:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\page.tsx:98
**Current:** `toast.error('Error fetching data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\page.tsx:103
**Current:** `toast.error('Error fetching data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\page.tsx:93
**Current:** `toast.error('Error fetching data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\page.tsx:108
**Current:** `toast.error('Error fetching quiz analytics:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching quiz analytics:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:93
**Current:** `toast.error('Error fetching data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:89
**Current:** `toast.error('Error fetching data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:258
**Current:** `toast.error('Error fetching data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:285
**Current:** `toast.error('Error fetching data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\page.tsx:123
**Current:** `toast.error('Error fetching course:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching course:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institution-monetization\page.tsx:102
**Current:** `toast.error('Error fetching institutions:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching institutions:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\page.tsx:79
**Current:** `toast.error('Error fetching institutions:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching institutions:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\courses\page.tsx:115
**Current:** `toast.error('Error fetching institution courses:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching institution courses:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\courses\page.tsx:131
**Current:** `toast.error('Error fetching categories:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching categories:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\edit\page.tsx:41
**Current:** `toast.error('Error fetching institution:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching institution:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\permissions\page.tsx:95
**Current:** `toast.error('Error fetching data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\users\page.tsx:83
**Current:** `toast.error('Error fetching users:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching users:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:136
**Current:** `toast.error('Error fetching data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-banks\page.tsx:60
**Current:** `toast.error('Error fetching question banks:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching question banks:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-templates\page.tsx:86
**Current:** `toast.error('Error fetching question templates:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching question templates:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\commission-tiers\page.tsx:151
**Current:** `toast.error('Error fetching data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\notifications\templates\page.tsx:143
**Current:** `toast.error('Error fetching templates:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching templates:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:269
**Current:** `toast.error('Error fetching institutions:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching institutions:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:285
**Current:** `toast.error('Error fetching email settings:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching email settings:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:557
**Current:** `toast.error('Error fetching notification templates:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching notification templates:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:578
**Current:** `toast.error('Error fetching notification logs:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching notification logs:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:592
**Current:** `toast.error('Error fetching notification stats:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching notification stats:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\payment-approval\page.tsx:114
**Current:** `toast.error('Error fetching settings:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching settings:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\revenue\page.tsx:109
**Current:** `console.error('Error fetching revenue data:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching revenue data:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\subscriptions\page.tsx:103
**Current:** `console.error('Error fetching subscriptions:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching subscriptions:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\subscriptions\page.tsx:118
**Current:** `console.error('Error fetching stats:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching stats:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\subscriptions\[id]\edit\page.tsx:87
**Current:** `console.error('Error fetching subscription:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching subscription:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:185
**Current:** `console.error('Error fetching tags:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching tags:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:206
**Current:** `console.error('Error fetching analytics:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching analytics:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\page.tsx:86
**Current:** `console.error('Error fetching users:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching users:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\[userId]\page.tsx:66
**Current:** `console.error('Error fetching user:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching user:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\advertising\route.ts:244
**Current:** `console.error('Error fetching advertising data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching advertising data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\route.ts:24
**Current:** `console.error('Error fetching categories:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching categories:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\categories\[categoryId]\route.ts:34
**Current:** `console.error('Error fetching category:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching category:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\priority\route.ts:183
**Current:** `console.error('Error fetching course priority:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching course priority:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\enrollments\route.ts:137
**Current:** `console.error('Error fetching course enrollments:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching course enrollments:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\route.ts:95
**Current:** `console.error('Error fetching modules:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching modules:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\content\route.ts:52
**Current:** `console.error('Error fetching content:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching content:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\route.ts:68
**Current:** `console.error('Error fetching quizzes:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching quizzes:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\analytics\route.ts:107
**Current:** `console.error('Error fetching quiz analytics:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching quiz analytics:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:246
**Current:** `console.error('Error fetching questions:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching questions:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:96
**Current:** `console.error('Error fetching question:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching question:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:72
**Current:** `console.error('Error fetching quiz:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching quiz:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\route.ts:70
**Current:** `console.error('Error fetching module:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching module:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\route.ts:94
**Current:** `console.error('Error fetching course:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching course:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institution-monetization\route.ts:118
**Current:** `console.error('Error fetching institution monetization data:', error instanceof Error ? error.message : error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching institution monetization data:', error instanceof Error ? error.message : error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\route.ts:65
**Current:** `console.error('Error fetching institutions:', error instanceof Error ? error.message : error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching institutions:', error instanceof Error ? error.message : error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\settings\route.ts:39
**Current:** `console.error('Error fetching institution settings:', error instanceof Error ? error.message : error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching institution settings:', error instanceof Error ? error.message : error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\commission-rate\route.ts:101
**Current:** `console.error('Error fetching commission rate logs:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching commission rate logs:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\permissions\route.ts:58
**Current:** `console.error('Error fetching institution permissions:', error instanceof Error ? error.message : error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching institution permissions:', error instanceof Error ? error.message : error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\route.ts:69
**Current:** `console.error('Error fetching institution:', error instanceof Error ? error.message : error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching institution:', error instanceof Error ? error.message : error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\institutions\[id]\users\route.ts:50
**Current:** `console.error('Error fetching institution users:', error instanceof Error ? error.message : error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching institution users:', error instanceof Error ? error.message : error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\payments\pending-count\route.ts:37
**Current:** `console.error('Error fetching pending payments count:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching pending payments count:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\payments\route.ts:133
**Current:** `console.error('Error fetching payments:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching payments:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\performance\health\route.ts:20
**Current:** `console.error('Error fetching system health:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching system health:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\performance\metrics\route.ts:20
**Current:** `console.error('Error fetching performance metrics:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching performance metrics:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\commission-tiers\route.ts:22
**Current:** `console.error('Error fetching commission tiers:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching commission tiers:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\email\route.ts:36
**Current:** `console.error('Error fetching email settings:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching email settings:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\stats\route.ts:132
**Current:** `console.error('Error fetching notification statistics:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching notification statistics:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\route.ts:64
**Current:** `console.error('Error fetching notification templates:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching notification templates:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\notifications\templates\[id]\route.ts:66
**Current:** `console.error('Error fetching notification template:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching notification template:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\payment-approval\route.ts:104
**Current:** `console.error('Error fetching payment approval settings:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching payment approval settings:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\subscription-plans\route.ts:102
**Current:** `console.error('Error fetching subscription plans:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching subscription plans:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\route.ts:82
**Current:** `console.error('Error fetching subscriptions:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching subscriptions:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\stats\route.ts:108
**Current:** `console.error('Error fetching subscription stats:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching subscription stats:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\[id]\route.ts:46
**Current:** `console.error('Error fetching subscription:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching subscription:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\tags\route.ts:67
**Current:** `console.error('Error fetching tags:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching tags:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\users\route.ts:33
**Current:** `console.error('Error fetching users:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching users:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\users\[userId]\route.ts:54
**Current:** `console.error('Error fetching user:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching user:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\users\[userId]\route.ts:56
**Current:** `{ message: 'Error fetching user', error: error instanceof Error ? error.message : 'Unknown error' },`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: { message: 'Error fetching user', error: error instanceof Error ? error.message : 'Unknown error' },
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\analytics\leads\route.ts:123
**Current:** `console.error('Error fetching lead analytics:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching lead analytics:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\user\route.ts:38
**Current:** `console.error('Error fetching user:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching user:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\bookings\route.ts:160
**Current:** `console.error('Error fetching bookings:', error)`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching bookings:', error)
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\categories\route.ts:34
**Current:** `console.error('Error fetching categories:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching categories:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\by-country\route.ts:48
**Current:** `console.error('Error fetching courses by country:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching courses by country:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\public\route.ts:139
**Current:** `console.error('Error fetching public courses:', error)`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching public courses:', error)
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route.ts:54
**Current:** `console.error('Error fetching courses:', error)`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching courses:', error)
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\route_new.ts:54
**Current:** `console.error('Error fetching courses:', error)`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching courses:', error)
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\monthly-pricing\route.ts:32
**Current:** `console.error('Error fetching monthly prices:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching monthly prices:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\pricing\route.ts:118
**Current:** `console.error('Error fetching weekly prices:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching weekly prices:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\pricing-rules\route.ts:89
**Current:** `console.error('Error fetching pricing rules:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching pricing rules:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\route.ts:59
**Current:** `console.error('Error fetching course:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching course:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\[id]\tags\route.ts:30
**Current:** `console.error('Error fetching course tags:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching course tags:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\stats\route.ts:92
**Current:** `console.error('Error fetching institution stats:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching institution stats:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\categories\route.ts:31
**Current:** `console.error('Error fetching institution types:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching institution types:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\collaboration\stats\route.ts:154
**Current:** `console.error('Error fetching collaboration stats:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching collaboration stats:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\commission-rate\route.ts:130
**Current:** `console.error('Error fetching commission rate logs:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching commission rate logs:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\enrollments\route.ts:143
**Current:** `console.error('Error fetching course enrollments:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching course enrollments:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\route.ts:87
**Current:** `console.error('Error fetching modules:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching modules:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\[contentId]\route.ts:59
**Current:** `console.error('Error fetching content:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching content:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\route.ts:65
**Current:** `console.error('Error fetching exercises:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching exercises:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\exercises\[exerciseId]\route.ts:66
**Current:** `console.error('Error fetching exercise:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching exercise:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\route.ts:59
**Current:** `console.error('Error fetching quizzes:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching quizzes:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\route.ts:73
**Current:** `console.error('Error fetching quiz questions:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching quiz questions:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\route.ts:76
**Current:** `console.error('Error fetching question:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching question:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\route.ts:101
**Current:** `console.error('Error fetching quiz:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching quiz:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\monthly-prices\route.ts:131
**Current:** `console.error('Error fetching monthly prices:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching monthly prices:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\route.ts:130
**Current:** `console.error('Error fetching course:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching course:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\weekly-prices\route.ts:133
**Current:** `console.error('Error fetching weekly prices:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching weekly prices:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\current\route.ts:33
**Current:** `console.error('Error fetching institution data:', error instanceof Error ? error.message : error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching institution data:', error instanceof Error ? error.message : error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\info\route.ts:49
**Current:** `console.error('Error fetching institution info:', error instanceof Error ? error.message : error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching institution info:', error instanceof Error ? error.message : error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payments\route.ts:140
**Current:** `console.error('Error fetching payments:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching payments:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\payouts\route.ts:47
**Current:** `console.error('Error fetching payouts:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching payouts:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\route.ts:70
**Current:** `console.error('Error fetching institution profile:', error instanceof Error ? error.message : error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching institution profile:', error instanceof Error ? error.message : error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\route.ts:70
**Current:** `console.error('Error fetching question banks:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching question banks:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\route.ts:73
**Current:** `console.error('Error fetching questions:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching questions:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:66
**Current:** `console.error('Error fetching question:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching question:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\route.ts:38
**Current:** `console.error('Error fetching question bank:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching question bank:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\route.ts:39
**Current:** `console.error('Error fetching question templates:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching question templates:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\route.ts:44
**Current:** `console.error('Error fetching question template:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching question template:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\quizzes\route.ts:142
**Current:** `console.error('Error fetching quizzes:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching quizzes:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\discount\route.ts:55
**Current:** `console.error('Error fetching discount settings:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching discount settings:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\payment-approval\route.ts:75
**Current:** `console.error('Error fetching institution payment settings:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching institution payment settings:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\settings\route.ts:68
**Current:** `console.error('Error fetching institution settings:', error instanceof Error ? error.message : error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching institution settings:', error instanceof Error ? error.message : error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:148
**Current:** `console.error('Error fetching shared questions:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching shared questions:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\stats\route.ts:169
**Current:** `console.error('Error fetching stats:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching stats:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\students\route.ts:135
**Current:** `console.error('Error fetching students:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching students:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\students\[id]\route.ts:94
**Current:** `console.error('Error fetching student details:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching student details:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\billing-history\route.ts:70
**Current:** `console.error('Error fetching billing history:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching billing history:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:88
**Current:** `console.error('Error fetching institution subscription:', error instanceof Error ? error.message : error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching institution subscription:', error instanceof Error ? error.message : error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\route.ts:84
**Current:** `console.error('Error fetching institutions:', error)`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching institutions:', error)
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:127
**Current:** `console.error('Error fetching institution:', error instanceof Error ? error.message : error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching institution:', error instanceof Error ? error.message : error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\locations\route.ts:77
**Current:** `console.error('Error fetching location data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching location data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\preferences\route.ts:65
**Current:** `console.error('Error fetching notification preferences:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching notification preferences:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\route.ts:75
**Current:** `console.error('Error fetching notifications:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching notifications:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\stats\route.ts:41
**Current:** `console.error('Error fetching stats:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching stats:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\route.ts:158
**Current:** `console.error('Error fetching courses:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching courses:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\quizzes\[quizId]\attempts\route.ts:48
**Current:** `console.error('Error fetching quiz attempts:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching quiz attempts:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\route.ts:143
**Current:** `console.error('Error fetching course details:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching course details:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\achievements\route.ts:44
**Current:** `console.error('Error fetching achievements:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching achievements:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\courses\route.ts:179
**Current:** `console.error('Error fetching course progress:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching course progress:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\quiz-stats\route.ts:155
**Current:** `console.error('Error fetching quiz stats:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching quiz stats:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\recent-modules\route.ts:89
**Current:** `console.error('Error fetching recent modules:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching recent modules:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:203
**Current:** `console.error('Error fetching dashboard data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching dashboard data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\stats\route.ts:141
**Current:** `console.error('Error fetching learning stats:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching learning stats:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\learning-path\route.ts:174
**Current:** `console.error('Error fetching learning path:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching learning path:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\profile\route.ts:110
**Current:** `console.error('Error fetching student profile:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching student profile:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress\route.ts:151
**Current:** `console.error('Error fetching progress:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching progress:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:133
**Current:** `console.error('Error fetching progress visualization:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching progress visualization:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\billing-history\route.ts:73
**Current:** `console.error('Error fetching student billing history:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching student billing history:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:36
**Current:** `console.error('Error fetching student subscription:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching student subscription:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\analytics\route.ts:82
**Current:** `console.error('Error fetching tag analytics:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching tag analytics:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\public\route.ts:75
**Current:** `console.error('Error fetching public tags:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching public tags:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\[id]\route.ts:32
**Current:** `console.error('Error fetching tag:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching tag:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\user\settings\route.ts:49
**Current:** `console.error('Error fetching user settings:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching user settings:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\awaiting-approval\page.tsx:44
**Current:** `toast.error('Error fetching institution:', error instanceof Error ? error.message : 'Unknown error');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching institution:', error instanceof Error ? error.message : 'Unknown error');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\LocationSelect.tsx:46
**Current:** `toast.error('Error fetching ${type}s:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching ${type}s:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\NotificationBell.tsx:51
**Current:** `console.error('Error fetching notifications:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching notifications:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\NotificationDashboard.tsx:81
**Current:** `console.error('Error fetching notifications:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching notifications:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\NotificationDashboard.tsx:96
**Current:** `console.error('Error fetching preferences:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching preferences:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\LearningPath.tsx:94
**Current:** `toast.error('Error fetching learning path:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching learning path:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\NotificationPreferences.tsx:139
**Current:** `toast.error('Error fetching preferences:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching preferences:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\PersonalizedRecommendations.tsx:85
**Current:** `toast.error('Error fetching recommendations:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching recommendations:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\components\student\ProgressVisualization.tsx:80
**Current:** `toast.error('Error fetching progress data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching progress data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\hooks\useCurrency.ts:47
**Current:** `console.error('Error fetching currency settings:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching currency settings:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\analytics\InstitutionAnalyticsClient.tsx:102
**Current:** `toast.error('Error fetching analytics:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching analytics:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\analytics\quiz-analytics\page.tsx:89
**Current:** `toast.error('Error fetching analytics:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching analytics:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\collaboration\page.tsx:83
**Current:** `toast.error('Error fetching collaboration stats:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching collaboration stats:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\content-management\page.tsx:94
**Current:** `toast.error('Error fetching content data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching content data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\components\MonthlyPricingTable.tsx:114
**Current:** `toast.error('Error fetching monthly prices:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching monthly prices:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:166
**Current:** `toast.error('Error fetching courses:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching courses:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:201
**Current:** `toast.error('Error fetching categories:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching categories:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:126
**Current:** `toast.error('Error fetching course:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching course:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:140
**Current:** `toast.error('Error fetching categories:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching categories:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\new\page.tsx:63
**Current:** `toast.error('Error fetching course:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching course:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\page.tsx:55
**Current:** `toast.error('Error fetching modules:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching modules:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\page.tsx:90
**Current:** `toast.error('Error fetching module:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching module:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\[contentId]\edit\page.tsx:83
**Current:** `toast.error('Error fetching content:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching content:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:86
**Current:** `toast.error('Error fetching module:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching module:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\edit\page.tsx:100
**Current:** `toast.error('Error fetching course:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching course:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\page.tsx:74
**Current:** `toast.error('Error fetching data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\edit\page.tsx:61
**Current:** `toast.error('Error fetching quiz:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching quiz:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\page.tsx:62
**Current:** `toast.error('Error fetching quiz:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching quiz:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:72
**Current:** `toast.error('Error fetching quiz:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching quiz:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\page.tsx:58
**Current:** `toast.error('Error fetching quiz:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching quiz:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:142
**Current:** `toast.error('Error fetching data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\page.tsx:109
**Current:** `toast.error('Error fetching course:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching course:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\DashboardClient.tsx:85
**Current:** `toast.error('Error fetching payment settings:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching payment settings:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\page.tsx:98
**Current:** `toast.error('Error fetching data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:148
**Current:** `toast.error('6. Error fetching institution:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('6. Error fetching institution:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:166
**Current:** `toast.error('Error fetching analytics:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching analytics:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\page.tsx:142
**Current:** `toast.error('Error fetching question banks:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching question banks:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\page.tsx:157
**Current:** `toast.error('Error fetching question templates:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching question templates:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:172
**Current:** `toast.error('Error fetching question bank:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching question bank:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:188
**Current:** `toast.error('Error fetching questions:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching questions:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:203
**Current:** `toast.error('Error fetching templates:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching templates:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:161
**Current:** `toast.error('Error fetching question bank:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching question bank:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:177
**Current:** `toast.error('Error fetching questions:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching questions:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:192
**Current:** `toast.error('Error fetching courses:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching courses:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:204
**Current:** `toast.error('Error fetching institutions:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching institutions:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-templates\page.tsx:128
**Current:** `toast.error('Error fetching question templates:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching question templates:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-templates\page.tsx:143
**Current:** `toast.error('Error fetching question banks:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching question banks:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\quizzes\page.tsx:120
**Current:** `toast.error('Error fetching quizzes:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching quizzes:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\quizzes\page.tsx:139
**Current:** `toast.error('Error fetching courses:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching courses:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\quizzes\page.tsx:175
**Current:** `toast.error('Error fetching modules:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching modules:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\settings\page.tsx:159
**Current:** `toast.error('Error fetching settings:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching settings:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\settings\page.tsx:173
**Current:** `toast.error('Error fetching logs:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching logs:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\shared-questions\page.tsx:115
**Current:** `toast.error('Error fetching shared questions:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching shared questions:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\page.tsx:110
**Current:** `toast.error('Error fetching students:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching students:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:124
**Current:** `toast.error('Error fetching student details:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching student details:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institutions\[id]\page.tsx:61
**Current:** `console.error('Error fetching institution:', error)`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching institution:', error)
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\settings\page.tsx:72
**Current:** `toast.error('Error fetching settings:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching settings:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\components\EnrollmentModal.tsx:147
**Current:** `toast.error('Error fetching course details:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching course details:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\page.tsx:76
**Current:** `toast.error('Error fetching courses:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching courses:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\modules\[moduleId]\page.tsx:158
**Current:** `toast.error('Error fetching attempts for quiz ${quiz.id}:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching attempts for quiz ${quiz.id}:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\modules\[moduleId]\page.tsx:164
**Current:** `toast.error('Error fetching module details:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching module details:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\page.tsx:96
**Current:** `toast.error('Error fetching course details:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching course details:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\page.tsx:194
**Current:** `toast.error('Error fetching dashboard data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching dashboard data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\page_backup.tsx:193
**Current:** `toast.error('Error fetching dashboard data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching dashboard data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\profile\page.tsx:73
**Current:** `toast.error('Error fetching profile:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching profile:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\progress\page.tsx:174
**Current:** `toast.error('Error fetching progress:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching progress:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\settings\page.tsx:56
**Current:** `toast.error('Error fetching profile:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching profile:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\course-categories.tsx:51
**Current:** `toast.error('Error fetching categories:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching categories:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\_admin_backup\page.tsx:75
**Current:** `toast.error('Error fetching advertising data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching advertising data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\AdminNotificationAnalytics.tsx:103
**Current:** `console.error('Error fetching analytics:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching analytics:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\Sidebar.tsx:71
**Current:** `console.error('Error fetching pending payments count:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching pending payments count:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CoursesPageClient.tsx:120
**Current:** `// toast.error('Error fetching courses:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: // toast.error('Error fetching courses:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CourseTagManager.tsx:69
**Current:** `toast.error('Error fetching tags:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching tags:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\components\DiscountSettingsForm.tsx:46
**Current:** `// toast.error('Error fetching discount settings:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: // toast.error('Error fetching discount settings:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\components\HomePageClient.tsx:142
**Current:** `console.error('Error fetching data:', error)`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching data:', error)
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionSidebar.tsx:119
**Current:** `toast.error('Error fetching courses:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching courses:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionSubscriptionCard.tsx:127
**Current:** `toast.error('Error fetching subscription data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching subscription data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\components\LeadTracking.tsx:110
**Current:** `toast.error('Error fetching analytics:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching analytics:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\components\PromotionalSidebar.tsx:171
**Current:** `// toast.error('Error fetching promotional content:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: // toast.error('Error fetching promotional content:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\components\providers\InstitutionProvider.tsx:43
**Current:** `// toast.error('Error fetching institution data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: // toast.error('Error fetching institution data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SimpleNotifications.tsx:64
**Current:** `console.error('Error fetching notifications:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching notifications:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\NotificationPreferences.tsx:114
**Current:** `toast.error('Error fetching preferences:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching preferences:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\StudentSubscriptionCard.tsx:125
**Current:** `toast.error('Error fetching subscription data:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: toast.error('Error fetching subscription data:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\components\TagFilter.tsx:46
**Current:** `console.error('Error fetching tags:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.error('Error fetching tags:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\constants\payment-config.ts:58
**Current:** `logger.error('Error fetching payment settings:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: logger.error('Error fetching payment settings:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\reminder-scheduler.ts:133
**Current:** `logger.error('Error fetching reminder history:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: logger.error('Error fetching reminder history:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\permissions.ts:56
**Current:** `logger.error('Error fetching institution permissions:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: logger.error('Error fetching institution permissions:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\permissions.ts:111
**Current:** `logger.error('Error fetching user institution permissions:');`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: logger.error('Error fetching user institution permissions:');
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-plan-manager.ts:45
**Current:** `logger.error('Error fetching active subscription plans:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: logger.error('Error fetching active subscription plans:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-plan-manager.ts:76
**Current:** `logger.error('Error fetching subscription plan by ID:', error);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: logger.error('Error fetching subscription plan by ID:', error);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\prisma\seed.ts:500
**Current:** `console.log(`Error fetching course for enrollment ${enrollment.id}:`, error.message);`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: console.log(`Error fetching course for enrollment ${enrollment.id}:`, error.message);
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-common-errors.ts:34
**Current:** `pattern: 'Error fetching.*:',`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: pattern: 'Error fetching.*:',
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-common-errors.ts:197
**Current:** `suggestions += `// Use: console.error('Error fetching institution:', error.message || error)\n`;`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: suggestions += `// Use: console.error('Error fetching institution:', error.message || error)\n`;
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:16
**Current:** `pattern: "toast\\.error\\('Error fetching ([^']+):'\\);",`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: pattern: "toast\\.error\\('Error fetching ([^']+):'\\);",
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:17
**Current:** `replacement: "toast.error('Error fetching $1:', error instanceof Error ? error.message : 'Unknown error');",`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: replacement: "toast.error('Error fetching $1:', error instanceof Error ? error.message : 'Unknown error');",
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:37
**Current:** `pattern: "console\\.error\\('Error fetching ([^']+):'\\);",`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: pattern: "console\\.error\\('Error fetching ([^']+):'\\);",
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:38
**Current:** `replacement: "console.error('Error fetching $1:', error instanceof Error ? error.message : error);",`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: replacement: "console.error('Error fetching $1:', error instanceof Error ? error.message : error);",
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:48
**Current:** `// Fix generic "Error fetching data:" messages`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: // Fix generic "Error fetching data:" messages
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:50
**Current:** `pattern: "toast\\.error\\('Error fetching data:'\\);",`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: pattern: "toast\\.error\\('Error fetching data:'\\);",
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:51
**Current:** `replacement: "toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');",`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: replacement: "toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');",
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:141
**Current:** `const toastErrorRegex = /toast\.error\('Error fetching ([^']+):'\);/g;`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: const toastErrorRegex = /toast\.error\('Error fetching ([^']+):'\);/g;
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:145
**Current:** `"toast.error('Error fetching $1:', error instanceof Error ? error.message : 'Unknown error');"`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: "toast.error('Error fetching $1:', error instanceof Error ? error.message : 'Unknown error');"
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:151
**Current:** `const consoleErrorRegex = /console\.error\('Error fetching ([^']+):'\);/g;`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: const consoleErrorRegex = /console\.error\('Error fetching ([^']+):'\);/g;
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:155
**Current:** `"console.error('Error fetching $1:', error instanceof Error ? error.message : error);"`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: "console.error('Error fetching $1:', error instanceof Error ? error.message : error);"
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:160
**Current:** `// Fix 3: Generic "Error fetching data:" messages`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: // Fix 3: Generic "Error fetching data:" messages
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:161
**Current:** `if (content.includes("toast.error('Error fetching data:');")) {`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: if (content.includes("toast.error('Error fetching data:');")) {
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:163
**Current:** `/toast\.error\('Error fetching data:'\);/g,`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: /toast\.error\('Error fetching data:'\);/g,
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:164
**Current:** `"toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');"`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: "toast.error('Error fetching data:', error instanceof Error ? error.message : 'Unknown error');"
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:169
**Current:** `// Fix 4: Generic "Error fetching data:" console messages`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: // Fix 4: Generic "Error fetching data:" console messages
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:170
**Current:** `if (content.includes("console.error('Error fetching data:');")) {`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: if (content.includes("console.error('Error fetching data:');")) {
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:172
**Current:** `/console\.error\('Error fetching data:'\);/g,`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: /console\.error\('Error fetching data:'\);/g,
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:173
**Current:** `"console.error('Error fetching data:', error instanceof Error ? error.message : error);"`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: "console.error('Error fetching data:', error instanceof Error ? error.message : error);"
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:242
**Current:** `/console\.error\('Error fetching ([^']+):'\);/g,`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: /console\.error\('Error fetching ([^']+):'\);/g,
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-critical-errors.ts:243
**Current:** `"console.error('Error fetching $1:', error instanceof Error ? error.message : error);"`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: "console.error('Error fetching $1:', error instanceof Error ? error.message : error);"
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-specific-errors.ts:23
**Current:** `pattern: "toast\\.error\\('Error fetching institution:'\\);",`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: pattern: "toast\\.error\\('Error fetching institution:'\\);",
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-specific-errors.ts:24
**Current:** `replacement: "toast.error('Error fetching institution:', error instanceof Error ? error.message : 'Unknown error');",`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: replacement: "toast.error('Error fetching institution:', error instanceof Error ? error.message : 'Unknown error');",
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-specific-errors.ts:43
**Current:** `pattern: "console\\.error\\('Error fetching institution:'\\);",`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: pattern: "console\\.error\\('Error fetching institution:'\\);",
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-specific-errors.ts:44
**Current:** `replacement: "console.error('Error fetching institution:', error instanceof Error ? error.message : error);",`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: replacement: "console.error('Error fetching institution:', error instanceof Error ? error.message : error);",
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-specific-errors.ts:103
**Current:** `if (content.includes("console.error('Error fetching institution:');")) {`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: if (content.includes("console.error('Error fetching institution:');")) {
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-specific-errors.ts:105
**Current:** `"console.error('Error fetching institution:');",`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: "console.error('Error fetching institution:');",
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-specific-errors.ts:106
**Current:** `"console.error('Error fetching institution:', error instanceof Error ? error.message : error);"`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: "console.error('Error fetching institution:', error instanceof Error ? error.message : error);"
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-specific-errors.ts:112
**Current:** `if (content.includes("toast.error('Error fetching institution:');")) {`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: if (content.includes("toast.error('Error fetching institution:');")) {
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-specific-errors.ts:114
**Current:** `"toast.error('Error fetching institution:');",`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: "toast.error('Error fetching institution:');",
// Use: console.error('Error fetching institution:', error.message || error)
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-specific-errors.ts:115
**Current:** `"toast.error('Error fetching institution:', error instanceof Error ? error.message : 'Unknown error');"`
**Suggested fix:** Add proper error handling with specific error messages
```tsx
// Instead of: "toast.error('Error fetching institution:', error instanceof Error ? error.message : 'Unknown error');"
// Use: console.error('Error fetching institution:', error.message || error)
```

## Optional chaining that might hide errors
**Found in 406 locations:**

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:859
**Current:** `? course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:860
**Current:** `course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:861
**Current:** `course.institution?.name?.toLowerCase().includes(searchQuery.toLowerCase())`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\page.tsx:1052
**Current:** `const currentYear = course.weeklyPrices?.[0]?.year || new Date().getFullYear();`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\enrollments\page.tsx:585
**Current:** `Update the status for {selectedEnrollment?.student.name}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\page.tsx:209
**Current:** `Manage modules for {course?.title} • {course?.institution.name}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\page.tsx:199
**Current:** `Manage quizzes for {course?.title} • {course?.institution.name}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:485
**Current:** `value={questionData.question_config?.leftItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:503
**Current:** `value={questionData.question_config?.rightItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:527
**Current:** `value={questionData.question_config?.dragItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:545
**Current:** `value={questionData.question_config?.dropZones?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:599
**Current:** `value={questionData.question_config?.orderItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:523
**Current:** `value={formData.question_config?.leftItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:541
**Current:** `value={formData.question_config?.rightItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:566
**Current:** `value={formData.question_config?.dragItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:584
**Current:** `value={formData.question_config?.dropZones?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:638
**Current:** `value={formData.question_config?.orderItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\courses\[id]\page.tsx:140
**Current:** `router.push(`/admin/institutions/${course?.institution.id}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\dashboard\page.tsx:174
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalUsers || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\dashboard\page.tsx:193
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalInstitutions || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\dashboard\page.tsx:212
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalCourses || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\dashboard\page.tsx:231
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">${stats?.statistics?.totalRevenue?.toLocaleString() || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\dashboard\page.tsx:250
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalEnrollments || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\dashboard\page.tsx:269
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">${stats?.statistics?.totalCommission?.toLocaleString() || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institution-monetization\page.tsx:110
**Current:** `if (session?.user?.role === 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\page.tsx:93
**Current:** `if (session?.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\courses\page.tsx:455
**Current:** `courseId={editingCourse?.id.toString() || 'new'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\permissions\page.tsx:66
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\institutions\[id]\users\page.tsx:55
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:143
**Current:** `if (status === 'authenticated' && session?.user?.role === 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:251
**Current:** `if (paymentSettings.institutionPaymentApprovalExemptions?.includes(payment.institution.id)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:257
**Current:** `if (payment.paymentMethod && !paymentSettings.institutionApprovableMethods?.includes(payment.paymentMethod)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:275
**Current:** `if (paymentSettings.institutionPaymentApprovalExemptions?.includes(payment.institution.id)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:280
**Current:** `if (payment.paymentMethod && !paymentSettings.institutionApprovableMethods?.includes(payment.paymentMethod)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:325
**Current:** `if (paymentSettings.institutionPaymentApprovalExemptions?.includes(payment.institution.id)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:329
**Current:** `if (payment.paymentMethod && !paymentSettings.institutionApprovableMethods?.includes(payment.paymentMethod)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:380
**Current:** `payment.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:381
**Current:** `payment.bookingId?.toLowerCase().includes(searchTerm.toLowerCase());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\payments\page.tsx:402
**Current:** `if (session?.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-banks\page.tsx:160
**Current:** `bank.description?.toLowerCase().includes(searchTerm.toLowerCase());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\question-templates\page.tsx:189
**Current:** `template.description?.toLowerCase().includes(searchTerm.toLowerCase());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\revenue\page.tsx:270
**Current:** `{metrics?.topRevenueSources.slice(0, 5).map((source, index) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\commission-tiers\page.tsx:159
**Current:** `if (session?.user?.role === 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:243
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\page.tsx:823
**Current:** `if (session?.user?.role === 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\payment-approval\page.tsx:94
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\settings\payment-approval\page.tsx:238
**Current:** `if (session?.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:123
**Current:** `if (sessionData?.user?.role === 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\tags\page.tsx:226
**Current:** `if (!sessionData?.user?.role || sessionData.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\page.tsx:67
**Current:** `if (session?.user?.role?.toUpperCase() !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\page.tsx:227
**Current:** `user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin\users\[userId]\page.tsx:37
**Current:** `if (session?.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:859
**Current:** `? course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:860
**Current:** `course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:861
**Current:** `course.institution?.name?.toLowerCase().includes(searchQuery.toLowerCase())`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\page.tsx:1052
**Current:** `const currentYear = course.weeklyPrices?.[0]?.year || new Date().getFullYear();`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\enrollments\page.tsx:585
**Current:** `Update the status for {selectedEnrollment?.student.name}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\page.tsx:209
**Current:** `Manage modules for {course?.title} • {course?.institution.name}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\page.tsx:199
**Current:** `Manage quizzes for {course?.title} • {course?.institution.name}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:485
**Current:** `value={questionData.question_config?.leftItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:503
**Current:** `value={questionData.question_config?.rightItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:527
**Current:** `value={questionData.question_config?.dragItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:545
**Current:** `value={questionData.question_config?.dropZones?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:599
**Current:** `value={questionData.question_config?.orderItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:523
**Current:** `value={formData.question_config?.leftItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:541
**Current:** `value={formData.question_config?.rightItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:566
**Current:** `value={formData.question_config?.dragItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:584
**Current:** `value={formData.question_config?.dropZones?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:638
**Current:** `value={formData.question_config?.orderItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\courses\[id]\page.tsx:140
**Current:** `router.push(`/admin/institutions/${course?.institution.id}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institution-monetization\page.tsx:110
**Current:** `if (session?.user?.role === 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\page.tsx:93
**Current:** `if (session?.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\courses\page.tsx:455
**Current:** `courseId={editingCourse?.id.toString() || 'new'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\permissions\page.tsx:66
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\institutions\[id]\users\page.tsx:55
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:143
**Current:** `if (status === 'authenticated' && session?.user?.role === 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:251
**Current:** `if (paymentSettings.institutionPaymentApprovalExemptions?.includes(payment.institution.id)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:257
**Current:** `if (payment.paymentMethod && !paymentSettings.institutionApprovableMethods?.includes(payment.paymentMethod)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:275
**Current:** `if (paymentSettings.institutionPaymentApprovalExemptions?.includes(payment.institution.id)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:280
**Current:** `if (payment.paymentMethod && !paymentSettings.institutionApprovableMethods?.includes(payment.paymentMethod)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:325
**Current:** `if (paymentSettings.institutionPaymentApprovalExemptions?.includes(payment.institution.id)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:329
**Current:** `if (payment.paymentMethod && !paymentSettings.institutionApprovableMethods?.includes(payment.paymentMethod)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:380
**Current:** `payment.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:381
**Current:** `payment.bookingId?.toLowerCase().includes(searchTerm.toLowerCase());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\payments\page.tsx:402
**Current:** `if (session?.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-banks\page.tsx:160
**Current:** `bank.description?.toLowerCase().includes(searchTerm.toLowerCase());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\question-templates\page.tsx:189
**Current:** `template.description?.toLowerCase().includes(searchTerm.toLowerCase());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\commission-tiers\page.tsx:159
**Current:** `if (session?.user?.role === 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:237
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\page.tsx:742
**Current:** `if (session?.user?.role === 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\payment-approval\page.tsx:94
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-backup-restored\settings\payment-approval\page.tsx:238
**Current:** `if (session?.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-disabled\dashboard\page.tsx:174
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalUsers || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-disabled\dashboard\page.tsx:193
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalInstitutions || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-disabled\dashboard\page.tsx:212
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalCourses || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-disabled\dashboard\page.tsx:231
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">${stats?.statistics?.totalRevenue?.toLocaleString() || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-disabled\dashboard\page.tsx:250
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.statistics?.totalEnrollments || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-disabled\dashboard\page.tsx:269
**Current:** `<div className="text-2xl font-bold text-gray-900 dark:text-white">${stats?.statistics?.totalCommission?.toLocaleString() || 0}</div>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\revenue\page.tsx:270
**Current:** `{metrics?.topRevenueSources.slice(0, 5).map((source, index) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:123
**Current:** `if (sessionData?.user?.role === 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\tags\page.tsx:226
**Current:** `if (!sessionData?.user?.role || sessionData.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\page.tsx:67
**Current:** `if (session?.user?.role?.toUpperCase() !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\page.tsx:227
**Current:** `user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\admin-temp\users\[userId]\page.tsx:37
**Current:** `if (session?.user?.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\update-weekly-prices\route.ts:9
**Current:** `if (!session?.user?.role?.toUpperCase() === 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\process-fallbacks\route.ts:11
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\error-scanning\route.ts:13
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\error-scanning\route.ts:128
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\run-all-maintenance-scripts\route.ts:10
**Current:** `if (!session?.user?.email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\run-all-maintenance-scripts\route.ts:115
**Current:** `if (enrollment.booking?.payment?.status === 'COMPLETED' && enrollment.paymentStatus !== 'COMPLETED') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\settings\run-all-maintenance-scripts\route.ts:122
**Current:** `} else if (enrollment.booking?.payment?.status === 'PENDING' && enrollment.paymentStatus === 'COMPLETED') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:29
**Current:** `prisma?.user.count() || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:30
**Current:** `prisma?.course.count() || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:31
**Current:** `prisma?.institution.count() || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:32
**Current:** `prisma?.studentCourseEnrollment.count() || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:33
**Current:** `prisma?.studentCourseCompletion.count() || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\stats\route.ts:78
**Current:** `const recentUsers = await prisma?.user.findMany({`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\subscriptions\stats\route.ts:92
**Current:** `commissionRate: institution.subscription?.commissionTier?.commissionRate || 0`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\test-session\route.ts:11
**Current:** `console.log('Test Session API - User role:', session?.user?.role);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\check-password-reset\route.ts:11
**Current:** `if (!session?.user?.email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\check-password-reset\route.ts:59
**Current:** `if (!session?.user?.email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\redirect-after-signin\route.ts:11
**Current:** `console.log('User role:', session?.user?.role);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\test-login\route.ts:11
**Current:** `console.log('Test Login API - User role:', session?.user?.role);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\test-login\route.ts:18
**Current:** `role: session?.user?.role`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\auth\user\route.ts:12
**Current:** `if (!session?.user?.email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\courses\search\route.ts:13
**Current:** `const tagIds = searchParams.get('tagIds')?.split(',').filter(Boolean) || [];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\analytics\quiz\route.ts:9
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\collaboration\stats\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\route.ts:33
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\route.ts:199
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\route.ts:328
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\update-weekly-prices\route.ts:9
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\dates\route.ts:12
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\monthly-prices\route.ts:13
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\route.ts:36
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\route.ts:142
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\route.ts:283
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\current\route.ts:10
**Current:** `if (!session?.user?.email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\enrollments\[id]\dates\route.ts:12
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\info\route.ts:9
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\route.ts:107
**Current:** `if (!session?.user?.email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\bulk-delete\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\bulk-export\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\bulk-update\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\import\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\route.ts:79
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\copy\route.ts:13
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\export\route.ts:12
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\import\route.ts:12
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk\route.ts:12
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk\route.ts:73
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk-delete\route.ts:13
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\route.ts:13
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\route.ts:85
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\share\route.ts:13
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:13
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:78
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:176
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\route.ts:9
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\route.ts:47
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\copy\route.ts:12
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\route.ts:12
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\route.ts:55
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\route.ts:99
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\copy\route.ts:13
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\copy-to-course\route.ts:13
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\rate\route.ts:13
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:123
**Current:** `shared_by: course?.institution?.name || 'Unknown Institution',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:132
**Current:** `id: course?.institution?.id || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:133
**Current:** `name: course?.institution?.name || 'Unknown',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:137
**Current:** `id: course?.institution?.id || '',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:138
**Current:** `name: course?.institution?.name || 'Unknown Institution',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:139
**Current:** `country: course?.institution?.country || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\students\[id]\route.ts:12
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\billing-history\route.ts:9
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\payment\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:102
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:161
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\route.ts:248
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\upgrade\route.ts:11
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\upload\route.ts:127
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\approve\route.ts:12
**Current:** `if (!session?.user?.role || session.user.role !== 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:41
**Current:** `userRole: session?.user?.role,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:42
**Current:** `isInstitution: session?.user?.role === 'INSTITUTION',`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:43
**Current:** `institutionData: session?.user?.institution,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:44
**Current:** `isApproved: session?.user?.institution?.status === 'APPROVED'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:48
**Current:** `const isInstitutionUser = session?.user?.role === 'INSTITUTION' &&`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:49
**Current:** `session?.user?.institutionId === params.id;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institutions\[id]\route.ts:50
**Current:** `const isAdmin = session?.user?.role === 'ADMIN';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\preferences\route.ts:9
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\preferences\route.ts:76
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\preferences\route.ts:134
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\route.ts:9
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\route.ts:58
**Current:** `read: stats.find(s => s.status === 'READ')?._count.status || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\route.ts:59
**Current:** `unread: stats.find(s => s.status === 'UNREAD')?._count.status || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\route.ts:60
**Current:** `sent: stats.find(s => s.status === 'SENT')?._count.status || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\route.ts:61
**Current:** `failed: stats.find(s => s.status === 'FAILED')?._count.status || 0`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\route.ts:86
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\send\route.ts:17
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\send\route.ts:170
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\subscribe\route.ts:16
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\subscribe\route.ts:98
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\notifications\unsubscribe\route.ts:8
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\route.ts:136
**Current:** `price: booking?.amount || payment?.[0]?.amount || course.base_price,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\enroll\route.ts:20
**Current:** `console.log('Session:', session?.user?.id);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\quizzes\[quizId]\submit\route.ts:89
**Current:** `isCorrect = studentAnswer?.toLowerCase().trim() === question.correct_answer?.toLowerCase().trim();`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\courses\[id]\modules\[moduleId]\route.ts:119
**Current:** `quizzes: module?.quizzes?.map(q => ({`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\achievements\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\courses\route.ts:10
**Current:** `if (!session?.user?.email) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\recent-modules\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:11
**Current:** `userId: session?.user?.id,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:12
**Current:** `userRole: session?.user?.role`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:15
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\route.ts:187
**Current:** `name: institutions.find(i => i.id === course?.institutionId)?.name || 'Unknown Institution'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\dashboard\stats\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\learning-path\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\learning-path\route.ts:131
**Current:** `lastAccessed: progress?.lastStudyDate?.toISOString() || progress?.lastAccessedAt?.toISOString()`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\notifications\route.ts:96
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\notifications\route.ts:144
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\notifications\route.ts:186
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\progress-visualization\route.ts:243
**Current:** `const courseTitle = progress.module?.course?.title || 'Unknown Course';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:41
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\quiz\[quizId]\adaptive\route.ts:326
**Current:** `return answer.toLowerCase().trim() === question.correct_answer?.toLowerCase().trim();`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\recommendations\route.ts:9
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\billing-history\route.ts:9
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\payment\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:11
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:45
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:168
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:359
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\upgrade\route.ts:10
**Current:** `if (!session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\route.ts:14
**Current:** `userRole: session?.user?.role`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\auth\register\enhanced\page.tsx:973
**Current:** `${formData.isAnnual ? selectedPlanData?.annualPrice : selectedPlanData?.price}/{formData.isAnnual ? 'year' : 'month'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\hooks\useCurrency.ts:23
**Current:** `if (session?.user?.role === 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\hooks\useCurrency.ts:30
**Current:** `if (session?.user?.role === 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\hooks\useInstitution.ts:20
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\hooks\useInstitution.ts:40
**Current:** `}, [session?.user?.institutionId]);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\analytics\InstitutionAnalyticsClient.tsx:83
**Current:** `if (!session?.user?.institutionId) return;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\analytics\InstitutionAnalyticsClient.tsx:110
**Current:** `if (session?.user?.role === 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\analytics\InstitutionAnalyticsClient.tsx:330
**Current:** `{session?.user?.institutionId && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\analytics\InstitutionAnalyticsClient.tsx:350
**Current:** `{analytics?.topReferrers.map((referrer, index) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\analytics\InstitutionAnalyticsClient.tsx:382
**Current:** `{analytics?.recentEvents?.map((event, index) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\content-management\page.tsx:67
**Current:** `if (session?.user?.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:126
**Current:** `institutionId: session?.user?.institutionId || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:140
**Current:** `if (session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:211
**Current:** `const institutionId = session?.user?.institutionId;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:343
**Current:** `institutionId: session?.user?.institutionId || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:567
**Current:** `institutionId: session?.user?.institutionId || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:900
**Current:** `moduleCount: selectedCourseForModules?.modules?.length,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:945
**Current:** `router.push(`/institution/courses/${selectedCourseForModules?.id}/modules/${module.id}/edit`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:954
**Current:** `router.push(`/institution/courses/${selectedCourseForModules?.id}/modules/${module.id}/content`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:1003
**Current:** `institutionId: session?.user?.institutionId || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\page.tsx:1025
**Current:** `institutionId={session?.user?.institutionId || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:76
**Current:** `institutionId: session?.user?.institutionId || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:85
**Current:** `if (session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:123
**Current:** `institutionId: session?.user?.institutionId || ''`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\edit\page.tsx:280
**Current:** `institutionId={session?.user?.institutionId || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\content\page.tsx:233
**Current:** `e.currentTarget.nextElementSibling?.classList.remove('hidden');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:359
**Current:** `value={questionData.question_config?.leftItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:377
**Current:** `value={questionData.question_config?.rightItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:401
**Current:** `value={questionData.question_config?.dragItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:419
**Current:** `value={questionData.question_config?.dropZones?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\new\page.tsx:491
**Current:** `value={questionData.question_config?.orderItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:419
**Current:** `value={formData.question_config?.leftItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:437
**Current:** `value={formData.question_config?.rightItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:461
**Current:** `value={formData.question_config?.dragItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:479
**Current:** `value={formData.question_config?.dropZones?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\courses\[id]\modules\[moduleId]\quizzes\[quizId]\questions\[questionId]\edit\page.tsx:551
**Current:** `value={formData.question_config?.orderItems?.join('\n') || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\DashboardClient.tsx:158
**Current:** `if (payment.paymentMethod && !paymentSettings?.institutionApprovableMethods?.includes(payment.paymentMethod)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\page.tsx:10
**Current:** `if (!session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\page.tsx:198
**Current:** `const institutionAmount = payment?.metadata?.institutionAmount ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\dashboard\page.tsx:205
**Current:** `commissionAmount: payment?.metadata?.commissionAmount || 0,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\page.tsx:94
**Current:** `if (session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\page.tsx:189
**Current:** `if (payment.paymentMethod && !paymentSettings?.institutionApprovableMethods?.includes(payment.paymentMethod)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\page.tsx:206
**Current:** `payment.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\PaymentsClient.tsx:151
**Current:** `${payment.metadata?.commissionAmount?.toFixed(2) || '0.00'} (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\payments\PaymentsClient.tsx:158
**Current:** `${payment.metadata?.institutionAmount?.toFixed(2) || payment.amount.toFixed(2)}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\00institution-profile.tsx:393
**Current:** `{citiesByCountryAndState[formData.country]?.[formData.state]?.map((city) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:62
**Current:** `} else if (status === 'authenticated' && session?.user?.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:157
**Current:** `if (!session?.user?.institutionId) return;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:709
**Current:** `{selectedState && citiesByCountryAndState[selectedCountry]?.[selectedState]?.map((city) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\profile\institution-profile.tsx:873
**Current:** `{session?.user?.institutionId && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\page.tsx:123
**Current:** `bank.description?.toLowerCase().includes(searchTerm.toLowerCase());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\page.tsx:454
**Current:** `bank.description?.toLowerCase().includes(searchTerm.toLowerCase());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\page.tsx:468
**Current:** `bank.description?.toLowerCase().includes(searchTerm.toLowerCase());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:151
**Current:** `question.explanation?.toLowerCase().includes(searchTerm.toLowerCase());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:389
**Current:** `question.explanation?.toLowerCase().includes(searchTerm.toLowerCase());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\page.tsx:405
**Current:** `question.explanation?.toLowerCase().includes(searchTerm.toLowerCase());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:137
**Current:** `question.explanation?.toLowerCase().includes(searchTerm.toLowerCase());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:276
**Current:** `question.explanation?.toLowerCase().includes(searchTerm.toLowerCase());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\question-banks\[id]\share\page.tsx:295
**Current:** `question.explanation?.toLowerCase().includes(searchTerm.toLowerCase());`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\quizzes\page.tsx:213
**Current:** `quiz.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\quizzes\page.tsx:428
**Current:** `const course = quizzes.find(q => q.module.course.id === courseId)?.module.course;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\settings\page.tsx:125
**Current:** `if (!session?.user?.role || session.user.role !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\settings\page.tsx:143
**Current:** `const response = await fetch(`/api/institution/settings?institutionId=${session?.user?.institutionId}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\settings\page.tsx:189
**Current:** `institutionId: session?.user?.institutionId,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\shared-questions\page.tsx:167
**Current:** `question.explanation?.toLowerCase().includes(searchTerm.toLowerCase()) ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\page.tsx:93
**Current:** `if (session?.user?.role?.toUpperCase() !== 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:106
**Current:** `if (!session?.user?.role || (session.user.role !== 'INSTITUTION' && session.user.role !== 'ADMIN')) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:167
**Current:** `const originalStartDate = new Date(student?.enrolledCourses.find(c => c.id === editingEnrollment.id)?.start_date || '').toISOString().split('T')[0];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:168
**Current:** `const originalEndDate = new Date(student?.enrolledCourses.find(c => c.id === editingEnrollment.id)?.end_date || '').toISOString().split('T')[0];`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:441
**Current:** `{session?.user?.role === 'ADMIN' ? (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:509
**Current:** `value={editingEnrollment?.dates?.startDate || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:520
**Current:** `value={editingEnrollment?.dates?.endDate || ''}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution\students\[id]\page.tsx:523
**Current:** `min={editingEnrollment?.dates?.startDate || new Date().toISOString().split('T')[0]}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\institution-registration\page.tsx:394
**Current:** `citiesByCountryAndState[formData.country]?.[formData.state]?.map(city => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\lib\utils.ts:124
**Current:** `fractionDigits: parts.find(part => part.type === 'fraction')?.value.length || 2,`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\settings\page.tsx:213
**Current:** `<p><span className="font-medium">Institution:</span> {settings?.institution.name}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\settings\page.tsx:214
**Current:** `<p><span className="font-medium">Currency:</span> {settings?.institution.currency}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\page.tsx:96
**Current:** `course.institution?.name.toLowerCase().includes(searchTerm.toLowerCase())`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\modules\[moduleId]\page.tsx:121
**Current:** `if (session?.user?.role?.toUpperCase() !== 'STUDENT') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\courses\[id]\page.tsx:74
**Current:** `if (session?.user?.role?.toUpperCase() !== 'STUDENT') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\page.tsx:233
**Current:** `Welcome back, {session?.user?.name}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\page.tsx:242
**Current:** `{session?.user?.id && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\page.tsx:247
**Current:** `{session?.user?.id && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\page.tsx:252
**Current:** `{session?.user?.id && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\page_backup.tsx:232
**Current:** `Welcome back, {session?.user?.name}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\page_backup.tsx:241
**Current:** `{session?.user?.id && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\page_backup.tsx:246
**Current:** `{session?.user?.id && (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\payments\history\page.tsx:56
**Current:** `{payment.enrollment?.course.title || 'Course Payment'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\payments\history\page.tsx:86
**Current:** `{payment.enrollment?.course.institution.name || 'N/A'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\payments\page.tsx:121
**Current:** `{payment.enrollment?.course.title || 'Course Payment'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\payments\page.tsx:143
**Current:** `{payment.enrollment?.course.institution.name || 'N/A'}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\payments\process\[paymentId]\page.tsx:67
**Current:** `{payment.enrollment?.course.title}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\payments\process\[paymentId]\page.tsx:73
**Current:** `{payment.enrollment?.course.institution.name}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\profile\page.tsx:54
**Current:** `if (session?.user?.role?.toUpperCase() !== 'STUDENT') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\student\progress\page.tsx:110
**Current:** `if (session?.user?.role?.toUpperCase() !== 'STUDENT') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\app\subscription-signup\page.tsx:263
**Current:** `if (!selectedPlan || !session?.user?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\QuestionPreview.tsx:278
**Current:** `{question.question_config?.leftItems?.map((item: string, index: number) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\admin\QuestionPreview.tsx:285
**Current:** `{question.question_config?.rightItems?.map((item: string, index: number) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedMobileDashboard.tsx:223
**Current:** `<p className="text-2xl font-bold">{analyticsData?.summary?.offlineSessions || 0}</p>`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedMobileDashboard.tsx:243
**Current:** `{analyticsData?.summary?.lastSync`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedMobileDashboard.tsx:252
**Current:** `{syncStats?.successRate?.toFixed(1) || 0}%`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedMobileDashboard.tsx:282
**Current:** `{cacheStats?.cacheDetails?.[0]?.hitRate?.toFixed(1) || 0}%`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedMobileDashboard.tsx:288
**Current:** `{analyticsData?.summary?.performanceMetrics?.averageLoadTime?.toFixed(0) || 0}ms`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:302
**Current:** `{facets?.categories.map((category) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:323
**Current:** `{facets?.levels.map((level) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:344
**Current:** `{facets?.institutions.map((institution) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:403
**Current:** `{facets?.frameworks.map((framework) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:435
**Current:** `Category: {facets?.categories.find(c => c.id === filters.category)?.name}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\AdvancedSearch.tsx:451
**Current:** `Institution: {facets?.institutions.find(i => i.id === filters.institution)?.name}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ChunkErrorBoundary.tsx:207
**Current:** `event.reason?.message?.includes('Loading chunk') ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\ChunkErrorBoundary.tsx:208
**Current:** `event.reason?.message?.includes('ChunkLoadError')`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CoursesPageClient.tsx:91
**Current:** `if (enrollCourseId && status === 'authenticated' && session?.user?.role === 'STUDENT') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CoursesPageClient.tsx:138
**Current:** `course.institution?.name.toLowerCase().includes(searchTerm.toLowerCase())`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CoursesPageClient.tsx:185
**Current:** `if (session?.user?.role !== 'STUDENT') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\CoursesPageClient.tsx:401
**Current:** `userRole={session?.user?.role}`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\HomePageClient.tsx:58
**Current:** `userRole: session?.user?.role`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\institution\InstitutionForm.tsx:617
**Current:** `{citiesByCountryAndState[formData.country]?.[formData.state]?.map((city) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\MainNav.tsx:37
**Current:** `role: session?.user?.role`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\Navbar.tsx:30
**Current:** `console.log('Navbar - Session authenticated:', session?.user?.email, 'Role:', session?.user?.role);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\Navbar.tsx:69
**Current:** `if (session?.user?.role === 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\Navbar.tsx:79
**Current:** `if (session?.user?.role === 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\Navbar.tsx:89
**Current:** `if (session?.user?.role === 'INSTITUTION') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\Navbar.tsx:99
**Current:** `if (session?.user?.role === 'ADMIN') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\PricingPageClient.tsx:138
**Current:** `price: isYearly ? plans.find(p => p.id === planId)?.price.yearly : plans.find(p => p.id === planId)?.price.monthly`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\providers\InstitutionProvider.tsx:24
**Current:** `if (status !== 'authenticated' || session?.user?.role !== 'INSTITUTION' || !session?.user?.institutionId) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\providers\InstitutionProvider.tsx:61
**Current:** `}, [session?.user?.role, session?.user?.institutionId, status]);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\AdvancedQuizInterface.tsx:416
**Current:** `{question.question_config?.leftItems?.map((item: string, index: number) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\student\AdvancedQuizInterface.tsx:430
**Current:** `{question.question_config?.rightItems?.map((rightItem: string, rightIndex: number) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\components\SubscriptionManagementCard.tsx:493
**Current:** `{currentPlan?.features.map((feature, index) => (`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useSessionSync.ts:17
**Current:** `console.log('useSessionSync - Session authenticated:', session?.user?.email);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\hooks\useSessionSync.ts:55
**Current:** `userRole: session?.user?.role`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\payment\service.ts:12
**Current:** `this.stripe = new Stripe(stripeConfig?.config.secretKey || '', {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\permissions.ts:105
**Current:** `if (!user?.institution?.id) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\search.ts:298
**Current:** `if (course.description?.toLowerCase().includes(queryLower)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\search.ts:347
**Current:** `if (course.description?.toLowerCase().includes(queryLower)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:137
**Current:** `const currentPlan = institution.subscription?.commissionTier?.planType;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:155
**Current:** `const isFallback = institution.subscription?.metadata?.isFallback || false;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:159
**Current:** `institution.subscription?.commissionTier?.planType !== 'ENTERPRISE';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:161
**Current:** `institution.subscription?.commissionTier?.planType !== 'STARTER';`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:164
**Current:** `const billingHistory: BillingHistoryItem[] = institution.subscription?.billingHistory?.map(bill => ({`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:180
**Current:** `features: institution.subscription?.commissionTier?.features as Record<string, any> || {},`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:227
**Current:** `const isFallback = currentSubscription?.metadata?.isFallback || false;`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\subscription-commission-service.ts:236
**Current:** `const billingHistory: BillingHistoryItem[] = currentSubscription?.billingHistory?.map(bill => ({`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\websocket.ts:204
**Current:** `this.io?.to(`user:${userId}`).emit('notification', message);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\lib\websocket.ts:237
**Current:** `this.io?.sockets.sockets.get(socketId)?.disconnect();`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-approval-settings.ts:51
**Current:** `const isExempted = adminSettings?.institutionPaymentApprovalExemptions?.includes(institution.id);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-approval-settings.ts:104
**Current:** `const isExempted = adminSettings?.institutionPaymentApprovalExemptions?.includes(institution.id);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-approval-settings.ts:116
**Current:** `} else if (payment.paymentMethod && !adminSettings?.institutionApprovableMethods.includes(payment.paymentMethod)) {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-approval-settings.ts:130
**Current:** `console.log(`  - Exempted Institutions: ${adminSettings?.institutionPaymentApprovalExemptions?.length || 0}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-approval-settings.ts:149
**Current:** `const isExempted = adminSettings?.institutionPaymentApprovalExemptions?.includes(institution.id);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-dashboard-data.ts:67
**Current:** `console.log(`    Course: ${enrollment?.course?.title || 'Unknown'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-dashboard-data.ts:72
**Current:** `console.log(`    Institution: ${enrollment?.course?.institution?.name || 'Unknown'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-dashboard-data.ts:120
**Current:** `console.log(`    Institution: ${enrollment.course?.institution?.name || 'Unknown'}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-bug-detection.ts:85
**Current:** `if (test.results?.[0]?.status === 'passed') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\run-bug-detection.ts:87
**Current:** `} else if (test.results?.[0]?.status === 'failed') {`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-prioritization-system.ts:94
**Current:** `subscriptionTier: course.institution.subscription?.commissionTier?.planType || 'NONE'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-relations.ts:77
**Current:** `console.log('Booking -> Course relation:', bookingWithCourse?.course.title === 'Test Course');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-relations.ts:84
**Current:** `console.log('Booking -> Institution relation:', bookingWithInstitution?.institution.name === 'Test Institution');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-relations.ts:91
**Current:** `console.log('Booking -> Student relation:', bookingWithStudent?.student.name === 'Test Student');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-relations.ts:98
**Current:** `console.log('Course -> Bookings relation:', courseWithBookings?.bookings.length === 1);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-relations.ts:105
**Current:** `console.log('Institution -> Bookings relation:', institutionWithBookings?.bookings.length === 1);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-relations.ts:112
**Current:** `console.log('Student -> Bookings relation:', studentWithBookings?.bookings.length === 1);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-updated-priority-algorithm.ts:88
**Current:** `subscriptionTier: course.institution.subscription?.commissionTier?.planType || 'NONE'`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\batch-3-mobile.spec.ts:60
**Current:** `expect(box?.height).toBeGreaterThan(40);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\batch-3-mobile.spec.ts:102
**Current:** `expect(box?.height).toBeGreaterThan(40);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\batch-3-mobile.spec.ts:103
**Current:** `expect(box?.width).toBeGreaterThan(60);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\responsive.spec.ts:19
**Current:** `expect(bodyWidth?.width).toBeLessThanOrEqual(viewportWidth + 20);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\utils\test-helpers.ts:93
**Current:** `document.body.textContent?.includes('integration.test.student@example.com') ||`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\e2e\utils\test-helpers.ts:95
**Current:** `document.body.textContent?.includes('integration.test.admin@example.com');`
### C:\wamp64\www\myCursorProj\langcsebkg4a\tests\integration\auth.test.ts:16
**Current:** `expect(adminUser?.role).toBe('ADMIN');`
## Generic 500 errors without proper error details
**Found in 56 locations:**

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\update-weekly-prices\route.ts:75
**Current:** `return NextResponse.json({ error: 'Failed to update weekly prices' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Failed to update weekly prices' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\admin\courses\[id]\modules\[moduleId]\quizzes\[quizId]\analytics\route.ts:108
**Current:** `return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\collaboration\stats\route.ts:155
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\route.ts:405
**Current:** `return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\update-weekly-prices\route.ts:48
**Current:** `return NextResponse.json({ error: 'Failed to update weekly prices' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Failed to update weekly prices' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\[contentId]\route.ts:60
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\[contentId]\route.ts:119
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\modules\[moduleId]\content\[contentId]\route.ts:163
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\route.ts:131
**Current:** `return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\courses\[id]\route.ts:311
**Current:** `return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\facilities\route.ts:147
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\profile\facilities\route.ts:232
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\bulk-delete\route.ts:63
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\bulk-export\route.ts:97
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\bulk-update\route.ts:80
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\import\route.ts:95
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\route.ts:71
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\route.ts:119
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\copy\route.ts:98
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\export\route.ts:124
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\import\route.ts:155
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk\route.ts:63
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk\route.ts:152
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\bulk-delete\route.ts:83
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\route.ts:74
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\route.ts:159
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\share\route.ts:140
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:67
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:165
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\questions\[questionId]\route.ts:235
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\route.ts:39
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\route.ts:92
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-banks\[id]\route.ts:125
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\route.ts:40
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\route.ts:85
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\copy\route.ts:79
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\route.ts:45
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\route.ts:89
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\question-templates\[id]\route.ts:124
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\copy\route.ts:129
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\copy-to-course\route.ts:152
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\questions\[id]\rate\route.ts:86
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\quizzes\route.ts:143
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\shared-questions\route.ts:149
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\billing-history\route.ts:71
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\institution\subscription\payment\route.ts:62
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\profile\password\route.ts:58
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\billing-history\route.ts:74
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\payment\route.ts:62
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\student\subscription\route.ts:37
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\route.ts:158
**Current:** `return NextResponse.json({ error: 'Database error occurred' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Database error occurred' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\route.ts:162
**Current:** `return NextResponse.json({ error: 'Internal server error' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\route.ts:225
**Current:** `return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\[id]\route.ts:136
**Current:** `return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\app\api\tags\[id]\route.ts:199
**Current:** `return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });`
**Suggested fix:** Include error details in response
```tsx
// Instead of: return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-common-errors.ts:203
**Current:** `suggestions += `// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })\n`;`
**Suggested fix:** Include error details in response
```tsx
// Instead of: suggestions += `// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })\n`;
// Use: return NextResponse.json({ error: 'Failed to fetch institution', details: error.message }, { status: 500 })
```

## Console logging undefined values
**Found in 7 locations:**

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-db-directly.ts:28
**Current:** `console.log(`   Main Image URL is undefined: ${institution.mainImageUrl === undefined}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\check-db-directly.ts:41
**Current:** `console.log(`Is undefined: ${abcSchool.mainImageUrl === undefined}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-admin-api.ts:27
**Current:** `console.log(`Main Image URL is undefined: ${data.mainImageUrl === undefined}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-institution-monetization.ts:113
**Current:** `console.log(`   Has commission rate: ${firstInst.commissionRate !== undefined}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-institution-monetization.ts:114
**Current:** `console.log(`   Has subscription plan: ${firstInst.subscriptionPlan !== undefined}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-institution-monetization.ts:115
**Current:** `console.log(`   Has course count: ${firstInst.courseCount !== undefined}`);`
### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\test-institution-monetization.ts:116
**Current:** `console.log(`   Has student count: ${firstInst.studentCount !== undefined}`);`
## Undefined values being passed as props
**Found in 1 locations:**

### C:\wamp64\www\myCursorProj\langcsebkg4a\scripts\fix-common-errors.ts:24
**Current:** `pattern: 'undefined.*from props',`
**Suggested fix:** Add proper default values or null checks
```tsx
// Instead of: pattern: 'undefined.*from props',
// Use: institutionId || null
// Or: institutionId ?? null
```

