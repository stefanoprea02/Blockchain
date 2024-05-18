import { useEffect, useState } from "react";
import { Rental } from "../types";
import { useAppContext } from "../contexts/AppContext";

const Rentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const { rentalManagerContract } = useAppContext();

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

  return (
    <div>
      <h2 style={{ margin: 0 }}>Rentals</h2>
      {rentals.map((rental, index) => (
        <div key={`rental-${index}`}>
          <hr></hr>
          <div className="propertyContainer">
            <div>
              <p>ID : {index}</p>
              <p>Owner address : {rental.owner}</p>
              <p>Tenant address : {rental.tenant}</p>
              <p>Property ID : {rental.propertyId.toString()}</p>
              <p>
                Start Date:{" "}
                {new Date(Number(rental.startDate) * 1000).toLocaleString(
                  "en-US",
                  {
                    timeZone: "UTC",
                  }
                )}
              </p>
              <p>Duration : {rental.duration.toString()} days</p>
              <p>Total Price : {rental.totalPrice.toString()}</p>
              <p>Is Active : {rental.isActive ? "Yes" : "No"}</p>
              <p>
                Is Waiting Confirmation :{" "}
                {rental.isWaitingConfirmation ? "Yes" : "No"}
              </p>
            </div>
          </div>
          <hr></hr>
        </div>
      ))}
    </div>
  );
};

export default Rentals;
