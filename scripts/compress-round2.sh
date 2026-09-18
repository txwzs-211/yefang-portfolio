#!/usr/bin/env bash
# 第二轮压缩：处理第一轮未覆盖的视频
# 用法: bash scripts/compress-round2.sh

set -u

FFMPEG_BIN="C:/Users/win10/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin"
FF="$FFMPEG_BIN/ffmpeg.exe"

PROJECT="E:/桌面缓存/Personal project/portfolio website-小叶"
ASSETS="$PROJECT/public/assets"
BACKUP="$PROJECT/_original_videos"

mkdir -p "$BACKUP"

# 文件名 | 最大宽度 | CRF | 说明
JOBS=(
  "qrsk.mp4|1280|29|七日世界-411秒长片，二次压缩"
  "明日世界PV.mp4|960|29|明日世界PV-二次压缩"
  "work-04.mp4|1280|27|作品四"
  "work-06.mp4|1280|27|作品六"
  "work-01.mp4|1280|27|雪的记忆"
  "work-05.mp4|1280|27|末日社区"
  "work-03.mp4|1280|27|武僧打斗"
)

total_before=0
total_after=0

for job in "${JOBS[@]}"; do
  IFS='|' read -r fname maxw crf note <<< "$job"
  src="$ASSETS/$fname"
  tmp="$ASSETS/${fname%.mp4}.round2.mp4"

  if [ ! -f "$src" ]; then
    echo "[跳过] $fname 不存在"
    continue
  fi

  before=$(stat -c %s "$src")
  before_mb=$(( before / 1024 / 1024 ))
  echo ""
  echo "压缩中: $fname (${before_mb}MB) — $note"

  "$FF" -y -hide_banner -loglevel error \
    -i "$src" \
    -vf "scale='if(gt(iw,ih),min(${maxw},iw),-2)':'if(gt(iw,ih),-2,min(${maxw},ih))'" \
    -c:v libx264 -preset medium -crf "$crf" -pix_fmt yuv420p \
    -profile:v high -level 4.2 \
    -c:a aac -b:a 128k -ac 2 \
    -movflags +faststart -threads 0 \
    "$tmp" 2>&1 | tail -2

  if [ ! -f "$tmp" ]; then
    echo "  [失败] $fname"
    continue
  fi

  after=$(stat -c %s "$tmp")
  after_mb=$(( after / 1024 / 1024 ))
  total_before=$(( total_before + before ))
  total_after=$(( total_after + after ))

  # 第一轮的原文件已在备份里，则直接覆盖；否则备份
  if [ -f "$BACKUP/$fname" ]; then
    rm -f "$src"
  else
    mv "$src" "$BACKUP/$fname"
  fi
  mv "$tmp" "$src"

  echo "  ✓ ${before_mb}MB -> ${after_mb}MB"
done

echo ""
echo "第二轮压缩前: $(( total_before / 1024 / 1024 ))MB -> 压缩后: $(( total_after / 1024 / 1024 ))MB"
echo "public/assets 总大小:"
du -sh "$ASSETS"
