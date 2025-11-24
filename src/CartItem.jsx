// Import React so we can use JSX and define components
import React from 'react';
// Import useSelector to read data from Redux, and useDispatch to send actions
import { useSelector, useDispatch } from 'react-redux';
// Import the two actions we need from our CartSlice: removeItem and updateQuantity
import { removeItem, updateQuantity } from './CartSlice';
// Import CSS specific to the cart UI
import './CartItem.css';

// Define the CartItem component
// It receives one prop: onContinueShopping, which comes from ProductList
const CartItem = ({ onContinueShopping }) => {
  // Read the current cart items from Redux store: state.cart.items (as defined in CartSlice)
  const cart = useSelector((state) => state.cart.items);
  // Get the dispatch function so we can send actions to Redux (updateQuantity, removeItem)
  const dispatch = useDispatch();

  // Function to calculate the total amount (sum of all item subtotals in the cart)
  const calculateTotalAmount = () => {
    // Use reduce to accumulate a running total over the cart array
    const total = cart.reduce((accumulator, item) => {
      // Each item.cost is like "$15" so we strip the "$" and convert to a number
      const price = parseFloat(item.cost.substring(1));
      // Add current item's price * quantity to the accumulator
      return accumulator + price * item.quantity;
    }, 0); // Start accumulator at 0

    // toFixed(2) keeps the number at two decimal places (like 12.34)
    return total.toFixed(2);
  };

  // When user clicks "Continue Shopping" button
  const handleContinueShopping = (e) => {
    // Prevent the default form/button navigation behavior
    e.preventDefault();
    // Call the function passed from the parent (ProductList) to go back to product grid
    onContinueShopping(e);
  };

  // When user clicks the "+" button on a specific cart item
  const handleIncrement = (item) => {
    // Dispatch updateQuantity with the same item name but quantity + 1
    dispatch(
      updateQuantity({
        name: item.name,            // identify which item to change
        quantity: item.quantity + 1 // new quantity
      })
    );
  };

  // When user clicks the "-" button on a specific cart item
  const handleDecrement = (item) => {
    // If quantity is more than 1, we just decrease quantity
    if (item.quantity > 1) {
      // Dispatch updateQuantity with quantity - 1
      dispatch(
        updateQuantity({
          name: item.name,            // identify which item to change
          quantity: item.quantity - 1 // new quantity
        })
      );
    } else {
      // If quantity is 1, pressing "-" would go to 0, so instead we remove it from the cart
      dispatch(removeItem(item.name));
    }
  };

  // When user clicks the "Delete" button on a specific cart item
  const handleRemove = (item) => {
    // Call removeItem with the item's name (our reducer expects just the name)
    dispatch(removeItem(item.name));
  };

  // Compute the subtotal for a single item: price * quantity
  const calculateTotalCost = (item) => {
    // Convert "$15" into 15
    const price = parseFloat(item.cost.substring(1));
    // Multiply by quantity and fix to 2 decimal places
    return (price * item.quantity).toFixed(2);
  };

  // Placeholder checkout handler (as per instructions)
  const handleCheckoutShopping = (e) => {
    // Prevent default click behavior
    e.preventDefault();
    // Show a simple alert to indicate checkout is not implemented yet
    alert('Functionality to be added for future reference');
  };

  // Return the JSX that builds the cart page UI
  return (
    // Outer container for the entire cart page
    <div className="cart-container">
      {/* Display total amount at top, using our calculateTotalAmount() function */}
      <h2 style={{ color: 'black' }}>
        Total Cart Amount: ${calculateTotalAmount()}
      </h2>

      {/* Main section that lists each item in the cart */}
      <div>
        {/* Map over the cart array; for each item, render a block of UI */}
        {cart.map((item) => (
          // One "row" per cart item, key uses item.name (assumes unique per plant)
          <div className="cart-item" key={item.name}>
            {/* Product image for this cart item */}
            <img
              className="cart-item-image"
              src={item.image}
              alt={item.name}
            />

            {/* Right-hand side details: name, cost, quantity controls, subtotal, delete */}
            <div className="cart-item-details">
              {/* Plant name */}
              <div className="cart-item-name">{item.name}</div>

              {/* Unit cost (like "$15") */}
              <div className="cart-item-cost">{item.cost}</div>

              {/* Quantity controls: "-" button, number, "+" button */}
              <div className="cart-item-quantity">
                {/* Decrement button */}
                <button
                  className="cart-item-button cart-item-button-dec"
                  onClick={() => handleDecrement(item)}
                >
                  -
                </button>

                {/* Current quantity value */}
                <span className="cart-item-quantity-value">
                  {item.quantity}
                </span>

                {/* Increment button */}
                <button
                  className="cart-item-button cart-item-button-inc"
                  onClick={() => handleIncrement(item)}
                >
                  +
                </button>
              </div>

              {/* Subtotal for this single item (price * quantity) */}
              <div className="cart-item-total">
                Total: ${calculateTotalCost(item)}
              </div>

              {/* Delete button to remove the item entirely from cart */}
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

      {/* Optional extra line where you could also show total amount again */}
      <div
        style={{ marginTop: '20px', color: 'black' }}
        className="total_cart_amount"
      >
        Total: ${calculateTotalAmount()}
      </div>

      {/* Buttons at the bottom: Continue Shopping and Checkout */}
      <div className="continue_shopping_btn">
        {/* Goes back to the product listing */}
        <button
          className="get-started-button"
          onClick={handleContinueShopping}
        >
          Continue Shopping
        </button>

        <br />

        {/* Checkout button (placeholder) */}
        <button
          className="get-started-button1"
          onClick={handleCheckoutShopping}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

// Export this component so ProductList can import and use it
export default CartItem;




