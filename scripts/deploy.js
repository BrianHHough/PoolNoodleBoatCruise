// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const BoatCruise = await hre.ethers.getContractFactory("BoatCruise");
  const boatCruise = await BoatCruise.deploy();
  await boatCruise.deployed();
  console.log("boatCruise deployed to:", boatCruise.address);

  const PoolNoodleNFT = await hre.ethers.getContractFactory("PoolNoodleNFT");
  const poolNoodleNFT = await PoolNoodleNFT.deploy(boatCruise.address);
  await poolNoodleNFT.deployed();
  console.log("poolNoodle deployed to:", poolNoodleNFT.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
