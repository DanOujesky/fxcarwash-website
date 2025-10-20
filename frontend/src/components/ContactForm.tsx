import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

interface FormData {
  email: string;
  telephone: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    telephone: "",
    message: "",
  });

  const [sending, setSending] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.telephone || !formData.message) {
      alert("Vyplňte prosím všechna pole.");
      return;
    }

    setSending(true);

    try {
      const res = await fetch("https://formspree.io/f/mblzejre", {
        method: "POST",
        headers: {
          Accept: "application/json", // DŮLEŽITÉ!
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          telephone: formData.telephone,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Zpráva byla úspěšně odeslána!");
        setFormData({ email: "", telephone: "", message: "" });
      } else {
        console.log("Formspree error:", data);
        alert(
          "Nastala chyba při odesílání: " +
            (data?.error || data?.message || "Neznámá chyba.")
        );
      }
    } catch (err) {
      console.error("Network error:", err);
      alert(
        "Chyba při odesílání formuláře. Zkontrolujte připojení k internetu nebo endpoint."
      );
    }

    setSending(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-2 gap-x-10 gap-y-8 w-5/6 max-w-300 place-items-center"
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
        value={sending ? "ODESÍLÁM..." : "ODESLAT"}
        disabled={sending}
        className="border-1 border-white col-span-2 w-full max-w-80 h-15 font-medium hover:text-black hover:bg-white cursor-pointer disabled:opacity-50"
      />
    </form>
  );
}
