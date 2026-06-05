export interface Category {
  id: string;
  name: string;
  words: string[];
  isCustom?: boolean;
}

export interface WordsDatabase {
  categories: Category[];
  version: number;
}
