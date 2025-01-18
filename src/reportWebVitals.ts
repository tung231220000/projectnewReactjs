import {onCLS, onFID, onFCP, onLCP, onTTFB, onINP, Metric} from 'web-vitals';

type WebVitalsCallback = (metric: Metric) => void;

const reportWebVitals = (onPerfEntry?: WebVitalsCallback): void => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
    onINP(onPerfEntry); // INP chỉ có trong v4.x
  }
};

export default reportWebVitals;