"""Gera o gráfico dos tempos anotados nas tarefas, por grupo de sessões."""

import csv
from pathlib import Path

import matplotlib
import numpy as np

matplotlib.use("Agg")
import matplotlib.pyplot as plt

BASE = Path(__file__).resolve().parents[1]
GROUPS = {"original": "Rodada original", "complementar": "Sessões complementares"}
COLORS = ["#675182", "#3d7e8d", "#bb8b3d", "#8b969e"]

with (BASE / "dados/tempos-tarefas.csv").open(encoding="utf-8", newline="") as data:
    rows = list(csv.DictReader(data))

groups = {group: [row for row in rows if row["rodada"] == group] for group in GROUPS}
fig, axes = plt.subplots(1, len(groups), figsize=(9, 3.5), sharey=True,
                         gridspec_kw={"width_ratios": [len(group) for group in groups.values()]})

for ax, (group, subset) in zip(axes, groups.items()):
    x = np.arange(len(subset))
    for index, color in enumerate(COLORS):
        task = f"T{index + 1}"
        times = [float(row[f"{task}_s"]) if row[f"{task}_s"] else np.nan for row in subset]
        positions = x + (index - 1.5) * 0.19
        bars = ax.bar(positions, times, 0.18, label=task, color=color)
        for row, bar, position, time in zip(subset, bars, positions, times):
            if np.isnan(time):
                ax.text(position, 6, "SR", ha="center", fontsize=8, rotation=90)
            elif task == "T4" and row["participante"] == "P02":
                bar.set_hatch("///")
                ax.text(position, time + 4, "*", ha="center", fontsize=11)

    ax.set_xticks(x, [row["participante"] for row in subset])
    ax.set_title(GROUPS[group], fontsize=11)
    ax.spines[["top", "right"]].set_visible(False)
    ax.set_ylim(bottom=0)
    ax.grid(axis="y", alpha=0.15)
    ax.set_axisbelow(True)

axes[0].set_ylabel("Tempo anotado (segundos)")
handles, labels = axes[0].get_legend_handles_labels()
fig.legend(handles, labels, loc="upper center", ncol=len(COLORS), frameon=False)
fig.text(0.5, 0.025, "SR: sem registro. * Execução de T4 de P02 parcialmente documentada.",
         ha="center", fontsize=9)
fig.tight_layout(rect=(0, 0.08, 1, 0.9))
fig.savefig(BASE / "figuras/tempos-tarefas.pdf", bbox_inches="tight",
            metadata={"CreationDate": None})
