namespace API.Models.Structure;

public class MunicipalityDTO
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public string Status { get; private set; }
    public string DistrictName { get; private set; }
    public int DistrictId { get; private set; }
    public string RegionName { get; private set; }
    public int RegionId { get; private set; }
    public int ZUJ { get; private set; }
    public string? ImageURL { get; private set; }
    public string? ICO { get; private set; }
    public string? DIC { get; private set; }

    public MunicipalityDTO(int id, string name, string status, int districtId, string districtName, int regionId, string regionName, int zuj, string? imageURL, string? ico, string? dic)
    {
        Id = id;
        Name = name;
        Status = status;
        DistrictName = districtName;
        DistrictId = districtId;
        RegionName = regionName;
        RegionId = regionId;
        ZUJ = zuj;
        ImageURL = imageURL;
        ICO = ico;
        DIC = dic;
    }
}