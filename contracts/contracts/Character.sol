// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Character is ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => uint256[]) public itemStats;
    mapping(uint256 => string) public uri;

    constructor(string memory name, string memory symbol) public ERC721(name, symbol) {}

    function mintBuy(uint256 mych,string memory url) public payable returns (uint256) {
        require(
            msg.value == 50000000000000000,
            "You need to pay 50 TFUEL to buy this item"
        );
        require(balanceOf(msg.sender)<1,"You are already a owner of nft");
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        
        itemStats[newItemId] = [mych,10+50, 10+50];
        uri[newItemId] = url;
        return newItemId;
    }

    function getStats(uint256 tokenId) public view returns (uint256[] memory) {
        return itemStats[tokenId];
    }

    function getNft(address getter) public view returns (uint256[] memory){
        uint256 amount = balanceOf(getter);
         uint256[] memory ids = new uint256[](amount);
          for (uint256 i = 0; i < amount; i++) {
            ids[i] = tokenOfOwnerByIndex(getter, i);
        }
        return ids;
    }
    function getUrl(uint256 tokenId) public view returns (string memory){
        return uri[tokenId];
    }

}
