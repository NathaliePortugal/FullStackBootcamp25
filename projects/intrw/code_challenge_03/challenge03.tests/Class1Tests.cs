
using challenge03;
namespace challenge03.tests;

public class UnitTest1
{
    public List<Product> mockedPrd;
    public readonly IProduct _ps;
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
    public UnitTest1(IProduct productservice)
    {
        _ps = productservice;
    }

    [Fact]
    public async Task GetAllProducts()
    {
        //Arrange
        mockedPrd = SeedData();

        //Act
        var result = await _ps.GetAllProducts();

        //Assert
        //result.Co

    }
}
