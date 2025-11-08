namespace challenge_01;

public record Order(int UserId, decimal Amount);

public static class OrderQueries
{
    public static IEnumerable<(int UserId, decimal Total)> TotalByUser(IEnumerable<Order> orders)
        => orders
            .GroupBy(o => o.UserId)
            .Select(g => (UserId: g.Key, Total: g.Sum(x => x.Amount)))
            .OrderByDescending(t => t.Total);
}
