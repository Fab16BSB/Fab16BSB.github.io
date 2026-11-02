import { I18nProvider } from '@/i18n/I18nProvider';
import { SearchProvider } from '@/search/SearchProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { Home } from '@/pages/Home';

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <SearchProvider>
          <Home />
        </SearchProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
