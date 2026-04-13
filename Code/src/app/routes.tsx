import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { HomePage } from "./pages/HomePage";
import { CategoryPage } from "./pages/CategoryPage";
import { WordDetailPage } from "./pages/WordDetailPage";
import { SearchPage } from "./pages/SearchPage";
import { LessonPlanPage } from "./pages/LessonPlanPage";
import { SavedLessonPlansPage } from "./pages/SavedLessonPlansPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "category/:categoryId", Component: CategoryPage },
      { path: "word/:wordId", Component: WordDetailPage },
      { path: "search", Component: SearchPage },
      { path: "lesson-plan", Component: LessonPlanPage },
      { path: "lesson-plan/saved", Component: SavedLessonPlansPage },
    ],
  },
]);
