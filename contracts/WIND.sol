pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract WIND is Ownable, ERC20, ERC20Detailed {
  uint256 constant MAX_SUPPLY = 100000000 * 1e18;
  uint256 constant PREMINE = MAX_SUPPLY / 100 * 5;

  mapping(address => uint256) private _minters;

  bool private _privacyMining;
  uint256 private _currentSupply;

  event AddedWhirlwind(address indexed whirlwind, uint256 factor);
  event RemovedWhirlwind(address indexed whirlwind);
  event PrivacyMiningEnabled();

  constructor() Ownable() ERC20Detailed("Whirlwind Cash", "WIND", 18) public {
    // Ensures the total supply is considered as 100 million
    // Requirement due to the antiquated ERC20 contract
    _mint(address(this), MAX_SUPPLY);
    // 5% premine
    _transfer(address(this), msg.sender, PREMINE);
    _currentSupply = PREMINE;
  }

  function currentSupply() public view returns (uint256) {
    return _currentSupply;
  }

  // Factor is a scale used when scoring participation.
  // Amounts such as 1 BNB or 10 USDT are prioritized over 100 BNB.
  // Factors can be updated by removing the Whirlwind and re-adding.
  function addWhirlwind(address whirlwind, uint256 factor) public onlyOwner {
    require(_minters[whirlwind] == 0);
    require(factor <= 5);
    _minters[whirlwind] = factor;
    emit AddedWhirlwind(whirlwind, factor);
  }

  // Will disable all further deposits into the whirlwind
  function removeWhirlwind(address whirlwind) public onlyOwner {
    require(_minters[whirlwind] != 0);
    _minters[whirlwind] = 0;
    emit RemovedWhirlwind(whirlwind);
  }

  function enablePrivacyMining() public onlyOwner {
    _privacyMining = true;
    emit PrivacyMiningEnabled();
  }

  function privacyMining() public view returns (bool) {
    return _privacyMining;
  }

  // Reward a privacy user with WIND.
  // Amount is based off current supply and what asset was used.
  function reward(address destination) public {
    if (!_privacyMining) {
      return;
    }
    require(_minters[msg.sender] != 0);
    uint256 amount = ((MAX_SUPPLY - _currentSupply) / 75000000) * _minters[msg.sender];
    _currentSupply += amount;
    // Safe even if the amount hits 0
    _transfer(address(this), destination, amount);
  }
}
