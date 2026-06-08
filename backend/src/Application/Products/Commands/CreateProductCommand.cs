using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;
using AgriEcommerce.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace AgriEcommerce.Application.Products.Commands
{
    public class CreateProductCommand : IRequest<Guid>
    {
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string UnitOfMeasure { get; set; } = "kg";
        public decimal BasePrice { get; set; }
        public int StockQuantity { get; set; }
        public string FarmingMethod { get; set; } = string.Empty; // Just for reference
        
        // Crop Origin Details
        public string FarmLocation { get; set; } = string.Empty;
        public string SoilType { get; set; } = string.Empty;
        public double AcresGrown { get; set; }
    }

    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Guid>
    {
        private readonly IApplicationDbContext _context;

        public CreateProductCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
            
            if (user == null) throw new Exception("User not found.");

            var farmerProfile = await _context.FarmerProfiles
                .FirstOrDefaultAsync(fp => fp.UserId == user.Id, cancellationToken);

            if (farmerProfile == null) throw new Exception("Farmer Profile not found.");

            var product = new Product
            {
                Id = Guid.NewGuid(),
                FarmerProfileId = farmerProfile.Id,
                Name = request.Name,
                Description = request.Description,
                Category = request.Category,
                UnitOfMeasure = request.UnitOfMeasure,
                BasePrice = request.BasePrice,
                AdminMargin = 0, // Admin sets this later, or defaults
                FinalPrice = request.BasePrice, // Updated by AI algorithm later
                StockQuantity = request.StockQuantity,
                Status = "Active", // Usually "Pending", but setting to "Active" for instant view in MVP
                FarmLocation = request.FarmLocation,
                SoilType = request.SoilType,
                AcresGrown = request.AcresGrown
            };

            await _context.Products.AddAsync(product, cancellationToken);
            
            // Automatically assign an image based on the product name
            var imageUrl = GetImageUrlFromName(request.Name);
            var productImage = new ProductImage
            {
                Id = Guid.NewGuid(),
                ProductId = product.Id,
                ImageUrl = imageUrl
            };
            await _context.ProductImages.AddAsync(productImage, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            return product.Id;
        }

        private string GetImageUrlFromName(string name)
        {
            // Use free AI image generation endpoint based on the crop name
            var prompt = $"fresh {name} farm harvest agriculture high quality macro photography";
            var urlSafePrompt = Uri.EscapeDataString(prompt);
            return $"https://image.pollinations.ai/prompt/{urlSafePrompt}?width=800&height=800&nologo=true";
        }
    }
}
