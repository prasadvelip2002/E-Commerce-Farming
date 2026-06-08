using System;

namespace AgriEcommerce.Core.Entities
{
    public class FarmVerification : BaseEntity
    {
        public Guid FarmerProfileId { get; set; }
        public FarmerProfile FarmerProfile { get; set; } = null!;
        
        public Guid? AuthorizerProfileId { get; set; }
        public AuthorizerProfile? AuthorizerProfile { get; set; }
        
        public string Status { get; set; } = string.Empty; // Pending, Approved, Rejected
        public string Notes { get; set; } = string.Empty;
        public string GeoValidation { get; set; } = string.Empty;
    }
}
