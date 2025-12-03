namespace PosApi;

public class ShiftReport
{
    public int Id { get; set; }
    public string CashierName { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public decimal ReserveFund { get; set; }
    public decimal SystemSales { get; set; }
    public decimal ActualCash { get; set; }
    public decimal Difference { get; set; }
    public int OrderCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
