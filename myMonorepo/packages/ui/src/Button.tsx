// packages/ui/src/Button.tsx
import { formatPrice } from '@my-org/utils';

interface ButtonProps {
  label: string;
  price?: number;
  onClick?: () => void;
}

export function Button({ label, price, onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      {label} {price !== undefined && `(${formatPrice(price)})`}
    </button>
  );
}
