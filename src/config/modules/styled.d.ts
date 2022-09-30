import { THEME } from '../../core/theme';
import 'styled-components';

export type Theme = typeof THEME;

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
