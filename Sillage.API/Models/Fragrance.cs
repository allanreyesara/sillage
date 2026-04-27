namespace Sillage.API.Models
{

    public enum Genre
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
        public string? Description { get; set; }
        public string? Notes { get; set; }
        public string? Weather { get; set; }
        public string? Occasion { get; set; }
        public Genre Genre { get; set; } = Genre.Unisex;
        public Concentration Concentration { get; set; } = Concentration.EauDeParfum;
        public DateTime DateAdded { get; set; }

    }
}