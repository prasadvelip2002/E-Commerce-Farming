using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AgriEcommerce.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AgriEcommerce.Infrastructure.Persistence
{
    public static class ApplicationDbContextSeed
    {
        public static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
        {
            try
            {
                if (!await context.Roles.AnyAsync())
                {
                    logger.LogInformation("Seeding default roles...");
                    var roles = new List<Role>
                    {
                        new Role { Id = Guid.NewGuid(), Name = "Customer" },
                        new Role { Id = Guid.NewGuid(), Name = "Farmer" },
                        new Role { Id = Guid.NewGuid(), Name = "Authorizer" },
                        new Role { Id = Guid.NewGuid(), Name = "SubAdmin" },
                        new Role { Id = Guid.NewGuid(), Name = "SuperAdmin" },
                        new Role { Id = Guid.NewGuid(), Name = "DeliveryProvider" }
                    };
                    await context.Roles.AddRangeAsync(roles);
                    await context.SaveChangesAsync();
                }

                if (!await context.Users.AnyAsync())
                {
                    logger.LogInformation("Seeding default users and products...");
                    
                    var adminRole = await context.Roles.FirstAsync(r => r.Name == "SuperAdmin");
                    var farmerRole = await context.Roles.FirstAsync(r => r.Name == "Farmer");
                    var customerRole = await context.Roles.FirstAsync(r => r.Name == "Customer");

                    // Seed Admin
                    var adminUser = new User { Id = Guid.NewGuid(), Email = "admin@agrimart.com", PasswordHash = "admin123", PhoneNumber = "+910000000001", IsActive = true };
                    await context.Users.AddAsync(adminUser);
                    await context.UserRoles.AddAsync(new UserRole { UserId = adminUser.Id, RoleId = adminRole.Id });

                    // Seed Customer
                    var customerUser = new User { Id = Guid.NewGuid(), Email = "customer@agrimart.com", PasswordHash = "customer123", PhoneNumber = "+910000000002", IsActive = true };
                    await context.Users.AddAsync(customerUser);
                    await context.UserRoles.AddAsync(new UserRole { UserId = customerUser.Id, RoleId = customerRole.Id });

                    // Seed Farmer 1
                    var farmerUser1 = new User { Id = Guid.NewGuid(), Email = "ramesh@farms.com", PasswordHash = "farmer123", PhoneNumber = "+919876543210", IsActive = true };
                    await context.Users.AddAsync(farmerUser1);
                    await context.UserRoles.AddAsync(new UserRole { UserId = farmerUser1.Id, RoleId = farmerRole.Id });
                    
                    var farmerProfile1 = new FarmerProfile 
                    { 
                        Id = Guid.NewGuid(), 
                        UserId = farmerUser1.Id, 
                        AadhaarNumber = "123456789012", 
                        GpsLocation = "19.9975, 73.7898", 
                        TotalAcres = 5.5, 
                        IsVerified = true, 
                        Status = "Approved" 
                    };
                    await context.FarmerProfiles.AddAsync(farmerProfile1);

                    // Seed Farmer 2
                    var farmerUser2 = new User { Id = Guid.NewGuid(), Email = "singh@agro.com", PasswordHash = "farmer123", PhoneNumber = "+919876543211", IsActive = true };
                    await context.Users.AddAsync(farmerUser2);
                    await context.UserRoles.AddAsync(new UserRole { UserId = farmerUser2.Id, RoleId = farmerRole.Id });

                    var farmerProfile2 = new FarmerProfile 
                    { 
                        Id = Guid.NewGuid(), 
                        UserId = farmerUser2.Id, 
                        AadhaarNumber = "987654321098", 
                        GpsLocation = "23.2599, 77.4126", 
                        TotalAcres = 12.0, 
                        IsVerified = true, 
                        Status = "Approved" 
                    };
                    await context.FarmerProfiles.AddAsync(farmerProfile2);

                    await context.SaveChangesAsync();

                    // Seed Products
                    logger.LogInformation("Seeding default products...");
                    var products = new List<Product>
                    {
                        new Product { Id = Guid.NewGuid(), FarmerProfileId = farmerProfile1.Id, Name = "Organic Tomatoes", Description = "Sun-ripened, pesticide-free tomatoes from Nashik.", Category = "Vegetable", BasePrice = 4.00m, AdminMargin = 0.99m, StockQuantity = 1200, UnitOfMeasure = "kg", Status = "Active" },
                        new Product { Id = Guid.NewGuid(), FarmerProfileId = farmerProfile1.Id, Name = "Green Peas", Description = "Fresh farm-picked green peas.", Category = "Vegetable", BasePrice = 2.50m, AdminMargin = 0.50m, StockQuantity = 500, UnitOfMeasure = "kg", Status = "Active" },
                        new Product { Id = Guid.NewGuid(), FarmerProfileId = farmerProfile2.Id, Name = "Sharbati Wheat", Description = "Premium Sharbati wheat from MP.", Category = "Grain", BasePrice = 2.00m, AdminMargin = 0.50m, StockQuantity = 5000, UnitOfMeasure = "kg", Status = "Active" },
                        new Product { Id = Guid.NewGuid(), FarmerProfileId = farmerProfile2.Id, Name = "Basmati Rice", Description = "Long-grain aged Basmati rice.", Category = "Grain", BasePrice = 4.20m, AdminMargin = 1.30m, StockQuantity = 3000, UnitOfMeasure = "kg", Status = "Active" }
                    };
                    
                    await context.Products.AddRangeAsync(products);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding the database.");
            }
        }
    }
}
