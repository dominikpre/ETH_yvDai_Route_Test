const { ethers } = require("hardhat");
const { AlphaRouter } = require("@uniswap/smart-order-router");

const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
const owner = ethers.getSigners();

const router = new AlphaRouter({
    chainId: 1,
    provider: ethers.getDefaultProvider,
});

const SHIB = new Token(
    1,
    '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    18,
    'SHIB',
    'SHIBA INU'
);

const CURVE3CRV = new Token(
    1,
    '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
    18,
    '3Crv',
    'Curve.fi DAI/USDC/USDT'
);

const route = await router.route(
    ethers.utils.parseEther("1.1"),
    SHIB,
    TradeType.EXACT_INPUT,
    {
        recipient: owner.address,
        slippageTolerance: new Percent(2, 100),
    }
)

const transaction = {
    data: route.methodParameters.calldata,
    to: V3_SWAP_ROUTER_ADDRESS,
    value: BigNumber.from(route.methodParameters.value),
    from: owner.address,
    gasPrice: BigNumber.from(route.gasPriceWei),
};

await owner.sendTransaction(transaction);
