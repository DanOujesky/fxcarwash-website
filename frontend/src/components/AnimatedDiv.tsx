import { motion } from "framer-motion";

type AnimatedDivProps = {
  rightSite: boolean;
  title: string;
  text: string;
};

function AnimatedDiv({ rightSite, title, text }: AnimatedDivProps) {
  return (
    <motion.div
      initial={{ x: rightSite ? "90%" : "-90%", opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.1 }}
      className="flex flex-col gap-10 items-center justify-center"
    >
      <h3 className="text-4xl">{title}</h3>
      <p className="text-[14px]">{text}</p>
    </motion.div>
  );
}

export default AnimatedDiv;
