// ProductContext.js
import React, { createContext, useState, useEffect } from 'react';
import { baseUrl } from '../../Config/baseUrl';
export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    // ------------------brand Api--------------------
    const [brandData, setbrandData] = useState([]);
    const brandApi = async () => {
        try {

            const response = await fetch(`${baseUrl}/api/view_data_api.php?view=brand`)
            const result = await response.json()
                .then((result) => {
                    result.msg.map((item) => {

                        setbrandData(item.brand_id)
                    })

                })
                .catch(error => console.log(error))

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        brandApi()
    }, [])
    console.log(brandData)
    const [productData, setProductData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(true);

    const product = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/view_data_api.php?view=products&category_id=&sub_category_id=&sub_sub_category_id=&brand_id=${brandData}`);
            const result = await response.json();
            setProductData(result.msg);
            setIsLoaded(false);
            console.log('Product',result.msg[1])

        } catch (error) {
            console.log('E', error);
            setIsLoaded(false);
        }
    };

    useEffect(() => {
        product();
    }, []);

    return (
        <ProductContext.Provider value={{ productData, isLoaded }}>
            {children}
        </ProductContext.Provider>
    );
};
