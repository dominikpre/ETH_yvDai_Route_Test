const { expect } = require("chai");
const { ethers } = require("hardhat");

const weth9_address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const dai_address = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const yvDai_address = "0xdA816459F1AB5631232FE5e97a05BBBb94970c95";
const uniswapV2Router02_address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

describe("YearnZapper contract", function () {
  it("Should have more DAI balance after swapping from WETH", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const YearnZapper = await ethers.getContractFactory("YearnZapper");
    const yearnZapper = await YearnZapper.deploy();
    await yearnZapper.deployed();

    let weth9 = await ethers.getContractAt("contracts/interfaces/IWETH9.sol:IWETH9", weth9_address);
    let dai = await ethers.getContractAt("contracts/interfaces/IERC20.sol:IERC20", dai_address);
    let yvdai_ERC20 = await ethers.getContractAt("contracts/interfaces/IERC20.sol:IERC20", yvDai_address);

    let dbb = await dai.balanceOf(owner.address);
    let dbb2 = ethers.utils.formatUnits(dbb, 18);
    let dai_balance_before = ethers.utils.parseUnits(dbb2);
    console.log("DAI Balance before: " + dai_balance_before);

    let yvdbb = await yvdai_ERC20.balanceOf(owner.address);
    let yvdbb2 = ethers.utils.formatUnits(yvdbb, 18);
    let yvdai_balance_before = ethers.utils.parseUnits(yvdbb2);
    console.log("yvDAI Balance before: " + yvdai_balance_before);

    await weth9.deposit({value: ethers.utils.parseEther("1")});
    await weth9.approve(yearnZapper.address, ethers.utils.parseEther("1"));
    const setSwapTx = await yearnZapper.deposit(weth9_address, yvDai_address, ethers.utils.parseEther("1"), 1);
    await setSwapTx.wait();

    let dba = await dai.balanceOf(owner.address);
    let dba2 = ethers.utils.formatUnits(dba, 18);
    let dai_balance_after = ethers.utils.parseUnits(dba2);
    console.log("DAI Balance after: " + dai_balance_after);

    let yvdba = await yvdai_ERC20.balanceOf(owner.address);
    let yvdba2 = ethers.utils.formatUnits(yvdba, 18);
    let yvdai_balance_after = ethers.utils.parseUnits(yvdba2);
    console.log("yvDAI Balance after: " + yvdai_balance_after);

    // expect(dai_balance_after).to.above(dai_balance_before);
    expect(yvdai_balance_after).to.be.above(yvdai_balance_before);
  });
});
