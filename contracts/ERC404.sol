//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC404.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Dryads is ERC404 {
    string public dataURI;
    string public baseTokenURI;

    constructor(
        address _owner
    ) ERC404("DryadsTest", "404", 18, 1000000000, _owner) {
        balanceOf[_owner] = 1000000000 * 10 ** 18;
    }

    function setDataURI(string memory _dataURI) public onlyOwner {
        dataURI = _dataURI;
    }

    function setTokenURI(string memory _tokenURI) public onlyOwner {
        baseTokenURI = _tokenURI;
    }

    function setNameSymbol(
        string memory _name,
        string memory _symbol
    ) public onlyOwner {
        _setNameSymbol(_name, _symbol);
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        if (bytes(baseTokenURI).length > 0) {
            return string.concat(baseTokenURI, Strings.toString(id));
        } else {
            uint8 seed = uint8(bytes1(keccak256(abi.encodePacked(id))));
            string memory image = string.concat(Strings.toString(id), '.gif');
            string memory color = generateColorCode(seed);

            string memory jsonPreImage = string.concat(
                string.concat(
                    string.concat('{"name": "DryadsTest #', Strings.toString(id)),
                    '","description":"A collection of 1,000,000,000 Replicants enabled by ERC404, an experimental token standard.","external_url":"https://dryads.ai","image":"'
                ),
                string.concat(dataURI, image)
            );
            string memory jsonPostImage = string.concat(
                '","attributes":[{"trait_type":"Color","value":"',
                color
            );
            string memory jsonPostTraits = '"}]}';

            return
                string.concat(
                    "data:application/json;utf8,",
                    string.concat(
                        string.concat(jsonPreImage, jsonPostImage),
                        jsonPostTraits
                    )
                );
        }
    }

    function generateColorCode(uint8 seed) private pure returns (string memory) {
        bytes memory buffer = new bytes(6);
        bytes16 alphabet = "0123456789ABCDEF";
        for (uint256 i = 0; i < 6; i++) {
            buffer[i] = alphabet[uint8((seed >> (i * 4)) & 0x0F)];
        }
        return string(abi.encodePacked("#", buffer));
    }

}