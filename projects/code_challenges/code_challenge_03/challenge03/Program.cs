using challenge03.Challenges;
using challenge03.Interfaces;

var challenges = new List<IChallenge>
{
    new TwoSumChallenge()
};

// Si no hay args: mostrar lista
if (args.Length == 0)
{
    Console.WriteLine("Desafíos disponibles:");
    foreach (var c in challenges)
        Console.WriteLine($"- {c.Id} | {c.Title}");
    Console.WriteLine("\nEjemplo: dotnet run --project challenge03 -- two-sum nums=2,7,11,15 target=9");
    return;
}

var id = args[0];
var current = challenges.FirstOrDefault(c => c.Id == id);

if (current is null)
{
    Console.WriteLine($"No se encontró el desafío '{id}'.");
    return;
}

var output = current.Run(args.Skip(1).ToArray());
Console.WriteLine($"Resultado: {output}");
