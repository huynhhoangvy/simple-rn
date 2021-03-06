import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import FlashSaleList from './FlashSaleList';
import PRODUCTS from '../public/products.json';

const Home = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productState, setProductState] = useState([]);
  const getProducts = async () => {
    try {
      // console.log('running in try block');
      const response = await fetch(
        'https://my.api.mockaroo.com/ecom.json?key=2887a1d0',
      );
      if (response.status === 200) {
        const data = await response.json();
        setIsLoading(true);
        let newData = data.map(item => {
          const dueDate = Number(item.due_date);
          if (dueDate > Date.now()) {
            return Object.assign({}, {...item, due_date: dueDate})
          } else {
            return Object.assign({}, {...item, due_date: 'sale is over!'})
          }
        }
        );
        // console.log('data here: ', newData);
        setProductState(newData);
        setProducts(newData);
      } else {
        console.error(response.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // console.log('products: ', PRODUCTS);
    getProducts();
  }, []);

  return (
    <>
      {!isLoading ? (
        <View>
          <Text>Home screen: {props.extraData} IS LOADING</Text>
        </View>
      ) : (
        <FlashSaleList
          products={products}
          setProducts={setProducts}
          productState={productState}
        />
      )}
    </>
  );
};

export default Home;
