using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Estoque.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddSalesCategoryAndLastOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LastOrdersId",
                table: "OrderItem",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "LastOrders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Client = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Date = table.Column<string>(type: "varchar(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LastOrders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SalesCategories",
                columns: table => new
                {
                    Category = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Sales = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesCategories", x => x.Category);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItem_LastOrdersId",
                table: "OrderItem",
                column: "LastOrdersId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItem_LastOrders_LastOrdersId",
                table: "OrderItem",
                column: "LastOrdersId",
                principalTable: "LastOrders",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItem_LastOrders_LastOrdersId",
                table: "OrderItem");

            migrationBuilder.DropTable(
                name: "LastOrders");

            migrationBuilder.DropTable(
                name: "SalesCategories");

            migrationBuilder.DropIndex(
                name: "IX_OrderItem_LastOrdersId",
                table: "OrderItem");

            migrationBuilder.DropColumn(
                name: "LastOrdersId",
                table: "OrderItem");
        }
    }
}
