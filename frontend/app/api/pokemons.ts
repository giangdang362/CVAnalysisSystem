import { getApi } from "@/src/axios/method";
import axios from "axios";
import { IPokemonDetailResponse, IPokemonResponse } from "./JD/type";

export const getPokemons = async () => {
  try {
    const response = await getApi<IPokemonResponse>("/v2/pokemon");
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const getPokemonsById = async (id: number) => {
  try {
    const response = await getApi<IPokemonDetailResponse>(`/v2/pokemon/${id}`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
