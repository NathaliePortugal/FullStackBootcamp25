using Xunit;
using challenge_01;
using System.Threading;
using System.Threading.Tasks;

public class AsyncDemoTests
{
    [Fact]
    public async Task SumWithDelayAsync_Sums()
    {
        var nums = new[] {1,2,3};
        var total = await AsyncDemo.SumWithDelayAsync(nums);
        Assert.Equal(6, total);
    }

    [Fact]
public async Task SumWithDelayAsync_Cancels()
{
    var cts = new CancellationTokenSource();
    cts.Cancel();
    await Assert.ThrowsAsync<OperationCanceledException>(async () =>
        await AsyncDemo.SumWithDelayAsync(new[]{1,2,3}, cts.Token));
    // O más amplio:
    // await Assert.ThrowsAnyAsync<OperationCanceledException>(async () => ...);
}

}
