"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import type { Category, WordsDatabase } from "@/types/words";
import {
  addCategory,
  addWordToCategory,
  deleteCategory,
  exportWordsDatabase,
  importWordsDatabase,
  loadWordsDatabase,
  removeWordFromCategory,
  resetWordsDatabase,
} from "@/lib/words/wordsRepository";

export default function WordsPage() {
  const [db, setDb] = useState<WordsDatabase>(() => loadWordsDatabase());
  const [selectedId, setSelectedId] = useState<string>(
    () => loadWordsDatabase().categories[0]?.id ?? ""
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newWord, setNewWord] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selected = db.categories.find((c) => c.id === selectedId);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const updated = addCategory(db, newCategoryName);
    setDb(updated);
    setSelectedId(updated.categories[updated.categories.length - 1].id);
    setNewCategoryName("");
    showMessage("Категория добавлена");
  };

  const handleDeleteCategory = (cat: Category) => {
    if (!cat.isCustom) return;
    if (!confirm(`Удалить категорию «${cat.name}»?`)) return;
    const updated = deleteCategory(db, cat.id);
    setDb(updated);
    setSelectedId(updated.categories[0]?.id ?? "");
    showMessage("Категория удалена");
  };

  const handleAddWord = () => {
    if (!selected || !newWord.trim()) return;
    const updated = addWordToCategory(db, selected.id, newWord);
    setDb(updated);
    setNewWord("");
    showMessage("Слово добавлено");
  };

  const handleRemoveWord = (word: string) => {
    if (!selected) return;
    const updated = removeWordFromCategory(db, selected.id, word);
    setDb(updated);
  };

  const handleReset = () => {
    if (!confirm("Сбросить базу слов к стандартной? Ваши категории будут удалены."))
      return;
    const updated = resetWordsDatabase();
    setDb(updated);
    setSelectedId(updated.categories[0]?.id ?? "");
    showMessage("База сброшена");
  };

  const handleExport = () => {
    const json = exportWordsDatabase(db);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spy-game-words.json";
    a.click();
    URL.revokeObjectURL(url);
    showMessage("Файл экспортирован");
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = importWordsDatabase(reader.result as string);
      if (result) {
        setDb(result);
        setSelectedId(result.categories[0]?.id ?? "");
        showMessage("База импортирована");
      } else {
        showMessage("Ошибка импорта — проверьте файл");
      }
    };
    reader.readAsText(file);
  };

  return (
    <PageContainer
      title="База слов"
      subtitle="Просматривайте и редактируйте категории. Изменения сохраняются автоматически."
      backHref="/"
    >
      {message && (
        <div className="rounded-2xl bg-indigo-500/20 border border-indigo-500/30 px-4 py-3 text-indigo-200 text-sm text-center">
          {message}
        </div>
      )}

      {db.categories.length === 0 ? (
        <Card className="text-center space-y-4" padding="lg">
          <p className="text-slate-400">База слов пуста</p>
          <Button onClick={handleReset}>Загрузить стандартную базу</Button>
        </Card>
      ) : (
        <>
          <Card className="space-y-3">
            <label className="text-sm font-medium text-slate-300">
              Категория
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full rounded-2xl border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
            >
              {db.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.words.length})
                  {c.isCustom ? " ★" : ""}
                </option>
              ))}
            </select>

            {selected && (
              <div className="flex gap-2">
                {selected.isCustom && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteCategory(selected)}
                  >
                    Удалить категорию
                  </Button>
                )}
                <span className="text-xs text-slate-500 self-center ml-auto">
                  {selected.words.length} слов
                  {selected.words.length < 2 && " — мало для хардкора"}
                </span>
              </div>
            )}
          </Card>

          {selected && (
            <Card className="space-y-3">
              <h2 className="text-sm font-medium text-slate-300">
                Слова в «{selected.name}»
              </h2>
              {selected.words.length === 0 ? (
                <p className="text-slate-500 text-sm py-4 text-center">
                  Нет слов — добавьте первое
                </p>
              ) : (
                <ul className="space-y-1 max-h-52 overflow-y-auto">
                  {selected.words.map((word) => (
                    <li
                      key={word}
                      className="flex items-center justify-between rounded-xl bg-slate-800/60 px-4 py-2.5"
                    >
                      <span className="text-white">{word}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveWord(word)}
                        className="text-red-400 hover:text-red-300 text-sm px-2 py-1"
                        aria-label={`Удалить ${word}`}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Новое слово"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddWord()}
                  className="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                  maxLength={50}
                />
                <Button onClick={handleAddWord} disabled={!newWord.trim()}>
                  +
                </Button>
              </div>
            </Card>
          )}
        </>
      )}

      <Card className="space-y-3">
        <h2 className="text-sm font-medium text-slate-300">Новая категория</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Название категории"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            className="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            maxLength={40}
          />
          <Button
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim()}
          >
            Создать
          </Button>
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-sm font-medium text-slate-300">
          Экспорт / импорт
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={handleExport}>
            Экспорт JSON
          </Button>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Импорт JSON
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImport(file);
            e.target.value = "";
          }}
        />
      </Card>

      <Button variant="ghost" fullWidth onClick={handleReset}>
        Сбросить к стандартной базе
      </Button>
    </PageContainer>
  );
}
