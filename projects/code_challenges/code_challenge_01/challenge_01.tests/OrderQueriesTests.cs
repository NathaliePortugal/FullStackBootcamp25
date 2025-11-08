using Xunit;
using challenge_01;
using System.Linq;

public class OrderQueriesTests
{
    [Fact]
    public void TotalByUser_SumsCorrectly()
    {
        var data = new[]
        {
            new Order(1, 10m), new Order(2, 5m),
            new Order(1, 7m),  new Order(3, 12m),
        };

        var result = OrderQueries.TotalByUser(data).ToArray();

        Assert.Equal((1, 17m), result[0]);
        Assert.Contains(result, x => x.UserId == 3 && x.Total == 12m);
        Assert.Contains(result, x => x.UserId == 2 && x.Total == 5m);
    }
}
