// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PoolNoodleNFT is ERC721URIStorage {
    // implement counting for NFTs by tokenId
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    // address of marketplace
    address contractAddress;

    // Constructor goes here:
    constructor(address boatcruiseAddress) ERC721("Pool Noodle Tokens", "PNT") {
        contractAddress = boatcruiseAddress;
    }

    function createToken(string memory tokenURI) public returns (uint256) {
        // increment tokens by 1
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        // allow minter to mint Pool Noodle NFTs
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        // allow users to transact token within Boat Cruise
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
}
