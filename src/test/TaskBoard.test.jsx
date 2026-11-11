
import { useEffect, useState } from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskBoard from "../components/TaskBoard";

// DashboardLayout bileşeninin görev yönetimini test ortamında taklit ediyoruz.
function TestWrapper({ selectedDate, initialTasks = {} }) {
  const [allTasks, setAllTasks] = useState(initialTasks);

  useEffect(() => {
    localStorage.setItem("tasksByDate", JSON.stringify(allTasks));
  }, [allTasks]);

  return (
    <TaskBoard
      selectedDate={selectedDate}
      allTasks={allTasks}
      setAllTasks={setAllTasks}
    />
  );
}

describe("TaskBoard görev işlemleri", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // 1. Görev ekleme testi
  it("yeni bir görev ekler", async () => {
    const user = userEvent.setup();

    render(<TestWrapper selectedDate="2026-11-03" />);

    const inputs = screen.getAllByRole("textbox");
    const taskInput = inputs[1];

    await user.type(taskInput, "Kitap oku");
    await user.click(screen.getByRole("button", { name: "Ekle" }));

    expect(screen.getByText("Kitap oku")).toBeInTheDocument();

    await waitFor(() => {
      const savedTasks = JSON.parse(localStorage.getItem("tasksByDate"));
      expect(savedTasks["2026-11-03"]).toHaveLength(1);
      expect(savedTasks["2026-11-03"][0].text).toBe("Kitap oku");
    });
  });

  // 2. Görev tamamlama testi
  it("bir görevi tamamlandı olarak işaretler", async () => {
    const user = userEvent.setup();

    const initialTasks = {
      "2026-11-03": [
        {
          id: 1,
          text: "Kitap oku",
          done: false,
          priority: "medium",
          pinned: false,
        },
      ],
    };

    render(
      <TestWrapper
        selectedDate="2026-11-03"
        initialTasks={initialTasks}
      />
    );

    const taskText = screen.getByText("Kitap oku");
    const completeButton = taskText.parentElement.previousSibling;

    await user.click(completeButton);

    await waitFor(() => {
      const savedTasks = JSON.parse(localStorage.getItem("tasksByDate"));
      expect(savedTasks["2026-11-03"][0].done).toBe(true);
    });
  });

  // 3. Görev silme testi
  it("bir görevi siler", async () => {
    const user = userEvent.setup();

    const initialTasks = {
      "2026-11-03": [
        {
          id: 1,
          text: "Kitap oku",
          done: false,
          priority: "medium",
          pinned: false,
        },
      ],
    };

    render(
      <TestWrapper
        selectedDate="2026-11-03"
        initialTasks={initialTasks}
      />
    );

    expect(screen.getByText("Kitap oku")).toBeInTheDocument();

    await user.click(screen.getByTestId("delete-task"));

    expect(screen.queryByText("Kitap oku")).not.toBeInTheDocument();

    await waitFor(() => {
      const savedTasks = JSON.parse(localStorage.getItem("tasksByDate"));
      expect(savedTasks["2026-11-03"]).toHaveLength(0);
    });
  });

  // 4. Görev sabitleme testi
  it("bir görevi sabitler", async () => {
    const user = userEvent.setup();
    const today = "2026-11-11";

    const initialTasks = {
      [today]: [
        {
          id: 1,
          text: "Kitap oku",
          done: false,
          priority: "medium",
          pinned: false,
        },
      ],
    };

    render(
      <TestWrapper
        selectedDate={today}
        initialTasks={initialTasks}
      />
    );

    await user.click(screen.getByTestId("pin-task"));

    await waitFor(() => {
      const savedTasks = JSON.parse(localStorage.getItem("tasksByDate"));
      expect(savedTasks[today][0].pinned).toBe(true);
    });
  });
});
