namespace challenge03.Interfaces;

public interface IChallenge
{
    string Id { get; }
    string Title { get; }
    string Run(string[] args);
}
