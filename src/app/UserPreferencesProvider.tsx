import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import {
  Recipe,
  RecipeHistoryEntry,
  RecipeIngredient,
  RecipeVideoWatchState,
  UnitSystem
} from "../types";

type PersistedUserState = {
  unitSystem: UnitSystem;
  favorites: string[];
  downloadedRecipes: string[];
  history: RecipeHistoryEntry[];
  manualShoppingList: Record<string, number>;
  videoWatchHistory: Record<string, RecipeVideoWatchState>;
};

type UserPreferencesContextValue = PersistedUserState & {
  favoriteCount: number;
  downloadedCount: number;
  toggleFavorite: (recipeId: string) => void;
  markRecipeViewed: (recipeId: string) => void;
  toggleDownloadedRecipe: (recipeId: string) => void;
  setUnitSystem: (unitSystem: UnitSystem) => void;
  addRecipeIngredientsToShopping: (recipe: Recipe, servings: number) => void;
  removeManualShoppingItem: (foodId: string) => void;
  clearManualShoppingList: () => void;
  markRecipeVideoInteraction: (recipeId: string, action: RecipeVideoWatchState["lastAction"]) => void;
};

const STORAGE_KEY = "planificador-saludable-user-state-v2";

const defaultState: PersistedUserState = {
  unitSystem: "metric",
  favorites: [],
  downloadedRecipes: [],
  history: [],
  manualShoppingList: {},
  videoWatchHistory: {}
};

const UserPreferencesContext = createContext<UserPreferencesContextValue | null>(null);

const readInitialState = (): PersistedUserState => {
  if (typeof window === "undefined") {
    return defaultState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedUserState>;
    return {
      ...defaultState,
      ...parsed,
      manualShoppingList: parsed.manualShoppingList ?? {},
      videoWatchHistory: parsed.videoWatchHistory ?? {},
      history: parsed.history ?? [],
      favorites: parsed.favorites ?? [],
      downloadedRecipes: parsed.downloadedRecipes ?? []
    };
  } catch {
    return defaultState;
  }
};

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedUserState>(readInitialState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggleFavorite = useCallback((recipeId: string) => {
    setState((current) => ({
      ...current,
      favorites: current.favorites.includes(recipeId)
        ? current.favorites.filter((id) => id !== recipeId)
        : [...current.favorites, recipeId]
    }));
  }, []);

  const markRecipeViewed = useCallback((recipeId: string) => {
    setState((current) => ({
      ...current,
      history: [{ recipeId, viewedAt: new Date().toISOString() }, ...current.history.filter((entry) => entry.recipeId !== recipeId)].slice(
        0,
        12
      )
    }));
  }, []);

  const toggleDownloadedRecipe = useCallback((recipeId: string) => {
    setState((current) => ({
      ...current,
      downloadedRecipes: current.downloadedRecipes.includes(recipeId)
        ? current.downloadedRecipes.filter((id) => id !== recipeId)
        : [...current.downloadedRecipes, recipeId]
    }));
  }, []);

  const setUnitSystem = useCallback((unitSystem: UnitSystem) => {
    setState((current) => ({ ...current, unitSystem }));
  }, []);

  const addRecipeIngredientsToShopping = useCallback((recipe: Recipe, servings: number) => {
    setState((current) => {
      const nextManualList = { ...current.manualShoppingList };

      recipe.ingredients.forEach((ingredient: RecipeIngredient) => {
        nextManualList[ingredient.foodId] = Math.round(((nextManualList[ingredient.foodId] ?? 0) + ingredient.grams * servings) * 100) / 100;
      });

      return {
        ...current,
        manualShoppingList: nextManualList
      };
    });
  }, []);

  const removeManualShoppingItem = useCallback((foodId: string) => {
    setState((current) => {
      const nextManualList = { ...current.manualShoppingList };
      delete nextManualList[foodId];
      return {
        ...current,
        manualShoppingList: nextManualList
      };
    });
  }, []);

  const clearManualShoppingList = useCallback(() => {
    setState((current) => ({ ...current, manualShoppingList: {} }));
  }, []);

  const markRecipeVideoInteraction = useCallback((recipeId: string, action: RecipeVideoWatchState["lastAction"]) => {
    setState((current) => {
      const previous = current.videoWatchHistory[recipeId];

      return {
        ...current,
        videoWatchHistory: {
          ...current.videoWatchHistory,
          [recipeId]: {
            lastViewedAt: new Date().toISOString(),
            playCount: (previous?.playCount ?? 0) + 1,
            lastAction: action
          }
        }
      };
    });
  }, []);

  const value = useMemo<UserPreferencesContextValue>(
    () => ({
      ...state,
      favoriteCount: state.favorites.length,
      downloadedCount: state.downloadedRecipes.length,
      toggleFavorite,
      markRecipeViewed,
      toggleDownloadedRecipe,
      setUnitSystem,
      addRecipeIngredientsToShopping,
      removeManualShoppingItem,
      clearManualShoppingList,
      markRecipeVideoInteraction
    }),
    [
      addRecipeIngredientsToShopping,
      clearManualShoppingList,
      markRecipeVideoInteraction,
      removeManualShoppingItem,
      setUnitSystem,
      state,
      toggleDownloadedRecipe,
      toggleFavorite,
      markRecipeViewed
    ]
  );

  return <UserPreferencesContext.Provider value={value}>{children}</UserPreferencesContext.Provider>;
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);

  if (!context) {
    throw new Error("useUserPreferences debe usarse dentro de UserPreferencesProvider.");
  }

  return context;
}
