using Microsoft.EntityFrameworkCore;
using AgriEcommerce.Core.Entities;
using AgriEcommerce.Application.Interfaces;

namespace AgriEcommerce.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<FarmerProfile> FarmerProfiles { get; set; }
        public DbSet<AuthorizerProfile> AuthorizerProfiles { get; set; }
        public DbSet<FarmVerification> FarmVerifications { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Delivery> Deliveries { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<User>(entity => 
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(256);
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // UserRole Many-to-Many
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });
            
            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);

            // RolePermission Many-to-Many
            modelBuilder.Entity<RolePermission>()
                .HasKey(rp => new { rp.RoleId, rp.PermissionId });

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Role)
                .WithMany(r => r.RolePermissions)
                .HasForeignKey(rp => rp.RoleId);

            modelBuilder.Entity<RolePermission>()
                .HasOne(rp => rp.Permission)
                .WithMany(p => p.RolePermissions)
                .HasForeignKey(rp => rp.PermissionId);

            // 1-to-1 FarmerProfile
            modelBuilder.Entity<FarmerProfile>()
                .HasOne(fp => fp.User)
                .WithOne(u => u.FarmerProfile)
                .HasForeignKey<FarmerProfile>(fp => fp.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // 1-to-1 AuthorizerProfile
            modelBuilder.Entity<AuthorizerProfile>()
                .HasOne(ap => ap.User)
                .WithOne(u => u.AuthorizerProfile)
                .HasForeignKey<AuthorizerProfile>(ap => ap.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Delivery to User (Provider) & Order
            modelBuilder.Entity<Delivery>()
                .HasOne(d => d.DeliveryProvider)
                .WithMany(u => u.Deliveries)
                .HasForeignKey(d => d.DeliveryProviderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Delivery>()
                .HasOne(d => d.Order)
                .WithOne(o => o.Delivery)
                .HasForeignKey<Delivery>(d => d.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            // FarmVerification
            modelBuilder.Entity<FarmVerification>()
                .HasOne(fv => fv.FarmerProfile)
                .WithMany(fp => fp.Verifications)
                .HasForeignKey(fv => fv.FarmerProfileId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<FarmVerification>()
                .HasOne(fv => fv.AuthorizerProfile)
                .WithMany(ap => ap.ConductedVerifications)
                .HasForeignKey(fv => fv.AuthorizerProfileId)
                .OnDelete(DeleteBehavior.Restrict);

            // Decimal Precision
            modelBuilder.Entity<Product>().Property(p => p.BasePrice).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Product>().Property(p => p.AdminMargin).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Product>().Property(p => p.FinalPrice).HasColumnType("decimal(18,2)");
            
            modelBuilder.Entity<Order>().Property(o => o.TotalAmount).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<OrderItem>().Property(oi => oi.UnitPrice).HasColumnType("decimal(18,2)");
        }
    }
}
