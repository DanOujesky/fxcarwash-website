import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
const API_URL = import.meta.env.VITE_API_URL;
interface FormData {
  email: string;
  telephone: string;
  message: string;
}
interface ValidationError {
  value: string;
  msg: string;
  param: string;
  location: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    telephone: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.errors) {
        alert(
          "Please fix the following:\n" +
            (data.errors as ValidationError[])
              .map((err) => `- ${err.msg}`)
              .join("\n")
        );
      } else {
        alert(data.message || "Something went wrong");
      }
    } else {
      alert(data.message);
      setFormData({ email: "", telephone: "", message: "" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-2 gap-x-10 gap-y-8 w-5/6 max-w-300 place-items-center "
    >
      <input
        name="email"
        type="email"
        required
        placeholder="EMAIL"
        value={formData.email}
        onChange={handleChange}
        className="bg-white placeholder:font-light text-black placeholder:text-black p-6 w-full h-15 rounded-xs text-xl focus:outline-none col-span-2 lg:col-span-1"
      />

      <input
        name="telephone"
        type="tel"
        pattern="[0-9+ ]{7,15}"
        required
        placeholder="TELEFON"
        value={formData.telephone}
        onChange={handleChange}
        className="bg-white focus:outline-none placeholder:font-light text-black placeholder:text-black p-6 w-full h-15 rounded-xs text-xl col-span-2 lg:col-span-1"
      />

      <textarea
        name="message"
        required
        placeholder="POZNÁMKA"
        value={formData.message}
        onChange={handleChange}
        className="bg-white focus:outline-none placeholder:font-light text-black placeholder:text-black col-span-2 p-6 w-full h-45 rounded-xs text-xl"
      />

      <input
        type="submit"
        value="ODESLAT"
        className="border-1 border-white col-span-2 w-full max-w-80 h-15 font-medium hover:text-black hover:bg-white cursor-pointer"
      />
    </form>
  );
}
