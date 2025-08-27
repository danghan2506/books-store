import { motion, useMotionValue, useTransform, type PanInfo, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useMemo } from 'react';

interface Card {
  id: string;
  image: string;
  alt: string;
}

interface CardStackProps {
  cards: Card[];
  className?: string;
}

const CardStack = ({ cards, className = "" }: CardStackProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Motion values for drag
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-25, 25]);
  const opacity = useTransform(x, [-250, -100, 0, 100, 250], [0.5, 1, 1, 1, 0.5]);

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 80;
    const swipeVelocity = Math.abs(info.velocity.x);
    const swipeDistance = Math.abs(info.offset.x);
    
    // Determine if it's a valid swipe
    if ((swipeDistance > threshold || swipeVelocity > 400) && !isAnimating) {
      setIsAnimating(true);
      
      // Immediately move to next card without timeout
      setCurrentIndex(prev => (prev + 1) % cards.length);
      
      // Reset states after animation completes
      setTimeout(() => {
        setIsAnimating(false);
        x.set(0);
      }, 300);
    } else {
      // Snap back to center with spring animation
      x.set(0);
    }
  }, [cards.length, x, isAnimating]);

  // Memoize visible cards to prevent unnecessary recalculations
  const visibleCards = useMemo(() => {
    const result = [];
    const maxVisible = Math.min(4, cards.length);
    
    for (let i = 0; i < maxVisible; i++) {
      const cardIndex = (currentIndex + i) % cards.length;
      result.push({
        ...cards[cardIndex],
        stackIndex: i,
        cardIndex
      });
    }
    return result;
  }, [cards, currentIndex]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          {visibleCards.map((card, index) => {
            const isTop = index === 0;
            const zIndex = visibleCards.length - index;
            const scale = 1 - (index * 0.05);
            const yOffset = index * 8;
            const brightness = 1 - (index * 0.1);
            
            return (
              <motion.div
                key={`${card.id}-${card.cardIndex}`}
                className="absolute inset-0"
                initial={index === 0 ? { 
                  scale: 0.9, 
                  opacity: 0,
                  y: 50
                } : false}
                animate={{
                  scale,
                  y: yOffset,
                  zIndex,
                  opacity: 1,
                }}
                exit={isTop ? {
                  x: info => info.offset.x > 0 ? 400 : -400,
                  rotate: info => info.offset.x > 0 ? 25 : -25,
                  opacity: 0,
                  scale: 0.8,
                  transition: {
                    duration: 0.3,
                    ease: "easeOut"
                  }
                } : {}}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 1
                }}
                style={isTop ? {
                  x,
                  rotate,
                  opacity,
                } : {}}
                drag={isTop && !isAnimating ? "x" : false}
                dragConstraints={{ left: -400, right: 400 }}
                dragElastic={0.2}
                onDragEnd={isTop ? handleDragEnd : undefined}
                whileDrag={isTop ? { 
                  scale: 1.05,
                  cursor: "grabbing"
                } : {}}
              >
                <motion.img
                  src={card.image}
                  alt={card.alt}
                  className="w-full h-full object-cover rounded-2xl shadow-xl select-none"
                  style={{
                    filter: `brightness(${brightness})`,
                    pointerEvents: isTop ? 'auto' : 'none'
                  }}
                  whileHover={isTop && !isAnimating ? {
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  } : {}}
                  draggable={false}
                />
                
                {/* Subtle overlay for depth */}
                {!isTop && (
                  <motion.div 
                    className="absolute inset-0 bg-black rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: index * 0.08,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Gradient overlay for top card during drag */}
                {isTop && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-green-500/20 rounded-2xl pointer-events-none"
                    style={{
                      opacity: useTransform(x, [-200, 0, 200], [0.6, 0, 0.6])
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Swipe indicator with better animations */}
      <motion.div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.span
          animate={{ 
            x: [0, -5, 5, 0],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            repeatDelay: 3,
            ease: "easeInOut" 
          }}
        >
          ← Swipe to explore →
        </motion.span>
      </motion.div>
      
      {/* Card counter with smooth transitions */}
      <motion.div
        className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        {cards.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
            }`}
            animate={{
              scale: index === currentIndex ? 1.2 : 1,
              opacity: index === currentIndex ? 1 : 0.5,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default CardStack;