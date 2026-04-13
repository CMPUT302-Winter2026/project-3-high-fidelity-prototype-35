import { words, categories } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { AlertCircle } from "lucide-react";

export function SemanticGapAnalysis() {
  // Analyze semantic gaps - words with few or no relationships
  const wordsWithFewRelationships = words.filter(word => {
    const totalRelationships = 
      (word.relationships.related?.length || 0) +
      (word.relationships.synonyms?.length || 0) +
      (word.relationships.antonyms?.length || 0) +
      (word.relationships.broader?.length || 0) +
      (word.relationships.narrower?.length || 0);
    
    return totalRelationships < 2;
  });

  // Find categories with sparse coverage
  const categoryAnalysis = categories.map(cat => {
    const categoryWords = words.filter(w => w.category === cat.id);
    const avgRelationships = categoryWords.reduce((sum, word) => {
      const total = 
        (word.relationships.related?.length || 0) +
        (word.relationships.synonyms?.length || 0) +
        (word.relationships.antonyms?.length || 0) +
        (word.relationships.broader?.length || 0) +
        (word.relationships.narrower?.length || 0);
      return sum + total;
    }, 0) / categoryWords.length;

    return {
      category: cat,
      wordCount: categoryWords.length,
      avgRelationships: avgRelationships || 0
    };
  });

  const sparseCategories = categoryAnalysis.filter(c => c.avgRelationships < 2);

  return (
    <div className="space-y-4">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-orange-900">
            <AlertCircle className="w-5 h-5" />
            Semantic Gap Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2 text-orange-800">
              Words with Limited Relationships
            </h4>
            <p className="text-xs text-orange-700 mb-2">
              {wordsWithFewRelationships.length} words have fewer than 2 semantic connections.
              These may need additional documentation.
            </p>
            <div className="flex flex-wrap gap-1">
              {wordsWithFewRelationships.slice(0, 10).map(word => (
                <Badge key={word.id} variant="outline" className="text-xs">
                  {word.cree}
                </Badge>
              ))}
              {wordsWithFewRelationships.length > 10 && (
                <Badge variant="secondary" className="text-xs">
                  +{wordsWithFewRelationships.length - 10} more
                </Badge>
              )}
            </div>
          </div>

          {sparseCategories.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2 text-orange-800">
                Categories Needing Expansion
              </h4>
              <div className="space-y-2">
                {sparseCategories.map(({ category, wordCount, avgRelationships }) => (
                  <div key={category.id} className="text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {wordCount} words, {avgRelationships.toFixed(1)} avg connections
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-orange-700 bg-white rounded p-2">
            <strong>Recommendation:</strong> Consider adding more semantic relationships,
            documenting related concepts, or identifying Cree words that don't have
            direct English equivalents.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
