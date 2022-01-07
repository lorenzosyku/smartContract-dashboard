import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";
import Transactions from "./Transactions";
import Loader from "./Loader";
import ErrorMessage from "./errorMessage";


function Balance() {

  const [hasError, setHasError] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contractListened, setContractListened] = useState();
  const [balance, setBalance] = useState({
    address: '-',
    balance: '-'
  });
  const [trxList, setTrxList] = useState([]);
  const [contractInfo, setContractInfo] = useState({
    address: "-",
    tokenName: "-",
    tokenSymbol: "-",
    totalSupply: "-"
  });

  useEffect(() => {

      if(contractInfo.address !== '-'){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const erc20 = new ethers.Contract(
          contractInfo.address,
          abi,
          provider
        );

        erc20.on("Transfer", (from, to, amount, event)=>{
          console.log(from, to, amount, event);
          setIsLoading(false);
          setTrxList((currentTrx)=>[
            ...currentTrx,
            {
              txHash: event.transactionHash,
              from,
              to,
              amount: String(amount)
            }
          ]);
        });
        setContractListened(erc20);


        return () => {
          contractListened.removeAllListeners();
        };
      };

  }, [contractInfo.address])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    try {
      const erc20 = new ethers.Contract(data.get("addr"), abi, provider);
      console.log(erc20)
      const tokenName = await erc20.name();
      const tokenSymbol = await erc20.symbol();
      const totalSupply = await erc20.totalSupply();

      setContractInfo({
        address: data.get("addr"),
        tokenName,
        tokenSymbol,
        totalSupply
      });
    } catch (error) {
      console.error(error);
      setMessage('CONTRACT ADDRESS INVALID!');
      setHasError(true);
    }
    
  }

  const getMyBalance = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const erc20 = new ethers.Contract(contractInfo.address, abi, provider);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      const balInfo = await erc20.balanceOf(signerAddress);

      setBalance({
        address: signerAddress,
        balance: String(balInfo)
      });
    } catch (error) {
      console.error(error);
      setMessage('CONTRACT ADDRESS INVALID!');
      setHasError(true);
    }
    
  }

  const handleTransfer = async (e) => {
    e.preventDefault();

    const data = new FormData(e.target);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const erc20 = new ethers.Contract(contractInfo.address, abi, signer);
      await erc20.transfer(data.get("recipient"), data.get("amount"));
      setIsLoading(true); 
      
    } catch (error) {
      console.error(error);
      setMessage('EITHER THE AMOUNT OR THE RECIPIENT ADDRESS ARE INVALID!');
      setHasError(true);
    }
    
  }


  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 shadow-lg mx-auto rounded-xl m-30">
      <div>
        <div className="">
          {hasError && <ErrorMessage message={message} setHasError={setHasError}/>}
        </div>
        
        <form className="m-4" onSubmit={handleSubmit}>
          <div className="w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl ">
            <main className="mt-4 p-4">
              <h1 className="text-xl font-semibold text-gray-700 text-center">
                Read from smart contract(RINKEBY TESTNET)
              </h1>
              <div className="">
                <div className="my-3">
                  <input
                    type="text"
                    name="addr"
                    className="block w-full focus:ring focus:outline-none"
                    placeholder="ERC20 contract address"
                  />
                </div>
              </div>
            </main>
            <footer className="p-4">
              <button
                type="submit"
                className="bg-cyan-700 rounded-lg  text-white focus:ring focus:outline-none w-full"
              >
                Get token info(RINKEBY TESTNET)
              </button>
            </footer>
            <div className="px-4">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-gray-50">
                    <tr className="whitespace-nowrap">
                      <th className="px-6 py-2 text-xs text-gray-500">Name</th>
                      <th className="px-6 py-2 text-xs text-gray-500">Symbol</th>
                      <th className="px-6 py-2 text-xs text-gray-500">Total supply</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="whitespace-nowrap">
                      <th className="px-6 py-4 text-sm text-gray-500">{contractInfo.tokenName}</th>
                      <td className="px-6 py-4 text-sm text-gray-500">{contractInfo.tokenSymbol}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{String(contractInfo.totalSupply)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{contractInfo.deployedAt}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-4">
              <button
                onClick={getMyBalance}
                type="submit"
                className="bg-cyan-700 rounded-lg focus:ring focus:outline-none w-full text-white"
              >
                Get my balance(RINKEBY TESTNET)
              </button>
            </div>
            <div className="px-4">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-gray-50">
                    <tr className="whitespace-nowrap">
                      <th className="px-6 py-2 text-xs text-gray-500">Address</th>
                      <th className="px-6 py-2 text-xs text-gray-500">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="whitespace-nowrap">
                      <th className="px-6 py-4 text-sm text-gray-500">{balance.address}</th>
                      <td className="px-6 py-4 text-sm text-gray-500">{balance.balance}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
        <div className="m-4 w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-lg bg-white">
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Write to contract(RINKEBY TESTNET)
            </h1>

            <form onSubmit={handleTransfer}>
              <div className="my-3">
                <input
                  type="text"
                  name="recipient"
                  className="block w-full focus:ring focus:outline-none"
                  placeholder="Recipient address"
                />
              </div>
              <div className="my-3">
                <input
                  type="text"
                  name="amount"
                  className="block w-full focus:ring focus:outline-none"
                  placeholder="Amount to transfer"
                />
              </div>
              <footer className="p-4">
                <button
                  type="submit"
                  className="bg-cyan-700 focus:ring focus:outline-none w-full rounded-xl text-white"
                >
                  Transfer(RINKEBY TESTNET)
                </button>
              </footer>
            </form>
          </div>
        </div>
      </div>
      <div>
        <div className="m-4 w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <div className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Recent transactions on the RINKEBY TESTNET
            </h1>
            {isLoading ? (<Loader/>) : (<div>
              <Transactions trxList={trxList}/>
            </div>)}
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Balance
