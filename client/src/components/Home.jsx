import React from "react";
import NavBar from "./NavBar";
import Search from "./Search";
import Filter from "./Filters";
import Cards from "./Cards";
import Paginado from "./Paginado";

export default function Home() {
  return (
    <div>
      <NavBar />
      <Search />
      <Filter />
      <Cards />
      <Paginado />
    </div>
  );
}
