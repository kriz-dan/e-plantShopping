// Import React so we can define a component and use JSX
import React from 'react';
// Import useSelector to read data from the Redux store and useDispatch to send actions
import { useSelector, useDispatch } from 'react-redux';
// Import the cart actions from our CartSlice (make sure the path and names match your slice file)
import { addItem, updateQuantity, removeItem } from './CartSlice';
// Import CSS for styling the cart page (optional file; adjust the name if yours is different)
import './CartItem.css';

// Define the CartItem component, which receives onContinueShopping from the parent (ProductList)
function CartItem({ onContinueShopping }) {
  // Get the dispatch function so we can send actions to the Redux store
  const dispatch = useDispatch();

  // Read the array of items currently in the cart from the Redux store
  // state => entire Redux state object
  // state.cart => the "cart" slice of state (named in configureStore)
  // state.cart.items => the items array defined in the cart slice's initialState
  const cartItems = useSelector((state) => state.cart.items);

  // Function to handle increasing the quantity of a specific item
  // We choose to reuse the addItem action for this so the slice logic decides how to increment
  const handleIncreaseQuantity = (item) => {
    // Dispatch addItem with the item; in the slice, it should increase quantity if it already exists
    dispatch(addItem(item));
  };

  // Function to handle decreasing the quantity of a specific item
  const handleDecreaseQuantity = (item) => {
    // If the quantity is greater than 1, we reduce it by 1 using updateQuantity
    if (item.quantity > 1) {
      // Dispatch updateQuantity with the item's name and the new quantity
      dispatch(
        updateQuantity({
          name: item.name,           // Identify which cart item to update by its name
          quantity: item.quantity - 1 // New quantity is old quantity minus 1
        })
      );
    } else {
      // If quantity is 1 and user clicks "-", we remove the item completely from the cart
      dispatch(removeItem(item.name));
    }
  };

  // Function to remove an item entirely from the cart, regardless of its quantity
  const handleRemoveItem = (item) => {
    // Dispatch removeItem using the item's name as the identifier
    dispatch(removeItem(item.name));
  };

  // Helper function to calculate the total number of items in the cart
  const calculateTotalQuantity = () => {
    // If cartItems exists and is an array, use reduce to sum up all the quantities
    return cartItems
      ? cartItems.reduce(
          // total is the running sum, item is the current cart item
          (total, item) => total + item.quantity,
          // Start the total at 0
          0
        )
      // If cartItems is null or undefined, return 0 so we don't crash the UI
      : 0;
  };

  // Helper function to calculate the total price of all items in the cart
  const calculateTotalPrice = () => {
    // If cartItems exists, sum up the cost * quantity for each item
    return cartItems
      ? cartItems.reduce((total, item) => {
          // Each item.cost is a string like "$15", so we remove the "$" and parse the number
          const numericCost = parseFloat(item.cost.replace('$', ''));
          // For each item, add price * quantity to the running total
          return total + numericCost * item.quantity;
        }, 0)
      // If cartItems is null or undefined, return 0 as the total price
      : 0;
  };

  // Render the cart UI
  return (
    // Wrapper div for the whole cart page
    <div className="cart-container">
      {/* Title at the top of the cart page */}
      <h2>Your Cart</h2>

      {/* If there are no items in the cart, show an empty-cart message */}
      {(!cartItems || cartItems.length === 0) && (
        // Simple message for empty cart
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          {/* Button that lets the user go back to shopping using the parent callback */}
          <button onClick={onContinueShopping}>Continue Shopping</button>
        </div>
      )}

      {/* If there ARE items in the cart, show them in a list */}
      {cartItems && cartItems.length > 0 && (
        // Main content area for the list of cart items and totals
        <div className="cart-content">
          {/* List container for all cart items */}
          <div className="cart-items">
            {/* Loop over each item in the cartItems array */}
            {cartItems.map((item) => (
              // Wrapper div for each individual cart item row
              <div className="cart-item" key={item.name}>
                {/* Optional product image if your cart items include image URLs */}
                {item.image && (
                  <img
                    src={item.image}          // Set the image source from the item
                    alt={item.name}           // Alt text for accessibility
                    className="cart-item-image" // CSS class for styling the image
                  />
                )}

                {/* Details section for name, description, and cost */}
                <div className="cart-item-details">
                  {/* Show the product's name */}
                  <h3>{item.name}</h3>
                  {/* Show the product's description if present */}
                  {item.description && <p>{item.description}</p>}
                  {/* Show the product's individual cost (e.g., "$15") */}
                  <p>Price: {item.cost}</p>
                </div>

                {/* Quantity controls and remove button for this cart item */}
                <div className="cart-item-actions">
                  {/* Label for the quantity section */}
                  <span>Quantity:</span>
                  {/* Button to decrease the quantity */}
                  <button
                    type="button"               // Explicitly set the button type
                    onClick={() => handleDecreaseQuantity(item)} // Call our decrease handler with this item
                  >
                    -
                  </button>
                  {/* Display the current quantity of this item */}
                  <span className="cart-item-quantity">{item.quantity}</span>
                  {/* Button to increase the quantity */}
                  <button
                    type="button"               // Explicitly set the button type
                    onClick={() => handleIncreaseQuantity(item)} // Call our increase handler with this item
                  >
                    +
                  </button>

                  {/* Button to remove the item completely from the cart */}
                  <button
                    type="button"               // Explicitly set the button type
                    className="remove-button"   // CSS class to style the remove button
                    onClick={() => handleRemoveItem(item)} // Call our remove handler with this item
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary section showing totals and continue shopping button */}
          <div className="cart-summary">
            {/* Show total quantity of items using our helper function */}
            <p>Total Items: {calculateTotalQuantity()}</p>
            {/* Show total price of the cart, formatted to two decimal places */}
            <p>
              Total Price: ${calculateTotalPrice().toFixed(2)}
            </p>
            {/* Button to go back to the product list via the parent callback */}
            <button onClick={onContinueShopping}>Continue Shopping</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Export the CartItem component so ProductList (or App) can import and use it
export default CartItem;





