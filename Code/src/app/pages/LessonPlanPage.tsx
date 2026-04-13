import { useState, useEffect } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router";
import { categories, getWordsByCategory, CreeWord } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { Plus, Trash2, Save, FileText, BookOpen, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { toast } from "sonner";
import type { SavedLessonPlan } from "./SavedLessonPlansPage";
import { getPartOfSpeechDisplay, getPartOfSpeechTooltip } from "../utils/partOfSpeechHelper";

interface OutletContext {
  expertMode: boolean;
}

interface LessonPlan {
  title: string;
  description: string;
  selectedCategory: string;
  selectedWords: string[];
  notes: string;
}

export function LessonPlanPage() {
  const { expertMode } = useOutletContext<OutletContext>();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [lessonPlan, setLessonPlan] = useState<LessonPlan>({
    title: "",
    description: "",
    selectedCategory: "",
    selectedWords: [],
    notes: ""
  });
  const [expandedPOSInfo, setExpandedPOSInfo] = useState<Record<string, boolean>>({});
  const [filterPOS, setFilterPOS] = useState<string>("all");

  // Load lesson plan if editing
  useEffect(() => {
    if (editId) {
      try {
        const saved = localStorage.getItem("cree-lesson-plans");
        if (saved) {
          const plans: SavedLessonPlan[] = JSON.parse(saved);
          const planToEdit = plans.find(p => p.id === editId);
          if (planToEdit) {
            setLessonPlan({
              title: planToEdit.title,
              description: planToEdit.description,
              selectedCategory: planToEdit.selectedCategory,
              selectedWords: planToEdit.selectedWords,
              notes: planToEdit.notes
            });
          }
        }
      } catch (error) {
        console.error("Failed to load lesson plan for editing:", error);
        toast.error("Failed to load lesson plan");
      }
    }
  }, [editId]);

  const allCategoryWords = lessonPlan.selectedCategory
    ? getWordsByCategory(lessonPlan.selectedCategory)
    : [];

  const categoryWords = allCategoryWords.filter(word => {
    if (filterPOS === "all") return true;
    return word.partOfSpeech === filterPOS;
  });

  const partsOfSpeech = Array.from(new Set(allCategoryWords.map(w => w.partOfSpeech)));

  const toggleWordSelection = (wordId: string) => {
    setLessonPlan(prev => ({
      ...prev,
      selectedWords: prev.selectedWords.includes(wordId)
        ? prev.selectedWords.filter(id => id !== wordId)
        : [...prev.selectedWords, wordId]
    }));
  };

  const handleSaveLessonPlan = () => {
    try {
      // Load existing plans
      const existingPlans = localStorage.getItem("cree-lesson-plans");
      const plans: SavedLessonPlan[] = existingPlans ? JSON.parse(existingPlans) : [];

      if (editId) {
        // Update existing plan
        const index = plans.findIndex(p => p.id === editId);
        if (index !== -1) {
          plans[index] = {
            ...plans[index],
            ...lessonPlan,
          };
          localStorage.setItem("cree-lesson-plans", JSON.stringify(plans));
          toast.success("Lesson plan updated successfully!");
        }
      } else {
        // Create new plan
        const lessonPlanData: SavedLessonPlan = {
          id: `lesson-${Date.now()}`,
          ...lessonPlan,
          createdAt: new Date().toISOString()
        };
        plans.push(lessonPlanData);
        localStorage.setItem("cree-lesson-plans", JSON.stringify(plans));

        // Reset form only when creating new
        setLessonPlan({
          title: "",
          description: "",
          selectedCategory: "",
          selectedWords: [],
          notes: ""
        });

        toast.success("Lesson plan saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save lesson plan:", error);
      toast.error("Failed to save lesson plan");
    }
  };

  const handleExportPrintable = () => {
    // Create a printable version
    const selectedCategory = categories.find(c => c.id === lessonPlan.selectedCategory);
    const selectedWordObjs = allCategoryWords.filter(w => lessonPlan.selectedWords.includes(w.id));

    let content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${lessonPlan.title || 'Lesson Plan'}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
          h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
          h2 { color: #4b5563; margin-top: 30px; }
          .word-entry { margin: 20px 0; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
          .word-cree { font-size: 20px; font-weight: bold; color: #1f2937; }
          .word-english { font-size: 16px; color: #4b5563; margin: 5px 0; }
          .word-definition { font-size: 14px; color: #6b7280; }
          .word-pos { font-size: 12px; color: #9ca3af; margin: 5px 0; font-style: italic; }
          .notes { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <h1>${lessonPlan.title || 'Cree Language Lesson Plan'}</h1>
        ${lessonPlan.description ? `<p><strong>Description:</strong> ${lessonPlan.description}</p>` : ''}
        ${selectedCategory ? `<p><strong>Category:</strong> ${selectedCategory.name} (${selectedCategory.cree})</p>` : ''}

        <h2>Vocabulary (${selectedWordObjs.length} words)</h2>
        ${selectedWordObjs.map(word => `
          <div class="word-entry">
            <div class="word-cree">${word.cree}</div>
            <div class="word-english">${word.english}</div>
            <div class="word-definition">${word.definition}</div>
            ${expertMode ? `<div class="word-pos">Part of Speech: ${word.partOfSpeech}</div>` : ''}
            ${word.examples && word.examples.length > 0 ? `
              <div style="margin-top: 10px; font-size: 13px;">
                <strong>Example:</strong> ${word.examples[0].cree}<br>
                <em>${word.examples[0].english}</em>
              </div>
            ` : ''}
          </div>
        `).join('')}
        
        ${lessonPlan.notes ? `
          <h2>Notes</h2>
          <div class="notes">${lessonPlan.notes.replace(/\n/g, '<br>')}</div>
        ` : ''}
        
        <p style="margin-top: 40px; color: #9ca3af; font-size: 12px;">
          Generated by Vocabulary Explorer • ${new Date().toLocaleDateString()}
        </p>
      </body>
      </html>
    `;
    
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lesson-plan-${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto pb-6 sm:pb-8">
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{editId ? "Edit Lesson Plan" : "Create Lesson Plan"}</h2>
          <p className="text-sm sm:text-base text-gray-600">
            {editId
              ? "Update your lesson plan details and vocabulary selection."
              : "Build a custom lesson plan by selecting a category and choosing specific vocabulary words to teach."
            }
          </p>
        </div>
        <Link to="/lesson-plan/saved">
          <Button variant="outline" size="sm" className="touch-manipulation whitespace-nowrap">
            <BookOpen className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">View Saved Plans</span>
            <span className="sm:hidden">Saved</span>
          </Button>
        </Link>
      </div>

      {/* Lesson Plan Details */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Lesson Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Lesson Title
            </label>
            <Input
              placeholder="e.g., Body Parts - Week 1"
              value={lessonPlan.title}
              onChange={(e) => setLessonPlan(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Description
            </label>
            <Textarea
              placeholder="Describe the learning objectives for this lesson..."
              value={lessonPlan.description}
              onChange={(e) => setLessonPlan(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Select Category
            </label>
            <Select
              value={lessonPlan.selectedCategory}
              onValueChange={(value) => {
                setLessonPlan(prev => ({
                  ...prev,
                  selectedCategory: value,
                  selectedWords: [] // Reset selected words when category changes
                }));
                setFilterPOS("all"); // Reset part of speech filter when category changes
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name} ({cat.cree})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Word Selection */}
      {lessonPlan.selectedCategory && (
        <Card className="mb-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Select Vocabulary Words
              </CardTitle>
              <Badge variant="secondary">
                {lessonPlan.selectedWords.length} selected
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {allCategoryWords.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No words available in this category
              </p>
            ) : categoryWords.length === 0 && filterPOS !== "all" ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No words with part of speech "{filterPOS}" in this category
              </p>
            ) : (
              <>
                {expertMode && partsOfSpeech.length > 1 && (
                  <div className="mb-3">
                    <label className="text-xs font-medium mb-1 block text-gray-600">
                      Filter by Part of Speech
                    </label>
                    <Select value={filterPOS} onValueChange={setFilterPOS}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Parts of Speech" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Parts of Speech</SelectItem>
                        {partsOfSpeech.map(pos => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex gap-2 mb-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setLessonPlan(prev => ({
                      ...prev,
                      selectedWords: categoryWords.map(w => w.id)
                    }))}
                    className="flex-1 touch-manipulation"
                  >
                    Select All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setLessonPlan(prev => ({
                      ...prev,
                      selectedWords: []
                    }))}
                    className="flex-1 touch-manipulation"
                  >
                    Clear All
                  </Button>
                </div>
                
                <Separator className="my-3" />
                
                {categoryWords.map((word) => (
                  <div key={word.id} className="border-b border-gray-100 last:border-0">
                    <div
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleWordSelection(word.id)}
                    >
                      <Checkbox
                        checked={lessonPlan.selectedWords.includes(word.id)}
                        className="mt-1 pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{word.cree}</span>
                          <Badge variant="outline" className="text-xs">
                            {getPartOfSpeechDisplay(word.partOfSpeech, expertMode)}
                          </Badge>
                          {expertMode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0 hover:bg-gray-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedPOSInfo(prev => ({
                                  ...prev,
                                  [word.id]: !prev[word.id]
                                }));
                              }}
                            >
                              <Info className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{word.english}</p>
                        <p className="text-xs text-gray-500 mt-1">{word.definition}</p>
                      </div>
                    </div>
                    {expertMode && expandedPOSInfo[word.id] && (
                      <div className="mx-3 mb-3 bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
                        {getPartOfSpeechTooltip(word.partOfSpeech)}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Teaching Notes */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Teaching Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add notes about teaching strategies, activities, cultural context, pronunciation tips, etc."
            value={lessonPlan.notes}
            onChange={(e) => setLessonPlan(prev => ({ ...prev, notes: e.target.value }))}
            rows={6}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleSaveLessonPlan}
          disabled={!lessonPlan.title || lessonPlan.selectedWords.length === 0}
          className="w-full min-h-[44px] touch-manipulation"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Lesson Plan
        </Button>

        <Button
          onClick={handleExportPrintable}
          disabled={!lessonPlan.title || lessonPlan.selectedWords.length === 0}
          variant="outline"
          className="w-full min-h-[44px] touch-manipulation"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export Printable Version
        </Button>
      </div>

      {/* Summary */}
      {lessonPlan.selectedWords.length > 0 && (
        <Card className="mt-4 bg-green-50 border-green-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-sm mb-2 text-green-900">
              ✓ Lesson Plan Summary
            </h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Title: {lessonPlan.title || '(Not set)'}</li>
              <li>• Category: {categories.find(c => c.id === lessonPlan.selectedCategory)?.name || 'None'}</li>
              <li>• Vocabulary words: {lessonPlan.selectedWords.length}</li>
              <li>• Notes: {lessonPlan.notes ? 'Added' : 'None'}</li>
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      <Card className="mt-4 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm mb-2 text-blue-900">
            💡 Teacher Tips
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Start with a small set of related words (5-10) per lesson</li>
            <li>• Use the semantic relationships to show how words connect</li>
            <li>• Remember: colors and weather are verbs in Cree, not adjectives!</li>
            <li>• Export printable version for handouts or save JSON for digital records</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
