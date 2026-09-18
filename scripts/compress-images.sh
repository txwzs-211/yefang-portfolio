#!/usr/bin/env bash
# 作品集网站图片压缩脚本（部署前准备）
# 用法: bash scripts/compress-images.sh
# 作用: 把 public/assets/*.png|jpg 转成 WebP（质量 82），原图备份到 _original_images/
#       WebP 在保持视觉无损的前提下，体积通常只有 PNG 的 10~25%。

set -u

FFMPEG_BIN="C:/Users/win10/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin"
FF="$FFMPEG_BIN/ffmpeg.exe"

PROJECT="E:/桌面缓存/Personal project/portfolio website-小叶"
ASSETS="$PROJECT/public/assets"
BACKUP="$PROJECT/_original_images"

if [ ! -f "$FF" ]; then
  echo "[错误] 找不到 ffmpeg: $FF"
  exit 1
fi

mkdir -p "$BACKUP"

total_before=0
total_after=0
count=0
skipped=0

# 遍历所有 png / jpg / jpeg（不递归，资产都在这一层）
for src in "$ASSETS"/*.png "$ASSETS"/*.jpg "$ASSETS"/*.jpeg; do
  [ -f "$src" ] || continue

  base=$(basename "$src")
  name="${base%.*}"
  ext="${base##*.}"
  out="$ASSETS/${name}.webp"

  # 已存在同名 webp 就跳过
  if [ -f "$out" ]; then
    skipped=$(( skipped + 1 ))
    continue
  fi

  before=$(stat -c %s "$src")
  before_kb=$(( before / 1024 ))

  # 超过 1MB 的图片限制最长边 2000px（网页上肉眼无差别，体积减半）
  if [ "$before" -gt 1048576 ]; then
    scale="-vf scale='if(gt(iw,ih),min(2000,iw),-2)':'if(gt(iw,ih),-2,min(2000,ih))'"
  else
    scale="-vf scale='if(gt(iw,ih),min(1600,iw),-2)':'if(gt(iw,ih),-2,min(1600,ih))'"
  fi

  "$FF" -y -hide_banner -loglevel error \
    -i "$src" \
    $scale \
    -c:v libwebp -quality 82 -compression_level 6 \
    "$out" 2>&1 | tail -2

  if [ ! -f "$out" ]; then
    echo "[失败] $base"
    continue
  fi

  after=$(stat -c %s "$out")
  after_kb=$(( after / 1024 ))
  total_before=$(( total_before + before ))
  total_after=$(( total_after + after ))
  count=$(( count + 1 ))

  pct=0
  [ "$before" -gt 0 ] && pct=$(( 100 - after * 100 / before ))
  echo "  ✓ $base  ${before_kb}KB -> ${after_kb}KB  (-${pct}%)"

  # 原图移入备份目录
  mv "$src" "$BACKUP/$base"
done

echo ""
echo "=========================================="
echo "  图片压缩完成"
echo "=========================================="
echo "  处理: ${count} 张，跳过(已存在): ${skipped} 张"
if [ "$total_before" -gt 0 ]; then
  echo "  合计: $(( total_before / 1024 / 1024 ))MB -> $(( total_after / 1024 / 1024 ))MB"
  echo "  节省: $(( 100 - total_after * 100 / total_before ))%"
fi
echo "  原图备份: _original_images/"
echo ""
echo "public/assets 当前总大小:"
du -sh "$ASSETS"
