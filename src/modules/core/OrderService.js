const API_URL = "http://localhost:5099/api/orders";

// --------------------------------------
    // ★ 新增：系統時間顯示 (System Clock)
    // --------------------------------------
    function updateClock() {
        const now = new Date();
        
        // 取得時間字串 (HH:mm)
        const timeStr = now.toLocaleTimeString('zh-TW', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        // 取得日期字串 (MM/DD)
        const dateStr = now.toLocaleDateString('zh-TW', {
            month: '2-digit',
            day: '2-digit'
        });

        // 更新畫面
        const timeEl = document.querySelector('.clock-time');
        const dateEl = document.querySelector('.clock-date');

        if (timeEl) timeEl.textContent = timeStr;
        if (dateEl) dateEl.textContent = dateStr;
    }

    // 1. 馬上執行一次，避免剛載入時顯示 --:--
    updateClock();

    // 2. 設定每秒更新一次 (1000ms)
    setInterval(updateClock, 1000);

export class OrderService {
    
    static async fetchAll() {
        try {
            // ★ 修改重點：在網址後面加上時間參數 `?_t=...`
            // 這會強制瀏覽器每次都發送新請求，絕不讀快取
            const timestamp = new Date().getTime();
            const urlWithNoCache = `${API_URL}?_t=${timestamp}`;

            console.log(`[OrderService] 正在抓取最新訂單: ${urlWithNoCache}`);

            const response = await fetch(urlWithNoCache, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`取得訂單失敗: ${response.status}`);
            }

            const data = await response.json();
            console.log(`[OrderService] 下載成功，共 ${data.length} 筆資料`);
            return data;

        } catch (error) {
            console.error("[OrderService] 錯誤:", error);
            return [];
        }
    }
}