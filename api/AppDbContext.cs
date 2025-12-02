using Microsoft.EntityFrameworkCore;

namespace PosApi;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // 對應資料庫裡的 Products 表格
    public DbSet<Product> Products { get; set; }

    public DbSet<Order> Orders { get; set; }

    public DbSet<User> Users { get; set; }
}