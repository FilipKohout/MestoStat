namespace API.Models.Structure;

public class MunicipalityDTO
{
    public string Name { get; private set; }
    public string Status { get; private set; }
    public string District { get; private set; }
    public string Region { get; private set; }

    public MunicipalityDTO(string name, string status, string district, string region)
    {
        Name = name;
        Status = status;
        District = district;
        Region = region;
    }
}