#!/usr/bin/env python3
"""
把源码中对 public/assets/*.png|jpg 的引用改为 .webp
只在对应的 .webp 文件确实存在时才替换，避免改坏引用。
"""
import re
import sys
from pathlib import Path

PROJECT = Path(r"E:/桌面缓存/Personal project/portfolio website-小叶")
SRC = PROJECT / "src"
ASSETS = PROJECT / "public" / "assets"

# 已生成的 webp 文件名（不含扩展名）
webp_stems = {p.stem for p in ASSETS.glob("*.webp")}

# 匹配 形如 xxx.png / xxx.jpg / xxx.jpeg 的字符串（不带路径分隔符的裸文件名）
pattern = re.compile(r"([A-Za-z0-9_\-\u4e00-\u9fff]+)\.(png|jpg|jpeg)")

changed_files = []
total_repl = 0
skipped = []

for f in list(SRC.rglob("*.jsx")) + list(SRC.rglob("*.js")) + list(SRC.rglob("*.css")):
    text = f.read_text(encoding="utf-8")
    original = text
    count = 0

    def repl(m):
        global count
        stem, ext = m.group(1), m.group(2)
        if stem in webp_stems:
            count += 1
            return f"{stem}.webp"
        skipped.append(f"{f.name}: {m.group(0)}")
        return m.group(0)

    text = pattern.sub(repl, text)

    if text != original:
        f.write_text(text, encoding="utf-8")
        changed_files.append((f.relative_to(PROJECT), count))
        total_repl += count

print("=" * 50)
print("  图片引用替换: png/jpg -> webp")
print("=" * 50)
for path, c in changed_files:
    print(f"  ✓ {path}  ({c} 处)")
print()
print(f"  共修改 {len(changed_files)} 个文件，替换 {total_repl} 处引用")
if skipped:
    print()
    print("  未替换（对应 webp 不存在，保持原样）:")
    for s in sorted(set(skipped)):
        print(f"    - {s}")
