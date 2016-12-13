# GengisSkhan
Scan products barcode into a command and get the all command into a web interface. 

#Installation
In order to scan products, you need to instal the apk "app-debug.apk" (only available for Android)

#Application modules
    - command.js:
        Contains all methods used to handle a customer order
    - config.js
        Contains all the configuration used by the Application
    - logger.js
        Logs all the events of the application
    - product.js
        Contains all methods used to handle the products in database
    - server.js
        Contains every routes available in the API
    - users.js
        Contains every method related to the users

#External modules
    - express - version: 4.14.0
    - http - version: 0.0.0
    - mongodb - version: 2.2.11
    - mongoose - version: 4.6.8
    - socket.io - version: 1.5.1
    - toastr - version: 2.1.2
    - winston - version: 2.2.2

#API routes
    - /admin/products
        GET method. No parameters.
        Return a JSON containing all the products available in database (those products are ficticious, created for our tests)
    - /connect/mobile
        POST method. Take a "login" as parameter (the login is the barcode associated to user).
        Connects the user and return a JSON containing informations about the user if this one exists. 
    - /command/new/:login
        GET method. ":login" correspond to the user to who the order will be associated
        Creates a new order for the user ":login" and return this order if it has been created.
    - /command/add
        POST method.
        Parameters:
            login: user barcode
            command: ID of the command where the product will be added
            product: product barcode
            quantity: quantity of the same product to add to the order
        Add a new product to the order of a user with the quantity indicated. Returns the order as a JSON.
    - /command/pay/:login/:command
        GET method.
        Parameters:
            :login: user barcode
            :command: command ID
        Changes the "payed" flag of order from false to true. Returns the order as a JSON.
    - /command/last/:login
        GET method
        Parameter:
            :login: user barcode
        Return the last command associated to the user
    - /command/remove
        POST method
        Parameters:
            login: user barcode
            command: command ID
            line: line ID
        Remove the line from the order and return it as a JSON.
    - /command/modify/quantity
        POST method
        Parameters:
            login: user barcode
            command: command ID
            line: line ID
            quantity: quantity to change 
        Changes the quantity of a product in an order and returns the order in JSON. 
    - /command/modify/price
        POST method
        Parameters:
            login: user barcode
            command: command ID
            line: line ID
            price: price to change 
        Changes the price of a product in an order and returns it in JSON.
    - /product/modify
        POST method
        Parameters:
            product: product ID
            name: product name
            price: product price
            description: product description
            image: image for the product
        Modifies a product if the product ID exists in database.
    - /product/add
        POST method
        Parameters:
            product: product ID
            name: product name
            price: product price
            description: product description
            image: image for the product
        Add a new product to the database.
    - /product/delete
        POST method
        Parameters:
            product: product ID
        Delete a product if the product ID exists in database.
    - *
        If no route are found, a page with "No route" is showed.


