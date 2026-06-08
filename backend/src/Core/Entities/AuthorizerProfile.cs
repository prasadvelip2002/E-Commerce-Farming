using System;
using System.Collections.Generic;

namespace AgriEcommerce.Core.Entities
{
    public class AuthorizerProfile : BaseEntity
    {
        public Guid UserId { get; set; }
        public User User { get; set; } = null!;
        
        public string Region { get; set; } = string.Empty;
        
        public ICollection<FarmVerification> ConductedVerifications { get; set; } = new List<FarmVerification>();
    }
}
