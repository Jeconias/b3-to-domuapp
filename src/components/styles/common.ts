import { css } from 'styled-components';

export const SideStyle = css(
  ({ theme }) => `
  flex: 1;
  padding: 0 ${theme.spacing.md} ${theme.spacing.md};
  min-width: 200px;
  
  h2 {
    flex: 1;
    margin: ${theme.spacing.md};
    padding: 0;
    color: ${theme.text.white};
    text-align: center;
  }
`
);
