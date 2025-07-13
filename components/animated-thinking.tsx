'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import cx from 'classnames';
import { SparklesIcon } from './icons';

export const ThinkingMessage = () => {
  const role = 'assistant';

  // Memoize thinking states to prevent re-creation on every render (fixes exhaustive-deps)
  const thinkingStates = useMemo(
    () => [
      { text: 'Thinking', icon: '🤔', duration: 2000, id: 'thinking' },
      { text: 'Processing', icon: '⚡', duration: 1800, id: 'processing' },
      { text: 'Analyzing', icon: '🔍', duration: 1600, id: 'analyzing' },
      { text: 'Generating', icon: '✨', duration: 1400, id: 'generating' },
      { text: 'Refining', icon: '🎯', duration: 1200, id: 'refining' },
      { text: 'Almost ready', icon: '🚀', duration: 1000, id: 'ready' },
    ],
    [],
  );

  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [dots, setDots] = useState('');

  // Cycle through thinking states
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStateIndex((prev) =>
        prev < thinkingStates.length - 1 ? prev + 1 : 0,
      );
    }, thinkingStates[currentStateIndex]?.duration || 2000);

    return () => clearInterval(timer);
  }, [currentStateIndex, thinkingStates]);

  // Animate dots independently for extra visual feedback
  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '';
        return `${prev}.`; // Fixed: use template literal instead of concatenation
      });
    }, 500);

    return () => clearInterval(dotTimer);
  }, []);

  const currentState = thinkingStates[currentStateIndex];

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message relative"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
      data-role={role}
    >
      {/* Subtle breathing effect background */}
      <motion.div
        className="absolute inset-0 bg-primary/5 rounded-xl -z-10"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY, // Fixed: use Number.POSITIVE_INFINITY
          ease: 'easeInOut',
        }}
      />

      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          {
            'group-data-[role=user]/message:bg-muted': true,
          },
        )}
      >
        {/* Animated AI Avatar */}
        <motion.div
          className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY, // Fixed: use Number.POSITIVE_INFINITY
            ease: 'easeInOut',
          }}
        >
          <motion.div
            className="translate-y-px"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }} // Fixed: use Number.POSITIVE_INFINITY
          >
            <SparklesIcon size={14} />
          </motion.div>
        </motion.div>

        <div className="flex flex-col gap-3 w-full py-2">
          {/* Main thinking text with smooth transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStateIndex}
              className="flex items-center gap-2 text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {/* Emoji icon */}
              <motion.span
                className="text-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              >
                {currentState?.icon}
              </motion.span>

              {/* Text */}
              <span className="font-medium">{currentState?.text}</span>

              {/* Animated dots */}
              <motion.span className="text-primary font-bold w-6" key={dots}>
                {dots}
              </motion.span>
            </motion.div>
          </AnimatePresence>

          {/* Progress indicator */}
          <div className="flex gap-1.5">
            {thinkingStates.map((state, index) => (
              <motion.div
                key={state.id} // Fixed: use unique id instead of array index
                className={cx(
                  'h-1 rounded-full transition-colors duration-300',
                  {
                    'bg-primary': index <= currentStateIndex,
                    'bg-muted': index > currentStateIndex,
                  },
                )}
                initial={{ width: 0 }}
                animate={{
                  width: index === currentStateIndex ? '24px' : '8px',
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
