namespace API.Models.Structure;

public class DistrictDTO
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public string CodeRUIAN { get; private set; }
    public string Region { get; private set; }

    public DistrictDTO(int id, string name, string codeRuian, string region)
    {
        Id = id;
        Name = name;
        CodeRUIAN = codeRuian;
        Region = region;
    }
}