namespace API.Models.Stats.Data;

public class TableDTO
{
    public int TableId { get; private set; }
    public string Name { get; private set; }
    public DateTime LastUpdated { get; private set; }
    public string SourceDomain { get; private set; }
    public int PeriodicityId { get; private set; }
    public string PeriodicityName { get; private set; }
    public int StructureLevelId { get; private set; }
    public string StructureLevelName { get; private set; }

    public TableDTO(int tableId, string name, DateTime lastUpdated, string sourceDomain, int periodicityId, string periodicityName, int structureLevelId, string structureLevelName)
    {
        TableId = tableId;
        Name = name;
        LastUpdated = lastUpdated;
        SourceDomain = sourceDomain;
        PeriodicityId = periodicityId;
        PeriodicityName = periodicityName;
        StructureLevelId = structureLevelId;
        StructureLevelName = structureLevelName;
    }
}