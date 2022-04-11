const { expect } = require("chai");
const { ethers } = require("hardhat");

const weth9_address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const dai_address = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const uniswapV2Router02_address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

describe("TestRoute contract", function () {
  it("Should have more DAI balance after swapping from WETH", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const TestRoute = await ethers.getContractFactory("TestRoute");
    const testRoute = await TestRoute.deploy(weth9_address, dai_address, uniswapV2Router02_address);
    await testRoute.deployed();

    let weth9 = await ethers.getContractAt("contracts/interfaces/IWETH9.sol:IWETH9", weth9_address);
    let dai = await ethers.getContractAt("contracts/interfaces/IERC20.sol:IERC20", dai_address);

    let dbb = await dai.balanceOf(owner.address);
    let dbb2 = ethers.utils.formatUnits(dbb, 18);
    let dai_balance_before = ethers.utils.parseUnits(dbb2);

    await weth9.deposit({value: ethers.utils.parseEther("1")});
    await weth9.approve(testRoute.address, ethers.utils.parseEther("1"));
    const setSwapTx = await testRoute.deposit(weth9_address, dai_address, ethers.utils.parseEther("1"), 1);
    await setSwapTx.wait();

    let dba = await dai.balanceOf(owner.address);
    let dba2 = ethers.utils.formatUnits(dba, 18);
    let dai_balance_after = ethers.utils.parseUnits(dba2);

    expect(dai_balance_after).to.above(dai_balance_before);
  });
});
