import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@shared/index";

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Nastala neznámá chyba.");
    }

    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-x-10 gap-y-8 w-5/6 max-w-300 place-items-center"
    >
      <input
        {...register("email")}
        type="email"
        placeholder="EMAIL"
        className={`bg-white placeholder:font-light contactText text-black placeholder:text-black p-6 w-full h-15 rounded-xs text-xl focus:outline-none col-span-2 lg:col-span-1 ${
          errors.email ? "border-2 border-red-500" : ""
        }`}
      />

      <input
        {...register("telephone")}
        type="tel"
        placeholder="TELEFON"
        className={`bg-white focus:outline-none placeholder:font-light text-black contactText placeholder:text-black p-6 w-full h-15 rounded-xs text-xl col-span-2 lg:col-span-1 ${
          errors.telephone ? "border-2 border-red-500" : ""
        }`}
      />

      <textarea
        {...register("message")}
        placeholder="POZNÁMKA"
        className={`bg-white focus:outline-none placeholder:font-light text-black contactText placeholder:text-black col-span-2 p-6 w-full h-45 rounded-xs text-xl ${
          errors.message ? "border-2 border-red-500" : ""
        }`}
      />

      {(errors.email || errors.telephone || errors.message) && (
        <p className="col-span-2 text-red-400 text-center text-sm -mt-4">
          {errors.email?.message || errors.telephone?.message || errors.message?.message}
        </p>
      )}

      <input
        type="submit"
        value={isSubmitting ? "ODESÍLÁM..." : "ODESLAT"}
        disabled={isSubmitting}
        className="border-1 border-white col-span-2 w-full max-w-80 h-15 font-medium hover:text-black hover:bg-white cursor-pointer disabled:opacity-50"
      />

      {isSubmitSuccessful && (
        <p className="col-span-2 text-green-400 text-center">
          Zpráva byla úspěšně odeslána!
        </p>
      )}
    </form>
  );
}
