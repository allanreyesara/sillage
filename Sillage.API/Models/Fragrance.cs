namespace Sillage.API.Models
{
    public enum Gender
    {
        Unisex,
        Masculine,
        Feminine
    }

    public enum Concentration
    {
        EauDeParfum,
        EauDeToilette,
        EauDeCologne,
        Parfum
    }

    public class Fragrance
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? Name { get; set; }
        public string? House { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public Gender Gender { get; set; } = Gender.Unisex;
        public Concentration Concentration { get; set; } = Concentration.EauDeParfum;
        public bool IsManual { get; set; } = false;

        // JSON columns
        public string? GeneralNotes { get; set; }
        public string? MainAccords { get; set; }
        public string? MainAccordsPercentage { get; set; }
        public string? SeasonRanking { get; set; }
        public string? OccasionRanking { get; set; }
        public string? Notes { get; set; }

        public DateTime DateAdded { get; set; } = DateTime.UtcNow;
    }
}