import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  icon?: ReactNode;
}

export function Button({ children, variant = 'primary', size = 'md', onClick, type = 'button', className = '', icon }: ButtonProps) {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };
  const variants = {
    primary: 'btn-primary',
    secondary: 'glass text-[var(--text-primary)] hover:bg-white/10',
    ghost: 'text-[var(--text-secondary)] hover:bg-white/5',
    outline: 'border border-[var(--border)] text-[var(--text-primary)] hover:bg-white/5',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {icon}
      {children}
    </motion.button>
  );
}
