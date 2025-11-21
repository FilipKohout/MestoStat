namespace API.Models.Structure;

public class MunicipalityDTO
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public string Status { get; private set; }
    public string District { get; private set; }
    public string Region { get; private set; }

    public MunicipalityDTO(int id, string name, string status, string district, string region)
    {
        Id = id;
        Name = name;
        Status = status;
        District = district;
        Region = region;
    }
}