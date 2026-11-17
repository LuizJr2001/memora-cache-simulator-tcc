"""Visualiza a síntese documental de T1-T4; não atribui notas de aprendizagem."""

import csv
from pathlib import Path
from collections import Counter

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Patch

BASE = Path(__file__).resolve().parents[1]
CATEGORIES = {
    'C': ('Conclusão registrada', '#675182', 'white'),
    'R': ('Conclusão com ressalva', '#eacb84', '#30261a'),
    'I': ('Registro insuficiente', '#e0e3e8', '#303842'),
}
TASKS = ['T1', 'T2', 'T3', 'T4']
PEOPLE = [f'P{i:02}' for i in range(1, 8)]
with (BASE/'dados/conclusao-tarefas.csv').open(encoding='utf-8', newline='') as f:
    rows = list(csv.DictReader(f))
matrix = {(r['participante'], r['tarefa']): r['indicador'] for r in rows}
assert len(rows) == len(matrix) == 28
assert set(matrix) == {(p, t) for p in PEOPLE for t in TASKS}
assert set(matrix.values()) <= set(CATEGORIES)
assert all(r['evidencia'].strip() and int(r['pagina_ficha']) > 0 for r in rows)

plt.rcParams.update({'font.family':'DejaVu Sans','pdf.fonttype':42,'ps.fonttype':42})
fig, ax = plt.subplots(figsize=(7.3, 3.6))
for y, person in enumerate(PEOPLE):
    for x, task in enumerate(TASKS):
        code = matrix[person, task]
        _, color, foreground = CATEGORIES[code]
        ax.add_patch(Rectangle((x-.46, y-.42), .92, .84,
                               facecolor=color, edgecolor='white', linewidth=1))
        ax.text(x, y, code, ha='center', va='center', fontsize=12,
                fontweight='bold', color=foreground)
ax.set_xlim(-.5, 3.5)
ax.set_ylim(6.5, -.5)
ax.set_xticks(range(4), ['T1\nConfiguração e ajuda', 'T2\nExecução e histórico',
                          'T3\nMudança de mapeamento', 'T4\nDivisão do endereço'], fontsize=9)
ax.xaxis.tick_top()
ax.set_yticks(range(7), PEOPLE, fontsize=10)
ax.tick_params(axis='both', length=0, pad=7)
ax.spines[:].set_visible(False)
fig.legend(handles=[Patch(facecolor=c, label=f'{k}: {label}')
                    for k, (label, c, _) in CATEGORIES.items()],
           loc='lower center', bbox_to_anchor=(.5, -.005),
           ncol=3, frameon=False, fontsize=8.5)
fig.subplots_adjust(left=.09, right=.99, bottom=.12, top=.83)
fig.savefig(BASE/'figuras/conclusao-tarefas.pdf', bbox_inches='tight',
            metadata={'CreationDate':None,'ModDate':None})
plt.close(fig)
for task in TASKS:
    print(task, dict(Counter(matrix[p, task] for p in PEOPLE)))
