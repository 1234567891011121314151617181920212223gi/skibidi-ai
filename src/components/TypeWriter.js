"use client";
import React from 'react';
import { useTypewriter } from 'react-simple-typewriter';

export default function TypeWriter({ texts = [] }) {
  const [text] = useTypewriter({
    words: texts,
    loop: 0,
    delaySpeed: 2000,
    deleteSpeed: 50,
    typeSpeed: 50
  });

  return (
    <h2 className="text-2xl text-gray-400">
      <span>{text}</span>
      <span className="animate-pulse">_</span>
    </h2>
  );
}