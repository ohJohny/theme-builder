# Storybook integration

Sync Storybook's theme toolbar with `ThemeProvider` using the shared storage key.

```tsx
// .storybook/preview.tsx
import type { Preview } from '@storybook/react';
import { STORY_COLOR_SCHEME_STORAGE_KEY } from '@ohJohny/theme-builder/core';
import { ThemeProvider } from '../src/theme';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider
        theme={created}
        storage={{ type: 'localStorage', key: STORY_COLOR_SCHEME_STORAGE_KEY }}
        viewTransition
      >
        <Story />
      </ThemeProvider>
    ),
  ],
  globalTypes: {
    theme: {
      name: 'Color scheme',
      toolbar: {
        icon: 'circlehollow',
        items: ['light', 'dark', 'system'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
```

`writePersistedColorScheme` mirrors the choice to both localStorage and a cookie under the same key, so Storybook toolbar changes stay in sync with app storage when you reuse `STORY_COLOR_SCHEME_STORAGE_KEY`.
