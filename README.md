a breakdown of the key features and functionality:

1. Login and Registration:
   - Implemented a LoginScreen component enabling users to log in or register.
   - Users can enter their email and password for authentication.
   - Firebase authentication methods used for registration and login.
   - Successful login redirects users to the Home screen.

2. Home Screen with Bottom Navigation:
   - Created a HomeScreen component serving as the central hub of the application.
   - Included a bottom navigation bar using React Navigation's `createMaterialBottomTabNavigator`.
   - The navigation bar features tabs for "Products," "Categories," "Favorites," "Cart," "Update Product," and "Users."
   - Tab visibility depends on user roles fetched from Firebase as following:
      normal user can see "Products," "Categories," "Favorites," "Cart," tabs
      manager can see "Products," "Categories," "Favorites," "Cart," "Update Product,"  tabs
      admin can see "Products," "Categories," "Favorites," "Cart," "Update Product," and "Users." tabs

3. Cart Screen:
   - Implemented a Cart component displaying a list of products in the user's cart.
   - Users can view product details, including images, titles, descriptions, and prices.
   - Products can be removed from the cart using the "Remove" button.
   - Total cart value is displayed, and users can proceed to checkout.

4. Product Listing Screen:
   - Developed a Main component displaying a list of products retrieved from the FakeStoreAPI.
   - Users can explore product details, such as images, titles, descriptions, and prices.
   - Users can add or remove products from their favorites list with the "Add to Favorites" button.
   - The "Add to Cart" button enables users to manage their cart items.
   - User favorites and cart items are stored and synchronized via Firebase.

7. Logout Functionality:
   - Users can log out from the application by clicking the "Logout" button on the Cart Screen.
   - Employed the `auth.signOut()` method from Firebase for logout functionality.

8. User Authentication:
   - Leveraged Firebase authentication for user registration and login.
   - Stored user data in Firestore, encompassing email, user ID, roles, favorites, and cart items.

This is the admin account i have created:
admin@czlondon.com
123456

You can create a normal user account by writing an email and password and then click register.

In conclusion, the application is now a fully functional, modern e-commerce platform with robust user authentication, role-based navigation, an appealing design, and practical features such as cart management and social media integration. Users can seamlessly browse products, curate their favorites, interact with their shopping cart, and enjoy a user-friendly experience.
