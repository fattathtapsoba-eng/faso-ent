// Utility functions

/**
 * Calculate weighted average for grades
 */
export function calculateAverage(grades: Array<{ score: number; coefficient: number }>): number {
    if (grades.length === 0) return 0;

    const totalWeighted = grades.reduce((sum, g) => sum + (g.score * g.coefficient), 0);
    const totalCoefficient = grades.reduce((sum, g) => sum + g.coefficient, 0);

    return totalCoefficient > 0 ? totalWeighted / totalCoefficient : 0;
}

/**
 * Format phone number for Burkina Faso (+226)
 */
export function formatPhone(phone: string): string {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // If starts with 226, assume it's already formatted
    if (cleaned.startsWith('226')) {
        return `+${cleaned}`;
    }

    // Otherwise add +226
    return `+226${cleaned}`;
}

/**
 * Get initials from name for avatar
 */
export function getInitials(name: string, firstName?: string): string {
    if (firstName) {
        return `${name.charAt(0)}${firstName.charAt(0)}`.toUpperCase();
    }

    const parts = name.split(' ');
    if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }

    return name.substring(0, 2).toUpperCase();
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if device is online
 */
export function isOnline(): boolean {
    return navigator.onLine;
}

/**
 * Generate unique ID (for offline-first operations)
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
