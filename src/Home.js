import React from "react";
import Header from "./components/common/header";
import SpecialOffers from "./components/SpecialOffers";
import Deals from "./components/DealsOfTheDay";
import Footer from "./components/common/footer";
import ListingCards from "./components/common/listingCards";

function Home() {
  return (
    <div className="App">
      <Header />
      <SpecialOffers />
      <Deals />
      <ListingCards />
      <Footer />
    </div>
  );
}

export default Home;
