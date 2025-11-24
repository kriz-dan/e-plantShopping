import React from 'react';                                      // Import React so we can define a component
import { useSelector, useDispatch } from 'react-redux';         // Import hooks to read from and write to the Redux store
import { removeItem, updateQuantity } from './CartSlice';       // Import the actions we defined in CartSlice.jsx
import './CartItem.css';                                        // Import the CSS so the cart styles apply

// Functional component for the Cart screen
const CartItem = ({ onContinueShopping }) => {                  // CartItem receives a prop: a function to go back to shopping
  const cart = useSelector(state => state.cart.items);          // Read the cart items array from Redux: state.cart.items
  const dispatch = useDispatch();                               // Get the dispatch function to send actions to Redux

  // Calculate total amount for all products in the cart
  const calculateTotalAmount = () => {                          // Function to compute sum of all (price * quantity)
    let total = 0;                                              // Start with total = 0

    cart.forEach((item) => {                                    // Loop through each item currently in the cart
      const numericPrice = parseFloat(                          // Convert the string cost (e.g. "$15") into a number 15
        item.cost.replace('$', '')                              // Remove the "$" so parseFloat can read the number
      );                                                        // End of price parsing

      total += numericPrice * item.quantity;                    // Add this item's total (price * quantity) into overall total
    });                                                         // End of loop over all cart items

    return total.toFixed(2);                                    // Return total as a string with 2 decimal places (e.g. "45.00")
  };                                                            // End of calculateTotalAmount function

  const handleContinueShopping = (e) => {                       // Handler for when user clicks "Continue Shopping"
    e.preventDefault();                                         // Prevent default button behavior (not strictly required here)
    onContinueShopping();                                       // Call the function passed from parent to go back to product list
  };                                                            // End of handleContinueShopping

  const handleIncrement = (item) => {                           // Handler for "+" button to increase quantity
    const newQuantity = item.quantity + 1;                      // Compute the new quantity by adding 1

    dispatch(                                                   // Dispatch an action to Redux
      updateQuantity({                                          // Call updateQuantity action creator
        name: item.name,                                        // Identify the item by its name
        quantity: newQuantity                                   // Set its quantity to the new value
      })                                                        // End of payload object
    );                                                          // End of dispatch
  };                                                            // End of handleIncrement

  const handleDecrement = (item) => {                           // Handler for "-" button to decrease quantity
    if (item.quantity > 1) {                                    // Only decrease if quantity is greater than 1
      const newQuantity = item.quantity - 1;                    // Compute new quantity by subtracting 1

      dispatch(                                                 // Dispatch an action to Redux
        updateQuantity({                                        // Use updateQuantity again
          name: item.name,                                      // Identify which item to update
          quantity: newQuantity                                 // New quantity after decrement
        })                                                      // End of payload object
      );                                                        // End of dispatch
    }                                                           // If quantity is 1, we do nothing; user can use Delete to remove
  };                                                            // End of handleDecrement

  const handleRemove = (item) => {                              // Handler for "Delete" button
    dispatch(                                                   // Dispatch an action to Redux
      removeItem(item.name)                                     // Call removeItem with the item's name as payload
    );                                                          // This will filter it out of the cart in the reducer
  };                                                            // End of handleRemove

  // Calculate total cost based on quantity for an item
  const calculateTotalCost = (item) => {                        // Function to compute total price for a single cart line
    const numericPrice = parseFloat(                            // Parse numeric cost from the string price
      item.cost.replace('$', '')                                // Remove "$" symbol before converting
    );                                                          // End of price parsing

    const lineTotal = numericPrice * item.quantity;             // Multiply price by quantity to get this line's total

    return lineTotal.toFixed(2);                                // Return the line total as a string with 2 decimal places
  };                                                            // End of calculateTotalCost

  return (                                                      
    <div className="cart-container">                            {/* Outer container div for the cart page */}
      <h2 style={{ color: 'black' }}>                           {/* Heading showing overall cart total */}
        Total Cart Amount: ${calculateTotalAmount()}            {/* Call calculateTotalAmount() to show the sum */}
      </h2>
      <div>                                                     {/* Wrapper for the list of cart items */}
        {cart.map(item => (                                     // Loop over each item in the cart array
          <div className="cart-item" key={item.name}>           {/* Single cart item container, key by item name */}
            <img                                                // Display the plant image
              className="cart-item-image"                       // Apply image styling
              src={item.image}                                  // Source URL of the plant image
              alt={item.name}                                   // Alt text for accessibility
            />
            <div className="cart-item-details">                 {/* Container for item text/details */}
              <div className="cart-item-name">{item.name}</div> {/* Display plant name */}
              <div className="cart-item-cost">{item.cost}</div> {/* Display plant price string (e.g. "$15") */}
              <div className="cart-item-quantity">              {/* Quantity controls container */}
                <button                                         // Decrement button
                  className="cart-item-button cart-item-button-dec"
                  onClick={() => handleDecrement(item)}         // Call handleDecrement with this item
                >
                  -                                             {/* Minus sign for quantity down */}
                </button>
                <span className="cart-item-quantity-value">     {/* Shows current quantity */}
                  {item.quantity}                               {/* Render the numeric quantity */}
                </span>
                <button                                         // Increment button
                  className="cart-item-button cart-item-button-inc"
                  onClick={() => handleIncrement(item)}         // Call handleIncrement with this item
                >
                  +                                             {/* Plus sign for quantity up */}
                </button>
              </div>
              <div className="cart-item-total">                 {/* Shows total for this item (price * quantity) */}
                Total: ${calculateTotalCost(item)}              {/* Call helper to compute line total */}
              </div>
              <button                                           // Delete button to remove item entirely
                className="cart-item-delete"
                onClick={() => handleRemove(item)}              // Call handleRemove with this item
              >
                Delete                                          {/* Button label */}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div                                                     // Extra area reserved for showing total (if needed by CSS)
        style={{ marginTop: '20px', color: 'black' }}
        className='total_cart_amount'
      >
        {/* Currently empty; total is shown in the <h2> above */}
      </div>
      <div className="continue_shopping_btn">                  {/* Container for action buttons below the cart */}
        <button                                                // Continue shopping button
          className="get-started-button"
          onClick={(e) => handleContinueShopping(e)}           // Call handler to go back to products
        >
          Continue Shopping                                     {/* Button label */}
        </button>
        <br />                                                 {/* Line break between buttons */}
        <button className="get-started-button1">               {/* Checkout button (visual only unless wired up) */}
          Checkout                                             {/* Button label */}
        </button>
      </div>
    </div>
  );                                                           // End of JSX return for CartItem
};                                                              // End of CartItem component

export default CartItem;                                       // Export component so ProductList can render it



