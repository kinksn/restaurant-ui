// WITH A LIBRARY
// "use client"
// import React from 'react'
// import Countdown from 'react-countdown'

// const endingDate = new Date("2023-07-25")

// const CountDown = () => {
//   return (
//     <Countdown className='font-bold text-5xl text-yellow-300' date={endingDate}/>
//   )
// }

// export default CountDown


// WITHOUT A LIBRARY
"use client"

import React, { useState, useEffect } from "react";

const CountDown = () => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true); // クライアントサイドでのレンダリング時に true に設定
  }, []);

  const calculateTimeLeft = () => {
    const difference = +new Date('2024-04-30T00:00:00Z') - +new Date();
    return {
      d: Math.floor(difference / (1000 * 60 * 60 * 24)),
      h: Math.floor((difference / (1000 * 60 * 60)) % 24),
      m: Math.floor((difference / 1000 / 60) % 60),
      s: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!hasMounted) return; // クライアントサイドでのレンダリングが完了するまで待つ

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [hasMounted]); // 依存配列に hasMounted を追加

  // クライアントサイドでのみレンダリングを実施
  if (!hasMounted) {
    return null; // またはローディングステート等を表示
  }

  const { d, h, m, s } = timeLeft;

  return (
    <span className="font-bold text-5xl text-yellow-300">
      {d}:{h}:{m}:{s}
    </span>
  );
};


export default CountDown;