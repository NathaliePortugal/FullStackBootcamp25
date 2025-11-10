using challenge03.Interfaces;

namespace challenge03.Challenges;

public class TwoSumChallenge : IChallenge
{
    public string Id => "two-sum";
    public string Title => "Two Sum (find indices)";

    public string Run(string[] args)
    {
        var numsArg = args.FirstOrDefault(a => a.StartsWith("nums=")) ?? "nums=";
        var targetArg = args.FirstOrDefault(a => a.StartsWith("target=")) ?? "target=0";

        var nums = numsArg["nums=".Length..]
            .Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(int.Parse)
            .ToArray();

        var target = int.Parse(targetArg["target=".Length..]);

        var map = new Dictionary<int, int>();
        for (int i = 0; i < nums.Length; i++)
        {
            int need = target - nums[i];
            if (map.TryGetValue(need, out var j))
                return $"[{j},{i}]";
            map[nums[i]] = i;
        }
        return "no-solution";
    }
}
