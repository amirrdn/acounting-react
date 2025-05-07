import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const formatDate = (date: string | Date, formatString = 'dd MMMM yyyy'): string => {
  return format(new Date(date), formatString, { locale: id });
}; 