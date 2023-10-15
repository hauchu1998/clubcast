// SPDX-License-Identifier: Pepega
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC721 {
    function owner() external view returns (address owner);

    function ownerOf(uint256 tokenId) external view returns (address owner);
}

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    function transfer(address recipient, uint256 amount) external returns (bool);
}

enum AudienceType {
    ALL,
    HOLDERS,
    TRAITS,
    TOKEN
}

struct Audience {
    AudienceType audienceType;
    uint256 tokenId;
}

contract ClubCast is Ownable {
    struct Publication {
        uint256 videoId;
        address publisher;
        string md5Hash;
        address erc721Address;
        Audience audience;
    }

    IERC20 public tippingToken;

    event NewPublication(uint256 indexed videoId, address indexed erc721Address, address publisher, string md5Hash);
    event Tipped(address indexed tipper, address indexed erc721Address, uint256 amount);
    event Withdrawn(address indexed publisher, address indexed erc721Address, uint256 amount);

    mapping(address => uint256) public tips;
    mapping(address => Publication[]) public publications;
    mapping(address => mapping(address => uint256)) public userTokenMappings;
    mapping(address => address[]) public userErc721Addresses;

    constructor(address _tippingTokenAddress) {
        tippingToken = IERC20(_tippingTokenAddress);
    }

    modifier onlyERC721Owner(address _erc721Address) {
        IERC721 erc721 = IERC721(_erc721Address);
        require(erc721.owner() == msg.sender, "You must be the owner of the ERC721 contract");
        _;
    }

    function publishVideo(
        uint256 _videoId,
        string memory _md5Hash,
        address _erc721Address,
        Audience memory _audience
    ) external onlyERC721Owner(_erc721Address) {
        Publication memory newPublication = Publication({
            videoId: _videoId,
            publisher: msg.sender,
            md5Hash: _md5Hash,
            erc721Address: _erc721Address,
            audience: _audience
        });

        publications[_erc721Address].push(newPublication);

        emit NewPublication(_videoId, _erc721Address, msg.sender, _md5Hash);
    }

    function getPublicationCount(address _erc721Address) public view returns (uint256) {
        return publications[_erc721Address].length;
    }

    struct PublicationInfo {
        uint256 videoId;
        address publisher;
        string md5Hash;
        Audience audience;
    }

    function listPublications(address _erc721Address, address _requester) public view returns (PublicationInfo[] memory publicationInfos) {
        uint256 length = getPublicationCount(_erc721Address);
        uint256 tokenId = userTokenMappings[_requester][_erc721Address];

        uint256 j = 0;
        for (uint256 i = 0; i < length; i++) {
            Publication storage publication = publications[_erc721Address][i];

            // Handle the scenario where content creators have published to all holders
            if (publication.audience.audienceType == AudienceType.HOLDERS && tokenId == 0) {
                continue;
            }

            // Handle the scenario where content creators have published got a target token
            if (publication.audience.audienceType == AudienceType.TOKEN && publication.audience.tokenId != tokenId) {
                continue;
            }
            j++;
        }

        publicationInfos = new PublicationInfo[](j);

        j = 0;
        for (uint256 i = 0; i < length; i++) {
            Publication storage publication = publications[_erc721Address][i];

            if (publication.audience.audienceType == AudienceType.HOLDERS && tokenId == 0) {
                continue;
            }

            if (publication.audience.audienceType == AudienceType.TOKEN && publication.audience.tokenId != tokenId) {
                continue;
            }

            publicationInfos[j] = PublicationInfo({
                videoId: publication.videoId,
                publisher: publication.publisher,
                md5Hash: publication.md5Hash,
                audience: publication.audience
            });
            j++;
        }
    }

    function tipContentCreator(uint256 _amount, address _erc721Address) external {
        require(_amount > 0, "Amount should be greater than zero");
        require(_erc721Address != address(0), "ERC-721 address cannot be zero address");

        require(tippingToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        tips[_erc721Address] += _amount;

        emit Tipped(msg.sender, _erc721Address, _amount);
    }

    function withdrawTips(address _erc721Address) public onlyERC721Owner(_erc721Address) {
        require(_erc721Address != address(0), "ERC-721 address cannot be zero address");

        uint256 amountToWithdraw = tips[_erc721Address];
        require(amountToWithdraw > 0, "No tips to withdraw");

        tips[_erc721Address] = 0;

        require(tippingToken.transfer(msg.sender, amountToWithdraw), "Transfer failed");

        emit Withdrawn(msg.sender, _erc721Address, amountToWithdraw);
    }

    function addUserTokenMapping(address[] memory _erc721Addresses, uint256[] memory _tokenIds) external {
        require(_erc721Addresses.length == _tokenIds.length, "Arrays should have the same length");
        require(_erc721Addresses.length > 0, "addresses array must be larger than 0");
        require(_tokenIds.length > 0, "tokenIds array must be larger than 0");

        delete userErc721Addresses[msg.sender];

        for (uint256 i = 0; i < _erc721Addresses.length; i++) {
            IERC721 erc721 = IERC721(_erc721Addresses[i]);
            require(erc721.ownerOf(_tokenIds[i]) == msg.sender, "Caller must be the owner of the token");

            userTokenMappings[msg.sender][_erc721Addresses[i]] = _tokenIds[i];
            userErc721Addresses[msg.sender].push(_erc721Addresses[i]);
        }
    }

    function getUserTokenMapping(address _userAddress) public view returns (address[] memory, uint256[] memory) {
        address[] memory erc721Addresses = userErc721Addresses[_userAddress];
        uint256[] memory tokenIds = new uint256[](erc721Addresses.length);

        for (uint256 i = 0; i < erc721Addresses.length; i++) {
            tokenIds[i] = userTokenMappings[_userAddress][erc721Addresses[i]];
        }

        return (erc721Addresses, tokenIds);
    }
}
