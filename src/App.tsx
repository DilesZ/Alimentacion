import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PlannerProvider } from "./app/PlannerProvider";
import { MainLayout } from "./components/MainLayout";

const HomePage = lazy(() => import("./pages/HomePage"));
const RecipesPage = lazy(() => import("./pages/RecipesPage"));
const CalendarPage = lazy(() => import("./pages/CalendarPage"));
const ShoppingPage = lazy(() => import("./pages/ShoppingPage"));

function App() {
  return (
    <PlannerProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="page-loading">Cargando vista...</div>}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/recetas" element={<RecipesPage />} />
              <Route path="/calendario" element={<CalendarPage />} />
              <Route path="/compras" element={<ShoppingPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </PlannerProvider>
  );
}

export default App;
