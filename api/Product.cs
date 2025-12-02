namespace PosApi;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? Category { get; set; } // ? 代表允許空值
    public string? ImageUrl { get; set; }
    public int Stock { get; set; }
    public DateTime CreatedAt { get; set; }
}