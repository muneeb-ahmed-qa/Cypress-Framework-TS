/**
 * Date manipulation and formatting utilities
 */

/**
 * Get current date in specified format
 */
export const getCurrentDate = (format: string = 'YYYY-MM-DD'): string => {
  const date = new Date();
  return formatDate(date, format);
};

/**
 * Get date N days from now
 */
export const getDateFromNow = (days: number, format: string = 'YYYY-MM-DD'): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date, format);
};

/**
 * Format date to string
 */
export const formatDate = (date: Date, format: string = 'YYYY-MM-DD'): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Parse date string to Date object
 */
export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * Compare two dates
 */
export const compareDates = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? parseDate(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseDate(date2) : date2;
  return d1.getTime() - d2.getTime();
};

/**
 * Check if date is today
 */
export const isToday = (date: Date | string): boolean => {
  const checkDate = typeof date === 'string' ? parseDate(date) : date;
  const today = new Date();
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

