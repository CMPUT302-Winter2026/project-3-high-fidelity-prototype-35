import { useState } from "react";
import { Link, useOutletContext } from "react-router";
import { words } from "../data/mockData";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Search, Filter } from "lucide-react";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { SemanticGapAnalysis } from "../components/SemanticGapAnalysis";
import { getPartOfSpeechDisplay } from "../utils/partOfSpeechHelper";
import { normalizeForSearch } from "../utils/searchHelper";

interface OutletContext {
  expertMode: boolean;
}

export function SearchPage() {
  const { expertMode } = useOutletContext<OutletContext>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPOS, setFilterPOS] = useState<string>("all");
  const [showGapAnalysis, setShowGapAnalysis] = useState(false);

  // Filter words based on search query and filters
  const filteredWords = words.filter(word => {
    const normalizedQuery = normalizeForSearch(searchQuery);
    const matchesQuery =
      searchQuery === "" ||
      normalizeForSearch(word.cree).includes(normalizedQuery) ||
      normalizeForSearch(word.english).includes(normalizedQuery) ||
      normalizeForSearch(word.definition).includes(normalizedQuery);

    const matchesCategory =
      filterCategory === "all" || word.category === filterCategory;

    const matchesPOS =
      filterPOS === "all" || word.partOfSpeech === filterPOS;

    return matchesQuery && matchesCategory && matchesPOS;
  });

  const categories = Array.from(new Set(words.map(w => w.category)));
  const partsOfSpeech = Array.from(new Set(words.map(w => w.partOfSpeech)));

  return (
    <div className="max-w-4xl mx-auto pb-6">
      {/* Sticky Search Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 pb-3 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Search Dictionary</h2>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search in Cree or English..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="flex-1 min-w-0">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {expertMode && (
          <>
            <Select value={filterPOS} onValueChange={setFilterPOS}>
              <SelectTrigger className="flex-1 min-w-0">
                <SelectValue placeholder="Part of Speech" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All POS</SelectItem>
                {partsOfSpeech.map(pos => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showGapAnalysis ? "default" : "outline"}
              size="sm"
              onClick={() => setShowGapAnalysis(!showGapAnalysis)}
              className="w-full sm:w-auto"
            >
              Gap Analysis
            </Button>
          </>
        )}
        </div>
      </div>

      <div className="px-4">
        {/* Results Count */}
        <div className="mb-3 text-sm text-gray-600">
        {filteredWords.length} {filteredWords.length === 1 ? 'result' : 'results'}
        {searchQuery && ` for "${searchQuery}"`}
      </div>

        {/* Semantic Gap Analysis */}
        {expertMode && showGapAnalysis && (
          <div className="mb-4">
            <SemanticGapAnalysis />
          </div>
        )}

        {/* Results */}
        <div className="space-y-2">
        {filteredWords.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                No words found. Try a different search term.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredWords.map((word) => (
            <Link key={word.id} to={`/word/${word.id}`} state={{ from: 'search' }}>
              <Card className="hover:shadow-md transition-shadow active:scale-[0.98]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{word.cree}</h3>
                        <Badge variant="outline" className="text-xs">
                          {word.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {getPartOfSpeechDisplay(word.partOfSpeech, expertMode)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-1">{word.english}</p>
                      <p className="text-sm text-gray-500">{word.definition}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
        </div>
      </div>
    </div>
  );
}