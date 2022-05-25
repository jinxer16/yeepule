let network;
let contract_address;
let connection;
let mainAccount;
let accounts;
let Accounttype = "0";
let Wallet_balance;
let Token_Balance;
let windows = {}
let contractAddress = "0x0aC37E74F7D3b9B1EEB89E5eE49Aa52E581f058F";
let abi = [{ "inputs": [{ "internalType": "contract ITRC20", "name": "_tokenaddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": false, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "Token", "outputs": [{ "internalType": "contract ITRC20", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "Users", "outputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "tokenAmount", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }], "name": "_balanceof", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "buy", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "getTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address[]", "name": "_contributors", "type": "address[]" }, { "internalType": "uint256[]", "name": "_balances", "type": "uint256[]" }], "name": "multisendToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "register", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_token", "type": "uint256" }], "name": "sell", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address payable[]", "name": "userAddress", "type": "address[]" }, { "internalType": "uint256[]", "name": "_amount", "type": "uint256[]" }], "name": "sendMultiEth", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "withDraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];

let contractAddressToken = "0xF5D1fEe5B8EA9A7F9007C05c4ebE74732a1BDa2F";
let abiToken = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "mint", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "account", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }, { "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }];


window.setInterval(async function () {
    if (typeof window.ethereum !== undefined) {
        windows.ethereum = window.ethereum
    }
}, 500);

window.addEventListener("load", () => {
    interval = setInterval(async function checkConnection() {
        try {
            //alert(windows.ethereum);
            let isConnected = false;
            if (windows.ethereum) {
                window.web3 = new Web3(windows.ethereum);
                await windows.ethereum.enable();

                isConnected = true;
            } else {
                isConnected = false;
                //connection = "Plz install metamask/trustwallet!";
                connection = "Please  install metamask !!!";
                jQuery(".metamaskConnection").text(connection);
                console.log(connection);
            }
        } catch (error) {

        }
        try {
            let accounts = await getAccounts();
            // jQuery('#loginid').val(accounts[0])
            mainAccount = accounts[0];
           // BalanceOfAccount();
            TokenbalanceOf();
            
            if (accounts.length > 0) {
                connection = "Wallet is Connected";
                jQuery(".metamaskConnection").text(connection);
                jQuery('.metamaskConnection').css('color', 'green');
                window.web3.eth.getChainId((err, netId) => {
                    //console.log("networkId==>", netId);
                    switch (netId.toString()) {
                        case "1":
                            console.log("This is mainnet");
                            jQuery("#network").text("This is mainnet");
                            Accounttype = "1";
                            network = "mainnet";
                            break;
                        case "2":
                            console.log("This is the deprecated Morden test network.");
                            jQuery("#network").text(
                                "This is the deprecated Morden test network."
                            );
                            break;
                        case "3":
                            console.log("This is the ropsten test network.");
                            jQuery("#network").text("This is the ropsten test network.");
                            network = "ropsten";
                            break;
                        case "4":
                            console.log("This is the Rinkeby test network.");
                            jQuery("#network").text("This is the Rinkeby test network.");
                            network = "Rinkeby";
                            break;
                        case "42":
                            console.log("This is the Kovan test network.");
                            jQuery("#network").text("This is the Kovan test network.");
                            network = "Kovan";
                            break;
                        case "97":
                            console.log("This is the BNB test network.");
                            jQuery("#network").text("This is the BNB test network.");
                            network = "BNBTestnet";
                            break;
                        case "56":
                            // console.log("This is the BNB main network.");
                            Accounttype = "56";
                            jQuery("#network").text("This is the BNB main network.");
                            network = "BNBMain";
                            break;
                        default:
                           // console.log("This is an unknown network.");
                            jQuery("#network").text("This is the unknown test network.");
                    }
                });

            } else {
                connection = "Wallet is locked";
                jQuery(".metamaskConnection").text(connection);
            }
        } catch (error) {
            console.log("Error while checking locked account");
        }
        // console.log("web3333===>", await window.web3);
    }, 1000);
});

function isLocked() {
    window.web3.eth.getAccounts(function (err, accounts) {
        if (err != null) {
            console.log(err);
            jQuery("#lock").text(err);
        } else if (accounts.length === 0) {
            console.log(" Wallet is locked");
            jQuery("#lock").text(" Wallet is locked.");
        } else {
            console.log(" Wallet is unlocked");
            jQuery("#lock").text(" Wallet is unlocked.");
        }
    });
}

const getAccounts = async () => {
    try {
        const web3 = new Web3(windows.ethereum)
        accounts = await web3.eth.getAccounts();
        jQuery("#account").text("Account:" + accounts[0]);

        // console.log(accounts);
        return accounts;
    } catch (error) {
        console.log("Error while fetching acounts: ", error);
        return null;
    }
};


function BalanceOfAccount() {
    //console.log("length===>" + mainAccount);
    window.web3.eth.getBalance(accounts[0], (err, wei) => {
        myBalance = web3.utils.fromWei(wei, 'ether')
        // console.log("Balance===>", myBalance);
        Wallet_balance = myBalance;
        $("#getBalance").text(myBalance);
        jQuery('#getBalance').css('color', '#fff');
    })
}

async function TokenbalanceOf() {
    let token = 0;
    let add = mainAccount;
    let contract = new web3.eth.Contract(abiToken, contractAddressToken);
    return new Promise(async (resolve, reject) => {        
        let data = await contract.methods.balanceOf(add).call();
        // console.log("data", data / 1000000000000000000);
        token = data / 1000000000000000000;
        jQuery("#tokenbalance").text(token);
        jQuery('#tokenbalance').css('color', '#000');
        Token_Balance = token;
    })
}



async function sell() {
    try {
       
        let address = jQuery("#address").val();
        let uid = jQuery("#useid").val();
        let amt = jQuery("#txtamount").val();
        let token = jQuery("#txtTokenvalue").val();
        let bnb = jQuery("#txtTronvalue").val();
        let oldpackage = jQuery("#oldpackage").val();
        let packid = amt;//jQuery("#packageamount").val();
        let package = "1";// jQuery("#txtamount").val();// jQuery("#id option:selected").val();

        let IsUpgradeStatus = jQuery("#IsUpgradeStatus").val();

        let mainadd = mainAccount;
        if (mainadd == undefined) {
            alert("Please connect wallet");
            return;
        }

        if (parseInt(amt) < 100) {
            alert("Enter Minimum package amount 100 USD!!!");
            return;
        }

        if (parseInt(amt % 100) != 0) {
            alert("Enter package amount in multiple of 100 USD!!!");
            return;
        }

        if (parseInt(amt) > 100000) {
            alert('Maximum package amount is 100000 USD');
            return false;
        }


        if (packid == "0" || packid == "") {
            alert("Please select  Currect package amount!!!");
            return;
        }
        if (parseFloat(oldpackage) > parseFloat(amt)) {
            alert("Please Select higher Package!!!");
            return;
        }
        if (parseFloat(token) > parseFloat(Token_Balance)) {
            alert("Wallet balance insufficient!!!");
            return;
        }

        if (IsUpgradeStatus=="1") {
            alert("Your ID doesnt upgrade before 85% of earnings !!");
            return;
        }

        let value = jQuery("#txtTokenvalue").val();
        
        let contract = new web3.eth.Contract(abi, contractAddress);
        let tokencontract = new web3.eth.Contract(abiToken, contractAddressToken);
        $('.loader').show();
        await tokencontract.methods.approve(contractAddress, web3.utils.toWei(value).toString()).send({ from: mainAccount });
              
        return new Promise(async (resolve, reject) => {
            contract.methods.sell(web3.utils.toWei(value).toString()).send({
                from: mainAccount
            }).on("transactionHash", async (hash) => {
                if (hash != "") {
                    $('.loader').show();
                  ///  Upgrade(uid, hash, amt, package, address, token);
                }

            });
        });
    } catch (error) {
        console.log("error", error);
    }
}



async function Activation() {
     
    try {
        let address = jQuery("#address").val();         //Login User Address
        let uid = jQuery("#useid").val();               //Login User Id
        let usdamt = jQuery("#txtamount").val();        //Package USD Amount
        let token = jQuery("#txtTokenvalue").val();     //Package ULE Value
        //let bnb = jQuery("#txtTronvalue").val();
        let packid = usdamt;//jQuery("#packageamount").val();
        let package = 1;//jQuery("#id option:selected").val();

        let mainadd = mainAccount;

        if (parseInt(usdamt) < 100) {
            alert("Enter Minimum package amount 100 USD!!!");
            return;
        }
        
        if (parseInt(usdamt % 100) != 0) {
            alert("Enter package amount in multiple of 100 USD!!!");
            return;
        }

        if (parseInt(usdamt) > 100000) {
            alert('Maximum package amount is 100000 USD');
            return false;
        }


        if (mainadd == undefined) {
            alert("Please connect wallet!!!");
            return;
        }
        if (address.toUpperCase() != mainadd.toUpperCase()) {
            alert("Wallet address and login miss match");
            return;
        }
        if (packid == "0" || packid == "") {
            alert("Please Enter correct package amount!!!");
            return;
        }
        if (parseInt(token) > parseInt(Token_Balance)) {
            alert("Wallet balance insufficient!!!");
            return;
        }
        let value = jQuery("#txtTokenvalue").val();
        
        let tokenAmount = value * (10 ** 18);

        let contract = new web3.eth.Contract(abi, contractAddress);
        let tokencontract = new web3.eth.Contract(abiToken, contractAddressToken);
        $('.loader').show();
        await tokencontract.methods.approve(contractAddress, (tokenAmount).toString(10)).send({ from: mainAccount });

       
        return new Promise(async (resolve, reject) => {
            contract.methods.sell(web3.utils.toWei(value).toString()).send({
                from: mainAccount
            }).on("transactionHash", async (hash) => {
                if (hash != "") {
                    $('.loader').show();
                //    -- Activate(uid, hash, usdamt, package, address, token);
                }

            });
        });
    } catch (error) {
        console.log("error", error);
    }
}