using System.Collections.Generic;

namespace challenge_01;

public static class Algorithms
{
    public static char FirstNonRepeatingChar(string s)
    {
        if (string.IsNullOrEmpty(s)) return '\0';
        var freq = new Dictionary<char, int>();
        foreach (var c in s) freq[c] = freq.TryGetValue(c, out var n) ? n + 1 : 1;
        foreach (var c in s) if (freq[c] == 1) return c;
        return '\0';
    }
}
