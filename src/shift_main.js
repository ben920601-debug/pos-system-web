// src/shift_main.js
import { OrderService } from './modules/core/OrderService.js';

// 1. 安全檢查
const currentUserJson = localStorage.getItem('currentUser');
if (!currentUserJson) {
    window.location.href = '../login/index.html';
    throw new Error("Unauthorized");
}

const currentUser = JSON.parse(currentUserJson);

document.addEventListener('DOMContentLoaded', async () => {

    // 2. 填入基本資訊
    const loginTime = new Date(currentUser.loginTime);
    const now = new Date();

    const orderCountEl = document.getElementById('shift-order-count');
    const totalAmountEl = document.getElementById('shift-total-amount');

    // 介面初始化顯示
    document.getElementById('shift-user').textContent = currentUser.username;
    document.getElementById('start-time').textContent = loginTime.toLocaleString('zh-TW', { hour12: false });
    document.getElementById('end-time').textContent = now.toLocaleString('zh-TW', { hour12: false });
    
    // 顯示「計算中...」讓使用者知道系統正在跑
    orderCountEl.textContent = "...";
    totalAmountEl.textContent = "計算中...";

    // 3. 抓取資料並計算
    try {
        const allOrders = await OrderService.fetchAll();
        
        // 設定緩衝時間
        const bufferTime = loginTime;

        // 篩選本班訂單
        const shiftOrders = allOrders.filter(order => {
            
            let timeStr = order.createdAt;
            if (!timeStr.endsWith('Z')) {
                timeStr += 'Z';
            }
            
            const orderDate = new Date(timeStr);
            
            return orderDate >= bufferTime;
        });

        console.log(`[交班計算] 登入時間: ${loginTime.toLocaleString()}`);
        console.log(`[交班計算] 本班訂單數: ${shiftOrders.length}`);

        // 計算總額 (★ 強制轉成 Number，避免字串相加錯誤)
        const totalSales = shiftOrders.reduce((sum, order) => {
            return sum + Number(order.totalAmount);
        }, 0);

        const orderCount = shiftOrders.length;

        // 4. 更新畫面
        orderCountEl.textContent = orderCount;
        totalAmountEl.textContent = `$${totalSales}`;

        // 如果完全沒單，顯示 0
        if (orderCount === 0) {
            totalAmountEl.textContent = "$0";
        }

    } catch (error) {
        console.error("交班計算錯誤", error);
        totalAmountEl.textContent = "讀取失敗";
        alert("無法更新數據，請確認網路連線。");
    }

    // 5. 確認交班按鈕
    document.getElementById('btn-confirm-shift').addEventListener('click', () => {
        if (confirm("確認要結算並登出系統嗎？")) {
            localStorage.removeItem('currentUser');
            window.location.href = '../login/login-index.html';
        }
    });

});