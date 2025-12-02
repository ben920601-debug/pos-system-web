const express = require('express');
const path = require('path');
const { exec } = require('child_process'); // 用來自動開啟瀏覽器

const app = express();
const PORT = 3000;

// 設定靜態檔案資料夾 (把目前目錄下的所有檔案都開放存取)
app.use(express.static(path.join(__dirname)));

// 設定首頁路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login', 'login-index.html'));
});

// 啟動伺服器
app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`✅ 前端伺服器已啟動: ${url}`);
    
    // 根據作業系統自動開啟瀏覽器
    const startCommand = (process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open');
    exec(`${startCommand} ${url}`);
});