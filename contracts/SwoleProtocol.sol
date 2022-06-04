//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SwoleProtocol is ERC721URIStorage, IERC2981, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private tokenCounter;

    event WorkoutMinted(uint tokenId, string tokenURI, uint256 royaltyPercentageForOwner);

    uint256 public _royaltyAmount;

    constructor() ERC721("SwoleProtocol", "SWOLE") {
        _royaltyAmount = 5;
    }

    function withdraw() public onlyOwner {
        address _owner = owner();
        uint _amount = address(this).balance;

        (bool success, ) = _owner.call{value: _amount}("");
        require(success, "failed to withdraw funds");
    }

    function mintWorkout(string memory _tokenURI) public {
        address _msgSender = _msgSender();
        uint256 newTokenId = tokenCounter.current();

        _safeMint(_msgSender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        tokenCounter.increment();

        emit WorkoutMinted(newTokenId, _tokenURI, _royaltyAmount);
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        returns (address _receiver, uint256 royaltyAmount)
    {
        require(_exists(tokenId), "Nonexistent token");
        uint256 royalty = ((salePrice * _royaltyAmount) / 100);
        return (ownerOf(tokenId), royalty);
    }
}