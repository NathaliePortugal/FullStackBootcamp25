using Xunit;
using challenge_01;

public class AlgorithmsTests
{
    [Theory]
    [InlineData("swiss", 'w')]
    [InlineData("aabbccdde", 'e')]
    [InlineData("aabb", '\0')]
    public void FirstNonRepeatingChar_Works(string input, char expected)
    {
        var got = Algorithms.FirstNonRepeatingChar(input);
        Assert.Equal(expected, got);
    }
}
