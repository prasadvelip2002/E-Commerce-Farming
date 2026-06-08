using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AgriEcommerce.Application.Products.Commands
{
    public class UpdateProductStockCommand : IRequest<bool>
    {
        public Guid ProductId { get; set; }
        public int NewStock { get; set; }
        public string FarmerEmail { get; set; } = string.Empty;
    }

    public class UpdateProductStockCommandHandler : IRequestHandler<UpdateProductStockCommand, bool>
    {
        private readonly IApplicationDbContext _context;

        public UpdateProductStockCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(UpdateProductStockCommand request, CancellationToken cancellationToken)
        {
            var product = await _context.Products
                .Include(p => p.FarmerProfile)
                .ThenInclude(fp => fp.User)
                .FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);
            
            if (product == null) return false;

            // Security: Ensure only the farmer who owns it can update it
            if (product.FarmerProfile.User.Email != request.FarmerEmail) return false;

            product.StockQuantity = request.NewStock;
            
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
