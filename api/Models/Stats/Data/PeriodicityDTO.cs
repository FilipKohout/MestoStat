namespace API.Models.Stats.Data;

public class PeriodicityDTO
{
    public int Id { get; set; }
    public int IntervalMonths { get; set; }
    public string Name { get; set; }
    
    public PeriodicityDTO(int id, string name, int intervalMonths)
    {
        Id = id;
        Name = name;
        IntervalMonths = intervalMonths;
    }
}