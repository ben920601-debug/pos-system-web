import { OrderService } from './modules/core/OrderService.js';

// 1. 安全檢查
const currentUserJson = localStorage.getItem('currentUser');
if (!currentUserJson) {
    window.location.href = '../login/index.html';
    throw new Error("Unauthorized");
}
const currentUser = JSON.parse(currentUserJson);

document.addEventListener('DOMContentLoaded', async () => {

    // --- DOM 元素 ---
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const headerSubtitle = document.getElementById('header-subtitle');
    
    const inputActual = document.getElementById('input-actual-cash');
    const textReserve = document.getElementById('text-reserve-fund');
    const inputUserSpan = document.getElementById('input-shift-user');

    const reportSales = document.getElementById('shift-sales-amount');
    const reportExpected = document.getElementById('shift-expected-cash');
    const reportActual = document.getElementById('report-actual-cash');
    const reportReserve = document.getElementById('report-reserve');
    const reportDiff = document.getElementById('shift-diff-amount');
    const diffWarning = document.getElementById('diff-warning');

    // --- 2. 初始化 Step 1 ---
    inputUserSpan.textContent = currentUser.username;
    
    // 讀取預備金
    const defaultReserve = parseInt(localStorage.getItem('defaultReserveFund') || 0);
    textReserve.textContent = `$${defaultReserve}`;

    // 變數儲存系統計算結果 (這些變數要拉到外面，讓最後的按鈕也能讀取)
    let systemTotalSales = 0;
    let loginTime = new Date(currentUser.loginTime);
    let shiftOrderCount = 0; // 新增：紀錄訂單數
    
    // 變數儲存最終要存檔的資料
    let finalReportData = {};

    // 預先抓取資料
    try {
        const allOrders = await OrderService.fetchAll();
        const bufferTime = loginTime; 
        
        const shiftOrders = allOrders.filter(order => {
            let timeStr = order.createdAt;
            if (!timeStr.endsWith('Z')) timeStr += 'Z';
            return new Date(timeStr) >= bufferTime;
        });

        systemTotalSales = shiftOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        shiftOrderCount = shiftOrders.length;
        console.log(`[系統計算] 本班銷售額: $${systemTotalSales}, 單數: ${shiftOrderCount}`);

    } catch (error) {
        alert("連線錯誤，無法讀取銷售資料");
        console.error(error);
    }

    // --- 3. 點擊「開始結算」 ---
    document.getElementById('btn-calculate').addEventListener('click', () => {
        // A. 驗證輸入
        const actualCashStr = inputActual.value;
        if (actualCashStr === "") { alert("請輸入金額"); return; }
        
        const actualCash = parseInt(actualCashStr);
        if (isNaN(actualCash) || actualCash < 0) { alert("請輸入有效的正整數"); return; }

        // B. 計算邏輯
        const diff = actualCash - systemTotalSales;
        const endTime = new Date(); // 結算當下時間

        // C. 準備要存檔的資料 (暫存起來)
        finalReportData = {
            cashierName: currentUser.username,
            startTime: loginTime.toISOString(),
            endTime: endTime.toISOString(),
            reserveFund: defaultReserve,
            systemSales: systemTotalSales,
            actualCash: actualCash,
            difference: diff,
            orderCount: shiftOrderCount
        };

        // D. 填寫報表
        document.getElementById('start-time').textContent = loginTime.toLocaleString('zh-TW', { hour12: false });
        document.getElementById('end-time').textContent = endTime.toLocaleString('zh-TW', { hour12: false });
        
        reportSales.textContent = `$${systemTotalSales}`;
        reportReserve.textContent = `$${defaultReserve}`;
        reportExpected.textContent = `$${systemTotalSales}`; 
        reportActual.innerHTML = `<span style="font-size:1.4rem;">$${actualCash}</span>`;
        reportDiff.textContent = diff > 0 ? `+$${diff}` : `$${diff}`;

        // E. 設定顏色
        reportDiff.className = 'diff-amount'; 
        if (diff === 0) {
            reportDiff.classList.add('status-match'); 
            reportDiff.textContent = "帳務吻合 ($0)";
            diffWarning.style.display = 'none'; 
        } else if (diff > 0) {
            reportDiff.classList.add('status-over'); 
            diffWarning.style.display = 'block';
            diffWarning.textContent = `⚠️ 溢收 (多了 $${Math.abs(diff)})`;
            diffWarning.style.color = '#1565c0';
            diffWarning.style.backgroundColor = '#e3f2fd';
        } else {
            reportDiff.classList.add('status-short'); 
            diffWarning.style.display = 'block';
            diffWarning.textContent = `⚠️ 短少 (少了 $${Math.abs(diff)})`;
            diffWarning.style.color = '#c62828';
            diffWarning.style.backgroundColor = '#ffebee';
        }

        step1.classList.add('hidden');
        step2.classList.remove('hidden');
        headerSubtitle.textContent = "步驟 2/2：確認交班明細";
        
        const labelExpected = document.querySelector('#step-2 .stat-box:nth-child(2) .stat-label');
        if(labelExpected) labelExpected.textContent = "系統銷售總額";
        
        const labelActual = document.querySelector('#step-2 .info-row:nth-last-of-type(3) span:first-child');
        if(labelActual) labelActual.textContent = "實點營收現金";
    });

    // --- 4. 返回修改 ---
    document.getElementById('btn-back-step1').addEventListener('click', () => {
        step2.classList.add('hidden');
        step1.classList.remove('hidden');
        headerSubtitle.textContent = "步驟 1/2：輸入金額";
    });

    // --- 5. 最終確認並存檔 ---
    const btnFinal = document.getElementById('btn-confirm-final');
    
    btnFinal.addEventListener('click', async () => {
        if (!confirm("確認明細無誤並登出系統？")) return;

        try {
            // 按鈕顯示處理中
            btnFinal.disabled = true;
            btnFinal.textContent = "存檔中...";

            // 發送 API 請求
            const response = await fetch("http://localhost:5099/api/shiftreports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalReportData)
            });

            if (!response.ok) {
                throw new Error("交班存檔失敗");
            }

            // 成功後登出
            alert("交班成功！系統將自動登出。");
            localStorage.removeItem('currentUser');
            window.location.href = '../login/login-index.html';

        } catch (error) {
            console.error(error);
            alert("⚠️ 存檔失敗，請聯繫管理員！(但系統仍會登出)");
            // 即使存檔失敗，為了安全還是先登出
            localStorage.removeItem('currentUser');
            window.location.href = '../login/login-index.html';
        }
    });

});
