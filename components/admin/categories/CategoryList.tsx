import { category } from '@prisma/client';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryListProps {
  categories: category[];
  onEdit: (category: category) => void;
  onDelete: (category: category) => void;
}

export function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-500">{category.description}</p>
            <p className="text-xs text-gray-400">Slug: {category.slug}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(category)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(category)}
              className="text-gray-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
} 