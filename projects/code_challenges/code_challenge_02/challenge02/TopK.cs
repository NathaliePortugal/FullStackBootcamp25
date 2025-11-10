using System.Text.RegularExpressions;

namespace challenge02;

public interface IFrequentWords
{
    IEnumerable<(string Word, int Count)> TopKFrequentWords(string? text, int k);
}

public class TopKService : IFrequentWords
{
    public IEnumerable<(string Word, int Count)> TopKFrequentWords(string? text, int k)
    {
        if (string.IsNullOrWhiteSpace(text) || k <= 0)
            return Enumerable.Empty<(string Word, int Count)>();

        // Extrae solo palabras con letras Unicode y normaliza a minúsculas
        var matches = System.Text.RegularExpressions.Regex.Matches(text, @"\p{L}+");
        if (matches.Count == 0)
            return Enumerable.Empty<(string Word, int Count)>();
        
        var dictWords = new Dictionary<string, int>(StringComparer.Ordinal);

        foreach (System.Text.RegularExpressions.Match m in matches)
        {
            var tk = m.Value.ToLowerInvariant();
            dictWords[tk] = dictWords.TryGetValue(tk, out var c) ? c + 1 : 1;
        }

        return dictWords
            .OrderByDescending(p => p.Value)
            .ThenBy(p => p.Key, StringComparer.Ordinal)
            .Take(k)
            .Select(kvp => (kvp.Key, kvp.Value));
    }
}
