from pathlib import Path
import csv
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
BASE = Path(__file__).resolve().parents[1]
rows = list(csv.DictReader((BASE / "dados/avaliacao-rapida.csv").open()))
categories = {"C": "Atende completamente", "P": "Atende parcialmente", "N": "Não atende", "X": "Não conseguiu avaliar", "SR": "Sem código registrado"}
assert len({r["participante"] for r in rows}) == len(rows)
fig, ax = plt.subplots(figsize=(8, 3.2))
for i, criterion in enumerate(("C1", "C2", "C3", "C4")):
    vals = [r[criterion] for r in rows]
    assert all(v in categories for v in vals)
    left = 0
    for code, color in (("C", "#675182"), ("P", "#be9f51"), ("N", "#b75b57"), ("X", "#6d94ab"), ("SR", "#dedde2")):
        count = vals.count(code)
        pct = count / len(rows) * 100
        if count:
            ax.barh(i, pct, left=left, color=color, edgecolor="white", label=categories[code] if i == 0 else None)
            text = f"{count}/{len(rows)} ({pct:.1f}%)".replace(".", ",")
            ax.text(left + pct/2, i, text, ha="center", va="center", fontsize=10, color="white" if code == "C" else "#222222")
        left += pct
ax.set_yticks(range(4), ["C1 · Controles", "C2 · Clareza", "C3 · Mapeamentos", "C4 · Satisfação"])
ax.invert_yaxis(); ax.set_xlim(0,100)
ax.set_xlabel("Percentual dos três participantes da rodada original")
ax.set_xticks([0, 25, 50, 75, 100], ["0%", "25%", "50%", "75%", "100%"])
ax.spines[["top", "right", "left"]].set_visible(False)
ax.legend(loc="upper center", bbox_to_anchor=(.5,1.23), ncol=2, frameon=False)
fig.tight_layout()
fig.savefig(BASE / "figuras/avaliacao-rapida.pdf", bbox_inches="tight", metadata={"CreationDate": None})
