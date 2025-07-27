SELECT 
    c.id,
    c.title,
    c.categoryId,
    cat.name as category_name,
    cat.parentId as category_parent_id,
    parent.name as parent_category_name
FROM `course` c
JOIN `category` cat ON c.categoryId = cat.id
LEFT JOIN `category` parent ON cat.parentId = parent.id
LIMIT 5; 