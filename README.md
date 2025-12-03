# POS 系統 Web 版 (POS System Web)

這是一個現代化、前後端分離的銷售點情報系統 (Point of Sale)。
採用原生 JavaScript (ES Modules) 進行模組化開發，後端使用 C# ASP.NET Core Web API 串接 PostgreSQL 資料庫，實現完整的銷售流程。

## 🚀 專案特色

* **前後端分離架構**：前端與後端邏輯完全解耦，透過 RESTful API 溝通。
* **模組化前端**：不依賴大型框架 (Vue/React)，使用原生 ES6 Modules (`import`/`export`) 實現組件化開發，包含購物車邏輯、API 服務層等。
* **完整銷售流程**：
    * **身分驗證**：登入系統、權限檢查 (Session Management)。
    * **收銀台**：商品展示、購物車操作 (增減數量)、自動計算找零。
    * **結帳**：訂單驗證、寫入資料庫。
* **交班系統**：自動計算當班銷售額、訂單數，支援時區校正與現金核對。
* **歷史訂單**：可查詢過往交易紀錄與明細。
* **RWD 介面**：使用 CSS Grid/Flexbox 佈局，適應不同螢幕解析度，並具備深色側邊欄風格。

## 🛠️ 技術棧 (Tech Stack)

### 前端 (Frontend)
* **語言**：HTML5, CSS3, JavaScript (ES6+)
* **核心技術**：ES Modules, Fetch API, CSS Variables, CSS Grid layout
* **運行環境**：Node.js (用於開發伺服器 `server.js`)

### 後端 (Backend)
* **框架**：ASP.NET Core 6/8 Web API
* **語言**：C#
* **ORM**：Entity Framework Core
* **資料庫**：PostgreSQL

## 📂 專案結構

```text
/pos-system-web
  ├── /api               # C# 後端專案 (ASP.NET Core)
  │    ├── Controllers   # API 控制器 (Products, Orders, Auth)
  │    └── appsettings.json # 資料庫連線設定
  │
  ├── /src               # 前端核心資源 (共用層)
  │    ├── /css          # 全域樣式、頁面樣式
  │    ├── /modules      # JS 模組 (Core Logic & UI Components)
  │    │    ├── /core    # 商業邏輯 (Cart, Service...)
  │    │    └── /ui      # 畫面渲染邏輯
  │
  ├── /pos               # POS 收銀主程式 (HTML)
  ├── /login             # 登入頁面 (HTML)
  ├── server.js          # 前端開發伺服器 (Node.js)
  └── README.md          # 專案說明文件
