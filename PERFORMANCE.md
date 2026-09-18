# 性能优化报告

## 审查结果

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 视频体积 | ⚠️ 需手动压缩 | 159MB（43MB + 116MB），建议压缩至 40MB 以内 |
| WebGL 动态背景 | ✅ 未使用 | 当前项目无 WebGL，无性能开销 |
| 滚动监听 | ✅ 已优化 | rAF 节流 + passive + 状态去重 |
| GSAP 动画 | ✅ 未使用 | 用 CSS transition + IntersectionObserver，性能更优 |
| 首屏加载 | ✅ 已优化 | 视频延迟初始化 + 渐显 + 懒加载 |

## 已完成的优化

### 1. 视频懒加载
- **Hero 视频**：先加载 metadata，rAF 延迟一帧后再加载完整视频，避免阻塞首屏渲染
- **Featured 视频**：`useVideoLazyLoad` Hook，进入视口前 300px 才开始加载
- **作品卡片视频**：IntersectionObserver 懒加载，进入视口前 400px 才加载
- **Modal 视频**：`preload="metadata"`，打开弹窗才加载

### 2. 滚动监听优化
```js
// 优化前：每次 scroll 都触发 setState
window.addEventListener('scroll', handleScroll)

// 优化后：rAF 节流 + 状态去重
let ticking = false
const handleScroll = () => {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(updateSection)
  }
}
```

### 3. 首屏加载优化
- 视频元素初始 `opacity: 0`，加载完成后渐显至 `0.8`
- 文字内容优先渲染，视频不阻塞首屏
- 非首屏视频全部懒加载

## 待手动优化：视频压缩

当前视频体积过大，严重影响加载速度：

| 文件 | 当前大小 | 建议大小 | 压缩率 |
|------|----------|----------|--------|
| 明日世界PV.mp4 | 43 MB | 10-15 MB | 65-75% |
| chengdu.mp4 | 116 MB | 20-30 MB | 75-85% |
| **总计** | **159 MB** | **30-45 MB** | **70-80%** |

### 压缩方法

运行项目根目录下的 `compress-videos.bat`（需先安装 ffmpeg）：

```bash
# 或手动执行
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k -movflags +faststart output.mp4
```

**参数说明：**
- `-crf 28`：质量因子（23=高质量，28=平衡，32=小体积）
- `-preset slow`：压缩速度越慢，体积越小
- `-movflags +faststart`：将元数据移到文件头，支持流式播放

### 安装 ffmpeg
1. 下载：https://www.gyan.dev/ffmpeg/builds/
2. 解压后将 `bin` 目录添加到系统 PATH
3. 运行 `compress-videos.bat`

## 构建产物

```
dist/index.html          0.49 kB
dist/assets/index.css   14.81 kB (gzip 3.39 kB)
dist/assets/index.js   240.74 kB (gzip 76.82 kB)
```

JS 体积主要来自 React（~140KB gzip），属于正常范围。
