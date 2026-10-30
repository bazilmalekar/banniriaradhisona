// import axios from "axios";

// export const BASE_URL = import.meta.env.PROD
//     ? "https://test.aradhisuva.com" // Production URL
//     : "https://localhost:7086";

// export const axiosPublic = axios.create({
//     baseURL: BASE_URL
// });



import axios from "axios";
import { Capacitor } from "@capacitor/core";

const getBaseUrl = () => {
    if (import.meta.env.PROD) {
        return "https://test.aradhisuva.com";
    }

    const platform = Capacitor.getPlatform();

    switch (platform) {
        case "android":
            return "http://10.0.2.2:5245";

        case "ios":
            return "http://localhost:5245";

        default:
            return "https://localhost:7086";
    }
};

export const BASE_URL = getBaseUrl();

export const axiosPublic = axios.create({
    baseURL: BASE_URL,
});
