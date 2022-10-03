import { MouseEvent } from 'react';

export const stopPropagation = <T>(e: MouseEvent<T>) => {
  if (e) e.stopPropagation();
};
