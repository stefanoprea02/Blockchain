import { useEffect, useState } from "react";
import { useAppContext } from "../contexts/AppContext";

type RentalFormProps = {
  id: number;
  pricePerDay: bigint;
};

const RentalForm = ({ id, pricePerDay }: RentalFormProps) => {
  const [days, setDays] = useState<string>("");
  const [totals, setTotals] = useState<{
    totalEth: bigint;
    totalUsd: bigint;
  }>({ totalEth: BigInt(0), totalUsd: BigInt(0) });
  const { rentalManagerContract, web3 } = useAppContext();

  useEffect(() => {
    if (rentalManagerContract) {
      rentalManagerContract.events.RentalCreated().on("data", (event) => {
        console.log("RentalCreated event:", event);
        console.log(event.returnValues);
      });
    }
  }, [rentalManagerContract]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const valueInWei = web3.utils.toWei(totals.totalEth.toString(), "ether");
    console.log(valueInWei);

    event.preventDefault();
    const res = await rentalManagerContract.methods
      .rentProperty(id, Number(days))
      .send({
        from: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`,
        value: valueInWei,
      });

    console.log(res);
    setDays("");
  };

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setDays(event.target.value);
    const response: { _totalEth: bigint; _totalUsd: bigint } =
      await rentalManagerContract.methods
        .calculateTotalPrice(pricePerDay, Number(event.target.value))
        .call();
    console.log(response);
    setTotals({
      totalEth: response._totalEth,
      totalUsd: response._totalUsd,
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 16, margin: 32 }}
    >
      <label htmlFor="pricePerDay" style={{ marginBottom: -10 }}>
        Days
      </label>
      <input
        name="days"
        type="number"
        onChange={(event) => onChange(event)}
        value={days}
      />
      <div style={{ display: "flex", gap: 16 }}>
        <p style={{ margin: 0 }}>Total eth: {totals.totalEth.toString()}</p>
        <p style={{ margin: 0 }}>Total usd: {totals.totalUsd.toString()}</p>
      </div>
      <button type="submit">Create rental</button>
    </form>
  );
};

export default RentalForm;
