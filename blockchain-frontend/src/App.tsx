import "./App.css";
import AccountStats from "./components/account-stats";
import Properties from "./components/properties";
import Rentals from "./components/rentals";

function App() {
  return (
    <div className="App">
      <AccountStats />
      <div className="container">
        <Properties />
        <Rentals />
      </div>
    </div>
  );
}

export default App;
