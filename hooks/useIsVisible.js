import { useState, useRef, useEffect } from 'react';
import { Dimensions } from 'react-native';

const useIsVisible = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const checkVisibility = () => {
      if (ref.current) {
        ref.current.measure((x, y, width, height, pageX, pageY) => {
          const screenHeight = Dimensions.get('window').height;
          const isComponentVisible =
            pageY + height >= 0 && pageY <= screenHeight;

          setIsVisible(isComponentVisible);
        });
      }
    };

    // Check visibility on mount and on scroll
    checkVisibility();
    const interval = setInterval(checkVisibility, 200); // Check every 200ms

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return [ref, isVisible];
};

export default useIsVisible;