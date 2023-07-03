const Character = artifacts.require("Character");
const Game = artifacts.require("Game");
const CyberChips = artifacts.require("CyberChips");


module.exports = async function (deployer) {
    // Deploy the SolidityContract contract as our only task
    let ch = await deployer.deploy(Character, "Fighter", "Boxer");
    let cyber = await deployer.deploy(CyberChips, "5000000000000000000000");
    let game = await deployer.deploy(Game,cyber.address);
};