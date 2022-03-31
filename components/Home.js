import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {View, Text} from 'react-native';
import FlashSaleList from './FlashSaleList';

const Home: () => Node = (props) => {
const [isLoading, setIsLoading] = useState(false);
const [products, setProducts] = useState([]);
const getProducts = async () => {
    try {
        // console.log('running in try block');
        const response = await fetch('https://my.api.mockaroo.com/ecom.json?key=2887a1d0');
        if (response.status === 200) {
            const data = await response.json();
            setIsLoading(true);
            setProducts(data);
        } else {
            console.error(response.error);
        }
    }
    catch (e) {
        console.error(e);
    }
}

useEffect(() => {
    // console.log('useeffect');
    getProducts();
}, []);


    return (
    <>
        {
            !isLoading
            ?
            <View>
                <Text>Home screen: {props.extraData} IS LOADING</Text>

            </View>
            :
            <FlashSaleList products={products} setProducts={setProducts} />
        }
    </>
    )
}

export default Home;
