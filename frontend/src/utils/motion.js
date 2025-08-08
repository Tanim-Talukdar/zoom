export const fadeIn = (direction, delay) => {
  return {
    hidden: {
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      opacity: 0
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.25,
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      }
    }
  };
};

export const staggerContainer = (staggerChildren, delayChildren) => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren,
        delayChildren,
      }
    }
  };
};

export const slideIn = (direction, type, delay, duration) => {
  return {
    hidden: {
      x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
      y: direction === 'up' ? '100%' : direction === 'down' ? '100%' : 0,
    },
    show: {
      x: 0,
      y: 0,
      transition: {
        type,
        delay,
        duration,
        ease: 'easeOut',
      }
    }
  };
};

export const textVariant = (delay) => {
  return {
    hidden: {
      y: 50,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.25,
        delay,
      }
    }
  };
};

export const scale = (delay) => {
  return {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.25,
        delay,
      }
    }
  };
}; 

// Zoom In Effect
export const zoomIn = (direction, delay) => {
  return {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.5,
        delay: delay,
        ease: [0.25, 0.8, 0.25, 1],
      }
    }
  };
};

// Fade In and Out Effect
export const fadeInOut = (direction, delay) => {
  return {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        type: "spring",
        duration: 2,
        delay: delay,
        repeat: Infinity,
        repeatType: "reverse",
      }
    }
  };
};

// Bounce In Effect
export const bounceIn = (direction, delay) => {
  return {
    hidden: {
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 0.75,
        delay: delay,
        bounce: 0.5,
      }
    }
  };
};

// Rotate In Effect
export const rotateIn = (direction, delay) => {
  return {
    hidden: {
      rotate: direction === 'left' ? -180 : direction === 'right' ? 180 : 0,
      opacity: 0,
    },
    show: {
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.25,
        delay: delay,
        ease: [0.25, 0.8, 0.25, 1],
      }
    }
  };
};

// Slide & Rotate Effect (Combined)
export const slideRotate = (direction, delay, duration) => {
  return {
    hidden: {
      x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
      y: direction === 'up' ? '100%' : direction === 'down' ? '100%' : 0,
      rotate: direction === 'left' ? -180 : direction === 'right' ? 180 : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        delay: delay,
        duration: duration,
        ease: [0.25, 0.8, 0.25, 1],
      }
    }
  };
};

export const flipCard = (delay = 0) => ({
  hidden: {
    rotateY: 180,
    opacity: 0,
  },
  show: {
    rotateY: 0,
    opacity: 1,
    transition: {
      delay,
      duration: 1,
      type: "tween",
      ease: "easeInOut",
    },
  },
});

export const pulseFloat = {
  animate: {
    y: [0, -10, 0],
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    },
  },
};

export const diagonalSlide = (delay = 0) => ({
  hidden: {
    x: -100,
    y: -100,
    scale: 0.5,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      delay,
      duration: 1.2,
      type: "spring",
      stiffness: 100,
    },
  },
});

export const elasticDrop = (delay = 0) => ({
  hidden: {
    y: -500,
    scale: 2,
    opacity: 0,
  },
  show: {
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      delay,
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
});