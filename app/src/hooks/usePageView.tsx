import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// This is for use with Google Analytics and react-router-dom
const usePageView = () => {
    const location = useLocation();

    useEffect(() => {
        if (typeof window.gtag === 'function') {
            if (window.gtag) {
                window.gtag('event', 'page_view', {
                    page_path: location.pathname + location.search,
                    page_location: window.location.href,
                });
            }
        }
    }, [location]);
};

export default usePageView;