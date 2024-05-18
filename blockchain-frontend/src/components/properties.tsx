import { useEffect, useState } from "react";
import { Property } from "../types";
import { useAppContext } from "../contexts/AppContext";
import PropertyForm from "./property-form";
import RentalForm from "./rental-form";

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const { propertyManagerContract } = useAppContext();

  useEffect(() => {
    const fetchProperties = async () => {
      const propertyCount = parseInt(
        await propertyManagerContract.methods.propertyCount().call(),
        10
      );

      const properties: Property[] = [];

      for (let i = 0; i < propertyCount; i++) {
        const property: Property = await propertyManagerContract.methods
          .getProperty(i)
          .call();

        properties.push(property);
      }

      setProperties(properties);
    };

    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2 style={{ margin: 0 }}>Properties</h2>
      <PropertyForm />
      {properties.map((property, index) => (
        <div key={`property-${index}`}>
          <hr></hr>
          <div className="propertyContainer">
            <div>
              <p>ID : {index}</p>
              <p>Owner address : {property.owner}</p>
              <p>Price per day : {property.pricePerDay.toString()}</p>
              <p>Is Available : {property.isAvailable ? "Yes" : "No"}</p>
            </div>
            {property.isAvailable && (
              <RentalForm id={index} pricePerDay={property.pricePerDay} />
            )}
          </div>
          <hr></hr>
        </div>
      ))}
    </div>
  );
};

export default Properties;
