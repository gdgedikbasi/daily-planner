
import { describe, it, expect } from "vitest";
import { calculateStats } from "./utils/taskStats";

describe("Görev istatistikleri", () => {
  it("toplam, tamamlanan ve bekleyen görevleri doğru hesaplar", () => {
    const tasks = [
      { id: 1, text: "Kitap oku", done: true },
      { id: 2, text: "Ders çalış", done: false },
      { id: 3, text: "Yürüyüş yap", done: false },
    ];

    expect(calculateStats(tasks)).toEqual({
      total: 3,
      done: 1,
      pending: 2,
      percent: 33,
    });
  });

  it("hiç görev olmadığında bütün değerleri sıfır hesaplar", () => {
    expect(calculateStats([])).toEqual({
      total: 0,
      done: 0,
      pending: 0,
      percent: 0,
    });
  });

  it("bütün görevler tamamlandığında başarı oranını yüzde 100 hesaplar", () => {
    const tasks = [
      { id: 1, text: "Kitap oku", done: true },
      { id: 2, text: "Ders çalış", done: true },
    ];

    expect(calculateStats(tasks)).toEqual({
      total: 2,
      done: 2,
      pending: 0,
      percent: 100,
    });
  });
});
