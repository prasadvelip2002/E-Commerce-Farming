using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;
using AgriEcommerce.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace AgriEcommerce.Application.Verifications.Commands
{
    public class SubmitVerificationCommand : IRequest<Guid>
    {
        public Guid UserId { get; set; }
        public string AadhaarNumber { get; set; } = string.Empty;
        public string GpsLocation { get; set; } = string.Empty;
        public double TotalAcres { get; set; }
        public string OwnershipType { get; set; } = "Owned";
        public string FarmingMethod { get; set; } = "Natural";
        public string LeaseDocumentUrl { get; set; } = string.Empty;
        public string GovRecordsUrl { get; set; } = string.Empty;
        public string OrganicCertificateUrl { get; set; } = string.Empty;
    }

    public class SubmitVerificationCommandHandler : IRequestHandler<SubmitVerificationCommand, Guid>
    {
        private readonly IApplicationDbContext _context;

        public SubmitVerificationCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> Handle(SubmitVerificationCommand request, CancellationToken cancellationToken)
        {
            var farmerProfile = await _context.FarmerProfiles
                .FirstOrDefaultAsync(fp => fp.UserId == request.UserId, cancellationToken);

            if (farmerProfile == null)
            {
                farmerProfile = new FarmerProfile
                {
                    UserId = request.UserId,
                    AadhaarNumber = request.AadhaarNumber,
                    GpsLocation = request.GpsLocation,
                    TotalAcres = request.TotalAcres,
                    OwnershipType = request.OwnershipType,
                    FarmingMethod = request.FarmingMethod,
                    LeaseDocumentUrl = request.LeaseDocumentUrl,
                    GovRecordsUrl = request.GovRecordsUrl,
                    OrganicCertificateUrl = request.OrganicCertificateUrl,
                    Status = "Pending",
                    IsVerified = false
                };
                _context.FarmerProfiles.Add(farmerProfile);
            }
            else
            {
                farmerProfile.AadhaarNumber = request.AadhaarNumber;
                farmerProfile.GpsLocation = request.GpsLocation;
                farmerProfile.TotalAcres = request.TotalAcres;
                farmerProfile.OwnershipType = request.OwnershipType;
                farmerProfile.FarmingMethod = request.FarmingMethod;
                farmerProfile.LeaseDocumentUrl = request.LeaseDocumentUrl;
                farmerProfile.GovRecordsUrl = request.GovRecordsUrl;
                farmerProfile.OrganicCertificateUrl = request.OrganicCertificateUrl;
                farmerProfile.Status = "Pending";
            }

            var verification = new FarmVerification
            {
                FarmerProfile = farmerProfile,
                Status = "Pending",
                Notes = "Awaiting review"
            };

            _context.FarmVerifications.Add(verification);
            await _context.SaveChangesAsync(cancellationToken);

            return verification.Id;
        }
    }
}
