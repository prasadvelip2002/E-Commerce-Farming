using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AgriEcommerce.Application.Verifications.Queries
{
    public class PendingVerificationDto
    {
        public Guid VerificationId { get; set; }
        public Guid FarmerId { get; set; }
        public string AadhaarNumber { get; set; } = string.Empty;
        public string GpsLocation { get; set; } = string.Empty;
        public double TotalAcres { get; set; }
        public string OwnershipType { get; set; } = string.Empty;
        public string FarmingMethod { get; set; } = string.Empty;
        public string LeaseDocumentUrl { get; set; } = string.Empty;
        public string GovRecordsUrl { get; set; } = string.Empty;
        public string OrganicCertificateUrl { get; set; } = string.Empty;
        public string SubmittedAt { get; set; } = string.Empty;
    }

    public class GetPendingVerificationsQuery : IRequest<List<PendingVerificationDto>>
    {
    }

    public class GetPendingVerificationsQueryHandler : IRequestHandler<GetPendingVerificationsQuery, List<PendingVerificationDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetPendingVerificationsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PendingVerificationDto>> Handle(GetPendingVerificationsQuery request, CancellationToken cancellationToken)
        {
            return await _context.FarmVerifications
                .Include(v => v.FarmerProfile)
                .Where(v => v.Status == "Pending")
                .Select(v => new PendingVerificationDto
                {
                    VerificationId = v.Id,
                    FarmerId = v.FarmerProfile.Id,
                    AadhaarNumber = v.FarmerProfile.AadhaarNumber,
                    GpsLocation = v.FarmerProfile.GpsLocation,
                    TotalAcres = v.FarmerProfile.TotalAcres,
                    OwnershipType = v.FarmerProfile.OwnershipType,
                    FarmingMethod = v.FarmerProfile.FarmingMethod,
                    LeaseDocumentUrl = v.FarmerProfile.LeaseDocumentUrl,
                    GovRecordsUrl = v.FarmerProfile.GovRecordsUrl,
                    OrganicCertificateUrl = v.FarmerProfile.OrganicCertificateUrl,
                    SubmittedAt = v.CreatedAt.ToString("O")
                })
                .ToListAsync(cancellationToken);
        }
    }
}
