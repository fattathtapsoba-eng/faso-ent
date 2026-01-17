import type { TuitionStatus } from '../../types';

interface StatusBadgeProps {
    status: TuitionStatus;
    className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === 'PAID'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
                } ${className}`}
        >
            <span className={`mr-1 ${status === 'PAID' ? 'text-paid' : 'text-unpaid'}`}>
                {status === 'PAID' ? '●' : '●'}
            </span>
            {status === 'PAID' ? 'À jour' : 'Impayé'}
        </span>
    );
}
