import axios from "axios";

export const API = axios.create({
  baseURL: "https://yeepule-network.herokuapp.com/",
});
