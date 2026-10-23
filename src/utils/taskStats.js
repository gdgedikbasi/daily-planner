
export function calculateStats(tasks) {
  const total = tasks.length;
  const done = tasks.filter((task) => task.done).length;
  const pending = total - done;
  const percent =
    total === 0 ? 0 : Math.round((done / total) * 100);

  return { total, done, pending, percent };
}
