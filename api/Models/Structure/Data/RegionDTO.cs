namespace API.Models.Structure;

public class RegionDTO
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public string CodeRUIAN { get; private set; }

    public RegionDTO(int id, string name, string codeRuian)
    {
        Id = id;
        Name = name;
        CodeRUIAN = codeRuian;
    }
}