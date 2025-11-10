using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices.Marshalling;
using System.Runtime.Versioning;

namespace challenge03;

public class Product
{
    public int id { get; set; }
    [Required]
    [MaxLength(100)]
    public string name { get; set; }
    public string description { get; set; }
    public decimal price { get; set; }
     public DateTime createdDate { get; set; } => DateTime.UtcNow();
}

public interface IProduct
{
    public Task<List<Product>> GetProducts();
    public Task<Product> GetProductById(int id);
    public Task<bool> RemoveProductById(int searchId);
}


public class ProductService : IProduct
{
    public List<Product> mockedPrd;
    readonly IDbProduct _dbproduct;
    readonly IProduct _product;

    public ProductService(IProduct product, IDbProduct dbprod)
    {
        _product = product;
        _dbproduct = dbprod;
        mockedPrd = await SeedData();
    }

    private async Task<List<Product>> SeedData()
    {
        var pr1 = new Product()
        {
            id = 1,
            name = "Prd1",
            description = null,
            price = 0
        };
        var pr2 = new Product()
        {
            id = 2,
            name = "Prd2",
            description = "product 2",
            price = 100.3
        };
        var pr3 = new Product()
        {
            id = 3,
            name = "Prd3",
            description = "product 3",
            price = 250
        };
        var pr4 = new Product()
        {
            id = 4,
            name = "Prd4",
            description = null,
            price = 15.6
        };
    }

    public async Task<Product> GetProductById(int searchId)
    {
        var result = await mockedPrd.Where(x => x.id == searchId).Select(x);
        return result;

    }
    public async Task<List<Product>> GetProducts()
    {
        //Get all products
        var result = await mockedPrd.OrderByDescending(x => x.createdDate);
        return result;
    }
    public async Task<bool> RemoveProductById(int searchId)
    {
        var result = await mockedPrd.Where(x => x.id == searchId).Select(x);
        mockedPrd.Remove(result);

        return true;
    }
}

public class EndpointService
{
    public readonly ProductService _productservice;
    public EndpointService(ProductService ps)
    {
        _productservice = ps;
    }

    [Route("api/products")]
    [HttpGet]
    public Action<List<Product>> GetAllProducts()
    {
        var result = _productservice.GetProducts();
        return OK(result);
    }
    [Route("api/products/{id}")]
    [HttpGet]
    public Action<Product> GetProductsById(int id)
    {
        var result = _productservice.GetProductById(id);
        return OK(result);
    }
    [Route("api/products/{id}")]
    [HttpDelete]
    public Action<Product> DeleteProductsById(int id)
    {
        var result = _productservice.RemoveProductById(id);
        return OK(result);
    }
}
