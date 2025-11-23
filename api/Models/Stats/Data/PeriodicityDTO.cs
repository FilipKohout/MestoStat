namespace API.Models.Stats.Data;

public class PeriodicityDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    public PeriodicityDTO(int id, string name)
    {
        Id = id;
        Name = name;
    }
}