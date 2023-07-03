const { ethers } = require('ethers');
const CHARACTER_ABI = require('../abis/Character');
const GAME_ABI = require('../abis/Game');
const CSC_ABI = require('../abis/CyberChips');

const privateKey = ''; // Replace with your private key
const rpcEndpoint = 'https://rpc.testnet.fantom.network';

const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint);
const wallet = new ethers.Wallet(privateKey, provider);

const WALLET_ADDRESS = wallet.address;
const CSC_ADDRESS = '0xb1E60480679488C2F4Cdd4386a1b32CF3022fC4a';
const GAME_ADDRESS = '0x664Eac62640aE2b794eC2fE32DB506E53134DD9E';
const CHARACTER_ADDRESS = '0x6C7416a04d9b6C085d296C4A0a0De96a318Aea8D';

let CSC_CONTRACT;
let GAME_CONTRACT;

let isReady = false;

const prepare = async () => {
    if (isReady) {
        return;
    }
    CSC_CONTRACT = new ethers.Contract(CSC_ADDRESS, CSC_ABI.abi, wallet);
    GAME_CONTRACT = new ethers.Contract(GAME_ADDRESS, GAME_ABI.abi, wallet);
    isReady = true;
};

const handleAllowance = async (receiver, amount) => {
    const allowanceAmount = await CSC_CONTRACT.allowance(WALLET_ADDRESS, receiver);
    if (amount > allowanceAmount) {
        const approveTx = await CSC_CONTRACT.approve(receiver, amount);
        await approveTx.wait();
    }
};

const handleHandleTournaments = (data) => {
    const items = [];
    const current = Math.floor(Date.now() / 1000);
    for (const x of data) {
        const endTime = parseInt(x[2]) + parseInt(x[3]);
        if (current <= endTime) {
            const players = x[6];
            const isJoined = players.includes(WALLET_ADDRESS);
            const item = {
                id: x[0].toString(),
                name: x[1],
                isJoined: isJoined,
                fees: x[5].toString(),
                endTime: endTime,
                startTime: parseInt(x[2]),
                map: 'Jungle Fantasy',
            };
            items.push(item);
        }
    }
    items.sort((a, b) => {
        const keyA = a.startTime;
        const keyB = b.startTime;
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    });
    return items;
};

const createTournament = async ({ name, startTime, length, gameType, depositAmount }) => {
    await prepare();
    await CSC_CONTRACT.faucet();
    const allowanceAmount = await CSC_CONTRACT.allowance(WALLET_ADDRESS, GAME_ADDRESS);
    if (allowanceAmount < depositAmount) {
        await handleAllowance(GAME_ADDRESS, depositAmount);
    }

    const createTournamentTx = await GAME_CONTRACT.createTournament(
        name,
        startTime,
        length,
        gameType,
        depositAmount
    );
    const createTournamentReceipt = await createTournamentTx.wait();
    console.log('createTournament:', createTournamentReceipt);
};

const getTournaments = async () => {
    await prepare();
    const tournamentsTemp = await GAME_CONTRACT.getAllTournaments();
    return handleHandleTournaments(tournamentsTemp);
};

const finalsieGameId = async (gameId, players) => {
    const addresses = [];
    const scores = [];
    for (const player of Object.keys(players)) {
        addresses.push(player.address);
        scores.push(player.score);
    }
    const finalizeGameTx = await GAME_CONTRACT.tournamentOver(gameId, addresses, scores);
    console.log('finalizeGameId', finalizeGameTx);
};

const spendToken = async (from, amount) => {
    const allowanceAmount = await CSC_CONTRACT.allowance(from, WALLET_ADDRESS);
    console.log(`Allowed amount ${allowanceAmount} and requested amount ${amount}`)
    
    if (!ethers.BigNumber.from(allowanceAmount.toString()).gte(ethers.BigNumber.from(amount.toString())) ) {
        return false;
    }
    console.log('sufficient balance going ahead')
    const transferFromTx = await CSC_CONTRACT.transferFrom(from, WALLET_ADDRESS, amount);
    console.log(`spend tx:`, transferFromTx)
    await transferFromTx.wait();
    return true;
};

module.exports = {
    createTournament,
    getTournaments,
    finalsieGameId,
    spendToken,
};