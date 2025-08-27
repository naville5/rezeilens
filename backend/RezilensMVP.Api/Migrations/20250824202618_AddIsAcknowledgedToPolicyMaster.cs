using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RezilensMVP.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIsAcknowledgedToPolicyMaster : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsAcknowledged",
                table: "PolicyMasters",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAcknowledged",
                table: "PolicyMasters");
        }
    }
}
