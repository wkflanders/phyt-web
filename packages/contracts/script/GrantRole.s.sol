// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {Minter} from "../src/Minter.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract GrantMintConfigRoleScript is Script {
    // The DEFAULT_ADMIN_ROLE is 0x00 by convention.
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
    // Compute the MINT_CONFIG_ROLE hash.
    bytes32 public constant MINT_CONFIG_ROLE = keccak256("MINT_CONFIG_ROLE");

    function run() external {
        // Read required environment variables.
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address serverAddress = vm.envAddress("SERVER_ADDRESS");
        address payable minterAddress = payable(
            vm.envAddress("MINTER_ADDRESS")
        );

        // Get deployer address from the private key.
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deployer Address:", deployer);
        console.log("Server Address:", serverAddress);
        console.log("Minter Address:", minterAddress);

        // Instantiate the Minter contract.
        Minter minter = Minter(minterAddress);

        // Check if deployer holds the DEFAULT_ADMIN_ROLE on the Minter.
        bool hasAdminRole = minter.hasRole(DEFAULT_ADMIN_ROLE, deployer);
        console.log("Deployer has admin role:", hasAdminRole);

        vm.startBroadcast(deployerPrivateKey);

        try minter.grantRole(MINT_CONFIG_ROLE, serverAddress) {
            console.log(
                "Successfully granted MINT_CONFIG_ROLE to:",
                serverAddress
            );
            // Verify that the role was granted.
            bool hasRole = minter.hasRole(MINT_CONFIG_ROLE, serverAddress);
            console.log("Role verification:", hasRole);
        } catch Error(string memory reason) {
            console.log("Failed to grant role. Reason:", reason);
        } catch (bytes memory) {
            console.log("Failed to grant role. (No reason specified)");
        }

        vm.stopBroadcast();
    }
}
