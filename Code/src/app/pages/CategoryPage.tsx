import { useParams, Link, useOutletContext } from "react-router";
import { useState } from "react";
import { categories, getWordsByCategory } from "../data/mockData";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { getPartOfSpeechDisplay } from "../utils/partOfSpeechHelper";
import { normalizeForSearch } from "../utils/searchHelper";

interface OutletContext {
  expertMode: boolean;
}

export function CategoryPage() {
  const { categoryId } = useParams();
  const { expertMode } = useOutletContext<OutletContext>();
  const [searchQuery, setSearchQuery] = useState("");

  const category = categories.find(c => c.id === categoryId);
  const allWords = categoryId ? getWordsByCategory(categoryId) : [];

  // Filter words based on search query
  const words = allWords.filter(word => {
    if (searchQuery === "") return true;
    const normalizedQuery = normalizeForSearch(searchQuery);
    return (
      normalizeForSearch(word.cree).includes(normalizedQuery) ||
      normalizeForSearch(word.english).includes(normalizedQuery) ||
      normalizeForSearch(word.definition).includes(normalizedQuery)
    );
  });

  if (!category) {
    return (
      <div className="p-4">
        <p>Category not found</p>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-4 pb-5 mb-4">
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-white mb-3 -ml-2 touch-manipulation">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </Link>

        <h2 className="text-xl sm:text-2xl font-bold mb-1">{category.name}</h2>
        <p className="text-blue-100 mb-3 text-sm sm:text-base">{category.cree}</p>
        <p className="text-xs sm:text-sm text-blue-50">{category.description}</p>
      </div>

      <div className="px-4">
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search words in this category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {words.length} {words.length === 1 ? 'word' : 'words'}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>

        {/* Words List */}
        <div className="space-y-2">
          {words.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">
                  No words found matching "{searchQuery}"
                </p>
              </CardContent>
            </Card>
          ) : (
            words.map((word) => (
              <Link key={word.id} to={`/word/${word.id}`} state={{ from: 'category' }}>
              <Card className="hover:shadow-md transition-shadow active:scale-[0.98]">
                <CardContent className="p-4 touch-manipulation">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{word.cree}</h3>
                        <Badge variant="outline" className="text-xs">
                          {getPartOfSpeechDisplay(word.partOfSpeech, expertMode)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{word.english}</p>
                      <p className="text-sm text-gray-500">{word.definition}</p>

                      {expertMode && word.morphology && (
                        <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                          <span className="font-medium">Morphology:</span> {word.morphology.wordClass}
                          {word.morphology.inflection && ` • Inflection: ${word.morphology.inflection}`}
                          {word.morphology.stem && ` • Stem: ${word.morphology.stem}`}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Show relationship counts */}
                  <div className="flex gap-2 mt-3 text-xs">
                    {word.relationships.related && word.relationships.related.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {word.relationships.related.length} related
                      </Badge>
                    )}
                    {word.relationships.synonyms && word.relationships.synonyms.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {word.relationships.synonyms.length} synonyms
                      </Badge>
                    )}
                    {word.relationships.antonyms && word.relationships.antonyms.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {word.relationships.antonyms.length} antonyms
                      </Badge>
                    )}
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