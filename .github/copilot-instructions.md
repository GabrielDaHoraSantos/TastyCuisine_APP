# Copilot Instructions for TastyCuisine_APP

## Goal
Assist with the Expo React Native app in `app/` using Expo Router and local static recipe data.

## Architecture
- Root layout: `app/_layout.jsx` wraps the app with `GestureHandlerRootView`, `SafeAreaProvider`, and `ThemeProvider`.
- Routing is file-based via Expo Router:
  - `app/(auth)/...` for login/register/welcome flow.
  - `app/(onboarding)/preferences.tsx` for onboarding.
  - `app/(tabs)/...` for main tab screens.
  - `app/dish/[id].tsx` for detail pages outside the tab group.
- The tab navigator is defined in `app/(tabs)/_layout.tsx`; note `tabBarStyle: { display: 'none' }` is used, so navigation is driven by screen routes and custom UI rather than a visible tab bar.

## Key Patterns
- Theme state is centralized in `app/themeContext.tsx`; use `useTheme()` for colors, dark mode, and theme toggles.
- Static data lives in `src/data/recipes.ts` and `src/data/questions.ts`; recipe details, comments, and onboarding options are loaded from these modules.
- Page logic keeps hooks and state near the top of component files, then defines styles and render markup below.
- Dynamic deeper links use `useLocalSearchParams()` and `useRouter()` in `app/dish/[id].tsx`.
- The side drawer is custom-built in `components/SideMenu.tsx`; it navigates with `router.push(\