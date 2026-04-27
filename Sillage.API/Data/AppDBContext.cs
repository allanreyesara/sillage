using Microsoft.EntityFrameworkCore;
using Sillage.API.Models;

namespace Sillage.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Fragrance> Fragrances { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the Fragrance entity
            modelBuilder.Entity<Fragrance>(entity =>
            {
                entity.HasKey(f => f.Id);
                entity.Property(f => f.Name).HasMaxLength(100);
                entity.Property(f => f.House).HasMaxLength(100);
                entity.Property(f => f.Description).HasMaxLength(1000);
                entity.Property(f => f.Notes).HasMaxLength(1000);
                entity.Property(f => f.Weather).HasMaxLength(100);
                entity.Property(f => f.Occasion).HasMaxLength(100);
            });
        }
    }
}