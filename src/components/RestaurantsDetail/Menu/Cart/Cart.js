import React, { useContext, useEffect, useState } from 'react';

import CartList from './CartList/CartList';
import './Cart.css';
import CartLink from './CartLink/CartLink';
import pandaImg from '../../../../Profile/panda.png';
import CartDropDown from './CartDropDown/CartDropDown';
import CartCard from './CartCard/CartCard';
import LoadingSpinner from '../../../common/LoadingSpinner/LoadingSpinner';
import { CartContext } from '../../../../store/cart-context';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { database } from '../../../../firebase';

const DUMMY_USER = {
  'cart-id': '8oSlGubRLtE0ckNinFDy',
  dateAndTime: '2022-01-10 15:34:52.003559',
  email: 'thaparnimesh21@gmail.com',
  name: 'Nimesh',
  phoneNumber: '+917042334939',
  profilePic: '',
};

let isInitial = true;

const Cart = ({ checkout }) => {
  const {
    cartItems,
    restaurantId,
    restaurantName,
    address,
    method,
    totalAmount,
    fetchCart,
    cartChangeReset,
    cartChanged,
  } = useContext(CartContext);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(false);
      const cartDocRef = doc(database, 'cart', DUMMY_USER['cart-id']);

      const cartDocRefCollection = collection(
        database,
        cartDocRef.path,
        'items'
      );

      const snap = await getDocs(cartDocRefCollection);

      const addItemForCartCtx = {};
      if (snap.docs.length > 0) {
        const fetchedItems = snap.docs.map((d) => ({
          ...d.data(),
          qty: +d.data().quantity,
          price: +d.data().price,
          customize: d.data().id.split('-')[d.data().id.split('-').length - 1],
        }));
        const totalAmountFetchedItems = fetchedItems.reduce(
          (prev, item) => prev + parseInt(item.quantity) * parseInt(item.price),
          0
        );

        addItemForCartCtx.totalAmount = totalAmountFetchedItems;
        addItemForCartCtx.cartItems = fetchedItems;

        const doc = await getDoc(cartDocRef);

        addItemForCartCtx.restaurantId = doc.data()['vendor-id'];
        addItemForCartCtx.restaurantName = doc.data()['vendor-name'];
        addItemForCartCtx.address = 'Rohini, Delhi';
        addItemForCartCtx.method = 'Delivery';

        fetchCart(addItemForCartCtx);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        return;
      }
    };

    if (isInitial) {
      isInitial = false;
      fetchItems();
    }
  }, [fetchCart]);

  useEffect(() => {
    const submitData = async () => {
      if (!cartChanged || cartChanged.trim() === '') {
        return;
      } else if (cartChanged === 'ADD' || cartChanged === 'REMOVE') {
        for (const cartItem of cartItems) {
          await setDoc(
            doc(database, 'cart', DUMMY_USER['cart-id'], 'items', cartItem.id),
            {
              id: cartItem.id,
              name: cartItem.name,
              price: `${cartItem.price}`,
              quantity: `${cartItem.qty}`,
              veg: false,
            }
          );
        }
      } else if (cartChanged.includes('REMOVE')) {
        const id = cartChanged.split('_')[1];

        await deleteDoc(
          doc(database, 'cart', DUMMY_USER['cart-id'], 'items', id)
        );
      }
    };

    if (cartChanged && !isInitial) {
      submitData();
      cartChangeReset();
    }
  }, [cartChanged, cartItems, cartChangeReset]);

  return (
    <>
      {isLoading && (
        <div className="nocart-img__container">
          <LoadingSpinner center />
        </div>
      )}
      {cartItems.length > 0 && (
        <CartCard
          restaurantName={restaurantName}
          address={address}
          checkout={checkout}
          cartId={DUMMY_USER['cart-id']}
        >
          <CartList
            cartItems={cartItems}
            restaurantId={restaurantId}
            totalAmount={totalAmount}
            restaurantName={restaurantName}
            address={address}
            method={method}
          />
          <CartDropDown method={method} />
        </CartCard>
      )}
      {cartItems.length > 0 && !checkout && (
        <CartLink mobile cartId={DUMMY_USER['cart-id']} />
      )}
      {cartItems.length === 0 && (
        <div className={checkout ? 'checkout-nocart' : 'nocart-img__container'}>
          <img src={pandaImg} alt="No Items In Cart" />
          <p>No Items In Cart Add Items</p>
        </div>
      )}
    </>
  );
};

export default Cart;
