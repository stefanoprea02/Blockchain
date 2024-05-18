import { useEffect, useState } from "react";
import { Rental } from "../types";
import { useAppContext } from "../contexts/AppContext";

const Rentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const { rentalManagerContract, account, propertyManagerContract } =
    useAppContext();

  useEffect(() => {
    const fetchProperties = async () => {
      const rentalCount = parseInt(
        await rentalManagerContract.methods.rentalCount().call(),
        10
      );

      const rentals: Rental[] = [];

      for (let i = 0; i < rentalCount; i++) {
        const rental: Rental = await rentalManagerContract.methods
          .getRental(i)
          .call();

        rentals.push(rental);
      }

      setRentals(rentals);
    };

    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const endRental = async (id: number) => {
    await rentalManagerContract.methods
      .completeRental(id)
      .send({ from: account });
  };

  const approve = async (id: number) => {
    await propertyManagerContract.methods
      .updatePropertyAvailability(id, false)
      .send({ from: account });
    await rentalManagerContract.methods
      .confirmPropertyRent(id)
      .send({ from: account });
  };

  const reject = async (id: number) => {
    await propertyManagerContract.methods
      .updatePropertyAvailability(id, true)
      .send({ from: account });
    await rentalManagerContract.methods
      .rejectPropertyRent(id)
      .send({ from: account });
  };

  const getPastEvents = async () => {
    try {
      const events = await rentalManagerContract.getPastEvents("ALLEVENTS", {
        fromBlock: 0,
        toBlock: "latest",
      });
      console.log(events);
    } catch (error) {
      console.error("Error fetching past events:", error);
    }
  };

  getPastEvents();

  return (
    <div>
      <h2 style={{ margin: 0 }}>Rentals</h2>
      {rentals.map((rental, index) => (
        <div key={`rental-${index}`}>
          <hr></hr>
          <p>ID : {index}</p>
          <p>Owner address : {rental.owner}</p>
          <p>Tenant address : {rental.tenant}</p>
          <p>Property ID : {rental.propertyId.toString()}</p>
          <p>
            Start Date:{" "}
            {new Date(Number(rental.startDate) * 1000).toLocaleString("en-US", {
              timeZone: "UTC",
            })}
          </p>
          <p>Duration : {rental.duration.toString()} days</p>
          <p>Total Price : {rental.totalPrice.toString()}</p>
          <p>Is Active : {rental.isActive ? "Yes" : "No"}</p>
          <p>
            Is Waiting Confirmation :{" "}
            {rental.isWaitingConfirmation ? "Yes" : "No"}
          </p>
          {rental.owner === account && (
            <div className="container">
              {rental.isActive && (
                <button onClick={() => endRental(index)}>
                  Try to end rental
                </button>
              )}
              {rental.isWaitingConfirmation && (
                <button onClick={() => approve(index)}>Approve</button>
              )}
              {rental.isWaitingConfirmation && (
                <button onClick={() => reject(index)}>Reject</button>
              )}
            </div>
          )}
          <hr></hr>
        </div>
      ))}
    </div>
  );
};

export default Rentals;
