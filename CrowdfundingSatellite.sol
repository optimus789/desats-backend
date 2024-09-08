pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CrowdfundingSatellite is Ownable, ReentrancyGuard {
    struct Campaign {
        address creator;
        uint256 goal;
        uint256 totalFunded;
        uint256 endTime;
        bool isActive;
        address tokenAddress;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => address[]) public contributors;

    event CampaignCreated(uint256 indexed tokenId, address creator, uint256 goal, uint256 endTime, address tokenAddress);
    event ContributionMade(uint256 indexed tokenId, address contributor, uint256 amount);
    event CampaignEnded(uint256 indexed tokenId, bool successful, uint256 totalFunded);

    constructor(address initialOwner) Ownable(initialOwner) {
        
    }

    function createCampaign(uint256 _tokenId, uint256 _goal, uint256 _duration, address _tokenAddress) external onlyOwner {
        require(campaigns[_tokenId].creator == address(0), "Campaign already exists");
        
        campaigns[_tokenId] = Campaign({
            creator: msg.sender,
            goal: _goal,
            totalFunded: 0,
            endTime: block.timestamp + _duration,
            isActive: true,
            tokenAddress: _tokenAddress
        });

        emit CampaignCreated(_tokenId, msg.sender, _goal, block.timestamp + _duration, _tokenAddress);
    }

    function contribute(uint256 _tokenId, uint256 _amount) external nonReentrant {
        Campaign storage campaign = campaigns[_tokenId];
        require(campaign.isActive, "Campaign is not active");
        require(block.timestamp < campaign.endTime, "Campaign has ended");

        IERC20 token = IERC20(campaign.tokenAddress);
        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        if (contributions[_tokenId][msg.sender] == 0) {
            contributors[_tokenId].push(msg.sender);
        }
        contributions[_tokenId][msg.sender] += _amount;
        campaign.totalFunded += _amount;

        emit ContributionMade(_tokenId, msg.sender, _amount);
    }

    function endCampaign(uint256 _tokenId) external onlyOwner {
        Campaign storage campaign = campaigns[_tokenId];
        require(campaign.isActive, "Campaign is not active");
        require(block.timestamp >= campaign.endTime, "Campaign has not ended yet");

        campaign.isActive = false;
        bool successful = campaign.totalFunded >= campaign.goal;

        if (successful) {
            IERC20(campaign.tokenAddress).transfer(campaign.creator, campaign.totalFunded);
        } else {
            for (uint i = 0; i < contributors[_tokenId].length; i++) {
                address contributor = contributors[_tokenId][i];
                uint256 amount = contributions[_tokenId][contributor];
                if (amount > 0) {
                    IERC20(campaign.tokenAddress).transfer(contributor, amount);
                    contributions[_tokenId][contributor] = 0;
                }
            }
        }

        emit CampaignEnded(_tokenId, successful, campaign.totalFunded);
    }

    function getCampaignDetails(uint256 _tokenId) external view returns (
        address creator,
        uint256 goal,
        uint256 totalFunded,
        uint256 endTime,
        bool isActive,
        address tokenAddress
    ) {
        Campaign storage campaign = campaigns[_tokenId];
        return (
            campaign.creator,
            campaign.goal,
            campaign.totalFunded,
            campaign.endTime,
            campaign.isActive,
            campaign.tokenAddress
        );
    }

    function getContributorCount(uint256 _tokenId) external view returns (uint256) {
        return contributors[_tokenId].length;
    }

    function getContributorDetails(uint256 _tokenId, uint256 _index) external view returns (address contributor, uint256 amount) {
        require(_index < contributors[_tokenId].length, "Invalid index");
        contributor = contributors[_tokenId][_index];
        amount = contributions[_tokenId][contributor];
    }

    function setTokenAddress(uint256 _tokenId, address _newTokenAddress) external onlyOwner {
        require(campaigns[_tokenId].creator != address(0), "Campaign does not exist");
        require(!campaigns[_tokenId].isActive, "Cannot change token address for active campaign");
        campaigns[_tokenId].tokenAddress = _newTokenAddress;
    }
}