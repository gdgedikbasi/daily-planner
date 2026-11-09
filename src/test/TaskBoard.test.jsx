import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskBoard from "../components/TaskBoard";

describe("TaskBoard görev işlemleri", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // 1. Görev ekleme testi
  it("yeni bir görev ekler", async () => {
    const user = userEvent.setup();

    render(<TaskBoard selectedDate="2026-11-03" />);

    const inputs = screen.getAllByRole("textbox");
    const taskInput = inputs[1];

    await user.type(taskInput, "Kitap oku");
    await user.click(screen.getByRole("button", { name: "Ekle" }));

    expect(screen.getByText("Kitap oku")).toBeInTheDocument();

    const savedTasks = JSON.parse(
      localStorage.getItem("tasksByDate")
    );

    expect(savedTasks["2026-11-03"]).toHaveLength(1);
    expect(savedTasks["2026-11-03"][0].text).toBe("Kitap oku");
  });

  // 2. Görev tamamlama testi
  it("bir görevi tamamlandı olarak işaretler", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      "tasksByDate",
      JSON.stringify({
        "2026-11-03": [
          {
            id: 1,
            text: "Kitap oku",
            done: false,
            priority: "medium",
            pinned: false,
          },
        ],
      })
    );

    render(<TaskBoard selectedDate="2026-11-03" />);

    const taskText = screen.getByText("Kitap oku");
    const completeButton = taskText.parentElement.previousSibling;

    await user.click(completeButton);

    const savedTasks = JSON.parse(
      localStorage.getItem("tasksByDate")
    );

    expect(savedTasks["2026-11-03"][0].done).toBe(true);
  });

  // 3. Görev silme testi
  it("bir görevi siler", async () => {
    const user = userEvent.setup();

    localStorage.setItem(
      "tasksByDate",
      JSON.stringify({
        "2026-11-03": [
          {
            id: 1,
            text: "Kitap oku",
            done: false,
            priority: "medium",
            pinned: false,
          },
        ],
      })
    );

    render(<TaskBoard selectedDate="2026-11-03" />);

    expect(screen.getByText("Kitap oku")).toBeInTheDocument();

    await user.click(screen.getByTestId("delete-task"));

    expect(screen.queryByText("Kitap oku")).not.toBeInTheDocument();

    const savedTasks = JSON.parse(
      localStorage.getItem("tasksByDate")
    );

    expect(savedTasks["2026-11-03"]).toHaveLength(0);
  });

  //4. Görev Sabitleme Testi
  it("Bir görevi sabitler",async()=>{
    const user=userEvent.setup();
    const today = new Date().toISOString().split("T")[0];

    localStorage.setItem(
      "tasksByDate",
      JSON.stringify({
        [today]:[
          {
            id:1,
            text:"Kitap oku",
            done:false,
            priority:"medium",
            pinned:false,
          },
        ],
      })
    );

    render(<TaskBoard selectedDate={today} />);

    await user.click(screen.getByTestId("pin-task"));

    const savedTasks = JSON.parse(
      localStorage.getItem("tasksByDate")
    );

    expect(savedTasks[today][0].pinned).toBe(true);
  })
});