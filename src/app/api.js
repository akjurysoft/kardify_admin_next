import axios from "../../axios";


export const getProducts = async () => {
    try {
        const response = await axios.get('/api/get-products');
        if(response.data.status === 'success'){
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const response = await axios.get('/api/fetch-categories',{
            headers : {
                Authorization : localStorage.getItem('kardifyAdminToken')
            }
        });
        if(response.data.code === 200){
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getSubCategories = async () => {
    try {
        const response = await axios.get('/api/fetch-subcategories',{
            headers : {
                Authorization : localStorage.getItem('kardifyAdminToken')
            }
        });
        if(response.data.code === 200){
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getSuperSubCategories = async () => {
    try {
        const response = await axios.get('/api/fetch-supersubcategories',{
            headers : {
                Authorization : localStorage.getItem('kardifyAdminToken')
            }
        });
        if(response.data.code === 200){
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getProductBrands = async () => {
    try {
        const response = await axios.get('/api/fetch-product-brands-admin',{
            headers : {
                Authorization : localStorage.getItem('kardifyAdminToken')
            }
        });
        if(response.data.status === 'success'){
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getCarBrands = async () => {
    try {
        const response = await axios.get('/api/fetch-car-brands');
        if(response.data.status === 'success'){
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getProductAttributes = async () => {
    try {
        const response = await axios.get('/api/fetch-all-attributes',{
            headers : {
                Authorization : localStorage.getItem('kardifyAdminToken')
            }
        });
        if(response.data.code === 200){
            return response.data;
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};