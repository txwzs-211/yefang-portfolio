#!/usr/bin/env bash
# 作品集网站视频压缩脚本（部署前准备）
# 用法: bash scripts/compress-for-web.sh
# 作用: 把 public/assets/*.mp4 压到适合网页播放的体积，原文件备份到 _original_videos/

set -u

FFMPEG_BIN="C:/Users/win10/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin"
FF="$FFMPEG_BIN/ffmpeg.exe"

PROJECT="E:/桌面缓存/Personal project/portfolio website-小叶"
ASSETS="$PROJECT/public/assets"
BACKUP="$PROJECT/_original_videos"

if [ ! -f "$FF" ]; then
  echo "[错误] 找不到 ffmpeg: $FF"
  exit 1
fi

mkdir -p "$BACKUP"

# 压缩方案表: 文件名 | 最大宽度 | CRF | 说明
# CRF 越大体积越小、画质越低。26/27 是网页视频的甜点区间。
JOBS=(
  "qrsk.mp4|1280|27|七日世界-科幻短片"
  "work-08.mp4|1280|27|雾隐迷案-悬疑短片"
  "lhcl.mp4|1280|27|烈火淬炼-AI实拍结合"
  "chengdu.mp4|1280|27|成都-宽幅纪录片"
  "work-09.mp4|1280|26|FPS枪战游戏PV"
  "work-10.mp4|720|26|游戏广告-竖屏"
  "work-07.mp4|1280|26|Phantom Frequency-MV"
  "skill-demo.mp4|1280|27|技能演示"
  "明日世界PV.mp4|960|27|明日世界PV"
)

total_before=0
total_after=0

for job in "${JOBS[@]}"; do
  IFS='|' read -r fname maxw crf note <<< "$job"
  src="$ASSETS/$fname"
  tmp="$ASSETS/${fname%.mp4}.compressed.mp4"

  if [ ! -f "$src" ]; then
    echo "[跳过] $fname 不存在"
    continue
  fi

  before=$(stat -c %s "$src")
  before_mb=$(( before / 1024 / 1024 ))
  echo ""
  echo "=========================================="
  echo "压缩中: $fname  (${before_mb}MB)  — $note"
  echo "  目标宽度 ${maxw}px / CRF ${crf}"
  echo "=========================================="

  # scale: 若原宽 > maxw 则等比缩放到 maxw，否则保持不变。
  # 加 -2 保证高度是偶数（H.264 硬性要求）。
  # 竖屏视频（宽 < 高）按高度限制处理。
  "$FF" -y -hide_banner -loglevel error -stats \
    -i "$src" \
    -vf "scale='if(gt(iw,ih),min(${maxw},iw),-2)':'if(gt(iw,ih),-2,min(${maxw},ih))'" \
    -c:v libx264 -preset medium -crf "$crf" -pix_fmt yuv420p \
    -profile:v high -level 4.2 \
    -c:a aac -b:a 128k -ac 2 \
    -movflags +faststart \
    -threads 0 \
    "$tmp" 2>&1 | tail -3

  if [ ! -f "$tmp" ]; then
    echo "[失败] $fname 压缩未产出文件"
    continue
  fi

  after=$(stat -c %s "$tmp")
  after_mb=$(( after / 1024 / 1024 ))
  total_before=$(( total_before + before ))
  total_after=$(( total_after + after ))

  # 备份原文件后替换
  if [ ! -f "$BACKUP/$fname" ]; then
    mv "$src" "$BACKUP/$fname"
  else
    rm -f "$src"
  fi
  mv "$tmp" "$src"

  echo "  ✓ 完成: ${before_mb}MB -> ${after_mb}MB"
done

echo ""
echo "=========================================="
echo "  压缩完成"
echo "=========================================="
echo "  压缩前合计: $(( total_before / 1024 / 1024 ))MB"
echo "  压缩后合计: $(( total_after / 1024 / 1024 ))MB"
echo "  原文件备份: _original_videos/"
echo ""
echo "当前 public/assets 总大小:"
du -sh "$ASSETS"
