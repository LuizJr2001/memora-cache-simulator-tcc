const phases = ['decompose', 'search', 'result', 'select', 'update', 'complete'];
const titles = ['Decompor endereço', 'Consultar a cache', 'Identificar acerto ou falta', 'Escolher a linha', 'Atualizar a cache', 'Contabilizar o acesso'];

/** Explicações derivadas dos snapshots, sem executar ou alterar a simulação. */
export function explainSimulationAccess(access, configuration, layout, history, format = 'decimal') {
  if (!access) return null;
  const d = access.decomposition;
  const number = (value, width = layout.addressBits) => format === 'binary'
    ? value.toString(2).padStart(Math.max(1, width), '0') : String(value);
  const range = line => `${number(line.blockStart)}–${number(line.blockEnd)}`;
  const location = configuration.mapping === 'direct' ? 'linha' : 'conjunto';
  const place = `${location} ${number(d.set, layout.indexBits)}`;
  const lines = access.before.cache.filter(line => line.set === d.set);
  const first = !history.some(previous => previous.number < access.number && previous.decomposition.block === d.block);
  const found = lines.find(line => line.tag === d.tag && line.valid);
  const binary = [[d.tag, layout.tagBits, 'Tag'], [d.set, layout.indexBits, configuration.mapping === 'direct' ? 'Linha' : 'Conjunto'], [d.offset, layout.offsetBits, 'Deslocamento']]
    .filter(([, width]) => width > 0).map(([value, width, label]) => ({ label, value: value.toString(2).padStart(width, '0'), width }));
  const comparison = lines.length ? lines.slice(0, 8).map(line =>
    `via ${line.way + 1}: V=${Number(line.valid)}, tag ${number(line.tag, layout.tagBits)} ${line.tag === d.tag ? '=' : '≠'} ${number(d.tag, layout.tagBits)}`).join('; ') +
    (lines.length > 8 ? `; mais ${lines.length - 8} vias consultadas` : '') : 'Nenhuma linha válida neste local';
  const result = access.result === 'hit'
    ? `ACERTO: V=1 e a tag coincide na via ${(found?.way ?? access.foundWay) + 1}. O endereço pertence ao bloco ${range(d)}.`
    : access.result === 'miss'
      ? `${first ? 'FALTA compulsória: primeiro acesso a este bloco' : 'FALTA: o bloco já foi acessado, mas não está mais na cache'}. Nenhuma tag válida coincide em ${place}.`
      : 'O resultado será definido após a comparação de tags e bits de validade.';
  let selection = 'A linha será escolhida depois de identificar o resultado.';
  if (access.way !== null) {
    if (access.reason === 'hit') selection = `Mantém a via ${access.way + 1}; o bloco já está na cache.`;
    else if (!access.lineBefore) selection = `A via ${access.way + 1} está livre (V=0). Carrega o bloco ${range(d)} sem remover outro bloco.`;
    else {
      const rule = access.reason === 'direct' ? 'Mapeamento direto: esta é a única linha possível'
        : access.reason === 'LRU' ? 'LRU: escolhe o bloco usado há mais tempo'
          : access.reason === 'FIFO' ? 'FIFO: escolhe o bloco carregado há mais tempo'
            : 'Random: escolhe uma via aleatoriamente';
      selection = `${rule}. Substitui o bloco ${range(access.lineBefore)} da via ${access.way + 1} pelo bloco ${range(d)}.`;
    }
  }
  const update = access.result === 'hit'
    ? `Preserva o bloco e a ordem de chegada; atualiza a recência da via ${(access.way ?? access.foundWay) + 1}.`
    : `Grava a tag ${number(d.tag, layout.tagBits)} e o bloco ${range(d)}; define V=1 e atualiza a recência e a ordem de chegada.`;
  const bodies = [
    `Endereço ${number(access.address)}: bloco ${d.block}, ${place}, tag ${number(d.tag, layout.tagBits)} e deslocamento ${number(d.offset, layout.offsetBits)}.`,
    `${comparison}. A consulta verifica V=1 e igualdade da tag.`,
    result, selection, update,
    `Contabiliza um ${access.result === 'hit' ? 'acerto' : 'falta'} somente após terminar o acesso; as estatísticas não contam etapas intermediárias.`,
  ];
  const summary = !access.result ? 'Lendo o endereço e consultando a cache'
    : access.result === 'hit' ? `ACERTO: V=1 e tag coincidente; bloco ${range(d)} em ${place}.`
      : `${first ? 'Falta compulsória. ' : 'Falta: bloco ausente. '}${access.way === null ? `Nenhuma tag coincide em ${place}.` : selection}`;
  return { binary, summary, steps: phases.map((phase, index) => ({ phase, title: titles[index], body: bodies[index] })) };
}
