namespace PosApi;

public class Order
{
    public int Id { get; set; }
    public decimal TotalAmount { get; set; }
    public string? ItemsJson { get; set; } // 存商品明細
    public DateTime CreatedAt { get; set; }
}