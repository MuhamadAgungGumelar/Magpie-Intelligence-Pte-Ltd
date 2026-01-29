import { format, formatDistance } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'PP') => {
  try {
    return format(new Date(date), formatStr);
  } catch {
    return 'Invalid date';
  }
};

export const formatRelative = (date: string | Date) => {
  try {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
};

export const toISODate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};
