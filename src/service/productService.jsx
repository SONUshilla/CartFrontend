import axios from "axios";
const baseUrl = process.env.REACT_APP_BASEURL;
const fetchProducts = async (path) => {
    try {
      const response = await axios.get(`${baseUrl}/products${path}`, {
        withCredentials: false
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  export default fetchProducts;