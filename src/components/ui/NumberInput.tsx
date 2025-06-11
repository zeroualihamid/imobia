import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ 
  value, 
  onChange, 
  min = 0, 
  max = 999, 
  label 
}) => {
  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={decrement}
        disabled={value <= min}
        className="h-10 w-10 bg-white border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        className="w-20 text-center bg-white border-slate-300 text-slate-900"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={increment}
        disabled={value >= max}
        className="h-10 w-10 bg-white border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default NumberInput;
