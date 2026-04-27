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

            modelBuilder.Entity<Fragrance>(entity =>
            {
                entity.HasKey(f => f.Id);
                entity.Property(f => f.Name).HasMaxLength(100);
                entity.Property(f => f.House).HasMaxLength(100);
                entity.Property(f => f.Description).HasMaxLength(1000);
                entity.Property(f => f.ImageUrl).HasMaxLength(500);

                // JSON columns - sin MaxLength
                entity.Property(f => f.GeneralNotes).HasColumnType("text");
                entity.Property(f => f.MainAccords).HasColumnType("text");
                entity.Property(f => f.MainAccordsPercentage).HasColumnType("text");
                entity.Property(f => f.SeasonRanking).HasColumnType("text");
                entity.Property(f => f.OccasionRanking).HasColumnType("text");
                entity.Property(f => f.Notes).HasColumnType("text");
            });
        }
    }
}