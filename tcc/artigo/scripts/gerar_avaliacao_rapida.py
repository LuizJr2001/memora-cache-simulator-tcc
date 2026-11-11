"""Gera o gráfico de cobertura e respostas da avaliação rápida."""

import csv
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Patch

BASE = Path(__file__).resolve().parents[1]
CRITERIA = {
    "C1": "Controles",
    "C2": "Clareza",
    "C3": "Mapeamentos e parâmetros",
    "C4": "Satisfação",
}
CATEGORIES = {
    "C": ("Atende completamente", "#675182", "white"),
    "P": ("Atende parcialmente", "#caa455", "#222222"),
    "N": ("Não atende", "#a74e50", "white"),
    "X": ("Não conseguiu avaliar", "#6d94ab", "#222222"),
    "SR": ("Sem código registrado", "#e0dce5", "#222222"),
}

with (BASE / "dados/avaliacao-rapida.csv").open(encoding="utf-8", newline="") as data:
    rows = list(csv.DictReader(data))

total = len(rows)
assert total and len({row["participante"] for row in rows}) == total

fig, ax = plt.subplots(figsize=(8.6, 3.1))
observed_codes = set()
for index, criterion in enumerate(CRITERIA):
    codes = [row[criterion] for row in rows]
    assert set(codes) <= CATEGORIES.keys(), f"Código inesperado em {criterion}"
    observed_codes.update(codes)
    left = 0
    for code, (_, color, text_color) in CATEGORIES.items():
        count = codes.count(code)
        if count == 0:
            continue
        percent = count / total * 100
        ax.barh(index, percent, left=left, height=0.7, color=color, edgecolor="white")
        value = f"{count}/{total} ({percent:.1f}%)".replace(".", ",")
        ax.text(left + percent / 2, index, value, ha="center", va="center",
                fontsize=10, color=text_color)
        left += percent

ax.set_yticks(range(len(CRITERIA)), [f"{code} · {label}" for code, label in CRITERIA.items()])
ax.invert_yaxis()
ax.set_xlim(0, 100)
ax.set_xlabel(f"Percentual dos {total} participantes em cada critério")
ax.set_xticks([0, 25, 50, 75, 100], ["0%", "25%", "50%", "75%", "100%"])
ax.spines[["top", "right", "left"]].set_visible(False)
ax.tick_params(axis="y", length=0)
legend = [Patch(facecolor=color, label=label)
          for code, (label, color, _) in CATEGORIES.items() if code in observed_codes]
fig.legend(handles=legend, loc="upper center", ncol=len(legend), frameon=False)
fig.tight_layout(rect=(0, 0, 1, 0.89))
fig.savefig(BASE / "figuras/avaliacao-rapida.pdf", bbox_inches="tight",
            metadata={"CreationDate": None})
