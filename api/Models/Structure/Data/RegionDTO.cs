namespace API.Models.Structure;

public class RegionDTO
{
    public string Name { get; private set; }
    public string CodeRUIAN { get; private set; }

    public RegionDTO(string name, string codeRuian)
    {
        Name = name;
        CodeRUIAN = codeRuian;
    }
}