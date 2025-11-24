// Import React so we can create a React component
import React from 'react';
// Import hooks from React-Redux: useSelector reads from the store, useDispatch sends actions
import { useSelector, useDispatch } from 'react-redux';
// Import the two actions from our cart slice that we need here
import { removeItem, updateQuantity } from './CartSlice';
// Import CSS for styling the cart items
import './CartItem.css';

// Define the CartItem component, it receives onContinueShopping from the parent
const CartItem = ({ onContinueShopping }) => {
  // Read the cart items from the Redux store: state.cart.items is defined in our slice
  const cart = useSelector((state) => state.cart.items);
  // Get the dispatch function so we can send actions to the Redux store
  const dispatch = useDispatch();

  // -----------------------------
  // 1) TOTAL AMOUNT FOR ALL ITEMS
  // -----------------------------
  const calculateTotalAmount = () => {
    // Use Array.reduce to accumulate a running total over all items
    const total = cart.reduce((sumSoFar, item) => {
      // item.cost is like "$12", so strip the "$" and turn it into a number
      const price = parseFloat(item.cost.substring(1));
      // Add this item's subtotal (price * quantity) to the running total
      return sumSoFar + price * item.quantity;
    }, 0); // Start the sum at 0
    // Return the final numeric total
    return total;
  };

  // -----------------------------
  // 2) CONTINUE SHOPPING HANDLER
  // -----------------------------
  const handleContinueShopping = (e) => {
    // Prevent default link/button behavior (like page reload or navigation)
    e.preventDefault();
    // Call the function passed from the parent so it can hide the cart and show products
    onContinueShopping(e);
  };

  // -----------------------------
  // 3) INCREMENT QUANTITY
  // -----------------------------
  const handleIncrement = (item) => {
    // Dispatch updateQuantity with the item's name and quantity + 1
    dispatch(
      updateQuantity({
        name: item.name,          // Identify which item to update
        quantity: item.quantity + 1 // New quantity is old + 1
      })
    );
  };

  // -----------------------------
  // 4) DECREMENT QUANTITY
  // -----------------------------
  const handleDecrement = (item) => {
    // If quantity is greater than 1, just decrease it by 1
    if (item.quantity > 1) {
      dispatch(
        updateQuantity({
          name: item.name,          // Same item name
          quantity: item.quantity - 1 // New quantity is old - 1
        })
      );
    } else {
      // If quantity would go to 0, remove the item from the cart instead
      dispatch(removeItem(item.name));
    }
  };

  // -----------------------------
  // 5) REMOVE ITEM ENTIRELY
  // -----------------------------
  const handleRemove = (item) => {
    // Dispatch removeItem with the item's name so it’s filtered out of the array
    dispatch(removeItem(item.name));
  };

  // -----------------------------
  // 6) SUBTOTAL FOR ONE ITEM
  // -----------------------------
  const calculateTotalCost = (item) => {
    // Get numeric price by stripping the "$" and parsing as float
    const price = parseFloat(item.cost.substring(1));
    // Multiply unit price by quantity to get subtotal for this item
    return price * item.quantity;
  };

  // -----------------------------
  // 7) OPTIONAL: CHECKOUT HANDLER
  // -----------------------------
  const handleCheckoutShopping = (e) => {
    // Prevent default behavior
    e.preventDefault();
    // Just show an alert for now, per the lab instructions
    alert('Functionality to be added for future reference');
  };

  // -----------------------------
  // JSX TO RENDER THE CART
  // -----------------------------
  return (
    // Outer container for the whole cart page
    <div className="cart-container">
      {/* Heading that shows total amount for all items in the cart */}
      <h2 style={{ color: 'black' }}>
        Total Cart Amount: ${calculateTotalAmount()}
      </h2>

      {/* Wrapper for the list of cart items */}
      <div>
        {/* Loop over every item in the cart array */}
        {cart.map((item) => (
          // Root div for a single cart item card
          <div className="cart-item" key={item.name}>
            {/* Item image on the left */}
            <img
              className="cart-item-image"
              src={item.image}
              alt={item.name}
            />

            {/* Right side: details and controls */}
            <div className="cart-item-details">
              {/* Item name */}
              <div className="cart-item-name">{item.name}</div>

              {/* Unit cost, e.g., "$12" */}
              <div className="cart-item-cost">{item.cost}</div>

              {/* Quantity controls: -, current quantity, + */}
              <div className="cart-item-quantity">
                {/* Decrement button calls handleDecrement with this item */}
                <button
                  className="cart-item-button cart-item-button-dec"
                  onClick={() => handleDecrement(item)}
                >
                  -
                </button>

                {/* Show the current quantity value */}
                <span className="cart-item-quantity-value">
                  {item.quantity}
                </span>

                {/* Increment button calls handleIncrement with this item */}
                <button
                  className="cart-item-button cart-item-button-inc"
                  onClick={() => handleIncrement(item)}
                >
                  +
                </button>
              </div>

              {/* Subtotal for this item (price * quantity) */}
              <div className="cart-item-total">
                Total: ${calculateTotalCost(item)}
              </div>

              {/* Delete button removes the item from the cart completely */}
              <button
                className="cart-item-delete"
                onClick={() => handleRemove(item)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Extra div where they might inject total via JS/CSS (left as-is for lab) */}
      <div
        style={{ marginTop: '20px', color: 'black' }}
        className="total_cart_amount"
      ></div>

      {/* Buttons under the cart: Continue Shopping + Checkout */}
      <div className="continue_shopping_btn">
        {/* Call our continue shopping handler when clicked */}
        <button
          className="get-started-button"
          onClick={(e) => handleContinueShopping(e)}
        >
          Continue Shopping
        </button>
        <br />
        {/* Checkout button just shows an alert for now */}
        <button
          className="get-started-button1"
          onClick={(e) =>




