using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sillage.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateVariableSyntaxError : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Genre",
                table: "Fragrances",
                newName: "Gender");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Gender",
                table: "Fragrances",
                newName: "Genre");
        }
    }
}
