using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AgriEcommerce.Application.Products.Queries
{
    public class GetFarmerProductsQuery : IRequest<List<ProductSummaryDto>>
    {
        public string Email { get; set; } = string.Empty;
    }

    public class GetFarmerProductsQueryHandler : IRequestHandler<GetFarmerProductsQuery, List<ProductSummaryDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetFarmerProductsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductSummaryDto>> Handle(GetFarmerProductsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Products
                .Include(p => p.FarmerProfile)
                .ThenInclude(fp => fp.User)
                .Where(p => p.FarmerProfile.User.Email == request.Email)
                .Select(p => new ProductSummaryDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Category = p.Category,
                    FarmerName = p.FarmerProfile.User.Email, // Hack: using email as name
                    FinalPrice = p.FinalPrice,
                    BasePrice = p.BasePrice,
                    StockQuantity = p.StockQuantity,
                    UnitOfMeasure = p.UnitOfMeasure,
                    Status = p.Status,
                    FarmLocation = p.FarmLocation,
                    SoilType = p.SoilType,
                    AcresGrown = p.AcresGrown
                })
                .ToListAsync(cancellationToken);
        }
    }
}
