"""Gera o gráfico dos tempos anotados nas tarefas, para as sete entrevistas individuais de um único ciclo."""

import csv
from pathlib import Path

import matplotlib
import numpy as np

matplotlib.use("Agg")
import matplotlib.pyplot as plt

BASE = Path(__file__).resolve().parents[1]
COLORS = ["#675182", "#3d7e8d", "#bb8b3d", "#8b969e"]

with (BASE / "dados/tempos-tarefas.csv").open(encoding="utf-8", newline="") as data:
    rows = list(csv.DictReader(data))

assert len(rows) == 7
plt.rcParams.update({"pdf.fonttype": 42, "font.family": "DejaVu Sans"})
fig, ax = plt.subplots(figsize=(8.6, 3.3))
x = np.arange(len(rows))
for index, color in enumerate(COLORS):
    task = f"T{index + 1}"
    times = [float(row[f"{task}_s"]) if row[f"{task}_s"] else np.nan for row in rows]
    positions = x + (index - 1.5) * 0.19
    bars = ax.bar(positions, times, 0.18, label=task, color=color)
    for row, bar, position, time in zip(rows, bars, positions, times):
        if np.isnan(time):
            ax.text(position, 6, "SR", ha="center", fontsize=8, rotation=90)
        elif task == "T4" and row["participante"] == "P02":
            bar.set_hatch("///")
            ax.text(position, time + 4, "*", ha="center", fontsize=11)

ax.set_xticks(x, [row["participante"] for row in rows])
ax.spines[["top", "right"]].set_visible(False)
ax.set_ylim(bottom=0)
ax.grid(axis="y", alpha=0.15)
ax.set_axisbelow(True)
ax.set_ylabel("Tempo anotado (segundos)")
ax.legend(loc="upper center", ncol=len(COLORS), frameon=False, bbox_to_anchor=(0.5, 1.2))
fig.text(0.5, 0.025, "SR: sem registro. * Execução de T4 de P02 parcialmente documentada.",
         ha="center", fontsize=9)
fig.tight_layout(rect=(0, 0.08, 1, 0.98))
fig.savefig(BASE / "figuras/tempos-tarefas.pdf", bbox_inches="tight",
            metadata={"CreationDate": None})
