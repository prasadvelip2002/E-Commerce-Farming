using System;
using System.Collections.Generic;

namespace AgriEcommerce.Core.Entities
{
    public class User : BaseEntity
    {
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        
        public FarmerProfile? FarmerProfile { get; set; }
        public AuthorizerProfile? AuthorizerProfile { get; set; }
        
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
