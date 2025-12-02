// 修正 1：確認網址是包含 /api/products 的完整路徑
const API_URL = "http://localhost:5099/api/products";

export class ProductService {
    
    // 修正 2：函式前面一定要有 static async 關鍵字
    static async fetchAll() {
        try {
            console.log("正在向後端請求資料...");
            
            // 這裡發送請求
            const response = await fetch(API_URL);
            
            // 如果後端回傳 404 (找不到) 或 500 (錯誤)，這裡會擋下來
            if (!response.ok) {
                throw new Error(`連線失敗: ${response.status}`); // 你的 404 就是這裡丟出來的
            }

            const data = await response.json();
            console.log("成功取得資料:", data);
            return data;
            
        } catch (error) {
            console.error("API 錯誤:", error);
            // 這裡可以選擇不跳 alert，避免一直干擾測試
            // alert("無法連線到伺服器，請確認後端是否已啟動！");
            return []; 
        }
    }
}