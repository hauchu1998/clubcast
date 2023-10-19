// SPDX-License-Identifier: Pepega
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/IERC721.sol";
import "./interface/IERC20.sol";
import "./interface/IGovernance.sol";

struct Club {
    string clubId;
    address owner;
    address governanceAddress;
    address erc721Address;
    uint256 maxMember;
}

contract ClubCast is Ownable {
    struct Publication {
        string videoId;
        address publisher;
        string ipfsUrl;
    }

    IERC20 public tippingToken;

    event NewPublication(string indexed videoId, string indexed clubId, address publisher, string ipfsUrl);
    event NewClub(string indexed clubId, address indexed creator, address erc721Address, address governanceAddress);
    event Tipped(address indexed tipper, string indexed clubId, uint256 amount);
    event Withdrawn(address indexed creator, string indexed clubId, uint256 amount);

    mapping(address => mapping(string => uint256)) public userClubTokenMappings;
    mapping(address => string[]) public userClubIds;
    mapping(string => Publication[]) public publications;
    mapping(string => Club) public clubs;
    mapping(string => address[]) public clubMembers;
    mapping(string => uint256) public tips;

    constructor(address _tippingTokenAddress) Ownable(msg.sender) {
        tippingToken = IERC20(_tippingTokenAddress);
    }

    modifier onlyERC721Owner(address _erc721Address) {
        IERC721 erc721 = IERC721(_erc721Address);
        require(erc721.owner() == msg.sender, "You must be the owner of the ERC721 contract");
        _;
    }

    modifier onlyClubOwner(string memory _clubId) {
        address owner = getClubOwner(_clubId);
        address _erc721Address = getClubErc721(_clubId);
        IERC721 erc721 = IERC721(_erc721Address);
        require(
            owner == msg.sender && erc721.owner() == msg.sender,
            "You must be the owner of the club and the ERC721 contract"
        );
        _;
    }

    modifier onlyClubMember(string memory _clubId, address requester) {
        address owner = getClubOwner(_clubId);
        address _erc721Address = getClubErc721(_clubId);
        IERC721 erc721 = IERC721(_erc721Address);
        uint256 tokenId = userClubTokenMappings[requester][_clubId];
        require(requester == owner || erc721.ownerOf(tokenId) == requester, "You are not a club member");
        _;
    }

    function getClubOwner(string memory _clubId) public view returns (address) {
        return clubs[_clubId].owner;
    }

    function getClubErc721(string memory _clubId) public view returns (address) {
        return clubs[_clubId].erc721Address;
    }

    function getClubGovernance(string memory _clubId) public view returns (address) {
        return clubs[_clubId].governanceAddress;
    }

    function getClubInfo(string memory _clubId) public view returns (Club memory) {
        return clubs[_clubId];
    }

    function createClub(
        string memory _clubId,
        address _erc721Address,
        address _governanceAddress
    ) external onlyERC721Owner(_erc721Address) {
        IERC721 erc721 = IERC721(_erc721Address);
        Club memory newClub = Club({
            clubId: _clubId,
            owner: msg.sender,
            governanceAddress: _governanceAddress,
            erc721Address: _erc721Address,
            maxMember: erc721.getMaxSupply()
        });
        clubs[_clubId] = newClub;
        emit NewClub(_clubId, msg.sender, _erc721Address, _governanceAddress);
    }

    function publishVideo(
        string memory _clubId,
        string memory _videoId,
        string memory _ipfsUrl
    ) external onlyClubOwner(_clubId) {
        Publication memory newPublication = Publication({videoId: _videoId, publisher: msg.sender, ipfsUrl: _ipfsUrl});

        publications[_clubId].push(newPublication);
        emit NewPublication(_videoId, _clubId, msg.sender, _ipfsUrl);
    }

    function joinClub(string memory _clubId) external returns (uint256 _tokenId) {
        address _erc721Address = getClubErc721(_clubId);
        IERC721 erc721 = IERC721(_erc721Address);
        _tokenId = erc721.publicMint(msg.sender);

        require(erc721.ownerOf(_tokenId) == msg.sender, "Caller must be the owner of the token");
        userClubTokenMappings[msg.sender][_clubId] = _tokenId;
        userClubIds[msg.sender].push(_clubId);
        clubMembers[_clubId].push(msg.sender);
    }

    function getClubMembers(string memory _clubId) public view returns (address[] memory) {
        return clubMembers[_clubId];
    }

    function getPublicationCount(string memory _clubId) public view returns (uint256) {
        return publications[_clubId].length;
    }

    function listPublications(
        string memory _clubId,
        address _requester
    ) external view onlyClubMember(_clubId, _requester) returns (Publication[] memory) {
        return publications[_clubId];
    }

    function tipContentCreator(uint256 _amount, string memory _clubId) external {
        require(_amount > 0, "Amount should be greater than zero");
        // shoudl check if the _clubId exists

        require(tippingToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        tips[_clubId] += _amount;

        emit Tipped(msg.sender, _clubId, _amount);
    }

    function withdrawTips(string memory _clubId) public onlyClubOwner(_clubId) {
        uint256 amountToWithdraw = tips[_clubId];
        require(amountToWithdraw > 0, "No tips to withdraw");

        tips[_clubId] = 0;

        require(tippingToken.transfer(msg.sender, amountToWithdraw), "Transfer failed");

        emit Withdrawn(msg.sender, _clubId, amountToWithdraw);
    }

    function getUserClubIds(address _userAddress) public view returns (string[] memory, uint256[] memory) {
        string[] memory clubIds = userClubIds[_userAddress];
        uint256[] memory clubTokens = new uint256[](clubIds.length);

        for (uint256 i = 0; i < clubIds.length; i++) {
            clubTokens[i] = userClubTokenMappings[_userAddress][clubIds[i]];
        }
        return (clubIds, clubTokens);
    }
}
