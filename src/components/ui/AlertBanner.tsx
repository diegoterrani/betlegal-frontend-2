import React from 'react';
import { AlertTriangle, Info, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface AlertBannerProps {
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  children: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'info',
  title,
  children,
  actionText,
  onAction,
  className = '',
}) => {
  const styles = {
    info: {
      bg: 'bg-[#F0F7FF] dark:bg-[#1E3A8A]/30',
      border: 'border-[#BDDCFF] dark:border-[#1E40AF]',
      text: 'text-[#0B3A75] dark:text-[#93C5FD]',
      icon: <Info className="w-4 h-4 text-[#1769E0] dark:text-[#38BDF8] shrink-0 mt-0.5" />,
    },
    warning: {
      bg: 'bg-[#FFF4E5] dark:bg-[#78350F]/30',
      border: 'border-[#FEDF89] dark:border-[#B45309]',
      text: 'text-[#B54708] dark:text-[#FDE68A]',
      icon: <AlertTriangle className="w-4 h-4 text-[#B54708] dark:text-[#FB923C] shrink-0 mt-0.5" />,
    },
    error: {
      bg: 'bg-[#FDECEC] dark:bg-[#7F1D1D]/30',
      border: 'border-[#FECDCA] dark:border-[#991B1B]',
      text: 'text-[#B42318] dark:text-[#FCA5A5]',
      icon: <XCircle className="w-4 h-4 text-[#B42318] dark:text-[#F87171] shrink-0 mt-0.5" />,
    },
    success: {
      bg: 'bg-[#EAF7F0] dark:bg-[#064E3B]/30',
      border: 'border-[#A6F4C5] dark:border-[#059669]',
      text: 'text-[#16794A] dark:text-[#34D399]',
      icon: <CheckCircle2 className="w-4 h-4 text-[#16794A] dark:text-[#34D399] shrink-0 mt-0.5" />,
    },
  }[type];

  return (
    <div
      role="alert"
      className={`p-4 rounded-lg border flex items-start justify-between gap-3 text-xs leading-relaxed ${styles.bg} ${styles.border} ${styles.text} ${className}`}
    >
      <div className="flex items-start gap-3">
        {styles.icon}
        <div>
          {title && <strong className="block font-semibold mb-0.5">{title}</strong>}
          <div>{children}</div>
        </div>
      </div>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 inline-flex items-center gap-1 font-semibold underline hover:opacity-80 transition-opacity ml-2"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
