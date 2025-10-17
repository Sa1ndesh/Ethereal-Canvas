// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title EtherealCanvasNFT
 * @dev NFT contract for Ethereal Canvas AI Art Platform
 * @author Ethereal Canvas Team
 */
contract EtherealCanvasNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    
    // Mapping from token ID to prompt used to generate the art
    mapping(uint256 => string) private _tokenPrompts;
    
    // Mapping from token ID to creation timestamp
    mapping(uint256 => uint256) private _tokenTimestamps;
    
    // Minting fee in wei (0.001 ETH = 1000000000000000 wei)
    uint256 public mintingFee = 1000000000000000;
    
    // Events
    event ArtworkMinted(
        uint256 indexed tokenId,
        address indexed artist,
        string tokenURI,
        string prompt,
        uint256 timestamp
    );
    
    event MintingFeeUpdated(uint256 oldFee, uint256 newFee);

    constructor() ERC721("Ethereal Canvas", "ETHEREAL") {}

    /**
     * @dev Mint a new NFT artwork
     * @param to Address to mint the NFT to
     * @param tokenURI IPFS URI of the artwork metadata
     * @param prompt AI prompt used to generate the artwork
     */
    function mintArtwork(
        address to,
        string memory tokenURI,
        string memory prompt
    ) public payable returns (uint256) {
        require(msg.value >= mintingFee, "Insufficient minting fee");
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");
        require(bytes(prompt).length > 0, "Prompt cannot be empty");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Store additional metadata
        _tokenPrompts[tokenId] = prompt;
        _tokenTimestamps[tokenId] = block.timestamp;

        emit ArtworkMinted(tokenId, to, tokenURI, prompt, block.timestamp);

        return tokenId;
    }

    /**
     * @dev Get the prompt used to generate a specific artwork
     * @param tokenId Token ID to query
     * @return The AI prompt used to generate the artwork
     */
    function getTokenPrompt(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenPrompts[tokenId];
    }

    /**
     * @dev Get the creation timestamp of a specific artwork
     * @param tokenId Token ID to query
     * @return The timestamp when the artwork was minted
     */
    function getTokenTimestamp(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenTimestamps[tokenId];
    }

    /**
     * @dev Get the current token ID counter
     * @return The next token ID that will be minted
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @dev Update the minting fee (only owner)
     * @param newFee New minting fee in wei
     */
    function setMintingFee(uint256 newFee) public onlyOwner {
        uint256 oldFee = mintingFee;
        mintingFee = newFee;
        emit MintingFeeUpdated(oldFee, newFee);
    }

    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Get contract balance
     * @return Contract balance in wei
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
