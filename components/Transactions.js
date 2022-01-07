function Transactions({trxList}) {
  
  if (trxList.length === 0) return null;

  return (
    <>
      {trxList.reverse().map((item) => (
        <div key={item.txHash} className="bg-indigo-500 text-xs text-gray-50 mt-5 rounded-xl py-2 px-4">
          <div>
            <p>From: {item.from}</p>
            <p>To: {item.to}</p>
            <p>Amount: {item.amount}</p>
            <a href={`https://rinkeby.etherscan.io/tx/${item.txHash}`}>
              Check in block explorer
            </a>
          </div>
        </div>
      ))}
    </>
  );
}

export default Transactions
