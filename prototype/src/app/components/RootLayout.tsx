import { Outlet, Link, useLocation } from "react-router";
import { Search, BookOpen, Home, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useState } from "react";
import { Toaster } from "./ui/sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function RootLayout() {
  const location = useLocation();
  const [expertMode, setExpertMode] = useState(false);
  const [showExpertModeInfo, setShowExpertModeInfo] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VE</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">Vocabulary Explorer</h1>
                <p className="text-xs text-gray-600">nêhiyawêwin: itwêwina</p>
              </div>
            </Link>
          </div>

          {/* Expert Mode Toggle */}
          <div className="mb-3">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-1">
                <Label htmlFor="expert-mode" className="text-sm cursor-pointer touch-manipulation">
                  Expert Mode
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-gray-200 touch-manipulation"
                  onClick={() => setShowExpertModeInfo(!showExpertModeInfo)}
                >
                  <Info className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
              <Switch
                id="expert-mode"
                checked={expertMode}
                onCheckedChange={setExpertMode}
                className="touch-manipulation"
              />
            </div>
            {showExpertModeInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800 mt-2">
                Enable to view morphological analysis, word classes (NDA, VAI, VII),
                stem forms, and complete linguistic metadata for lexicographers and linguists.
              </div>
            )}
          </div>

          {/* Top Navigation */}
          <nav className="flex items-center justify-around border-t border-gray-200 pt-2">
            <Link to="/" className="flex-1">
              <Button
                variant={location.pathname === "/" ? "default" : "ghost"}
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-2 px-3 w-full touch-manipulation min-h-[44px]"
              >
                <Home className="w-5 h-5" />
                <span className="text-xs">Home</span>
              </Button>
            </Link>

            <Link to="/search" className="flex-1">
              <Button
                variant={location.pathname === "/search" ? "default" : "ghost"}
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-2 px-3 w-full touch-manipulation min-h-[44px]"
              >
                <Search className="w-5 h-5" />
                <span className="text-xs">Search</span>
              </Button>
            </Link>

            <Link to="/lesson-plan" className="flex-1">
              <Button
                variant={location.pathname.startsWith("/lesson-plan") ? "default" : "ghost"}
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-2 px-3 w-full touch-manipulation min-h-[44px]"
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-xs">Lessons</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet context={{ expertMode }} />
      </main>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}