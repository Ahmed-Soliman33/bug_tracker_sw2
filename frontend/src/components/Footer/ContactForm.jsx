import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const INITIAL = { name: "", phone: "", email: "", company: "" };

export default function ContactForm() {
  const { t } = useTranslation("footer");
  const { t: tc } = useTranslation("common");
  const [form, setForm] = useState(INITIAL);
  const [status, setStatus] = useState("idle");
  const [focused, setFocused] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    // TODO: replace with GraphQL mutation for WP Ninja Forms
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
    setForm(INITIAL);
    setTimeout(() => setStatus("idle"), 3000);
  };

  const submitLabel = () => {
    if (status === "loading") return tc("sending");
    if (status === "success") return tc("sent");
    return tc("sendMessage");
  };

  const fields = [
    { name: "name",    type: "text",  placeholder: t("form_name") },
    { name: "phone",   type: "tel",   placeholder: t("form_phone") },
    { name: "email",   type: "email", placeholder: t("form_email") },
    { name: "company", type: "text",  placeholder: t("form_company") },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {fields.map(({ name, type, placeholder }) => (
          <motion.div
            key={name}
            animate={{
              boxShadow: focused === name
                ? "0 0 0 2px rgba(0,184,148,0.55)"
                : "0 0 0 0px rgba(0,184,148,0)",
            }}
            transition={{ duration: 0.18 }}
            className="rounded-xl overflow-hidden"
          >
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              onFocus={() => setFocused(name)}
              onBlur={() => setFocused(null)}
              placeholder={placeholder}
              className="w-full px-4 py-3 text-sm font-medium text-[#0d1b4b] placeholder:text-gray-400 outline-none transition-colors duration-200"
              style={{
                background: focused === name ? "#f0f1f3" : "#edf0f3",
                border: "none",
              }}
            />
          </motion.div>
        ))}
      </div>

      <motion.button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="w-full mt-1 py-3 rounded-xl text-white text-sm font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background: "#00b894" }}
        whileHover={{ background: "#00cec9", scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.18 }}
      >
        {submitLabel()}
      </motion.button>
    </form>
  );
}
