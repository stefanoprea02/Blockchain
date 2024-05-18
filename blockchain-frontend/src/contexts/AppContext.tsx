import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { SDKState, useSDK } from "@metamask/sdk-react";
import Web3, { Contract, ContractAbi, Web3BaseProvider } from "web3";
import {
  propertyManagerABI,
  rentalManagerABI,
  propertyManagerAddress,
  rentalManagerAddress,
} from "../constants";
import { SDKProvider, MetaMaskSDK } from "@metamask/sdk";
import { RegisteredSubscription } from "web3-eth";

interface ContextState {
  account: string;
  connectToMetaMask: () => void;
  connected: boolean;
  connecting: boolean;
  provider: SDKProvider | Web3BaseProvider;
  sdk: MetaMaskSDK;
  web3: Web3<RegisteredSubscription>;
  rentalManagerContract: Contract<ContractAbi>;
  propertyManagerContract: Contract<ContractAbi>;
  isLocal: boolean;
}

const contextState: ContextState = {
  account: "",
  connectToMetaMask: () => {},
  connected: false,
  connecting: false,
  provider: {} as SDKProvider,
  sdk: {} as MetaMaskSDK,
  web3: {} as Web3<RegisteredSubscription>,
  rentalManagerContract: {} as Contract<ContractAbi>,
  propertyManagerContract: {} as Contract<ContractAbi>,
  isLocal: true,
};

const AppContext = createContext<ContextState>(contextState);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const isLocal = true;
  let provider;
  const [account, setAccount] = useState<string>("");
  const {
    sdk,
    connected,
    connecting,
    provider: sdkProvider,
  } = useSDK() as SDKState;

  const localProvider = new Web3.providers.HttpProvider(
    "http://localhost:8545"
  );

  if (isLocal) {
    provider = localProvider;
  } else {
    provider = sdkProvider;
  }

  const connectToMetaMask = async () => {
    try {
      const accounts = (await sdk?.connect()) as string[];
      setAccount(accounts?.[0] || "");
    } catch (err) {
      console.warn("failed to connect..", err);
    }
  };

  const web3 = new Web3(provider);
  const propertyManagerContract = new web3.eth.Contract(
    propertyManagerABI,
    propertyManagerAddress
  );
  const rentalManagerContract = new web3.eth.Contract(
    rentalManagerABI,
    rentalManagerAddress
  );

  //0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0 rental manager
  //0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  //0x976EA74026E726554dB657fA54763abd0C3a0aa9

  useEffect(() => {
    if (!account) {
      if (isLocal) setAccount(`0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`);
      else connectToMetaMask();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  return (
    <AppContext.Provider
      value={{
        account,
        connectToMetaMask,
        connected,
        connecting,
        provider: localProvider || ({} as SDKProvider),
        sdk: sdk || ({} as MetaMaskSDK),
        web3,
        propertyManagerContract,
        rentalManagerContract,
        isLocal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
export default AppContext;
