// SPDX-License-Identifier: MIT

//changed ^0.5.17 to >=0.5.17
pragma solidity >=0.5.17;

interface IVault {
    function token() external view returns (address);

    function underlying() external view returns (address);

    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint8);

    function controller() external view returns (address);

    function governance() external view returns (address);

    function getPricePerFullShare() external view returns (uint256);

    function deposit(uint256) external;

    function deposit(uint256, address) external;

    function depositAll() external;

    function withdraw(uint256) external;

    function withdraw(uint256, address) external;

    function withdrawAll() external;
}