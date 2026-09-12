const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function formatLocalDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

export function todayISO(): string {
    return formatLocalDate(new Date());
}

export function dateOnlyOf(value: string): string {
    if (DATE_ONLY_PATTERN.test(value))
        return value;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime()))
        return '';
    return formatLocalDate(parsed);
}
