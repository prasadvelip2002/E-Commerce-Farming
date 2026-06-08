using Microsoft.AspNetCore.Mvc;
using MediatR;
using System;
using System.Threading.Tasks;
using AgriEcommerce.Application.Products.Queries;

namespace AgriEcommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ProductsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Get a paginated, searchable list of active products.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetProducts(
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var query = new GetProductsQuery
            {
                SearchTerm = search,
                Page = page,
                PageSize = Math.Clamp(pageSize, 1, 100)
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Get the full detail for a single product by ID.
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetProduct(Guid id)
        {
            var result = await _mediator.Send(new GetProductByIdQuery { Id = id });
            if (result == null) return NotFound(new { message = "Product not found." });
            return Ok(result);
        }

        /// <summary>
        /// Get the full detail for a single product by farmer email.
        /// </summary>
        [HttpGet("farmer")]
        public async Task<IActionResult> GetFarmerProducts([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("Email is required.");
            var result = await _mediator.Send(new GetFarmerProductsQuery { Email = email });
            return Ok(result);
        }

        /// <summary>
        /// Get AI-driven recommended products for a customer.
        /// </summary>
        [HttpGet("recommended")]
        public async Task<IActionResult> GetRecommendedProducts([FromQuery] string customerId)
        {
            try
            {
                using var client = new System.Net.Http.HttpClient();
                var response = await client.GetAsync($"http://localhost:8000/recommend/products?customer_id={customerId}");
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return Content(content, "application/json");
                }
                return Ok(new { message = "Fallback static recommendations due to AI service issue." });
            }
            catch
            {
                return Ok(new { message = "Fallback static recommendations." });
            }
        }

        /// <summary>
        /// Create a new product.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] AgriEcommerce.Application.Products.Commands.CreateProductCommand command)
        {
            try 
            {
                var productId = await _mediator.Send(command);
                return Ok(new { ProductId = productId, message = "Product listed successfully." });
            } 
            catch (Exception ex) 
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Update the admin margin for a product.
        /// </summary>
        [HttpPatch("{id:guid}/margin")]
        public async Task<IActionResult> UpdateMargin(Guid id, [FromBody] UpdateMarginRequest request)
        {
            var success = await _mediator.Send(new AgriEcommerce.Application.Products.Commands.UpdateProductMarginCommand 
            { 
                ProductId = id, 
                NewMargin = request.Margin 
            });
            
            if (!success) return NotFound(new { message = "Product not found." });
            return Ok(new { message = "Margin updated successfully." });
        }

        /// <summary>
        /// Update the stock quantity for a product.
        /// </summary>
        [HttpPatch("{id:guid}/stock")]
        public async Task<IActionResult> UpdateStock(Guid id, [FromBody] UpdateStockRequest request)
        {
            var success = await _mediator.Send(new AgriEcommerce.Application.Products.Commands.UpdateProductStockCommand 
            { 
                ProductId = id, 
                NewStock = request.Stock,
                FarmerEmail = request.Email
            });
            
            if (!success) return BadRequest(new { message = "Failed to update stock. Verify ownership." });
            return Ok(new { message = "Stock updated successfully." });
        }
    }

    public class UpdateMarginRequest
    {
        public decimal Margin { get; set; }
    }

    public class UpdateStockRequest
    {
        public int Stock { get; set; }
        public string Email { get; set; } = string.Empty;
    }
}
