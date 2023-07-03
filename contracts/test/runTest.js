const Character = artifacts.require("Character");
const Game = artifacts.require("Game");
const CyberChips = artifacts.require("CyberChips");

contract("Character", (accounts) => {
    it("should put 10000 MetaCoin in the first account", async () => {
        const character = await Character.deployed();
        
        const mint = await character.mintBuy({from: accounts[0], value: 50000000000000000000})
        let stats = await character.getStats.call(1);
        console.log(Number(stats[0]))

    });

});


contract("Game", (accounts) => {
    it("should put 10000 MetaCoin in the first account", async () => {
        const game = await Game.deployed();
        const cyberchips = await CyberChips.deployed();

        console.log("ok dkdkkk")
    
        await cyberchips.approve(game.address,50000,{from: accounts[0]})
        await game.depositTokens(50000,{from: accounts[0]})
        const mint = await game.createTournament("Qf",1683058163,3982,"fd",500,{from: accounts[0]})
        console.log("ok are we doing")
        let stats = await game.getTournamentPlayers.call(0);
        console.log(stats)

    });

});
