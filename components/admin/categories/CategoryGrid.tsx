import { category } from '@prisma/client';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryGridProps {
  categories: category[];
  onEdit: (category: category) => void;
  onDelete: (category: category) => void;
}

export function CategoryGrid({ categories, onEdit, onDelete }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900 truncate">{category.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>
            <p className="text-xs text-gray-400 truncate">Slug: {category.slug}</p>
            <div className="flex items-center justify-end space-x-2 pt-2">
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
        </div>
      ))}
    </div>
  );
} 