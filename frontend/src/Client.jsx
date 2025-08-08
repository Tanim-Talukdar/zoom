import axios from "axios";

export const BASE_URL = "http://localhost:8000/api/v1/users"

export const client = axios.create({baseURL: BASE_URL})