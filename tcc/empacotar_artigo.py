"""Sincroniza o pacote Overleaf com os fontes versionados de tcc/artigo/."""

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo


def main():
    base = Path(__file__).resolve().parent
    source = base / "artigo"
    output = base / "tcc-atual.zip"
    extensions = {".tex", ".bib", ".md", ".txt", ".png", ".jpg", ".jpeg", ".svg"}
    files = [
        path
        for path in sorted(source.rglob("*"))
        if path.is_file()
        and (
            path.suffix.lower() in extensions
            or (path.suffix.lower() == ".pdf" and path.parent.name == "figuras")
        )
    ]
    with ZipFile(output, "w", compression=ZIP_DEFLATED) as bundle:
        for path in files:
            entry = ZipInfo(path.relative_to(source).as_posix(), (2026, 10, 23, 0, 0, 0))
            entry.compress_type = ZIP_DEFLATED
            entry.external_attr = 0o644 << 16
            bundle.writestr(entry, path.read_bytes())
    print(f"Pacote sincronizado: {output.relative_to(base.parent)} ({len(files)} arquivos)")


if __name__ == "__main__":
    main()
