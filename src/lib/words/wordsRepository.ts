import { DEFAULT_CATEGORIES, WORDS_DB_VERSION } from "@/data/defaultWords";
import type { Category, WordsDatabase } from "@/types/words";
import {
  getItem,
  setItem,
  WORDS_STORAGE_KEY,
} from "@/lib/storage/localStorage";

function createDefaultDatabase(): WordsDatabase {
  return {
    categories: DEFAULT_CATEGORIES.map((c) => ({ ...c, isCustom: false })),
    version: WORDS_DB_VERSION,
  };
}

export function loadWordsDatabase(): WordsDatabase {
  const stored = getItem<WordsDatabase>(WORDS_STORAGE_KEY);
  if (!stored?.categories?.length) {
    return createDefaultDatabase();
  }
  return stored;
}

export function saveWordsDatabase(db: WordsDatabase): void {
  setItem(WORDS_STORAGE_KEY, db);
}

export function resetWordsDatabase(): WordsDatabase {
  const db = createDefaultDatabase();
  saveWordsDatabase(db);
  return db;
}

export function getCategoryById(
  db: WordsDatabase,
  categoryId: string
): Category | undefined {
  return db.categories.find((c) => c.id === categoryId);
}

export function addCategory(db: WordsDatabase, name: string): WordsDatabase {
  const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const newCategory: Category = {
    id,
    name: name.trim(),
    words: [],
    isCustom: true,
  };
  const updated = {
    ...db,
    categories: [...db.categories, newCategory],
  };
  saveWordsDatabase(updated);
  return updated;
}

export function deleteCategory(
  db: WordsDatabase,
  categoryId: string
): WordsDatabase {
  const category = getCategoryById(db, categoryId);
  if (!category?.isCustom) return db;
  const updated = {
    ...db,
    categories: db.categories.filter((c) => c.id !== categoryId),
  };
  saveWordsDatabase(updated);
  return updated;
}

export function addWordToCategory(
  db: WordsDatabase,
  categoryId: string,
  word: string
): WordsDatabase {
  const trimmed = word.trim();
  if (!trimmed) return db;
  const updated = {
    ...db,
    categories: db.categories.map((c) =>
      c.id === categoryId && !c.words.includes(trimmed)
        ? { ...c, words: [...c.words, trimmed] }
        : c
    ),
  };
  saveWordsDatabase(updated);
  return updated;
}

export function removeWordFromCategory(
  db: WordsDatabase,
  categoryId: string,
  word: string
): WordsDatabase {
  const updated = {
    ...db,
    categories: db.categories.map((c) =>
      c.id === categoryId
        ? { ...c, words: c.words.filter((w) => w !== word) }
        : c
    ),
  };
  saveWordsDatabase(updated);
  return updated;
}

export function exportWordsDatabase(db: WordsDatabase): string {
  return JSON.stringify(db, null, 2);
}

export function importWordsDatabase(json: string): WordsDatabase | null {
  try {
    const parsed = JSON.parse(json) as WordsDatabase;
    if (!parsed.categories || !Array.isArray(parsed.categories)) return null;
    const valid: WordsDatabase = {
      version: parsed.version ?? WORDS_DB_VERSION,
      categories: parsed.categories
        .filter((c) => c.id && c.name && Array.isArray(c.words))
        .map((c) => ({
          id: c.id,
          name: c.name,
          words: c.words.filter((w) => typeof w === "string" && w.trim()),
          isCustom: c.isCustom ?? true,
        })),
    };
    if (!valid.categories.length) return null;
    saveWordsDatabase(valid);
    return valid;
  } catch {
    return null;
  }
}

export function categoryHasEnoughWords(
  category: Category,
  mode: "classic" | "hardcore"
): boolean {
  if (mode === "classic") return category.words.length >= 1;
  return category.words.length >= 2;
}
