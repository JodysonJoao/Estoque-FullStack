using Microsoft.EntityFrameworkCore;
using Estoque.Backend.Models;

namespace Estoque.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<Product> Products { get; set; }

        public DbSet<Order> Orders { get; set; }
        public DbSet<SalesCategory> SalesCategories { get; set; }
        public DbSet<LastOrders> LastOrders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Order>().HasKey(o => o.Id);
            modelBuilder.Entity<OrderItem>().HasKey(oi => oi.Id);
            modelBuilder.Entity<Order>()
                .Property(o => o.Total)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Product>().HasKey(p => p.id);
            modelBuilder.Entity<Product>()
                .Property(p => p.price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<LastOrders>()
                .Property(lo => lo.Total)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<SalesCategory>()
                .HasKey(sc => sc.Category);
        }


    }
}
