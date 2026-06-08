using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AgriEcommerce.Application.Verifications.Commands
{
    public class ReviewVerificationCommand : IRequest<bool>
    {
        public Guid VerificationId { get; set; }
        public Guid AuthorizerUserId { get; set; }
        public bool IsApproved { get; set; }
        public string Notes { get; set; } = string.Empty;
    }

    public class ReviewVerificationCommandHandler : IRequestHandler<ReviewVerificationCommand, bool>
    {
        private readonly IApplicationDbContext _context;

        public ReviewVerificationCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(ReviewVerificationCommand request, CancellationToken cancellationToken)
        {
            var verification = await _context.FarmVerifications
                .Include(v => v.FarmerProfile)
                .FirstOrDefaultAsync(v => v.Id == request.VerificationId, cancellationToken);

            if (verification == null)
                return false;

            var authorizer = await _context.AuthorizerProfiles
                .FirstOrDefaultAsync(a => a.UserId == request.AuthorizerUserId, cancellationToken);

            if (authorizer != null)
            {
                verification.AuthorizerProfileId = authorizer.Id;
            }

            verification.Status = request.IsApproved ? "Approved" : "Rejected";
            verification.Notes = request.Notes;

            if (verification.FarmerProfile != null)
            {
                verification.FarmerProfile.Status = verification.Status;
                verification.FarmerProfile.IsVerified = request.IsApproved;
            }

            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
