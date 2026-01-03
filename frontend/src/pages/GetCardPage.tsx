import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import CartIcon from "../components/CartIcon";
import Inputlabel from "../components/InputLabel";
import AddressAutocomplete from "../components/AddressAutocomplete";

interface MapySuggestion {
  name: string;
  location?: string;
  zip?: string;
}

function GetCardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [credit, setCredit] = useState(500);
  const [isLoading, setIsLoading] = useState(false);
  const [shipping, setShipping] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [errors, setErrors] = useState<{
    shipping?: string;
    quantity?: string;
    street?: string;
    zipCode?: string;
    city?: string;
    country?: string;
    credit?: string;
    response?: string;
  }>({});

  const handleAddressSelect = (address: MapySuggestion) => {
    setAddress(address.name);
    setZipCode(address.zip || "");
    if (address.location) {
      const locationParts = address.location
        .split(",")
        .map((part) => part.trim());

      if (locationParts.length > 1) {
        setCity(locationParts[0]);
        setCountry(locationParts[1]);
      }
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return <div className="h-screen bg-black" />;
  }

  const addCard = () => {};
  return (
    <div className="min-h-screen bg-[#252525]">
      <div className="flex justify-center items-center header-color p-20 border-b-1">
        <h1 className="text-3xl">Objednání Karty</h1>
        <CartIcon />
      </div>
      <div className="flex flex-col justify-center items-center body-bg-color p-15">
        <form className="my-5 flex flex-col gap-3" onSubmit={addCard}>
          <div className="flex flex-col">
            <Inputlabel white={true} text="Vyberte způsob doručení" />
            <select
              onChange={(e) => {
                setShipping(e.target.value);
              }}
              className=" bg-white text-black p-2 cursor-pointer contactText"
            >
              <option value="" disabled hidden></option>
              <option value="cp">Česká pošta (zdarma)</option>
              <option value="op">Osobní převzetí (zdarma)</option>
            </select>
          </div>

          {shipping === "cp" && (
            <div className="">
              <AddressAutocomplete
                white={true}
                onAddressSelect={handleAddressSelect}
              />
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-1 flex-col">
                  <Inputlabel white={true} text="Město" />
                  <input
                    className={`input-field bg-white text-black border-2 ${
                      errors.city ? "border-red-500" : ""
                    }`}
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <Inputlabel white={true} text="PSČ" />
                  <input
                    className={`input-field bg-white text-black border-2 ${
                      errors.zipCode ? "border-red-500" : ""
                    }`}
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <Inputlabel white={true} text="Stát" />
                <input
                  className={`input-field bg-white text-black border-2 ${
                    errors.country ? "border-red-500" : ""
                  }`}
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
          )}
          {shipping === "op" && (
            <p className="text-white">
              Osobní převzetí na adrese naší provozovny: K černému mostu, 330 12
              Horní Bříza. Jakmile bude Vaše karta připravena, kontaktujeme Vás
              telefonicky/mailem.
            </p>
          )}
          <div className="flex flex-col">
            <Inputlabel white={true} text="Vyberte výši kreditu" />
            <select
              value={credit}
              onChange={(e) => {
                setCredit(Number(e.target.value));
              }}
              className=" bg-white text-black p-2 cursor-pointer contactText"
            >
              <option value={500}>500</option>
              <option value={1000}>1000</option>
              <option value={1500}>1500</option>
              <option value={2000}>2000</option>
              <option value={2500}>2500</option>
              <option value={3000}>3000</option>
              <option value={4000}>4000</option>
              <option value={5000}>5000</option>
              <option value={6000}>6000</option>
              <option value={7000}>7000</option>
              <option value={8000}>8000</option>
              <option value={9000}>9000</option>
              <option value={10000}>10000</option>
            </select>
          </div>
          <p className="text-white">
            {`Ke zvolené výši kreditu nahrajeme ${user.discount}% navíc jako
              bonus pro Vás.`}
          </p>
          <div className="text-white contactText">
            Vaše cena: <span className="">{credit} Kč</span>
          </div>
          <div className="text-white contactText">
            Nahraný kredit:{" "}
            <span className="">{credit * (1 + user.discount / 100)} Kč</span>
          </div>
          {(errors.shipping && (
            <span className="text-red-500 text-center text-sm contactText">
              {errors.shipping}
            </span>
          )) ||
            (errors.street && (
              <span className="text-red-500 text-center text-sm contactText">
                {errors.street}
              </span>
            )) ||
            (errors.quantity && (
              <span className="text-red-500 text-center text-sm contactText">
                {errors.quantity}
              </span>
            )) ||
            (errors.credit && (
              <span className="text-red-500 text-center text-sm contactText">
                {errors.credit}
              </span>
            )) ||
            (errors.response && (
              <span className="text-red-500 text-center text-sm contactText">
                {errors.credit}
              </span>
            ))}

          <div className="flex flex-col justify-center">
            <button
              className="bg-green-500 hover:bg-green-600 p-2 inline-block  rounded-sm mt-5"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "přidávám..." : "Přidat do košíku"}
            </button>
            <Link
              className="bg-transparent border-2 hover:bg-[#1b1b1b] p-2 inline-block  rounded-sm mt-5 text-center"
              to="/moje-karty"
            >
              Zpět
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
export default GetCardPage;
