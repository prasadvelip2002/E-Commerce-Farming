using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AgriEcommerce.Application.Products.Commands
{
    public class UpdateProductMarginCommand : IRequest<bool>
    {
        public Guid ProductId { get; set; }
        public decimal NewMargin { get; set; }
    }

    public class UpdateProductMarginCommandHandler : IRequestHandler<UpdateProductMarginCommand, bool>
    {
        private readonly IApplicationDbContext _context;

        public UpdateProductMarginCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(UpdateProductMarginCommand request, CancellationToken cancellationToken)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);
            if (product == null) return false;

            // Update margin and recalculate final price
            product.AdminMargin = request.NewMargin;
            product.FinalPrice = product.BasePrice * (1 + (request.NewMargin / 100m));
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
