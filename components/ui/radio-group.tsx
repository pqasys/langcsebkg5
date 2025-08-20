'use client';

import * as React from 'react';

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  id: string;
  value: string;
  className?: string;
}

type RadioContextType = {
  value?: string;
  onValueChange?: (value: string) => void;
};

const RadioGroupContext = React.createContext<RadioContextType | null>(null);

export function RadioGroup({ value, onValueChange, children, className = '', ...props }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div role="radiogroup" className={className} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({ id, value, className = '', ...props }: RadioGroupItemProps) {
  const ctx = React.useContext(RadioGroupContext);
  const checked = ctx?.value === value;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ctx?.onValueChange?.(e.target.value);
  };
  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={checked}
      onChange={handleChange}
      className={className}
      {...props}
    />
  );
}


