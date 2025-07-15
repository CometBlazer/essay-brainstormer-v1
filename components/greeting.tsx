import { motion } from 'framer-motion';
import Image from 'next/image';

export const Greeting = () => {
  return (
    <div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center items-start gap-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-4"
      >
        <Image
          src="https://res.cloudinary.com/dqdasxxho/image/upload/v1752602678/dan-essay-coach-profile_r5spkl.png"
          alt="Dan - Essay Coach"
          width={128}
          height={128}
          className="rounded-full bordershadow-sm"
        />
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">
            Hi, I&apos;m Dan 👋
          </h1>
          <p className="text-zinc-500 mt-1 text-base">
            An ethical and professional AI college essay coach
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="text-xl sm:text-2xl font-medium mt-2"
      >
        I&apos;m here to transform your ideas into compelling college essays.
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="text-zinc-500 text-base sm:text-xl"
      >
        Paste your essay prompt or choose a suggestion below. I&apos;ll help you
        brainstorm a thoughtful, authentic outline that reflects who you are.
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.7 }}
        className="text-zinc-500 text-sm sm:text-base"
      >
        Just a heads-up: I can&apos;t write essays for you, but I&apos;m here to
        guide, refine, and answer any questions you have along the way.
      </motion.div>
    </div>
  );
};
