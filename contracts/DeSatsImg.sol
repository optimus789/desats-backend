// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {IOracle} from "https://github.com/galadriel-ai/contracts/blob/main/contracts/contracts/interfaces/IOracle.sol";

contract DeSatsImg {
    uint256 private _nextTokenId;

    struct ImageGenerationInput {
        address owner;
        string prompt;
        bool isGenerated;
    }

    mapping(uint => ImageGenerationInput) public imageInputs;

    event ImageInputCreated(address indexed owner, uint indexed tokenId);

    address private owner;
    address public oracleAddress;
    string public basePrompt;

    event BasePromptUpdated(string indexed newBasePrompt);
    event OracleAddressUpdated(address indexed newOracleAddress);

    constructor(
        address initialOracleAddress,
        string memory initialBasePrompt
    ) {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
        basePrompt = initialBasePrompt;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Caller is not oracle");
        _;
    }

    function setBasePrompt(string memory newBasePrompt) public onlyOwner {
        basePrompt = newBasePrompt;
        emit BasePromptUpdated(newBasePrompt);
    }

    function setOracleAddress(address newOracleAddress) public onlyOwner {
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    function initializeImageGeneration(string memory message) public returns (uint) {
        uint256 currentId = _nextTokenId++;
        ImageGenerationInput storage imageInput = imageInputs[currentId];

        imageInput.owner = msg.sender;
        imageInput.prompt = message;
        imageInput.isGenerated = false;

        string memory fullPrompt = string(abi.encodePacked(basePrompt, message, "\""));
        IOracle(oracleAddress).createFunctionCall(
            currentId,
            "image_generation",
            fullPrompt
        );
        emit ImageInputCreated(msg.sender, currentId);

        return currentId;
    }

    event ImageGenerated(uint indexed tokenId, string response);

    function onOracleFunctionResponse(
        uint runId,
        string memory response,
        string memory /*errorMessage*/
    ) public onlyOracle {
        ImageGenerationInput storage imageInput = imageInputs[runId];
        require(!imageInput.isGenerated, "Image already generated");

        imageInput.isGenerated = true;
        emit ImageGenerated(runId, response);
    }

    function getMessageHistoryContents(uint tokenId) public view returns (string[] memory) {
        string[] memory promptsArray = new string[](1);
        string memory fullPrompt = string(abi.encodePacked(basePrompt, imageInputs[tokenId].prompt, "\""));
        promptsArray[0] = fullPrompt;
        return promptsArray;
    }

    function getRoles(address /*_owner*/, uint /*_tokenId*/) public pure returns (string[] memory) {
        string[] memory rolesArray = new string[](1);
        rolesArray[0] = "user";
        return rolesArray;
    }
}