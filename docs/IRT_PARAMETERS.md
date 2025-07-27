# IRT (Item Response Theory) Parameters Guide

## Overview

This document explains how IRT parameters work in our quiz system and how they are automatically calculated and can be manually overridden.

## Supported Question Types

The system supports the following question types, each with appropriate IRT parameter calculations:

1. **MULTIPLE_CHOICE** - Traditional multiple choice questions with radio buttons
2. **TRUE_FALSE** - True/False questions
3. **SHORT_ANSWER** - Short text response questions
4. **ESSAY** - Long-form essay questions
5. **FILL_IN_BLANK** - Fill in the blank questions
6. **MATCHING** - Matching items from two columns
7. **DRAG_DROP** - Drag and drop questions
8. **HOTSPOT** - Click on specific areas of an image
9. **ORDERING** - Arrange items in correct order
10. **MULTIPLE_ANSWER** - Multiple choice with checkboxes (select all that apply)

## IRT Parameters

### 1. Difficulty (b)
- **Range**: -4 to +4
- **Meaning**: How hard the question is
- **Automatic Calculation**:
  - EASY: -1.0
  - MEDIUM: 0.0
  - HARD: +1.0

### 2. Discrimination (a)
- **Range**: 0.1 to 3.0
- **Meaning**: How well the question distinguishes between high and low ability students
- **Automatic Calculation**:
  - EASY: 0.8
  - MEDIUM: 1.0
  - HARD: 1.2

### 3. Guessing (c)
- **Range**: 0 to 1
- **Meaning**: Probability of correct answer by random guessing
- **Automatic Calculation by Question Type**:

| Question Type | Guessing Probability | Explanation |
|---------------|---------------------|-------------|
| MULTIPLE_CHOICE | 1/number_of_options | Based on number of choices |
| TRUE_FALSE | 0.5 | 50% chance of guessing correctly |
| FILL_IN_BLANK | 0.05 | Very low guessing probability |
| SHORT_ANSWER | 0.05 | Very low guessing probability |
| ESSAY | 0.02 | Minimal guessing probability |
| MATCHING | 0.15 | Moderate guessing probability |
| DRAG_DROP | 0.1 | Low guessing probability |
| HOTSPOT | 0.05 | Very low guessing probability |
| MULTIPLE_ANSWER | 0.1 | Lower than single choice |
| ORDERING | 0.05 | Very low guessing probability |

## Automatic vs Manual IRT Parameters

### Automatic Calculation
- **Default**: System automatically calculates IRT parameters based on question difficulty and type
- **Benefits**: Consistent, scientifically-based parameters
- **Use Case**: Most questions, especially when instructors are not IRT experts

### Manual Override
- **Toggle**: "Use Manual IRT Parameters" checkbox in question forms
- **Benefits**: Fine-tuned control for advanced users
- **Use Case**: When instructors have specific IRT expertise or requirements

## Implementation Details

### Form Fields
- **IRT Difficulty**: Number input (-4 to 4)
- **IRT Discrimination**: Number input (0.1 to 3.0)
- **IRT Guessing**: Number input (0 to 1)
- **Manual Override Toggle**: Checkbox to enable manual entry

### Validation Rules
- Difficulty: Must be between -4 and 4
- Discrimination: Must be between 0.1 and 3.0
- Guessing: Must be between 0 and 1
- Real-time validation with error messages

### API Integration
- **POST /questions**: Creates questions with IRT parameters
- **PUT /questions/[id]**: Updates questions with IRT parameters
- **Automatic Calculation**: Applied when manual parameters not provided
- **Database Storage**: Stored in `irt_difficulty`, `irt_discrimination`, `irt_guessing` fields

## Question Type-Specific Features

### Multiple Choice
- **Options**: Minimum 2 options required
- **IRT Guessing**: Automatically calculated as 1/number_of_options
- **Validation**: Ensures at least 2 options are provided

### Matching
- **Structure**: Left items and right items in separate text areas
- **Configuration**: Stored in `question_config.leftItems` and `question_config.rightItems`
- **Validation**: Requires both left and right items

### Drag & Drop
- **Structure**: Drag items and drop zones in separate text areas
- **Configuration**: Stored in `question_config.dragItems` and `question_config.dropZones`
- **Validation**: Requires both drag items and drop zones

### Hotspot
- **Media**: Requires uploaded image
- **Coordinates**: Stored as "x,y" format in correct_answer
- **Validation**: Requires image upload

### Ordering
- **Structure**: Items to order in text area (one per line)
- **Configuration**: Stored in `question_config.orderItems`
- **Validation**: Requires at least 2 items

### Fill in the Blank
- **Answer**: Single text input for correct answer
- **Alternative Answers**: Optional hints field for alternative acceptable answers
- **Validation**: Requires correct answer

## Best Practices

### For Automatic IRT Parameters
1. **Set Appropriate Difficulty**: Choose EASY, MEDIUM, or HARD based on question complexity
2. **Consider Question Type**: Different types have different guessing probabilities
3. **Review Auto-Calculated Values**: Check the calculated parameters before saving

### For Manual IRT Parameters
1. **Understand the Ranges**: Stay within the valid parameter ranges
2. **Consider Your Audience**: Adjust difficulty based on student population
3. **Test Questions**: Use pilot testing to refine parameters
4. **Document Decisions**: Keep records of why specific parameters were chosen

### General Guidelines
1. **Start with Automatic**: Use automatic calculation unless you have specific IRT expertise
2. **Consistency**: Apply similar parameters to similar question types
3. **Review Periodically**: Reassess parameters based on student performance data
4. **Training**: Provide training for instructors on IRT parameter interpretation

## Technical Implementation

### Database Schema
```sql
ALTER TABLE quiz_questions ADD COLUMN irt_difficulty DECIMAL(5,3);
ALTER TABLE quiz_questions ADD COLUMN irt_discrimination DECIMAL(5,3);
ALTER TABLE quiz_questions ADD COLUMN irt_guessing DECIMAL(5,3);
ALTER TABLE quiz_questions ADD COLUMN irt_last_updated TIMESTAMP;
```

### Frontend Components
- **Question Creation Form**: Includes IRT parameter fields with validation
- **Question Edit Form**: Allows modification of existing IRT parameters
- **Real-time Calculation**: Updates parameters as difficulty/type changes
- **Validation Feedback**: Shows errors for invalid parameter values

### API Endpoints
- **Validation**: Server-side validation of IRT parameters
- **Automatic Calculation**: Fallback to automatic calculation when manual values not provided
- **Error Handling**: Proper error messages for invalid parameters

## Troubleshooting

### Common Issues
1. **Invalid Parameter Ranges**: Ensure values are within specified ranges
2. **Missing Question Type**: All question types must be properly configured
3. **Validation Errors**: Check form validation messages for guidance

### Debugging
1. **Check Console**: Look for JavaScript errors in browser console
2. **API Responses**: Review API response for validation errors
3. **Database Values**: Verify stored IRT parameter values

## Future Enhancements

### Planned Features
1. **IRT Analysis Dashboard**: Visual representation of question performance
2. **Parameter Optimization**: AI-assisted parameter tuning
3. **Bulk Operations**: Mass update of IRT parameters
4. **Advanced Analytics**: Detailed IRT-based performance analysis

### Research Integration
1. **Pilot Testing**: Tools for conducting question pilot tests
2. **Parameter Refinement**: Automated parameter adjustment based on performance data
3. **Validity Studies**: Integration with educational research methodologies 