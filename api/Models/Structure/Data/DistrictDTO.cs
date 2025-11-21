namespace API.Models.Structure;

public class DistrictDTO
{
    public string Name { get; private set; }
    public string CodeRUIAN { get; private set; }

    public DistrictDTO(string name, string codeRuian)
    {
        Name = name;
        CodeRUIAN = codeRuian;
    }
}