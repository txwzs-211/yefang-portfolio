#!/usr/bin/env python3
"""
上线前资源完整性检查
扫描源码中所有对 assets/ 下文件的引用，确认文件真实存在。
"""
import re
from pathlib import Path

PROJECT = Path(r"E:/桌面缓存/Personal project/portfolio website-小叶")
SRC = PROJECT / "src"
ASSETS = PROJECT / "public" / "assets"

# 收集源码中引用的文件名
refs = set()
patterns = [
    # assets/xxx.ext 形式
    re.compile(r"assets/([A-Za-z0-9_\-\u4e00-\u9fff]+\.[A-Za-z0-9]+)"),
    # file: 'xxx.ext' / flowImg: 'xxx.ext' 形式
    re.compile(r"(?:file|flowImg|video)\s*:\s*['\"]([A-Za-z0-9_\-\u4e00-\u9fff]+\.[A-Za-z0-9]+)['\"]"),
]

for f in list(SRC.rglob("*.jsx")) + list(SRC.rglob("*.js")):
    text = f.read_text(encoding="utf-8")
    for p in patterns:
        for m in p.finditer(text):
            refs.add(m.group(1))

# 检查存在性
missing = []
present = []
for r in sorted(refs):
    if (ASSETS / r).exists():
        present.append(r)
    else:
        missing.append(r)

# 反向检查：assets 目录下有没有源码完全没用的孤儿文件
used = set(refs)
orphans = []
for f in sorted(ASSETS.iterdir()):
    if f.is_file() and f.suffix in (".mp4", ".webp", ".png", ".jpg", ".jpeg", ".svg", ".pdf"):
        if f.name not in used:
            orphans.append(f.name)

print("=" * 60)
print("  上线前资源完整性检查")
print("=" * 60)
print(f"  源码引用资源: {len(refs)} 个")
print(f"  存在: {len(present)} 个")
print(f"  缺失: {len(missing)} 个")
print()

if missing:
    print("  [警告] 以下引用的文件不存在（会导致页面 404）:")
    for m in missing:
        print(f"    ✗ {m}")
else:
    print("  ✓ 所有引用的资源均存在")

print()
print(f"  assets 目录中未被引用的文件: {len(orphans)} 个")
if orphans:
    for o in orphans[:20]:
        size = (ASSETS / o).stat().st_size / 1024
        print(f"    - {o}  ({size:.0f}KB)")
    if len(orphans) > 20:
        print(f"    ... 还有 {len(orphans) - 20} 个")
