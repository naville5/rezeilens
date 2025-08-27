using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RezilensMVP.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAcknowledgementFieldsToPolicyMaster : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AcknowledgedBy",
                table: "PolicyMasters",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "AcknowledgedDate",
                table: "PolicyMasters",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AcknowledgedBy",
                table: "PolicyMasters");

            migrationBuilder.DropColumn(
                name: "AcknowledgedDate",
                table: "PolicyMasters");
        }
    }
}
