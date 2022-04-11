pragma solidity ^0.8.11;
//TODO: Maybe use uniswaps interface?
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IWETH9.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IVault.sol";

contract TestRoute {
    address public immutable WETH;
    address public immutable DAI;
    address public immutable yvDAI;
    address public immutable UniswapV2Router02;

    constructor(address _WETH, address _DAI,address _yvDAI address _UniswapV2Router02) {
        WETH = _WETH;
        DAI = _DAI;
        UniswapV2Router02 = _UniswapV2Router02;
    }

    //TODO: Create mapping of _tokenOut to _tokenOutSwap, so that if e.g., _tokenOut = yvDAI -> _tokenOutSwap = DAI
    function deposit(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _maxSlippage
    ) external payable {
        swap(_tokenIn, _tokenOut, _amountIn, _maxSlippage);
        // yvDeposit(_tokenOut, );
    }

    function swap(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _maxSlippage
    ) internal {
        address[] memory path;
        if (_tokenIn != WETH) {
            //TODO: Is msg.value always ETH? Or can other tokens be sent to payable functions?
            require(msg.value == _amountIn, "Wrong amount of ETH sent.");
            path = new address[](3);
            path[0] = _tokenIn;
            path[1] = WETH;
            path[2] = _tokenOut;
        } else {
            //TODO: Resolve the double check of _tokenIn == WETH
            require(_tokenIn == WETH);
            path = new address[](2);
            path[0] = WETH;
            path[1] = _tokenOut;
        }

        IERC20(WETH).transferFrom(msg.sender, address(this), _amountIn);
        IERC20(WETH).approve(UniswapV2Router02, _amountIn);

        //TODO: calc _amountOutMin
        uint256[] memory _amountOutMins = IUniswapV2Router02(UniswapV2Router02).getAmountsOut(
            _amountIn,
            path
        );
        //TODO: How to handle slippage properly
        uint256 _amountOutMin = _amountOutMins[path.length - 1] * _maxSlippage;

        //TODO: implement block.timestamp (deadline)
        IUniswapV2Router02(UniswapV2Router02).swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            path,
            address(this),
            block.timestamp
        );
    }

    function yvDeposit(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn
    ) internal {

    }

    receive() external payable {}

    fallback() external payable {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
