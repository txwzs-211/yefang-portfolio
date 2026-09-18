#!/usr/bin/env bash
# 第三轮压缩：专门把超 25MB 的文件压到限制以内（为 EdgeOne Pages 准备）

set -u

FFMPEG_BIN="C:/Users/win10/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin"
FF="$FFMPEG_BIN/ffmpeg.exe"

PROJECT="E:/桌面缓存/Personal project/portfolio website-小叶"
ASSETS="$PROJECT/public/assets"
BACKUP="$PROJECT/_original_videos"

mkdir -p "$BACKUP"

# 目标：压到 25MB 以内。用两遍编码 + 目标码率控制，更精确。
# 时长已知：qrsk 411s（需 <= 480kbps），明日世界PV 411s（需 <= 480kbps）
JOBS=(
  "qrsk.mp4|1280|420k|60000|七日世界"
  "明日世界PV.mp4|960|380k|48000|明日世界PV"
)

for job in "${JOBS[@]}"; do
  IFS='|' read -r fname maxw vbr abr note <<< "$job"
  src="$ASSETS/$fname"
  tmp="$ASSETS/${fname%.mp4}.r3.mp4"

  [ -f "$src" ] || { echo "[跳过] $fname 不存在"; continue; }

  before=$(stat -c %s "$src")
  echo ""
  echo "压缩中: $fname  ($(( before / 1024 / 1024 ))MB) — $note  目标 ${vbr}"

  "$FF" -y -hide_banner -loglevel error \
    -i "$src" \
    -vf "scale='if(gt(iw,ih),min(${maxw},iw),-2)':'if(gt(iw,ih),-2,min(${maxw},ih))'" \
    -c:v libx264 -preset slower -b:v "$vbr" -maxrate "$vbr" -bufsize $(( ${vbr%k} * 2 ))k \
    -pix_fmt yuv420p -profile:v high -level 4.2 \
    -c:a aac -b:a "$abr" -ac 2 \
    -movflags +faststart -threads 0 \
    "$tmp" 2>&1 | tail -3

  if [ ! -f "$tmp" ]; then
    echo "  [失败] $fname"
    continue
  fi

  after=$(stat -c %s "$tmp")
  echo "  ✓ $(( before / 1024 / 1024 ))MB -> $(( after / 1024 / 1024 ))MB"

  [ -f "$BACKUP/$fname" ] || cp "$src" "$BACKUP/$fname.bak2" 2>/dev/null
  mv "$tmp" "$src"
done

echo ""
echo "=== 结果 ==="
find "$ASSETS" -type f -size +25M | while read f; do echo "仍超限: $(du -h "$f" | cut -f1)  $(basename "$f")"; done
echo "（无输出 = 全部符合 25MB 限制）"
du -sh "$ASSETS"
