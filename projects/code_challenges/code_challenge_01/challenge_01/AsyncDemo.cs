namespace challenge_01;

public static class AsyncDemo
{
    public static async Task<int> SumWithDelayAsync(IEnumerable<int> values, CancellationToken ct = default)
    {
        int sum = 0;
        foreach (var v in values)
        {
            ct.ThrowIfCancellationRequested();
            await Task.Delay(10, ct); // simula IO
            checked { sum += v; }     // protege overflow
        }
        return sum;
    }
}
