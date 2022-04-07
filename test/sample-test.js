const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TestRoute contract", function () {
  it("Should succesfully swap WETH to DAI", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    console.log(owner.address);

    const TestRoute = await ethers.getContractFactory("TestRoute");
    const testRoute = await TestRoute.deploy();
    await testRoute.deployed();
    
    const setSwapTx = await testRoute.swapEthToDAIonUni("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "0x6B175474E89094C44Da98b954EedeAC495271d0F", 1, 1);
    await setSwapTx.wait();
    //TODO: Check if more DAI than before TX
  });
});
