using challenge03.Challenges;
using FluentAssertions;

namespace challenge03.tests.Challenges;

public class TwoSumTests
{
    [Theory]
    [InlineData(new[] {2,7,11,15}, 9)]
    [InlineData(new[] {3,2,4}, 6)]
    [InlineData(new[] {3,3}, 6)]
    public void Should_Find_Pair(int[] nums, int target)
    {
        var sut = new TwoSumChallenge();
        var args = new[] { $"nums={string.Join(',', nums)}", $"target={target}" };

        var output = sut.Run(args);
        output.Should().NotBe("no-solution");

        var parts = output.Trim('[',']').Split(',');
        var i = int.Parse(parts[0]);
        var j = int.Parse(parts[1]);
        (nums[i] + nums[j]).Should().Be(target);
    }
}
