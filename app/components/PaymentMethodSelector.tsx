import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Wallet, Bank } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'credit_card',
    name: 'Credit Card',
    description: 'Pay securely with your credit card',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    description: 'Pay using your mobile money account',
    icon: <Wallet className="h-5 w-5" />,
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Pay directly from your bank account',
    icon: <Bank className="h-5 w-5" />,
  },
];

interface PaymentMethodSelectorProps {
  onSelect: (methodId: string) => void;
  selectedMethod?: string;
}

export default function PaymentMethodSelector({
  onSelect,
  selectedMethod,
}: PaymentMethodSelectorProps) {
  const [selected, setSelected] = useState<string>(selectedMethod || '');

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Payment Method</h3>
      <RadioGroup
        value={selected}
        onValueChange={handleSelect}
        className="space-y-4"
      >
        {paymentMethods.map((method) => (
          <div key={method.id}>
            <RadioGroupItem
              value={method.id}
              id={method.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={method.id}
              className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  {method.icon}
                </div>
                <div>
                  <p className="font-medium">{method.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
} 