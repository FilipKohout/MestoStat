namespace API.Models.Stats.Data;

public class StructureLevelDTO
{
    public int Id { get; set; }
    public string IndentifierName { get; set; }
    public string Name { get; set; }
    
    public StructureLevelDTO(int id, string name, string indentifierName)
    {
        Id = id;
        Name = name;
        IndentifierName = indentifierName;
    }
}