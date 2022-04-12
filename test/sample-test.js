const { expect } = require("chai");
const { ethers } = require("hardhat");

const weth9_address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const dai_address = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const yvDai_address = "0xdA816459F1AB5631232FE5e97a05BBBb94970c95";
const uniswapV2Router02_address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

describe("YearnZapper contract", function () {
  let owner;
  let addr1;
  let addr2;
  let addrs;

  let YearnZapper;
  let yearnZapper;

  let weth9;
  let dai;
  let yvdai_ERC20;

  before("Should deploy YearnZapper contract successfully", async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    YearnZapper = await ethers.getContractFactory("YearnZapper");
    yearnZapper = await YearnZapper.deploy();
    await yearnZapper.deployed();

    weth9 = await ethers.getContractAt("contracts/interfaces/IWETH9.sol:IWETH9", weth9_address);
    dai = await ethers.getContractAt("contracts/interfaces/IERC20.sol:IERC20", dai_address);
    yvdai_ERC20 = await ethers.getContractAt("contracts/interfaces/IERC20.sol:IERC20", yvDai_address);

    await owner.sendTransaction({to: addr1.address, value: ethers.utils.parseEther("1.1")});
    // let addrTemp = ethers.constants.Zero;
    //TODO: fix sendTx in line 40
    let valueTemp = await yvdai_ERC20.balanceOf(addr1.address);
    colsole.log("typeof:" + typeof(valueTemp));
    valueTemp = ethers.utils.parseEther(valueTemp);
    console.log("valueTemp: " + valueTemp);
    await addr1.sendTransaction({to: ethers.constants.AddressZero, value: valueTemp});
    console.log("yvDai balance before (but after burn all): " + await yvdai_ERC20.balanceOf(addr1.address));
  });

  it("Should have more yvDAI balance after WETH -> DAI -> yvDai", async function() {
    // let dbb = await dai.balanceOf(addr1.address);
    // let dbb2 = ethers.utils.formatUnits(dbb, 18);
    // let dai_balance_before = ethers.utils.parseUnits(dbb2);
    // console.log("DAI Balance before: " + dai_balance_before);

    let yvdbb = await yvdai_ERC20.balanceOf(addr1.address);
    let yvdbb2 = ethers.utils.formatUnits(yvdbb, 18);
    let yvdai_balance_before = ethers.utils.parseUnits(yvdbb2);
    console.log("yvDAI Balance before: " + yvdai_balance_before);

    await weth9.connect(addr1).deposit({ value: ethers.utils.parseEther("1") });
    console.log("WETH balance of addr1: " + await weth9.balanceOf(addr1.address));
    console.log("ETH balance of addr1: " + ethers.utils.formatEther(await ethers.provider.getBalance(addr1.address)));
    await weth9.connect(addr1).approve(yearnZapper.address, ethers.utils.parseEther("1"));
    const setSwapTx = await yearnZapper.connect(addr1).deposit(weth9_address, yvDai_address, ethers.utils.parseEther("1"), 1);
    await setSwapTx.wait();

    // let dba = await dai.balanceOf(addr1.address);
    // let dba2 = ethers.utils.formatUnits(dba, 18);
    // let dai_balance_after = ethers.utils.parseUnits(dba2);
    // console.log("DAI Balance after: " + dai_balance_after);

    let yvdba = await yvdai_ERC20.balanceOf(addr1.address);
    let yvdba2 = ethers.utils.formatUnits(yvdba, 18);
    let yvdai_balance_after = ethers.utils.parseUnits(yvdba2);
    console.log("yvDAI Balance after: " + yvdai_balance_after);

    expect(yvdai_balance_after).to.be.above(yvdai_balance_before);
  });

  it("Should have no yvDAI in wallet, but more DAI than before", async function() {

  });

});

