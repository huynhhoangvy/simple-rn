let products = [
  {"discount": 26, "due_date": 1649754482000, "id": 1, "image": "http://dummyimage.com/114x100.png/5fa2dd/ffffff", "name": "Lamb - Whole, Frozen", "price": 8558810}, 
  {"discount": 12, "due_date": 1650002782000, "id": 2, "image": "http://dummyimage.com/238x100.png/ff4444/ffffff", "name": "Cinnamon - Ground", "price": 13514626}, 
  {"discount": 30, "due_date": 1649764975000, "id": 3, "image": "http://dummyimage.com/207x100.png/cc0000/ffffff", "name": "Lid - 16 Oz And 32 Oz", "price": 6960568}, 
  {"discount": 21, "due_date": 1649870480000, "id": 4, "image": "http://dummyimage.com/172x100.png/cc0000/ffffff", "name": "Chocolate Bar - Smarties", "price": 17740542}, 
  {"discount": 7, "due_date": 1649655299000, "id": 5, "image": "http://dummyimage.com/241x100.png/cc0000/ffffff", "name": "Sardines", "price": 13457428}, 
  {"discount": 41, "due_date": 1649831594000, "id": 6, "image": "http://dummyimage.com/181x100.png/ff4444/ffffff", "name": "Cake - Mini Cheesecake", "price": 11384127}, 
  {"discount": 1, "due_date": 1649900312000, "id": 7, "image": "http://dummyimage.com/113x100.png/ff4444/ffffff", "name": "Cheese Cloth No 100", "price": 1636131}, 
  {"discount": 80, "due_date": 1649654344000, "id": 8, "image": "http://dummyimage.com/220x100.png/cc0000/ffffff", "name": "Wooden Mop Handle", "price": 3470010}, 
  {"discount": 23, "due_date": 1649822927000, "id": 9, "image": "http://dummyimage.com/240x100.png/dddddd/000000", "name": "Wine - Champagne Brut Veuve", "price": 16010507}, 
  {"discount": 12, "due_date": 1649803825000, "id": 10, "image": "http://dummyimage.com/117x100.png/ff4444/ffffff", "name": "Appetizer - Tarragon Chicken", "price": 8074340}];
let displayedProducts = [
  {"index": 0, "isViewable": true, "item": {"discount": 26, "due_date": 1649754482000, "id": 1, "image": "http://dummyimage.com/114x100.png/5fa2dd/ffffff", "name": "Lamb - Whole, Frozen", "price": 8558810}, "key": 1}, 
  {"index": 1, "isViewable": true, "item": {"discount": 12, "due_date": 1650002782000, "id": 2, "image": "http://dummyimage.com/238x100.png/ff4444/ffffff", "name": "Cinnamon - Ground", "price": 13514626}, "key": 2}, 
  {"index": 2, "isViewable": true, "item": {"discount": 30, "due_date": 1649764975000, "id": 3, "image": "http://dummyimage.com/207x100.png/cc0000/ffffff", "name": "Lid - 16 Oz And 32 Oz", "price": 6960568}, "key": 3}
];
let updatedProducts = [];
products.map(product => {
  let temp = null;
  displayedProducts.forEach(displayedProduct => {

    if (displayedProduct.item.id === product.id) {
      console.log('matching id');
      temp = Object.assign({}, {...product, due_date: product.due_date - Date.now()});
      return temp;
    }
    
  })
  return temp ? temp : product;

})

