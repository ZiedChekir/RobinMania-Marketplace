async function main() {
  MP = await ethers.getContractFactory("MarketPlace");
  MPlace = await MP.attach("0x42670556893Bcb7bbC53Cfe75fF4FCbeCc3d5cA6");
  for (let i = 1; i < 6; i++) {
    ordersOfi = await MPlace.getOrdersOf(i);
    for (let j = ordersOfi.length - 1; j > 0; j--) {
      //all orders except the first
      await MPlace.removeListing(i, j);
      console.log(i, j);
    }
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
