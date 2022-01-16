const { expect } = require("chai");
const { ethers } = require("hardhat");

// The goal of this test is to return an array of Pool Noodles (NFT items) within the Boat Cruise - create 2 items, sell 1, and return 1
describe("BoatCruise", function () {
  it("Should allow/enable sales of Pool Noodle NFTs ", async function () {
    const BoatCruise = await ethers.getContractFactory("BoatCruise")
    const boatCruise = await BoatCruise.deploy()
    await boatCruise.deployed()
    // pass in address for constructor
    const boatCruiseAddress = boatCruise.address

    const PoolNoodle = await ethers.getContractFactory("PoolNoodleNFT")
    const poolNoodle = await PoolNoodle.deploy(boatCruiseAddress)
    await poolNoodle.deployed()
    const poolNoodleAddress = poolNoodle.address

    // get reference to listing price
    let listingPrice = await boatCruise.getListingPrice()
    listingPrice = listingPrice.toString()

    const bidPrice = ethers.utils.parseUnits('100', 'ether')


    // create 2 NFTs on the market for sale
    // create tokens to interact with them - pass in URI
    await poolNoodle.createToken("https://www.mytokenlocation.com")
    await poolNoodle.createToken("https://www.mytokenlocation2.com")
    // pass in listing price
    await boatCruise.createPoolNoodle(poolNoodleAddress, 1, bidPrice, { value: listingPrice })
    await boatCruise.createPoolNoodle(poolNoodleAddress, 2, bidPrice, { value: listingPrice })

    // get a reference to 1st address and then buyer address
    const [_, buyerAddress] = await ethers.getSigners()
    // connect to sale
    await boatCruise.connect(buyerAddress).createPoolNoodleSale(poolNoodleAddress, 1, { value: bidPrice })
  
    // Test to query for Pool Noodles
      // asynchronous mapping
    items = await boatCruise.fetchPoolNoodles()

    items = await Promise.all(items.map(async i => {
      const tokenUri = await poolNoodle.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    // log items
    console.log('items: ', items)
  
  });
});
