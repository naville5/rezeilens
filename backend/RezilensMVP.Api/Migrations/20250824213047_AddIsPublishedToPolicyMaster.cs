using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RezilensMVP.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIsPublishedToPolicyMaster : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "PolicyMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "PolicyMasters");
        }
    }
}
