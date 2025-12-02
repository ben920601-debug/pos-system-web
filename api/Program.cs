using Microsoft.EntityFrameworkCore;
using PosApi;

var builder = WebApplication.CreateBuilder(args);

// 1. 設定 PostgreSQL 連線
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 2. 設定 CORS (允許前端存取)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ========= 修改區開始 =========
// 不管什麼環境，都強制開啟 Swagger，方便我們除錯
app.UseSwagger();
app.UseSwaggerUI();

// 3. 啟用 CORS
app.UseCors("AllowAll");

app.UseAuthorization();
app.MapControllers();

// 加入一個最簡單的測試路徑，不經過資料庫
app.MapGet("/test", () => "恭喜！伺服器運作正常！");
// ========= 修改區結束 =========

app.Run();