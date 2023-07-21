import { Route, Routes } from 'react-router-dom';

import { styled, ThemeProvider } from 'styled-components';

import GlobalStyle from '@/styles/GlobalStyle';
import { theme } from '@/styles/theme';
import Button from '@components/Button';
import { Counter, NewProject } from '@components/index.tsx';

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AppStyle>
          {/* Test button */}
          <Button $themeColor="Pri-500" size="bodyText">
            Click Me!
          </Button>
          {/* =============== react-router-dom Test ===============  */}
          <Routes>
            <Route element={<NewProject />} path="/" />
            <Route element={<Counter />} path="/redux" />
          </Routes>
        </AppStyle>
      </ThemeProvider>
    </>
  );
}

const AppStyle = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;

  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.react:hover {
    filter: drop-shadow(0 0 2em #61dafbaa);
  }

  @keyframes logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    a:nth-of-type(2) .logo {
      animation: logo-spin infinite 20s linear;
    }
  }

  .card {
    padding: 2em;
  }

  .read-the-docs {
    color: #888;
  }
`;

export default App;
