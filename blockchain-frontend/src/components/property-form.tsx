import { useEffect, useState } from "react";
import { useAppContext } from "../contexts/AppContext";

const PropertyForm = () => {
  const [pricePerDay, setPricePerDay] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const { propertyManagerContract } = useAppContext();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setSuccess(false);
    event.preventDefault();
    const pricePerDayNumber = Number(pricePerDay);
    const res = await propertyManagerContract.methods
      .listProperty(pricePerDayNumber)
      .send({ from: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` });

    console.log(res);
    setPricePerDay("");
  };

  useEffect(() => {
    if (propertyManagerContract) {
      propertyManagerContract.events.allEvents().on("data", (event) => {
        console.log("PropertyListed event:", event);
        console.log(event.returnValues);
        setSuccess(true);
      });
    }
  }, [propertyManagerContract]);

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 16, margin: 32 }}
    >
      <label htmlFor="pricePerDay" style={{ marginBottom: -10 }}>
        Price per day
      </label>
      <input
        name="pricePerDay"
        type="number"
        onChange={(event) => setPricePerDay(event.target.value)}
        value={pricePerDay}
      />
      <button type="submit">Add new property</button>
      {success && <p>Property added successfully!</p>}
    </form>
  );
};

export default PropertyForm;
