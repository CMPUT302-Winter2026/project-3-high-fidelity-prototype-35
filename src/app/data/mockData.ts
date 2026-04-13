// Mock data for Cree vocabulary with semantic relationships

export interface CreeWord {
  id: string;
  cree: string;
  english: string;
  category: string;
  subcategory?: string;
  partOfSpeech: string;
  definition: string;
  morphology?: {
    stem: string;
    inflection: string;
    wordClass: string;
  };
  relationships: {
    synonyms?: string[];
    antonyms?: string[];
    broader?: string[];
    narrower?: string[];
    related?: string[];
  };
  examples?: {
    cree: string;
    english: string;
  }[];
}

export interface Category {
  id: string;
  name: string;
  cree: string;
  description: string;
  icon: string;
  wordCount: number;
}

export const categories: Category[] = [
  {
    id: 'kinship',
    name: 'Kinship Terms',
    cree: 'wîcêwâkan',
    description: 'Family relationships and terms',
    icon: 'Users',
    wordCount: 24
  },
  {
    id: 'body',
    name: 'Body Parts',
    cree: 'wîyaw',
    description: 'Parts of the human body',
    icon: 'User',
    wordCount: 32
  },
  {
    id: 'movement',
    name: 'Ways of Moving',
    cree: 'pimohtewin',
    description: 'Walking, running, and other movements',
    icon: 'Footprints',
    wordCount: 18
  },
  {
    id: 'weather',
    name: 'Weather',
    cree: 'kîsikâw',
    description: 'Weather conditions (verbs in Cree)',
    icon: 'Cloud',
    wordCount: 15
  },
  {
    id: 'color',
    name: 'Colors',
    cree: 'wâpiskisiwin',
    description: 'Color terms (verbs in Cree)',
    icon: 'Palette',
    wordCount: 12
  },
  {
    id: 'animals',
    name: 'Animals',
    cree: 'pisiskiwak',
    description: 'Local fauna and wildlife',
    icon: 'Bird',
    wordCount: 45
  },
  {
    id: 'plants',
    name: 'Plants',
    cree: 'maskosiya',
    description: 'Local flora and vegetation',
    icon: 'TreePine',
    wordCount: 28
  },
  {
    id: 'hunting',
    name: 'Hunting Methods',
    cree: 'nôcihiwewin',
    description: 'Trapping, snaring, and hunting',
    icon: 'Target',
    wordCount: 16
  }
];

