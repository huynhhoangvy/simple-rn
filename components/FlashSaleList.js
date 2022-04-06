import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  Button,
} from 'react-native';
import useInterval from '../hooks/useInterval';
import union from 'lodash/union';

const styles = StyleSheet.create({
  image: {width: 50, height: 50},
  product: {width: 150, marginRight: 5},
  //   '.product + .product': {}
});

const getTimeDiff = saleDate => {
  let isOver = false;
  const diff = Date.now() - saleDate;
  diff <= 0 ? (isOver = true) : false;
  const delta = Math.abs(diff) / 1000; // time difference in sec
  console.log({delta});
  return {isOver, delta};
};

const convertSecToTimeDisplayed = ({isOver, delta}) => {
  if (!isOver) {
    let sec, min, hour, day, displayedStr;
    sec = Math.floor(delta / 1000);
    min = Math.floor(sec / 60);
    hour = Math.floor(min / 60);
    day = Math.floor(hour / 24);
    // if (min > 0) {
    // } else {
    //     sec = Math.floor(delta / 60);
    // }
    if (sec > 0) {
      displayedStr = sec + '';
      if (min > 0) {
        displayedStr = min + ':' + displayedStr;
        if (hour > 0) {
          displayedStr = hour + ':' + displayedStr;
          if (day > 0) {
            displayedStr = day + ' days';
          }
        }
      }
    }
  } else {
    console.log('sale is over!');
  }
};

const FlashSaleList = ({products, setProducts}) => {
  // const [count, setCount] = useState(0);
  const [timeoutIds, setTimeoutIds] = useState({});
  const [intervalId, setIntervalId] = useState(null);
  const [intervalDelay, setIntervalDelay] = useState(1000);
  const [viewableItemsState, setViewableItemsState] = useState([]);
  // let ids = {interval: {}, timeout: {}};


  useEffect(() => {}, [])

  useEffect(() => {
    const intervalCallback = () => {
      let intervalId;
      let updatedProducts = [];
      updatedProducts = products.map(product => {
        let newItem = null;
        viewableItemsState.forEach(viewableItem => {
          if (product.id === viewableItem.item.id) {
            let delta = Math.abs(product.due_date - Date.now());
            newItem = Object.assign({}, {...product, due_date: delta});
            return newItem;
          }
        });
        return newItem ? newItem : product;
      });
      setProducts(updatedProducts);
    };

    if (viewableItemsState.length) {
      console.log('GET NEW STATE, run effect: ', viewableItemsState.length);
      let id = setInterval(intervalCallback, intervalDelay);
      console.log('setinterval: ', id);
      setTimeout(() => {
        console.log('clear interval: ', id);
        clearInterval(id);
      }, 20000);
      setIntervalId(id);
    }
  }, [viewableItemsState]);

  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 0});
  const onViewRef = useRef(({viewableItems, changed}) => {
    console.log('onViewRef--------------------------------');
    console.log({viewableItems});
    console.log({changed});
    // Use viewable items in state or as intended
    // combine viewableItems with changed
    let items = [];
    let displayedProducts = [];

    // check condition to decide whether to set interval -- check if changed and viewable are the same
    let isMatched = viewableItems.every(
      (item, index) =>
        changed[index].item.name === viewableItems[index].item.name,
    );
    if (viewableItems.length !== changed.length || !isMatched) {
      console.log('NOT MATCH, HERE');
      // set interval to handle count & update view for product item
      items = union(viewableItems, changed).filter(item => {
        return item.isViewable === true;
      });

      // set timeout for displayed item from items array
      let ids = {timeout: []}
      items.forEach(item => {
        let delta = Math.floor(item.item.due_date - Date.now());
        if (delta > 0) {
          let timeoutId = setTimeout(() => {
            // timeout callback
          }, delta);
          
          ids.timeout.push(timeoutId);
        } else {
          console.log(`item ${item.item.id} sale is expired!`);
        }

        displayedProducts = [...displayedProducts, item];
      });
      console.log('timeoutid: ', ids.timeout)
      setTimeoutIds(ids.timeout);
      // console.log({displayedProducts});
      setViewableItemsState(displayedProducts);
    }
  });

  const renderItem = ({item}) => (
    <View class="product" style={styles.product}>
      <Image style={styles.image} source={{uri: item.image}} />
      <Text>{item.name.substring(0, 10)}</Text>
      <Text>{item.price} VND</Text>
      <Text>{item.discount}%</Text>
      <Text>{item.due_date}</Text>
    </View>
  );

  return (
    <SafeAreaView>
      {products && (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal={true}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
        />
      )}
      <Button onPress={() => console.log(products)} title="log" />
    </SafeAreaView>
  );
};

export default FlashSaleList;
