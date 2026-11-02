import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface FullscreenImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  altText?: string;
}

export default function FullscreenImageModal({ isOpen, onClose, imageSrc, altText }: FullscreenImageModalProps) {
  if (!imageSrc) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-full max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 sm:-right-12 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer"
              aria-label="Fechar"
            >
              <X size={32} />
            </button>
            
            <div className="bg-transparent rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
              <img
                src={imageSrc}
                alt={altText || "Logotipo em Tela Cheia"}
                className="max-w-[90vw] max-h-[80vh] object-contain [image-rendering:high-quality] mix-blend-multiply"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
