using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace AgriEcommerce.Application.Products.Queries
{
    public class ProductDetailDto : ProductSummaryDto
    {
        public decimal BasePrice { get; set; }
        public decimal AdminMargin { get; set; }
        public string[] ImageUrls { get; set; } = [];
        public double AverageRating { get; set; }
        public int ReviewCount { get; set; }
    }

    public class GetProductByIdQuery : IRequest<ProductDetailDto?>
    {
        public Guid Id { get; set; }
    }

    public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductDetailDto?>
    {
        private readonly IApplicationDbContext _context;

        public GetProductByIdQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ProductDetailDto?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
        {
            var p = await _context.Products
                .Include(x => x.FarmerProfile).ThenInclude(fp => fp.User)
                .Include(x => x.Images)
                .Include(x => x.Reviews)
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.IsDeleted, cancellationToken);

            if (p == null) return null;

            return new ProductDetailDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                FinalPrice = p.FinalPrice,
                BasePrice = p.BasePrice,
                AdminMargin = p.AdminMargin,
                StockQuantity = p.StockQuantity,
                Status = p.Status,
                FarmerName = p.FarmerProfile.User.Email,
                PrimaryImageUrl = p.Images.Select(i => i.ImageUrl).FirstOrDefault(),
                ImageUrls = p.Images.Select(i => i.ImageUrl).ToArray(),
                AverageRating = p.Reviews.Any() ? p.Reviews.Average(r => r.Rating) : 0,
                ReviewCount = p.Reviews.Count
            };
        }
    }
}
