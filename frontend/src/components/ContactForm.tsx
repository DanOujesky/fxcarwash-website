import { useState } from "react";
import type { FormEvent } from "react";

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (formData.get("website")) return;

    setSending(true);

    try {
      const res = await fetch("https://formspree.io/f/mblzejre", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Zpráva byla úspěšně odeslána!");
        form.reset();
      } else {
        setError(data?.error || data?.message || "Nastala neznámá chyba.");
      }
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError("Chyba připojení – " + err.message);
      } else {
        setError("Chyba připojení – zkontrolujte internet.");
      }
    }

    setSending(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-2 gap-x-10 gap-y-8 w-5/6 max-w-300 place-items-center"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        style={{ display: "none" }}
      />

      <input
        name="email"
        type="email"
        required
        placeholder="EMAIL"
        className="bg-white placeholder:font-light contactText text-black placeholder:text-black p-6 w-full h-15 rounded-xs text-xl focus:outline-none col-span-2 lg:col-span-1"
      />

      <input
        name="telephone"
        type="tel"
        pattern="[\d+() -]{7,20}"
        required
        placeholder="TELEFON"
        className="bg-white focus:outline-none placeholder:font-light text-black contactText placeholder:text-black p-6 w-full h-15 rounded-xs text-xl col-span-2 lg:col-span-1"
      />

      <textarea
        name="message"
        required
        placeholder="POZNÁMKA"
        className="bg-white focus:outline-none placeholder:font-light text-black contactText placeholder:text-black col-span-2 p-6 w-full h-45 rounded-xs text-xl"
      />

      <input
        type="submit"
        value={sending ? "ODESÍLÁM..." : "ODESLAT"}
        disabled={sending}
        className="border-1 border-white col-span-2 w-full max-w-80 h-15 font-medium hover:text-black hover:bg-white cursor-pointer disabled:opacity-50"
      />
      {success && (
        <p className="col-span-2 text-green-400 text-center">{success}</p>
      )}
      {error && <p className="col-span-2 text-red-400 text-center">{error}</p>}
    </form>
  );
}
