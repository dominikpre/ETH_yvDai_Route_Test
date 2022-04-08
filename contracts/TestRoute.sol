pragma solidity ^0.8.11;
//TODO: Maybe use uniswaps interface?
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IUniswapV2Router02.sol";

contract TestRoute {
    //TODO: what should be public/private costant/not constant
    address UniswapV2Router02Address = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    IUniswapV2Router02 uniswapRouter = IUniswapV2Router02(UniswapV2Router02Address);
    address WETHAddress = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    IERC20 WETH = IERC20(WETHAddress);
    address DAIAddress = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    IERC20 DAI = IERC20(DAIAddress);

    function swapEthToDAIonUni(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _maxSlippage
    ) external payable {
        //TODO: is "memory" even necessary?
        address[] memory path;
        if (_tokenIn != WETHAddress) {
            //TODO: Is msg.value always ETH? Or can other tokens be sent to payable functions?
            require(msg.value == _amountIn, "Wrong amount of ETH sent.");
            path = new address[](3);
            path[0] = _tokenIn;
            path[1] = WETHAddress;
            path[2] = _tokenOut;
        } else {
            //TODO: Resolve the double check of _tokenIn == WETH
            require(_tokenIn == WETHAddress);
            path = new address[](2);
            path[0] = WETHAddress;
            path[1] = _tokenOut;
        }


        
        WETH.transferFrom(msg.sender, address(this), _amountIn);
        WETH.approve(UniswapV2Router02Address, _amountIn);

        //TODO: calc _amountOutMin
        uint256[] memory _amountOutMins = uniswapRouter.getAmountsOut(
            _amountIn,
            path
        );
        uint256 _amountOutMin = _amountOutMins[path.length - 1] * _maxSlippage;

        //TODO: implement block.timestamp (deadline)
        uniswapRouter.swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            path,
            address(this),
            block.timestamp
        );
    }
}
