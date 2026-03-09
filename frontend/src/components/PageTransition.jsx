import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
    const location = useLocation();
    const [displayLocation, setDisplayLocation] = useState(location);
    const [transitionStage, setTransitionStage] = useState('fadeIn');

    // On location change, immediately show the new location and trigger fade-in.
    // Real page transitions with just React state require complex rendering matching.
    // For a snappy app, we can just trigger the animate-fade-in-up class on key change.

    return (
        <div key={location.pathname} className="animate-fade-in-up w-full flex-grow flex flex-col">
            {children}
        </div>
    );
};

export default PageTransition;
