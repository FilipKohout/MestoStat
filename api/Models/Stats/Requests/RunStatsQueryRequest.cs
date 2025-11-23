using System.ComponentModel.DataAnnotations;

namespace API.Models.Stats.Requests;

public class RunStatsQueryRequest
{
    [Required]
    public DateTime StartDate { get; set; }
    [Required]
    public DateTime EndDate { get; set; }
    public string? Periodicity { get; set; }
    public string? StructureLevel { get; set; }
}