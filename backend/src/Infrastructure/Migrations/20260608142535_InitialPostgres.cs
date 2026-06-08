using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgriEcommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialPostgres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "AcresGrown",
                table: "Products",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "FarmLocation",
                table: "Products",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SoilType",
                table: "Products",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FarmingMethod",
                table: "FarmerProfiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GovRecordsUrl",
                table: "FarmerProfiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LeaseDocumentUrl",
                table: "FarmerProfiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OrganicCertificateUrl",
                table: "FarmerProfiles",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OwnershipType",
                table: "FarmerProfiles",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AcresGrown",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "FarmLocation",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "SoilType",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "FarmingMethod",
                table: "FarmerProfiles");

            migrationBuilder.DropColumn(
                name: "GovRecordsUrl",
                table: "FarmerProfiles");

            migrationBuilder.DropColumn(
                name: "LeaseDocumentUrl",
                table: "FarmerProfiles");

            migrationBuilder.DropColumn(
                name: "OrganicCertificateUrl",
                table: "FarmerProfiles");

            migrationBuilder.DropColumn(
                name: "OwnershipType",
                table: "FarmerProfiles");
        }
    }
}
