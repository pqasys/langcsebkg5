UPDATE `course` c
SET 
    -- If current categoryId is a main category (has no parent)
    `subcategoryId` = CASE 
        WHEN NOT EXISTS (
            SELECT 1 FROM `category` cat 
            WHERE cat.id = c.`categoryId` AND cat.`parentId` IS NOT NULL
        ) THEN (
            -- Get the first subcategory of this main category
            SELECT sub.id 
            FROM `category` sub 
            WHERE sub.`parentId` = c.`categoryId` 
            ORDER BY sub.id 
            LIMIT 1
        )
        -- If current categoryId is already a subcategory
        ELSE c.`categoryId`
    END,
    -- Update categoryId to be the parent if current categoryId is a subcategory
    `categoryId` = CASE 
        WHEN EXISTS (
            SELECT 1 FROM `category` cat 
            WHERE cat.id = c.`categoryId` AND cat.`parentId` IS NOT NULL
        ) THEN (
            -- Get the parent category
            SELECT parent.id 
            FROM `category` cat 
            JOIN `category` parent ON cat.`parentId` = parent.id 
            WHERE cat.id = c.`categoryId`
        )
        -- Keep the same categoryId if it's already a main category
        ELSE c.`categoryId`
    END
WHERE c.id IN (
    SELECT id FROM (
        SELECT id FROM `course` LIMIT 5
    ) as test_subset
); 