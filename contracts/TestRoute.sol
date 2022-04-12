pragma solidity ^0.8.11;
//TODO: Maybe use uniswaps interface?
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IWETH9.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IVault.sol";

import "hardhat/console.sol";

contract YearnZapper {
    //TODO: Only for debugging purposes. Will be removed when contract can accept any token.
    address public immutable WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    // address public immutable DAI;
    // address public immutable YvDAI;
    //TODO: hardcode router?
    address public immutable UniswapV2Router02 = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    constructor(
        // address _WETH, 
        // address _DAI, 
        // address _YvDAI, 
        // address _UniswapV2Router02
        ) {
        // WETH = _WETH;
        // DAI = _DAI;
        // YvDAI = _YvDAI;
        // UniswapV2Router02 = _UniswapV2Router02;
    }

    //TODO: Create mapping of _tokenOut to _tokenOutSwap, so that if e.g., _tokenOut = yvDAI -> _tokenOutSwap = DAI
    function deposit(
        address _tokenInUni,
        address _tokenOutYearn,
        uint256 _amountIn,
        uint256 _maxSlippage
    ) external payable {
        address _tokenInYearn = IVault(_tokenOutYearn).token();
        swap(_tokenInUni, _tokenInYearn, _amountIn, _maxSlippage);
        IERC20(_tokenInYearn).approve(_tokenOutYearn, IERC20(_tokenInYearn).balanceOf(address(this)));
        yvDeposit(_tokenOutYearn, IERC20(_tokenInYearn).balanceOf(address(this)));
    }

    function withdraw(
        address
    ) external {

    }

    function swap(
        address _tokenInUni,
        address _tokenInYearn,
        uint256 _amountIn,
        uint256 _maxSlippage
    ) internal {
        address[] memory path;
    
        //TODO: Right now contract only accepts WETH. Make it accept any token by checking best route from _tokenInUni to _TokenOutUni
        if (_tokenInUni != WETH) {
            //TODO: Is msg.value always ETH? Or can other tokens be sent to payable functions?
            require(msg.value == _amountIn, "Wrong amount of ETH sent.");
            path = new address[](3);
            path[0] = _tokenInUni;
            path[1] = WETH;
            path[2] = _tokenInYearn;
        } else {
            //TODO: Resolve the double check of _tokenIn == WETH
            require(_tokenInUni == WETH);
            path = new address[](2);
            path[0] = WETH;
            path[1] = _tokenInYearn;
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
            // msg.sender,
            //TODO: msg.sender only for debugging purposes
            address(this),
            block.timestamp
        );
    }

    function yvDeposit(
        address _vaultReceiptToken,
        uint256 _amountIn
    ) internal {
        IVault(_vaultReceiptToken).deposit(_amountIn, msg.sender);
    }

    //TODO: what is maxLoss? -> https://docs.yearn.finance/vaults/smart-contracts/vault#withdraw-3
    function yvWithdraw(
        address _vaultReceiptToken,
        uint256 _amountIn
    ) internal {
        IERC20(_vaultReceiptToken).transferFrom(msg.sender, address(this), _amountIn);
        IVault(_vaultReceiptToken).withdraw(_amountIn, msg.sender);
    }

    receive() external payable {}

    fallback() external payable {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
