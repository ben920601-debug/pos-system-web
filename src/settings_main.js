// src/settings_main.js

// 1. 安全檢查
const currentUserJson = localStorage.getItem('currentUser');
if (!currentUserJson) {
    window.location.href = '../login/index.html';
}
const currentUser = JSON.parse(currentUserJson);

document.addEventListener('DOMContentLoaded', () => {

    // 2. 顯示使用者資訊
    const userDisplay = document.getElementById('current-user-display');
    if (userDisplay) {
        const roleText = currentUser.role === 'Manager' ? '(店長)' : '(員工)';
        userDisplay.textContent = `Hi, ${currentUser.username} ${roleText}`;
    }

    // 3. 時鐘功能
    function updateClock() {
        const now = new Date();
        const timeEl = document.querySelector('.clock-time');
        const dateEl = document.querySelector('.clock-date');
        if (timeEl) timeEl.textContent = now.toLocaleTimeString('zh-TW', { hour12: false, hour: '2-digit', minute: '2-digit' });
        if (dateEl) dateEl.textContent = now.toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' });
    }
    updateClock();
    setInterval(updateClock, 1000);

    // 4. 卡片點擊事件 (未來開發入口)
    
    // 人事管理
    document.getElementById('btn-personnel').addEventListener('click', () => {
        // 權限檢查：只有店長能進去
        if (currentUser.role !== 'Manager') {
            alert("權限不足：只有店長可以管理人員");
            return;
        }
        alert("即將前往：人事管理頁面 (開發中)");
        // window.location.href = 'settings/users.html';
    });

    // 交班金設定
    document.getElementById('btn-shift-money').addEventListener('click', () => {
        // 1. 取得目前的設定值 (預設為 0)
        const currentFund = localStorage.getItem('defaultReserveFund') || '0';
        
        // 2. 跳出輸入視窗，並帶入目前的值
        const amountStr = prompt("請輸入收銀機「預設備用金」金額：", currentFund);
        
        // 3. 如果使用者按取消 (null)，就不做任何事
        if (amountStr === null) return;

        // 4. 驗證輸入的是否為數字
        const amount = parseInt(amountStr);
        if (isNaN(amount) || amount < 0) {
            alert("輸入錯誤：請輸入有效的正整數");
            return;
        }

        // 5. 存入 localStorage
        localStorage.setItem('defaultReserveFund', amount.toString());
        alert(`設定成功！預設備用金已更新為 $${amount}`);
    });

    // 黑名單查詢
    document.getElementById('btn-blacklist').addEventListener('click', () => {
        alert("即將前往：黑名單資料庫 (開發中)");
    });

});
