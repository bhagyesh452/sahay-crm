import React, { useEffect, useState } from "react";
import Header_processing from "./Header_processing";
import Navbar_processing from "./Navbar_processing";
import '../dist/css/Header.css'

const StickyWrapper = () => {
  const [isSticky, setSticky] = useState(false);

  const handleScroll = () => {
    setSticky(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`sticky-wrapper ${isSticky ? "sticky" : ""}`}>
      <Header_processing />
      <Navbar_processing />
    </div>
  );
};

export default StickyWrapper;