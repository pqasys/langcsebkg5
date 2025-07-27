import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface CategorySelectProps {
  categories?: Category[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  categories = [],
  value,
  onChange,
  className = '',
  placeholder = 'Select a category'
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategorySelect; 