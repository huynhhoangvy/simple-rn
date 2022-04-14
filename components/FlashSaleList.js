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
import omit from 'lodash/omit';

const styles = StyleSheet.create({
  image: {width: 50, height: 50},
  product: {width: 150, marginRight: 5},
  //   '.product + .product': {}
});

let getTimeDiff = saleDate => {
  // let isOver = false;
  const diff = saleDate - Date.now();
  //console.log({diff})
  // diff <= 0 ? isOver = true : false;
  const delta = Math.abs(diff);
  //console.log({delta, isOver});
  // return {isOver,delta};
  return delta;
};

let convertSecToTimeDisplayed = delta => {
  // if (!isOver) {
  let sec, min, hour, day;
  let displayedStr = '';
  // console.log({sec, min, hour, day, displayedStr})
  sec = Math.floor(delta / 1000);
  const remainingSec = Math.floor(sec % 60);
  min = Math.floor(sec / 60);
  const remainingMinute = Math.floor(min % 60);
  hour = Math.floor(min / 60);
  const remainingHour = Math.floor(hour % 24);
  day = Math.floor(hour / 24);
  // console.log({day, hour, min, sec});
  // console.log({day, remainingHour, remainingMinute, remainingSec});
  if (remainingSec > 0) {
    displayedStr = remainingSec + 's' + displayedStr;
    // console.log('sec remain: ', displayedStr);
  }
  if (remainingMinute > 0) {
    displayedStr = remainingMinute + 'm' + displayedStr;
    // console.log('min: ', displayedStr);
  }
  if (remainingHour > 0) {
    displayedStr = remainingHour + 'h' + displayedStr;
    // console.log('hour: ', displayedStr);
  }
  if (day > 0) {
    displayedStr = day + 'd ' + displayedStr;
    // console.log('day: ', displayedStr);
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
  // console.log({result});
  // console.log({displayedStr});
  // } else {
  //   console.log('sale is over!');
  // }
  return displayedStr;
};

const initialIds = {intervalIds: [], timeoutIds: []};

const FlashSaleList = ({products, setProducts, productState}) => {
  // const [count, setCount] = useState(0);
  const [timeoutIds, setTimeoutIds] = useState([]);
  const [intervalIds, setIntervalIds] = useState([]);
  const [intervalDelay, setIntervalDelay] = useState(1000);
  const [viewableItemsState, setViewableItemsState] = useState([]);
  const intervalRef = useRef([]);
  const timeoutRef = useRef([]);
  // let ids = {interval: {}, timeout: {}};

  // useEffect(() => {
  // console.log('ID LIST: ', timeoutIds);
  // }, [timeoutIds]);

  useEffect(() => {
    let newTimeoutIds = [];
    const intervalCallback = id => {
      // console.log('start interval callback');
      let intervalId;
      let updatedProducts = [];
      console.log('WHICH INTERVAL: ', id);
      newTimeoutIds = [];
      updatedProducts = productState.map(product => {
        let newItem = null;
        viewableItemsState.forEach(viewableItem => {
          if (product.id === viewableItem.item.id) {
            let delta = product.due_date - Date.now();
            if (delta > 0) {
              const timestamp = convertSecToTimeDisplayed(
                getTimeDiff(product.due_date),
              );
              newItem = Object.assign({}, {...product, due_date: timestamp});
            } else {
              newItem = Object.assign(
                {},
                {...product, due_date: 'item expired!'},
              );
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
          console.log('clear interval id: ', id);
          clearInterval(id);
        });
        // console.log('clear all timeout & interval: ', intervalIds);
        // console.log('can i get ref: ', intervalRef);
      }

      // console.log('GET NEW STATE, run effect: ', viewableItemsState.length);
      let id = setInterval(() => intervalCallback(id), intervalDelay);
      // console.log('out setinterval: ', id);
      // let newIntervalIds = []
      // newIntervalIds = [id];
      // console.log('future interval ids: ', newIntervalIds)
      intervalRef.current = [id];
      setIntervalIds([id]);
      // console.log('setinterval: ', id);
      // setTimeout(() => {
      //   // console.log('fake clearinterval: ', id);
      //   clearInterval(id);
      // }, 5000);
      // setIntervalId(id);
    }
  }, [viewableItemsState]);

  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 0});
  const onViewRef = useRef(({viewableItems, changed}) => {
    console.log('onViewRef--------------------------------');
    // console.log({viewableItems});
    // console.log({changed});
    // Use viewable items in state or as intended
    // combine viewableItems with changed
    let items = [];
    // let displayedProducts = [];

    // clear all timeout and interval

    // IDS HERE NEED TO BE EMPTY

    // check condition to decide whether to set interval -- check if changed and viewable are the same
    let isMatched = changed.every((item, index) => {
      // console.log('WHY ERROR: ', item)
      return item.name === viewableItems[index].item.name;
    });
    // console.log(isMatched)
    if (viewableItems.length !== changed.length && !isMatched) {
      if (timeoutRef.current.length !== 0) {
        timeoutRef.current.forEach(id => clearTimeout(id));
      }
      console.log('cleared timeout: ', timeoutRef.current);
      // console.log('NOT MATCH, HERE');
      // set interval to handle count & update view for product item
      items = union(viewableItems, changed).filter(item => {
        return item.isViewable === true;
      });

      // console.log('WHAT ITEM HERE: ', items)
      let newTimeoutIds = [];
      items.forEach(item => {
        const delta = item.item.due_date - Date.now();
        if (delta > 0) {
          const id = setTimeout(() => {
            console.log('countdown done');
          }, delta);
          newTimeoutIds.push(id);
        } else {
          console.log('items loop expired');
        }
      });
      // console.log('need this: ', newTimeoutIds);
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
      <Button onPress={() => console.log({intervalIds})} title="log" />
    </SafeAreaView>
  );
};

export default FlashSaleList;
