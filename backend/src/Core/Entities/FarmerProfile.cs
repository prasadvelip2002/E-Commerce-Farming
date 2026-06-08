using System;
using System.Collections.Generic;

namespace AgriEcommerce.Core.Entities
{
    public class FarmerProfile : BaseEntity
    {
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        
        public string AadhaarNumber { get; set; } = string.Empty;
        public string GpsLocation { get; set; } = string.Empty;
        public double TotalAcres { get; set; }
        
        // PRD additions
        public string OwnershipType { get; set; } = "Owned"; // Owned, Lease, Rent
        public string FarmingMethod { get; set; } = "Natural"; // Organic, Natural, Fertilizer
        public string LeaseDocumentUrl { get; set; } = string.Empty;
        public string GovRecordsUrl { get; set; } = string.Empty;
        public string OrganicCertificateUrl { get; set; } = string.Empty;
        
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
        public bool IsVerified { get; set; } = false;

        public ICollection<FarmVerification> Verifications { get; set; } = new List<FarmVerification>();
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
