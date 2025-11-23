namespace API.Models.Structure;

public class DistrictDTO
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public string CodeRUIAN { get; private set; }
    public string RegionName { get; private set; }
    public int RegionId { get; private set; }

    public DistrictDTO(int id, string name, string codeRuian, int regionId, string region)
    {
        Id = id;
        Name = name;
        CodeRUIAN = codeRuian;
        RegionName = region;
        RegionId = regionId;
    }
}