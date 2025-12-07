"use client";

import React from "react";
import V0ParticleAnimation from "./v0-particle-animation";
import styles from "./v0Nasa.module.css";
import { InteractiveGlobe } from "./v0mundo/globe-to-map-transform";

export default function V0Nasa() {
  return (
    <div className={styles.container}>
      <div className={styles.container1}>
        <V0ParticleAnimation />
      </div>
      <div className={styles.globeContainer}>
        <InteractiveGlobe />
      </div>
    </div>
  );
}
