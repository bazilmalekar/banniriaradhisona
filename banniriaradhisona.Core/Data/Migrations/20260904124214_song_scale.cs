using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace banniriaradhisona.Data.Migrations
{
    /// <inheritdoc />
    public partial class song_scale : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SongScale",
                table: "Songs",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SongScale",
                table: "Songs");
        }
    }
}
