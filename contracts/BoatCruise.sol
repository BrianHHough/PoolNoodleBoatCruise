// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BoatCruise is ReentrancyGuard {
    // implement counting for NFTs by tokenId
    using Counters for Counters.Counter;
    // track each item in Boat Cruise
    Counters.Counter private _itemIds;
    // track items in Boat Cruise that are sold
    Counters.Counter private _itemsSold;

    // owner makes a commission off of each token sold (listing fee + commission off of what's listed)
    address payable owner;
    uint256 listingPrice = 0.05 ether;

    // owner of contract is the one deploying it
    constructor() {
        owner = payable(msg.sender);
    }

    // variable for each Boat Cruise Item
    struct PoolNoodle {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    // mapping for Boat Cruise Items
    mapping(uint256 => PoolNoodle) private idToPoolNoodle;

    // event emitted anytime a Pool Noodle is created
    event PoolNoodleCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    // function that returns listing price
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    // function for creating Pool Noodle NFT
    function createPoolNoodle(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei or more");
        require(
            msg.value == listingPrice,
            "Price must exactly equal the listing price"
        );

        // increment item ids
        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToPoolNoodle[itemId] = PoolNoodle(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        // transfer ownership of Pool Noodle to contract
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit PoolNoodleCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    // function for creating Pool Noodle Sale on Boat Cruise
    function createPoolNoodleSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = idToPoolNoodle[itemId].price;
        uint256 tokenId = idToPoolNoodle[itemId].tokenId;
        // require person sending transaction put in the correct price value
        require(
            msg.value == price,
            "The asking price is needed for the purchase"
        );

        // transfer value of transaction to owner's address
        idToPoolNoodle[itemId].seller.transfer(msg.value);
        // transfer ownership of token from contract address to buyer
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        idToPoolNoodle[itemId].owner = payable(msg.sender);
        idToPoolNoodle[itemId].sold = true;
        _itemsSold.increment();
        payable(owner).transfer(listingPrice);
    }

    // function returning all of the unsold Pool Noodles by everyone
    function fetchPoolNoodles() public view returns (PoolNoodle[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;
        // array to loop over all items created (if item has no address, then unsold)
        PoolNoodle[] memory items = new PoolNoodle[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            // check first if Pool Noodle is unsold
            if (idToPoolNoodle[i + 1].owner == address(0)) {
                // create a variable name for the Pool Noodles we want to check right now
                uint256 currentId = idToPoolNoodle[i + 1].itemId;
                // create a storage variable to get mapping to each item we want into the array
                PoolNoodle storage currentItem = idToPoolNoodle[currentId];
                // put those items into the index
                items[currentIndex] = currentItem;
                // incremeent current index
                currentIndex += 1;
            }
        }
        return items;
    }

    // function returning all the user's Pool Noodles they purchased
    function fetchMyPoolNoodles() public view returns (PoolNoodle[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        // loop over all items: if id of the Pool Noodle is equal to the msg.sender, increment by 1
        // Ex: if you have 5 Pool Noodles, increments by 5, then returns 5 items below
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToPoolNoodle[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }
        //
        PoolNoodle[] memory items = new PoolNoodle[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToPoolNoodle[i + 1].owner == msg.sender) {
                uint256 currentId = idToPoolNoodle[i + 1].itemId;
                PoolNoodle storage currentItem = idToPoolNoodle[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    // function returning all the user's created Pool Noodles
    function fetchPoolNoodlesCreated()
        public
        view
        returns (PoolNoodle[] memory)
    {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToPoolNoodle[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }
        PoolNoodle[] memory items = new PoolNoodle[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToPoolNoodle[i + 1].seller == msg.sender) {
                uint256 currentId = idToPoolNoodle[i + 1].itemId;
                PoolNoodle storage currentItem = idToPoolNoodle[currentId];
                // insert those results into the array
                items[currentIndex] = currentItem;
                // incremenet over the array
                currentIndex += 1;
            }
        }
        return items;
    }
}
