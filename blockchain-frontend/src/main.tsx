import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import MetamaskProvider from "./contexts/MetamaskProvider.tsx";
import { AppContextProvider } from "./contexts/AppContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MetamaskProvider>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </MetamaskProvider>
);
