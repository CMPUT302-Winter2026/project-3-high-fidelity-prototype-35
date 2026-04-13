import { useParams, Link, useOutletContext, useLocation } from "react-router";
import { getWordById, getRelatedWords } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, ArrowRight, Download, HelpCircle, Info } from "lucide-react";
import { Separator } from "../components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { getPartOfSpeechDisplay, getPartOfSpeechTooltip } from "../utils/partOfSpeechHelper";

interface OutletContext {
  expertMode: boolean;
}

export function WordDetailPage() {
  const { wordId } = useParams();
  const { expertMode } = useOutletContext<OutletContext>();
  const location = useLocation();
  const [showStemInfo, setShowStemInfo] = useState(false);
  const [showInflectionInfo, setShowInflectionInfo] = useState(false);
  const [showPOSInfo, setShowPOSInfo] = useState(false);

  const word = wordId ? getWordById(wordId) : undefined;
  const relatedWords = wordId ? getRelatedWords(wordId) : [];

  // Determine back link based on where user came from
  const backLink = (location.state as { from?: string })?.from === 'search'
    ? '/search'
    : `/category/${word?.category}`;

  const handleExportDefinition = () => {
    if (!word) return;
    
    const exportData = {
      word: word.cree,
      english: word.english,
      definition: word.definition,
      partOfSpeech: word.partOfSpeech,
      morphology: word.morphology,
      examples: word.examples
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${word.cree}-definition.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Definition exported successfully');
  };

  if (!word) {
    return (
      <div className="p-4">
        <p>Word not found</p>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-4 pb-5 mb-4">
        <Link to={backLink}>
          <Button variant="ghost" size="sm" className="text-white mb-3 -ml-2 touch-manipulation">
            <ArrowLeft className="w-4 h-4 mr-1" />
            {(location.state as { from?: string })?.from === 'search' ? 'Back to Search' : 'Back to Category'}
          </Button>
        </Link>

        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold break-words">{word.cree}</h1>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Badge variant="secondary" className="text-xs whitespace-nowrap">
              {getPartOfSpeechDisplay(word.partOfSpeech, expertMode)}
            </Badge>
            {expertMode && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-white/20 text-white touch-manipulation"
                onClick={() => setShowPOSInfo(!showPOSInfo)}
              >
                <Info className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {expertMode && showPOSInfo && (
          <div className="bg-white/20 border border-white/30 rounded p-2 text-xs text-white mb-2">
            {getPartOfSpeechTooltip(word.partOfSpeech)}
          </div>
        )}

        <p className="text-lg sm:text-xl text-blue-100 mb-2">{word.english}</p>
        <p className="text-xs sm:text-sm text-blue-50">{word.definition}</p>
      </div>

      <div className="px-4 space-y-4">
        {/* Morphological Information (Expert Mode) */}
        {expertMode && word.morphology && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Morphological Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Word Class:</span>
                <span className="font-medium">{word.morphology.wordClass}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-1">
                  Stem:
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 hover:bg-blue-100"
                    onClick={() => setShowStemInfo(!showStemInfo)}
                  >
                    <Info className="w-3 h-3" />
                  </Button>
                </span>
                <span className="font-medium">{word.morphology.stem}</span>
              </div>
              {showStemInfo && (
                <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
                  The core part of the word that carries the main meaning
                </div>
              )}
              {word.morphology.inflection && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center gap-1">
                      Inflection:
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 hover:bg-blue-100"
                        onClick={() => setShowInflectionInfo(!showInflectionInfo)}
                      >
                        <Info className="w-3 h-3" />
                      </Button>
                    </span>
                    <span className="font-medium">{word.morphology.inflection}</span>
                  </div>
                  {showInflectionInfo && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
                      Prefixes or suffixes that modify the stem's meaning
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Expert Tools: Export Definition */}
        {expertMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportDefinition}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Definition
          </Button>
        )}

        {/* Examples */}
        {word.examples && word.examples.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Examples</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {word.examples.map((example, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium mb-1">{example.cree}</p>
                  <p className="text-sm text-gray-600">{example.english}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Semantic Relationships */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Semantic Relationships</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Synonyms */}
            {word.relationships.synonyms && word.relationships.synonyms.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-green-700 mb-2">
                  Synonyms (Similar Meaning)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {word.relationships.synonyms.map(synId => {
                    const synWord = getWordById(synId);
                    return synWord ? (
                      <Link key={synId} to={`/word/${synId}`}>
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-green-50 border-green-300"
                        >
                          {synWord.cree} ({synWord.english})
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Badge>
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Antonyms */}
            {word.relationships.antonyms && word.relationships.antonyms.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-700 mb-2">
                  Antonyms (Opposite Meaning)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {word.relationships.antonyms.map(antId => {
                    const antWord = getWordById(antId);
                    return antWord ? (
                      <Link key={antId} to={`/word/${antId}`}>
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-red-50 border-red-300"
                        >
                          {antWord.cree} ({antWord.english})
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Badge>
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Broader Terms */}
            {word.relationships.broader && word.relationships.broader.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-purple-700 mb-2">
                  Broader Terms (More General)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {word.relationships.broader.map(broadId => {
                    const broadWord = getWordById(broadId);
                    return broadWord ? (
                      <Link key={broadId} to={`/word/${broadId}`}>
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-purple-50 border-purple-300"
                        >
                          {broadWord.cree} ({broadWord.english})
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Badge>
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Narrower Terms */}
            {word.relationships.narrower && word.relationships.narrower.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-blue-700 mb-2">
                  Narrower Terms (More Specific)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {word.relationships.narrower.map(narrowId => {
                    const narrowWord = getWordById(narrowId);
                    return narrowWord ? (
                      <Link key={narrowId} to={`/word/${narrowId}`}>
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-blue-50 border-blue-300"
                        >
                          {narrowWord.cree} ({narrowWord.english})
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Badge>
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Related Terms */}
            {word.relationships.related && word.relationships.related.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Related Words
                </h4>
                <div className="flex flex-wrap gap-2">
                  {word.relationships.related.map(relId => {
                    const relWord = getWordById(relId);
                    return relWord ? (
                      <Link key={relId} to={`/word/${relId}`}>
                        <Badge 
                          variant="outline" 
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          {relWord.cree} ({relWord.english})
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Badge>
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* No relationships */}
            {!word.relationships.synonyms?.length &&
             !word.relationships.antonyms?.length &&
             !word.relationships.broader?.length &&
             !word.relationships.narrower?.length &&
             !word.relationships.related?.length && (
              <p className="text-sm text-gray-500 italic">
                No semantic relationships recorded for this word yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Expert Mode: Semantic Gap Analysis */}
        {expertMode && (
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-base text-purple-900">
                Lexicographic Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-purple-800">
              <p className="mb-2">
                <strong>Word Class:</strong> {word.partOfSpeech}
              </p>
              <p className="mb-2">
                <strong>Relationships:</strong> {relatedWords.length} total connections
              </p>
              <p className="text-xs">
                This entry can be used to identify semantic gaps. Consider adding 
                more specific terms (narrower) or verifying all related concepts 
                are documented in the dictionary.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}