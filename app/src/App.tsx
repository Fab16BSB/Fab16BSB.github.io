import { I18nProvider } from '@/i18n/I18nProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { Home } from '@/pages/Home';

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <Home />
      </I18nProvider>
    </ThemeProvider>
  );
}
