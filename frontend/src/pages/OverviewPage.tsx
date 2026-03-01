import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import CartPhaseDisplay from "../components/CartPhaseDisplay";
import { Order } from "../types/Order";
import Footer from "../components/Footer";
import { formatCurrency } from "../utils/formater";
import ErrorMessage from "../components/ErrorMessage";
import Inputlabel from "../components/InputLabel";
import { companySchema, CompanySchema } from "../../../shared/src";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AddressAutocomplete from "../components/AddressAutocomplete";

function OverviewPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [onCompany, setOnCompany] = useState(false);

  const order: Order = location.state?.order;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useForm<CompanySchema>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: order?.companyName || user?.companyName || "",
      companyICO: order?.companyICO || user?.companyICO || "",
      companyDIC: order?.companyDIC || user?.companyDIC || "",
      companyAddress: order?.companyAddress || user?.companyAddress || "",
      companyZipCode: order?.companyZipCode || user?.companyZipCode || "",
      companyCity: order?.companyCity || user?.companyCity || "",
    },
  });

  useEffect(() => {
    if ((!loading && !user) || !order) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate, order]);

  if (loading || !user) {
    return <div className="h-screen bg-black" />;
  }

  const onSubmit = async (companyData: CompanySchema) => {
    setIsLoading(true);

    const finalOrder = onCompany ? { ...order, ...companyData } : order;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/payment/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: finalOrder }),
          credentials: "include",
        },
      );
      const data = await res.json();

      if (res.ok) {
        window.location.href = data.url;
      } else {
        console.error("Chyba při vytváření platební relace:", data.errors);
      }
    } catch (error) {
      console.error("Chyba při platbě:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoingBack = () => {
    const currentCompanyData = getValues();

    const updatedOrder = onCompany
      ? { ...order, ...currentCompanyData, onCompany: true }
      : { ...order, onCompany: false };

    localStorage.setItem("order", JSON.stringify(updatedOrder));

    const targetPath = order.address ? "/doprava" : "/kosik";
    navigate(targetPath);
  };
  interface MapySuggestion {
    name: string;
    location?: string;
    zip?: string;
  }

  const handleAddressSelect = (fullAddress: MapySuggestion) => {
    setValue("companyAddress", fullAddress.name, { shouldValidate: true });
    setValue("companyZipCode", fullAddress.zip || "", { shouldValidate: true });

    if (fullAddress.location) {
      const locationParts = fullAddress.location
        .split(",")
        .map((part) => part.trim());
      if (locationParts.length > 1) {
        setValue("companyCity", locationParts[0], { shouldValidate: true });
      }
    }
  };

  return (
    <div className="min-h-screen pt-[121px] sm:pt-[185px] bg-[#252525]">
      <Header
        withoutPadding={true}
        account={true}
        homePage={false}
        logo={false}
      />

      {order && order.items.length > 0 ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col justify-center items-center body-bg-color pt-15">
            <CartPhaseDisplay delivery={!!order.address} phaseNumber={3} />
          </div>

          <div className="flex flex-col justify-center items-center body-bg-color pt-15">
            <h2 className="text-2xl underline text-white">
              Shrnutí objednávky
            </h2>
          </div>

          <div className="flex flex-col justify-center items-center body-bg-color gap-5 pt-15 contactText text-white">
            {order.items.map((item) => (
              <div
                className="border-2 border-white p-5 justify-between w-[80%] sm:w-150"
                key={item.temp_id}
              >
                <div className="flex flex-col sm:flex-row gap-5 sm:gap-0 justify-between">
                  <div className="flex flex-col">
                    <div className="font-bold">
                      {item.name === "Objednání nové FX karty"
                        ? `FX karta v hodnotě ${item.price} Kč`
                        : `Dobití kreditu ${item.price} Kč`}
                    </div>
                    <div className="text-green-500">
                      Množství kreditů: {item.credit}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center text-2xl">
                    {item.quantity || 1} ks
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-center items-center body-bg-color text-white">
            <div className="border-2 flex flex-col border-white p-5 justify-between gap-10 sm:w-150 w-[80%] mt-5">
              <div>
                <p className="font-bold underline">Kontaktní údaje</p>
                <p>
                  {user.firstName} {user.lastName}
                </p>
                <p>{user.email}</p>
                <p>{order.phone || user.phone}</p>
              </div>
              {order.address && (
                <div>
                  <p className="font-bold underline">Doručovací adresa</p>
                  <p>
                    {order.address}, {order.zipCode} {order.city}{" "}
                    {order.country}
                  </p>
                </div>
              )}
              <div className="flex flex-row justify-between w-full border-t border-gray-600 pt-4">
                <p className="font-bold">Celková cena s DPH</p>
                <p className="text-green-500 text-2xl">
                  {formatCurrency(order.price)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-center items-center body-bg-color pt-15 mx-10">
            <div className="w-150 flex justify-start items-center gap-5">
              <input
                type="checkbox"
                id="onCompany"
                className="w-7 h-7 shrink-0 accent-green-500 cursor-pointer"
                checked={onCompany}
                onChange={() => setOnCompany(!onCompany)}
              />
              <label
                htmlFor="onCompany"
                className="text-white leading-none contactText cursor-pointer"
              >
                Chci nakupovat na firmu
              </label>
            </div>
          </div>

          {onCompany && (
            <div className="flex flex-col justify-center items-center body-bg-color pt-5">
              <div className="my-5 flex flex-col gap-3 w-full max-w-md px-4">
                <div className="flex flex-col">
                  <Inputlabel white={true} text="Název firmy" />
                  <input
                    {...register("companyName")}
                    className={`input-field input-white-field ${errors.companyName ? "border-red-500" : "border-transparent"}`}
                    type="text"
                  />
                  <ErrorMessage
                    marginOn={true}
                    message={errors.companyName?.message}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="flex flex-col">
                    <Inputlabel white={true} text="IČO" />
                    <input
                      {...register("companyICO")}
                      className={`input-field input-white-field ${errors.companyICO ? "border-red-500" : "border-transparent"}`}
                      type="text"
                    />
                    <ErrorMessage
                      marginOn={true}
                      message={errors.companyICO?.message}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Inputlabel white={true} text="DIČ (volitelné)" />
                    <input
                      {...register("companyDIC")}
                      className={`input-field input-white-field ${errors.companyDIC ? "border-red-500" : "border-transparent"}`}
                      type="text"
                    />
                  </div>
                </div>

                <Controller
                  control={control}
                  name="companyAddress"
                  render={({ field: { onChange, value } }) => (
                    <AddressAutocomplete
                      onAddressSelect={(companyAddress) => {
                        handleAddressSelect(companyAddress);
                        onChange(companyAddress.name);
                      }}
                      onChange={onChange}
                      initialValue={value}
                      error={errors.companyAddress}
                      white={true}
                    />
                  )}
                />
                <ErrorMessage message={errors.companyAddress?.message} />
                <input type="hidden" {...register("companyAddress")} />

                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="flex flex-col">
                    <Inputlabel white={true} text="Město" />
                    <input
                      {...register("companyCity")}
                      className={`input-field input-white-field ${errors.companyCity ? "border-red-500" : "border-transparent"}`}
                      type="text"
                    />
                    <ErrorMessage
                      marginOn={true}
                      message={errors.companyCity?.message}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Inputlabel white={true} text="PSČ" />
                    <input
                      {...register("companyZipCode")}
                      className={`input-field input-white-field ${errors.companyZipCode ? "border-red-500" : "border-transparent"}`}
                      type="text"
                    />
                    <ErrorMessage
                      marginOn={true}
                      message={errors.companyZipCode?.message}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-row justify-center items-center body-bg-color pt-10 mx-10">
            <div className="w-150 flex justify-start items-center gap-5">
              <input
                type="checkbox"
                id="gdpr"
                className="w-7 h-7 shrink-0 accent-green-500 cursor-pointer"
                checked={isAgreed}
                onChange={() => setIsAgreed(!isAgreed)}
              />
              <label
                htmlFor="gdpr"
                className="text-white leading-none contactText"
              >
                Souhlasím s{" "}
                <Link className="underline" to="/obchodni-podminky">
                  obchodními podmínkami
                </Link>
              </label>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center body-bg-color p-15">
            <div className="flex flex-col w-55 sm:w-80">
              <button
                type="submit"
                className={`${
                  !isAgreed
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } p-2 inline-block rounded-sm mt-5 text-white`}
                disabled={isLoading || !isAgreed}
              >
                {isLoading ? "přesměrování..." : "Zaplatit"}
              </button>
              <button
                type="button"
                onClick={handleGoingBack}
                className="bg-transparent border-2 border-white hover:bg-[#1b1b1b] p-2 inline-block rounded-sm mt-5 text-center text-white"
              >
                Zpět
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex flex-col justify-center items-center body-bg-color pt-15 text-white">
          <h2>V košíku dosud nemáte žádné zboží</h2>
          <Link to="/moje-karty" className="underline">
            Hlavní stránka
          </Link>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default OverviewPage;
