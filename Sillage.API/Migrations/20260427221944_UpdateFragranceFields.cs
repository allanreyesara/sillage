using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sillage.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFragranceFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Occasion",
                table: "Fragrances");

            migrationBuilder.DropColumn(
                name: "Weather",
                table: "Fragrances");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Fragrances",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GeneralNotes",
                table: "Fragrances",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Fragrances",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsManual",
                table: "Fragrances",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "MainAccords",
                table: "Fragrances",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MainAccordsPercentage",
                table: "Fragrances",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OccasionRanking",
                table: "Fragrances",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SeasonRanking",
                table: "Fragrances",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GeneralNotes",
                table: "Fragrances");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Fragrances");

            migrationBuilder.DropColumn(
                name: "IsManual",
                table: "Fragrances");

            migrationBuilder.DropColumn(
                name: "MainAccords",
                table: "Fragrances");

            migrationBuilder.DropColumn(
                name: "MainAccordsPercentage",
                table: "Fragrances");

            migrationBuilder.DropColumn(
                name: "OccasionRanking",
                table: "Fragrances");

            migrationBuilder.DropColumn(
                name: "SeasonRanking",
                table: "Fragrances");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Fragrances",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Occasion",
                table: "Fragrances",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Weather",
                table: "Fragrances",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }
    }
}
