using System.ComponentModel.DataAnnotations;

namespace API.Models.Stats.Requests;

public class RunStatsQueryRequest
{
    [Required]
    public DateTime StartDate { get; set; }
    [Required]
    public DateTime EndDate { get; set; }
    [Required]
    public int IdentifierId { get; set; }
    public int? Periodicity { get; set; }
}