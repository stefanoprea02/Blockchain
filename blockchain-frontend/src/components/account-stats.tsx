import { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";

const AccountStats = () => {
  const {
    web3,
    account,
    connected,
    connecting,
    connectToMetaMask,
    rentalManagerContract,
  } = useAppContext();

  const [balance, setBalance] = useState<string>("");

  useEffect(() => {
    const getBalance = async () => {
      if (account) {
        try {
          const balanceWei = await web3.eth.getBalance(account);
          const balanceEther = web3.utils.fromWei(balanceWei, "ether");
          setBalance(balanceEther);
        } catch (err) {
          console.warn("Failed to fetch balance", err);
        }
      }
    };

    getBalance();
  }, [account, web3, rentalManagerContract]);

  return !connected ? (
    <button onClick={connectToMetaMask}>
      {connecting ? "Connecting..." : "Connect to MetaMask"}
    </button>
  ) : (
    <>
      <p>Your address: {account}</p>
      <p>Your balance: {balance}</p>
    </>
  );
};

export default AccountStats;
