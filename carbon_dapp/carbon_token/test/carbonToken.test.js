// SPDX-License-Identifier: MIT
const CarbonCred = artifacts.require("CarbonCred");

contract("CarbonCred", (accounts) => {
    let carbonCred;
    const owner = accounts[0];
    const user = accounts[1];
    const minter = accounts[2];
    // const initialSupply = web3.utils.toBN(web3.utils.toWei("1000", "ether")); // Initial supply for testing

    before(async () => {
        carbonCred = await CarbonCred.new("CarbonCred", "CC", 1000000, 1000, owner); // Deploy the contract with initial values
    });

    it("Transfers tokens from owner to user", async () => {
      const initialBalanceOwner = await carbonCred.balanceOf(owner);
      const initialBalanceUser = await carbonCred.balanceOf(user);
      const transferAmount = web3.utils.toBN(web3.utils.toWei("100", "ether"));
  
      console.log("Initial Owner Balance: " + initialBalanceOwner.toString());
      console.log("Initial User Balance: " + initialBalanceUser.toString());
  
      await carbonCred.transfer(user, transferAmount, { from: owner });
  
      const finalBalanceOwner = await carbonCred.balanceOf(owner);
      const finalBalanceUser = await carbonCred.balanceOf(user);
  
      console.log("Final Owner Balance: " + finalBalanceOwner.toString());
      console.log("Final User Balance: " + finalBalanceUser.toString());
  
      assert.equal(finalBalanceOwner.toString(), initialBalanceOwner.sub(transferAmount).toString(), "Owner balance should decrease");
      assert.equal(finalBalanceUser.toString(), initialBalanceUser.add(transferAmount).toString(), "User balance should increase");
  });

    it("Mints tokens by a minter", async () => {
        const initialSupply = await carbonCred.totalSupply();
        const mintAmount = web3.utils.toBN(web3.utils.toWei("100", "ether"));

        // Assign MINTER role to the minter
        // await carbonCred.addMinter(minter, { from: owner });

        // Mint tokens
        await carbonCred.mint(user, mintAmount, { from: minter });

        const finalSupply = await carbonCred.totalSupply();
        const finalBalanceUser = await carbonCred.balanceOf(user);

        assert.equal(finalSupply.toString(), initialSupply.add(mintAmount).toString(), "Total supply should increase");
        assert.equal(finalBalanceUser.toString(), mintAmount.toString(), "User balance should increase");
    });


});
