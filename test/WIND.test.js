require('chai')
  .use(require('bn-chai')(web3.utils.BN))
  .use(require('chai-as-promised'))
  .should()

const WIND = artifacts.require('./WIND.sol')
const Whirlwind = artifacts.require('./NativeWhirlwind.sol')
const { NATIVE_AMOUNT } = process.env

const snarkjs = require('snarkjs')
const bigInt = snarkjs.bigInt
const toFixedHex = (number, length = 32) =>  '0x' + bigInt(number).toString(16).padStart(length * 2, '0')

contract('WIND', accounts => {
  let wind
  let whirlwind
  const creator = accounts[0]
  const sender = accounts[1]
  const otherSender = accounts[2]
  const value = NATIVE_AMOUNT || '1000000000000000000' // 1 bnb

  before(async () => {
    wind = await WIND.deployed()
    whirlwind = await Whirlwind.deployed()
  })

  it("should have a total supply of 100 million and a premine of 5 million", async () => {
    let supply = await wind.totalSupply()
    supply.should.be.eq.BN("100000000000000000000000000")
    let balance = await wind.balanceOf(creator)
    balance.should.be.eq.BN("5000000000000000000000000")

    supply = await wind.currentSupply()
    supply.should.be.eq.BN("5000000000000000000000000")
  })

  it("shouldn't mint anything until privacy mining is enabled", async () => {
    let commitment = toFixedHex(42)
    let logs = (await whirlwind.deposit(commitment, { value, from: sender })).receipt.rawLogs

    logs.length.should.be.equal(1)
    let currentSupply = await wind.currentSupply()
    currentSupply.should.be.eq.BN("5000000000000000000000000")

    await wind.enablePrivacyMining({ from: creator })

    logs = (await whirlwind.deposit(toFixedHex(12), { value, from: sender })).receipt.rawLogs
    logs[0].topics[0].should.be.equal("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef")
    logs[0].topics[1].should.be.equal(toFixedHex(WIND.address))
    logs[0].topics[2].should.be.equal(toFixedHex(sender))
  })

  it("should've minted an appropriate reward", async () => {
    // Should've minted 95,000,000 / 75000000 * 3 tokens
    let remainingSupply = (await wind.totalSupply()).sub(new web3.utils.BN("5000000000000000000000000"))
    let reward = remainingSupply.div(new web3.utils.BN(75000000)).mul(new web3.utils.BN(3))
    let balance = await wind.balanceOf(sender)
    balance.should.be.eq.BN(reward)
    let newSupply = await wind.currentSupply()
    newSupply.should.be.eq.BN((new web3.utils.BN("5000000000000000000000000")).add(reward))
  })

  it("should reduce the reward over time", async () => {
    // Just does the above reward calc again
    // If the current supply was updated, and the check passes again, it'll be lower
    let currentSupply = await wind.currentSupply()
    let remainingSupply = (await wind.totalSupply()).sub(currentSupply)
    let reward = remainingSupply.div(new web3.utils.BN(75000000)).mul(new web3.utils.BN(3))
    await whirlwind.deposit(toFixedHex(1), { value, from: otherSender })
    let balance = await wind.balanceOf(otherSender)
    balance.should.be.eq.BN(reward)
  })

  it("shouldn't change the total supply", async () => {
    let supply = await wind.totalSupply()
    supply.should.be.eq.BN("100000000000000000000000000")
  })
})
