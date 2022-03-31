import React, {useRef} from 'react';
import type {Node} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';

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
    //     console.log('min: ', )
    // } else {
    //     sec = Math.floor(delta / 60);
    //     console.log('else second: ', sec);
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

const FlashSaleList: () => Node = ({products, setProducts}) => {

  const onViewRef = React.useRef(({viewableItems, changed}) => {
    console.log('onViewRef')
    console.log({viewableItems});
    console.log({changed});
    // Use viewable items in state or as intended
  });
  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

  const renderItem = ({item}) => (
    <View
        class='product'
        style={styles.product}
    >
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
    </SafeAreaView>
  );
};

export default FlashSaleList;
