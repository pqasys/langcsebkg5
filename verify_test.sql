SELECT 
    c.id,
    c.title,
    c.categoryId,
    mc.name as main_category_name,
    c.subcategoryId,
    sc.name as sub_category_name
FROM `course` c
JOIN `category` mc ON c.categoryId = mc.id
LEFT JOIN `category` sc ON c.subcategoryId = sc.id
WHERE c.id IN (
    SELECT id FROM (
        SELECT id FROM `course` LIMIT 5
    ) as test_subset
); 