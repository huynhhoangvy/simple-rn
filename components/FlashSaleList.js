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
import union from 'lodash/union';
import isNumber from 'lodash/isNumber';

const styles = StyleSheet.create({
  image: {width: 50, height: 50},
  product: {width: 150, marginRight: 5},
  //   '.product + .product': {}
});

let getTimeDiff = saleDate => {
  // let isOver = false;
  const diff = saleDate - Date.now();
  // diff <= 0 ? isOver = true : false;
  const delta = Math.abs(diff);
  // return {isOver,delta};
  return delta;
};

let convertSecToTimeDisplayed = delta => {
  // if (!isOver) {
  let sec, min, hour, day;
  let displayedStr = '';
  sec = Math.floor(delta / 1000);
  const remainingSec = Math.floor(sec % 60);
  min = Math.floor(sec / 60);
  const remainingMinute = Math.floor(min % 60);
  hour = Math.floor(min / 60);
  const remainingHour = Math.floor(hour % 24);
  day = Math.floor(hour / 24);
  if (remainingSec > 0) {
    displayedStr = remainingSec + 's' + displayedStr;
  }
  if (remainingMinute > 0) {
    displayedStr = remainingMinute + 'm' + displayedStr;
  }
  if (remainingHour > 0) {
    displayedStr = remainingHour + 'h' + displayedStr;
  }
  if (day > 0) {
    displayedStr = day + 'd ' + displayedStr;
  }
  const result =
    day +
    ' d ' +
    remainingHour +
    ' h ' +
    remainingMinute +
    ' m ' +
    remainingSec +
    ' s';
  return displayedStr;
};

const initialIds = {intervalIds: [], timeoutIds: []};

const FlashSaleList = ({products, setProducts, productState}) => {
  const [timeoutIds, setTimeoutIds] = useState([]);
  const [intervalIds, setIntervalIds] = useState([]);
  const [intervalDelay, setIntervalDelay] = useState(500);
  const [viewableItemsState, setViewableItemsState] = useState([]);
  const intervalRef = useRef([]);
  const timeoutRef = useRef([]);

  useEffect(() => {
    let newTimeoutIds = [];
    const intervalCallback = id => {
      let intervalId;
      let updatedProducts = [];
      newTimeoutIds = [];
      updatedProducts = productState.map(product => {
        let newItem = null;
        viewableItemsState.forEach(viewableItem => {
          if (product.id === viewableItem.item.id) {
            // let delta = product.due_date - Date.now();
            if (isNumber(product.due_date)) {
              const timestamp = convertSecToTimeDisplayed(
                getTimeDiff(product.due_date),
              );
              newItem = Object.assign({}, {...product, due_date: timestamp});
              // console.log('if : ', newItem)
            } else {
              newItem = product;
              // newItem = Object.assign({}, {...product});
              // console.log('else : ', newItem)
            }
            return newItem;
          }
        });
        return newItem ? newItem : product;
      });
      setProducts(updatedProducts);
    };

    // NEED TO CLEAR ALL INTERVAL ON

    if (viewableItemsState.length) {
      if (intervalRef.current.length !== 0) {
        intervalRef.current.forEach(id => {
          clearInterval(id);
        });
      }

      let id = setInterval(() => intervalCallback(id), intervalDelay);
      intervalRef.current = [id];
      setIntervalIds([id]);
    }
  }, [viewableItemsState]);

  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 0});
  const onViewRef = useRef(({viewableItems, changed}) => {
    console.log('onViewRef--------------------------------');
    // Use viewable items in state or as intended
    // combine viewableItems with changed
    let items = [];

    // clear all timeout and interval

    // IDS HERE NEED TO BE EMPTY

    // check condition to decide whether to set interval -- check if changed and viewable are the same
    let isMatched = changed.every((item, index) => {
      return item.name === viewableItems[index].item.name;
    });
    if (viewableItems.length !== changed.length && !isMatched) {
      if (timeoutRef.current.length !== 0) {
        timeoutRef.current.forEach(id => clearTimeout(id));
      }
      // set interval to handle count & update view for product item
      items = union(viewableItems, changed).filter(item => {
        return item.isViewable === true;
      });

      let newTimeoutIds = [];
      items.forEach(item => {
        // const delta = item.item.due_date - Date.now();
        if (isNumber(item.item.due_date)) {
          const id = setTimeout(() => {
            console.log('countdown done');
          }, item.item.due_date);
          newTimeoutIds.push(id);
        }
      });
      timeoutRef.current = newTimeoutIds;
      setTimeoutIds(newTimeoutIds);

      setViewableItemsState(items);
    }
  });

  const renderItem = ({item}) => (
    <View class="product" style={styles.product}>
      <Image style={styles.image} source={{uri: item.image}} />
      <Text>{item.name.substring(0, 10)}</Text>
      <Text>{item.price} VND</Text>
      <Text>{item.discount}%</Text>
      <Text>
        {isNumber(item.due_date)
          ? convertSecToTimeDisplayed(getTimeDiff(item.due_date))
          : item.due_date}
      </Text>
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
    </SafeAreaView>
  );
};

export default FlashSaleList;
