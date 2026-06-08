using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AgriEcommerce.Application.Products.Queries
{
    public class ProductSummaryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string UnitOfMeasure { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public decimal FinalPrice { get; set; }
        public int StockQuantity { get; set; }
        public string Status { get; set; } = string.Empty;
        public string FarmerName { get; set; } = string.Empty;
        public string? PrimaryImageUrl { get; set; }
        public string FarmLocation { get; set; } = string.Empty;
        public string SoilType { get; set; } = string.Empty;
        public double AcresGrown { get; set; }
    }

    public class GetProductsQuery : IRequest<List<ProductSummaryDto>>
    {
        public string? Category { get; set; }
        public string? SearchTerm { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

    public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, List<ProductSummaryDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetProductsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductSummaryDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Products
                .Include(p => p.FarmerProfile).ThenInclude(fp => fp.User)
                .Include(p => p.Images)
                .Where(p => p.Status == "Active" && !p.IsDeleted);

            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var term = request.SearchTerm.ToLower();
                query = query.Where(p =>
                    p.Name.ToLower().Contains(term) ||
                    p.Description.ToLower().Contains(term));
            }

            return await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(p => new ProductSummaryDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Category = p.Category,
                    UnitOfMeasure = p.UnitOfMeasure,
                    BasePrice = p.BasePrice,
                    FinalPrice = p.FinalPrice,
                    StockQuantity = p.StockQuantity,
                    Status = p.Status,
                    FarmerName = p.FarmerProfile.User.Email,
                    PrimaryImageUrl = p.Images.Select(i => i.ImageUrl).FirstOrDefault(),
                    FarmLocation = p.FarmLocation,
                    SoilType = p.SoilType,
                    AcresGrown = p.AcresGrown
                })
                .ToListAsync(cancellationToken);
        }
    }
}
