using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace banniriaradhisona.Data.Migrations
{
    /// <inheritdoc />
    public partial class updated_AudioKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AudioUrl",
                table: "Songs",
                newName: "AudioKey");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AudioKey",
                table: "Songs",
                newName: "AudioUrl");
        }
    }
}
