// Helper function to convert part of speech abbreviations to user-friendly descriptions
export function getPartOfSpeechDisplay(pos: string, expertMode: boolean): string {
  if (expertMode) {
    return pos;
  }

  // Map technical terms to plain language
  const friendlyNames: Record<string, string> = {
    'NDA': 'Family/Relation Word',
    'NA': 'Animate Noun',
    'NI': 'Inanimate Noun',
    'NID': 'Dependent Noun',
    'NAD': 'Dependent Noun',
    'VAI': 'Action Verb',
    'VII': 'State Verb',
    'VTI': 'Action Verb',
    'VTA': 'Action Verb',
  };

  return friendlyNames[pos] || pos;
}

// Helper function to get tooltip description for technical terms
export function getPartOfSpeechTooltip(pos: string): string {
  const tooltips: Record<string, string> = {
    'NDA': 'Dependent Animate Noun - Words for family relationships that require possession (my, your, etc.)',
    'NA': 'Animate Noun - Words for living beings (people, animals)',
    'NI': 'Inanimate Noun - Words for non-living things',
    'NID': 'Dependent Inanimate Noun - Words that require possession',
    'NAD': 'Dependent Animate Noun - Words that require possession',
    'VAI': 'Animate Intransitive Verb - Action verbs for living beings',
    'VII': 'Inanimate Intransitive Verb - Verbs describing states (often colors, weather)',
    'VTI': 'Transitive Inanimate Verb - Action verbs with non-living objects',
    'VTA': 'Transitive Animate Verb - Action verbs with living objects',
  };

  return tooltips[pos] || pos;
}
