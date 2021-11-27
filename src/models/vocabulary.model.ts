export interface E_VocabCollection {
    id: string;
    title: string;
    description?: string;
    language: string;
    translateLang: string;
    color?: string;
    date: string;
    vocabulary: E_VocabCard[];
}

export interface E_VocabCard {
    id: string;
    word: string;
    pronunciation?: string;
    description?: string;
    translation: string;
    correct: number;
    wrong: number;
}