import React from "react";
import {ReactNode} from "react";
import {LazyMotion} from 'framer-motion';

const loadFeatures = () => import('./features').then((res) => res.default);

type Props = {
  children: ReactNode;
};

export default function MotionLazyContainer({children}: Props) {
  <LazyMotion strict features={loadFeatures}>
    {children}
  </LazyMotion>;
}
