@echo off
chcp 65001 >nul
setlocal
title 推送到 GitHub

cd /d "%~dp0.."

echo ==========================================
echo   推送到 GitHub
echo ==========================================
echo.

REM 如果还没设置远程仓库，提示用户
git remote get-url origin >nul 2>nul
if errorlevel 1 (
    echo [提示] 尚未配置远程仓库地址
    echo.
    echo 请先创建 GitHub 仓库，然后执行：
    echo   git remote add origin https://github.com/你的用户名/仓库名.git
    echo.
    pause
    exit /b 1
)

echo 当前远程仓库:
git remote -v
echo.
echo 开始推送（如弹出登录窗口，请用浏览器完成 GitHub 登录）...
echo.

git push -u origin main

if errorlevel 1 (
    echo.
    echo [失败] 推送出错，请把上面的错误信息截图发给我。
    pause
    exit /b 1
)

echo.
echo ==========================================
echo   推送成功！
echo ==========================================
echo.
echo 接下来去 GitHub 网页：
echo   1. 打开你的仓库 -^> Settings -^> Pages
echo   2. Source 选择 "GitHub Actions"
echo   3. 等 1-2 分钟，网址会显示在 Pages 页面顶部
echo.
pause
