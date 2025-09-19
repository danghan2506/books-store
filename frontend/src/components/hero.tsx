import { Link } from 'react-router'
import bg from "../assets/bg.jpg"
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import pencil from "../assets/pencil.png"
import { Button } from './ui/button';
const AnimatedText = ({ 
  text, 
  className, 
  delay = 0, 
  staggerDelay = 0.03 
}: { 
  text: string; 
  className: string; 
  delay?: number; 
  staggerDelay?: number; 
}) => {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: delay + i * staggerDelay,
            ease: "easeOut"
          }}
          className="inline-block mr-3"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
const AnimatedParagraph = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  if (shouldReduceMotion) {
    return <p className="text-muted-foreground leading-relaxed max-w-2xl">{text}</p>;
  }

  return (
    <p className="text-muted-foreground leading-relaxed max-w-2xl">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.02,
            ease: "easeOut"
          }}
          className="inline-block mr-1"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
};
const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  // Container animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  return (
 <motion.section 
      className='mx-auto max-w-[1440px] px-6 lg:px-12 py-12 xl:py-20'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className='flex items-center justify-center gap-12 flex-col xl:flex-row'>
        {/* Left side */}
        <motion.div 
          className='flex flex-1 flex-col pt-12 xl:pt-32'
          variants={itemVariants}
        >
          {/* Animated title */}
          <motion.h1 
            className='text-[45px] leading-tight md:text-[55px] md:leading-[1.3] mb-4 font-bold max-w-[46rem]'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatedText text="Find Your Next Favourite" className="" delay={0.2} />
            
            {/* Books with animated B circle */}
            <span className='inline-flex items-center'>
              <motion.span 
  className='inline-flex items-center justify-center p-5 h-16 w-16 bg-[var(--custom-yellow)] text-white rounded-full mr-2 cursor-pointer'
  style={{ rotate: -31 }}
  initial={{ scale: 0, rotate: -31 }}
  animate={{ scale: 1, rotate: -31 }}
  whileHover={{ 
    scale: 1.1, 
    rotate: shouldReduceMotion ? -31 : -25,
    transition: { type: "spring", stiffness: 300, damping: 10 }
  }}
  whileTap={{ scale: 0.95 }}
  transition={{
    duration: 0.8,
    delay: 1.2,
    type: "spring",
    stiffness: 100,
    damping: 8
  }}
>
  <motion.span
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.4, duration: 0.3 }}
    className="text-2xl font-bold"
  >
    B
  </motion.span>
</motion.span>
              
              <AnimatedText text="ooks" className="" delay={1.3} staggerDelay={0.1} />
            </span>
            
            {/* Animated pencil icon */}
            <motion.img 
              src={pencil} 
              height={49} 
              width={49} 
              className='inline-flex relative bottom-2 ml-2'
              initial={{ opacity: 0, rotate: -10, scale: 0 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 1.6,
                type: "spring",
                stiffness: 200,
                damping: 8
              }}
              whileHover={{
                rotate: shouldReduceMotion ? 0 : 10,
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
              alt="Pencil icon"
            />
            
            <AnimatedText text="From Anywhere" className="" delay={1.8} />
          </motion.h1>

          {/* Animated paragraph */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.3 }}
          >
            <AnimatedParagraph 
              text="Step into a world where stories breathe, and every page sparks wonder. From quiet nights to curious minds, discover books that stir your soul, awaken dreams, and stay with you long after the last word. Your next escape is just a chapter away."
              delay={2.4}
            />
          </motion.div>

          {/* Animated button */}
          <motion.div 
            className='mt-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 3.2, 
              duration: 0.5,
              type: "spring",
              stiffness: 100
            }}
          >
            <Button
              asChild
              variant="hero"
              size="hero"
              className="animate-pulse-glow"
            >
              <Link to='/store'>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Explore now
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Right side - Card Stack Animation */}
        <motion.div
            animate={shouldReduceMotion ? {} : {
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <motion.img 
              src={bg} 
              alt="Beautiful collection of books" 
              height={588} 
              width={588}
              className="rounded-2xl shadow-2xl"
              whileHover={shouldReduceMotion ? {} : {
                scale: 1.02,
                rotate: 1,
                transition: { duration: 0.3 }
              }}
            />
            
            {/* Subtle glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
      </div>
    </motion.section>
  );
}

export default Hero