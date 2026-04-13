import { Link, useOutletContext } from "react-router";
import { categories } from "../data/mockData";
import { Card, CardContent } from "../components/ui/card";
import * as LucideIcons from "lucide-react";

interface OutletContext {
  expertMode: boolean;
}

export function HomePage() {
  const { expertMode } = useOutletContext<OutletContext>();

  return (
    <div className="p-4 pb-6 max-w-4xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Tanisi! Welcome</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Explore Plains Cree vocabulary through semantic relationships.
          {expertMode
            ? " Expert mode enabled - showing full linguistic details."
            : " Select a category to begin learning."}
        </p>
      </div>

      {/* Categories Grid */}
      <div className="mb-4">
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((category) => {
            const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Folder;
            
            return (
              <Link key={category.id} to={`/category/${category.id}`}>
                <Card className="hover:shadow-md transition-shadow active:scale-[0.98]">
                  <CardContent className="p-4 touch-manipulation">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-0.5 truncate">
                          {category.name}
                        </h4>
                        <p className="text-xs text-gray-500 mb-1 truncate">
                          {category.cree}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {category.description}
                        </p>
                        <div className="mt-2 text-xs text-blue-600 font-medium">
                          {category.wordCount} words →
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}