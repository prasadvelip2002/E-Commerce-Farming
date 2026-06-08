using Microsoft.EntityFrameworkCore;
using AgriEcommerce.Core.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace AgriEcommerce.Application.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<User> Users { get; }
        DbSet<Role> Roles { get; }
        DbSet<UserRole> UserRoles { get; }
        DbSet<Permission> Permissions { get; }
        DbSet<RolePermission> RolePermissions { get; }
        DbSet<FarmerProfile> FarmerProfiles { get; }
        DbSet<AuthorizerProfile> AuthorizerProfiles { get; }
        DbSet<FarmVerification> FarmVerifications { get; }
        DbSet<Product> Products { get; }
        DbSet<ProductImage> ProductImages { get; }
        DbSet<Order> Orders { get; }
        DbSet<OrderItem> OrderItems { get; }
        DbSet<Delivery> Deliveries { get; }
        DbSet<Review> Reviews { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
