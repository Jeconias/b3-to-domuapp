import './App.scss';
import { ThemeProvider } from 'styled-components';
import { THEME } from './core/theme';
import Home from './pages/Home';

const App = () => {
  return (
    <ThemeProvider theme={THEME}>
      <main>
        <Home />
      </main>
    </ThemeProvider>
  );
};

export default App;