export const words: CreeWord[] = [
  // Kinship Terms
  {
    id: 'nikâwiy',
    cree: 'nikâwiy',
    english: 'my mother',
    category: 'kinship',
    partOfSpeech: 'NDA',
    definition: 'My mother (possessed form)',
    morphology: {
      stem: 'kâwiy',
      inflection: 'ni-',
      wordClass: 'NDA (Dependent Animate Noun)'
    },
    relationships: {
      related: ['nohtâwiy', 'nôhkom', 'nimosôm'],
      broader: ['wîcêwâkan']
    },
    examples: [
      {
        cree: 'nikâwiy kî-pê-itohtêw',
        english: 'My mother came'
      }
    ]
  },
  {
    id: 'nohtâwiy',
    cree: 'nohtâwiy',
    english: 'my father',
    category: 'kinship',
    partOfSpeech: 'NDA',
    definition: 'My father (possessed form)',
    morphology: {
      stem: 'ohtâwiy',
      inflection: 'n-',
      wordClass: 'NDA (Dependent Animate Noun)'
    },
    relationships: {
      related: ['nikâwiy', 'nôhkom', 'nimosôm'],
      broader: ['wîcêwâkan']
    },
    examples: [
      {
        cree: 'nohtâwiy ayamihcikêw',
        english: 'My father is praying'
      }
    ]
  },
  {
    id: 'nôhkom',
    cree: 'nôhkom',
    english: 'my grandmother',
    category: 'kinship',
    partOfSpeech: 'NDA',
    definition: 'My grandmother (possessed form)',
    morphology: {
      stem: 'ôhkom',
      inflection: 'n-',
      wordClass: 'NDA (Dependent Animate Noun)'
    },
    relationships: {
      related: ['nikâwiy', 'nohtâwiy', 'nimosôm'],
      antonyms: ['nimosôm'],
      broader: ['wîcêwâkan']
    }
  },
  {
    id: 'nimosôm',
    cree: 'nimosôm',
    english: 'my grandfather',
    category: 'kinship',
    partOfSpeech: 'NDA',
    definition: 'My grandfather (possessed form)',
    morphology: {
      stem: 'mosôm',
      inflection: 'ni-',
      wordClass: 'NDA (Dependent Animate Noun)'
    },
    relationships: {
      related: ['nikâwiy', 'nohtâwiy', 'nôhkom'],
      antonyms: ['nôhkom'],
      broader: ['wîcêwâkan']
    }
  },

  // Body Parts
  {
    id: 'nistikwân',
    cree: 'nistikwân',
    english: 'my head',
    category: 'body',
    partOfSpeech: 'NDA',
    definition: 'My head (possessed form)',
    morphology: {
      stem: 'istikwân',
      inflection: 'ni-',
      wordClass: 'NDA (Dependent Animate Noun)'
    },
    relationships: {
      related: ['nisit', 'nistikwâniy', 'nitây'],
      broader: ['wîyaw'],
      narrower: ['nisit']
    }
  },
  {
    id: 'nisit',
    cree: 'nisit',
    english: 'my foot',
    category: 'body',
    partOfSpeech: 'NDA',
    definition: 'My foot (possessed form)',
    morphology: {
      stem: 'isit',
      inflection: 'ni-',
      wordClass: 'NDA (Dependent Animate Noun)'
    },
    relationships: {
      related: ['nistikwân', 'niciy'],
      broader: ['wîyaw']
    }
  },
  {
    id: 'niciy',
    cree: 'niciy',
    english: 'my hand',
    category: 'body',
    partOfSpeech: 'NDA',
    definition: 'My hand (possessed form)',
    morphology: {
      stem: 'iciy',
      inflection: 'ni-',
      wordClass: 'NDA (Dependent Animate Noun)'
    },
    relationships: {
      related: ['nisit', 'nistikwân'],
      broader: ['wîyaw']
    }
  },
  {
    id: 'nitây',
    cree: 'nitây',
    english: 'my heart',
    category: 'body',
    partOfSpeech: 'NDA',
    definition: 'My heart (possessed form)',
    morphology: {
      stem: 'itây',
      inflection: 'ni-',
      wordClass: 'NDA (Dependent Animate Noun)'
    },
    relationships: {
      related: ['nistikwân'],
      broader: ['wîyaw']
    }
  },

  // Movement Verbs
  {
    id: 'pimohtêw',
    cree: 'pimohtêw',
    english: 'he/she walks',
    category: 'movement',
    partOfSpeech: 'VAI',
    definition: 'To walk (animate intransitive verb)',
    morphology: {
      stem: 'pimohtê',
      inflection: '-w',
      wordClass: 'VAI (Animate Intransitive Verb)'
    },
    relationships: {
      related: ['pimipayiw', 'pimisiniw', 'pakosêyimihtâw'],
      narrower: ['pakosêyimihtâw'],
      broader: ['pimohtewin']
    },
    examples: [
      {
        cree: 'pimohtêw mêskanâhk',
        english: 'He/she walks on the road'
      }
    ]
  },
  {
    id: 'pimipayiw',
    cree: 'pimipayiw',
    english: 'he/she runs',
    category: 'movement',
    partOfSpeech: 'VAI',
    definition: 'To run (animate intransitive verb)',
    morphology: {
      stem: 'pimipay',
      inflection: '-iw',
      wordClass: 'VAI (Animate Intransitive Verb)'
    },
    relationships: {
      related: ['pimohtêw', 'pimisiniw'],
      broader: ['pimohtewin']
    },
    examples: [
      {
        cree: 'pimipayiw kisikâw-kîsikâw',
        english: 'He/she runs every day'
      }
    ]
  },
  {
    id: 'pimisiniw',
    cree: 'pimisiniw',
    english: 'he/she lies down',
    category: 'movement',
    partOfSpeech: 'VAI',
    definition: 'To lie down, recline (animate intransitive verb)',
    morphology: {
      stem: 'pimisin',
      inflection: '-iw',
      wordClass: 'VAI (Animate Intransitive Verb)'
    },
    relationships: {
      related: ['pimohtêw', 'pimipayiw'],
      broader: ['pimohtewin']
    }
  },

  // Weather Verbs
  {
    id: 'kimiwân',
    cree: 'kimiwân',
    english: 'it rains',
    category: 'weather',
    partOfSpeech: 'VII',
    definition: 'It is raining (inanimate intransitive verb)',
    morphology: {
      stem: 'kimiw',
      inflection: '-ân',
      wordClass: 'VII (Inanimate Intransitive Verb)'
    },
    relationships: {
      related: ['yikwaskwan', 'mistahi-kimiwân', 'piwan'],
      antonyms: ['wâsêskwan', 'pîwan'],
      broader: ['kîsikâw']
    },
    examples: [
      {
        cree: 'kimiwân anohc',
        english: 'It is raining today'
      }
    ]
  },
  {
    id: 'yikwaskwan',
    cree: 'yikwaskwan',
    english: 'it snows',
    category: 'weather',
    partOfSpeech: 'VII',
    definition: 'It is snowing (inanimate intransitive verb)',
    morphology: {
      stem: 'yikwaskw',
      inflection: '-an',
      wordClass: 'VII (Inanimate Intransitive Verb)'
    },
    relationships: {
      related: ['kimiwân', 'piwan'],
      antonyms: ['wâsêskwan'],
      broader: ['kîsikâw']
    }
  },
  {
    id: 'wâsêskwan',
    cree: 'wâsêskwan',
    english: 'it is clear (weather)',
    category: 'weather',
    partOfSpeech: 'VII',
    definition: 'It is clear, sunny (inanimate intransitive verb)',
    morphology: {
      stem: 'wâsêskw',
      inflection: '-an',
      wordClass: 'VII (Inanimate Intransitive Verb)'
    },
    relationships: {
      related: ['pîwan'],
      antonyms: ['kimiwân', 'yikwaskwan'],
      broader: ['kîsikâw']
    }
  },

  // Color Verbs
  {
    id: 'wâpiskisiw',
    cree: 'wâpiskisiw',
    english: 'it is white',
    category: 'color',
    partOfSpeech: 'VAI',
    definition: 'To be white (animate intransitive verb)',
    morphology: {
      stem: 'wâpiskis',
      inflection: '-iw',
      wordClass: 'VAI (Animate Intransitive Verb)'
    },
    relationships: {
      related: ['mihkwâw', 'osâwâw', 'kasîwâw'],
      antonyms: ['kasîwâw'],
      broader: ['wâpiskisiwin']
    }
  },
  {
    id: 'mihkwâw',
    cree: 'mihkwâw',
    english: 'it is red',
    category: 'color',
    partOfSpeech: 'VAI',
    definition: 'To be red (animate intransitive verb)',
    morphology: {
      stem: 'mihkw',
      inflection: '-âw',
      wordClass: 'VAI (Animate Intransitive Verb)'
    },
    relationships: {
      related: ['wâpiskisiw', 'osâwâw', 'kasîwâw'],
      broader: ['wâpiskisiwin']
    }
  },
  {
    id: 'kasîwâw',
    cree: 'kasîwâw',
    english: 'it is black',
    category: 'color',
    partOfSpeech: 'VAI',
    definition: 'To be black (animate intransitive verb)',
    morphology: {
      stem: 'kasîw',
      inflection: '-âw',
      wordClass: 'VAI (Animate Intransitive Verb)'
    },
    relationships: {
      related: ['wâpiskisiw', 'mihkwâw'],
      antonyms: ['wâpiskisiw'],
      broader: ['wâpiskisiwin']
    }
  },

  // Animals
  {
    id: 'atim',
    cree: 'atim',
    english: 'dog',
    category: 'animals',
    partOfSpeech: 'NA',
    definition: 'Dog (animate noun)',
    morphology: {
      stem: 'atim',
      inflection: '',
      wordClass: 'NA (Animate Noun)'
    },
    relationships: {
      related: ['mahihkan', 'wâpos', 'môswa'],
      broader: ['pisiskiwak'],
      narrower: []
    }
  },
  {
    id: 'mahihkan',
    cree: 'mahihkan',
    english: 'wolf',
    category: 'animals',
    partOfSpeech: 'NA',
    definition: 'Wolf (animate noun)',
    morphology: {
      stem: 'mahihkan',
      inflection: '',
      wordClass: 'NA (Animate Noun)'
    },
    relationships: {
      related: ['atim', 'maskwa', 'môswa'],
      broader: ['pisiskiwak']
    }
  },
  {
    id: 'maskwa',
    cree: 'maskwa',
    english: 'bear',
    category: 'animals',
    partOfSpeech: 'NA',
    definition: 'Bear (animate noun)',
    morphology: {
      stem: 'maskwa',
      inflection: '',
      wordClass: 'NA (Animate Noun)'
    },
    relationships: {
      related: ['mahihkan', 'môswa', 'wâpos'],
      broader: ['pisiskiwak']
    }
  },
  {
    id: 'môswa',
    cree: 'môswa',
    english: 'moose',
    category: 'animals',
    partOfSpeech: 'NA',
    definition: 'Moose (animate noun)',
    morphology: {
      stem: 'môswa',
      inflection: '',
      wordClass: 'NA (Animate Noun)'
    },
    relationships: {
      related: ['maskwa', 'mahihkan', 'atim'],
      broader: ['pisiskiwak']
    }
  },
  {
    id: 'wâpos',
    cree: 'wâpos',
    english: 'rabbit',
    category: 'animals',
    partOfSpeech: 'NA',
    definition: 'Rabbit (animate noun)',
    morphology: {
      stem: 'wâpos',
      inflection: '',
      wordClass: 'NA (Animate Noun)'
    },
    relationships: {
      related: ['atim', 'maskwa'],
      broader: ['pisiskiwak']
    }
  },

  // Plants
  {
    id: 'mîtos',
    cree: 'mîtos',
    english: 'tree',
    category: 'plants',
    partOfSpeech: 'NI',
    definition: 'Tree, stick (inanimate noun)',
    morphology: {
      stem: 'mîtos',
      inflection: '',
      wordClass: 'NI (Inanimate Noun)'
    },
    relationships: {
      related: ['maskosiy', 'minâhik'],
      broader: ['maskosiya'],
      narrower: ['mînahik']
    }
  },
  {
    id: 'maskosiy',
    cree: 'maskosiy',
    english: 'grass',
    category: 'plants',
    partOfSpeech: 'NI',
    definition: 'Grass, hay (inanimate noun)',
    morphology: {
      stem: 'maskosiy',
      inflection: '',
      wordClass: 'NI (Inanimate Noun)'
    },
    relationships: {
      related: ['mîtos'],
      broader: ['maskosiya']
    }
  },

  // Hunting Methods
  {
    id: 'nôcihiwewin',
    cree: 'nôcihiwewin',
    english: 'hunting',
    category: 'hunting',
    partOfSpeech: 'NI',
    definition: 'The act of hunting (inanimate noun)',
    morphology: {
      stem: 'nôcihiwewin',
      inflection: '',
      wordClass: 'NI (Inanimate Noun)'
    },
    relationships: {
      narrower: ['âhkwacikêwin', 'pasakwâpiwin']
    }
  },
  {
    id: 'âhkwacikêwin',
    cree: 'âhkwacikêwin',
    english: 'trapping',
    category: 'hunting',
    partOfSpeech: 'NI',
    definition: 'The act of trapping (inanimate noun)',
    morphology: {
      stem: 'âhkwacikêwin',
      inflection: '',
      wordClass: 'NI (Inanimate Noun)'
    },
    relationships: {
      broader: ['nôcihiwewin'],
      related: ['pasakwâpiwin']
    }
  },
  {
    id: 'pasakwâpiwin',
    cree: 'pasakwâpiwin',
    english: 'snaring',
    category: 'hunting',
    partOfSpeech: 'NI',
    definition: 'The act of snaring (inanimate noun)',
    morphology: {
      stem: 'pasakwâpiwin',
      inflection: '',
      wordClass: 'NI (Inanimate Noun)'
    },
    relationships: {
      broader: ['nôcihiwewin'],
      related: ['âhkwacikêwin']
    }
  }
];

// Helper function to get words by category
export function getWordsByCategory(categoryId: string): CreeWord[] {
  return words.filter(word => word.category === categoryId);
}

// Helper function to get related words
export function getRelatedWords(wordId: string): CreeWord[] {
  const word = words.find(w => w.id === wordId);
  if (!word) return [];
  
  const relatedIds = new Set([
    ...(word.relationships.synonyms || []),
    ...(word.relationships.antonyms || []),
    ...(word.relationships.broader || []),
    ...(word.relationships.narrower || []),
    ...(word.relationships.related || [])
  ]);
  
  return words.filter(w => relatedIds.has(w.id));
}

// Helper to get word by ID
export function getWordById(id: string): CreeWord | undefined {
  return words.find(w => w.id === id);
}