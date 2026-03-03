using System.ComponentModel.DataAnnotations;

namespace API.Models.Stats.Requests;

public class DownloadStructureRequest
{
    [Required]
    public int StructureLevelId { get; set; }
    [Required] 
    public bool ShouldAggregate { get; set; } = true;
    public int? PeriodicityId { get; set; }
}