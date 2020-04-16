const router = require("express").Router();
let Order = require("../models/order_model");
let User = require("../models/user_model");
let CreditCard = require("../models/creditCard_model");
let MenuItem = require("../models/menuItem_model");

const setDone = (id) => {
  return Order.findById(id)
    .then((order) => {
      let startTime = order.createdAt;
      let endTime = new Date();
      let timePassed = (endTime - startTime) / 60000;
      if (!order.isCanceled && timePassed > order.prepTime) {
        order.isFulfilled = true;
        order
          .save()
          .then(() => {
            console.log("Order Fulfilled.");
            return Order.findById(id)
              .then((orderNew) => {
                console.log("Fulfilled Order updated");
              })
              .catch((err) => console.log("Error: " + err));
          })
          .catch((err) => console.log("Error: " + err));
      } else if (order.isCanceled) {
        console.log("Order cancelled");
        return null;
      } else {
        console.log("Order not yet fulfilled");
        return null;
      }
    })
    .catch((err) => res.status(400).json("Error: " + err));
};

const processOrders = async (orders) => {
  for (let i = 0; i < orders.length; i++) {
    const result = await setDone(orders[i]);
    if (!result) {
      orders[i] = result;
    }
    console.log(orders[i]);
  }
};

// Format: GET /api/orders/
// Required Fields: none
// Returns: All info on all orders
router.route("/").get((req, res) => {
  Order.find()
    .then((orders) => {
      processOrders(orders);
      res.json(orders);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: GET /api/orders/byUser/User._id
// Required Fields: none
// Returns: All orders on a specific user
router.route("/byUser/:id").get((req, res) => {
  Order.find({ userId: req.params.id })
    .then((orders) => {
      processOrders(orders);
      res.json(orders);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: GET /api/orders/byRestaurant/Resturant._id
// Required Fields: none
// Returns: All orders on a specific resturant
router.route("/byRestaurant/:id").get((req, res) => {
  Order.find({ restaurantId: req.params.id })
    .then((orders) => {
      processOrders(orders);
      res.json(orders);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: POST /api/orders/add
// Required Fields: userId, restaurantId, creditCardId, menuItems[], address,
//                  custFirst, custLast, custPhone, custAddress
// Returns: Status based on successful/unsuccessful order creation
router.route("/add").post((req, res) => {
  const userId = req.body.userId;
  let custFirst = "";
  let custLast = "";
  let custPhone = "555-123-4567";
  let custAddress = "123 Main St, Anywhere USA";
  const restaurantId = req.body.restaurantId;
  const creditCardId = req.body.creditCardId;
  let lastFour = "";
  const menuItemIds = req.body.menuItems;
  let menuItems = [];
  const quantity = req.body.quantity;
  const address = req.body.address;
  const instructions = req.body.instructions;
  const totalPaid = req.body.totalPaid;
  let prepTime = 0;

  if (quantity.length !== menuItemIds.length) {
    return res.status(400).json("Error: menuItems and quantity mismatched.");
  }

  const findFour = (id) => {
    return CreditCard.findById(id)
      .then((cc) => {
        lastFour = cc.number.slice(-4);
      })
      .catch((err) => res.status(400).json("Error: " + err));
  };

  const findItem = (id, amount) => {
    return MenuItem.findById(id)
      .then((item) => {
        menuItems.push(item);
        prepTime += item.preptime * amount;
      })
      .catch((err) => res.status(400).json("Error: " + err));
  };

  const findUser = (id) => {
    return User.findById(id)
      .then((user) => {
        custFirst = user.firstName;
        custLast = user.lastName;
        if (user.phone) {
          custPhone = user.phone;
        }
        if (user.address) {
          custAddress = user.address;
        }
      })
      .catch((err) => res.status(400).json("Error: " + err));
  };

  const createOrder = async (_) => {
    for (let i = 0; i < menuItemIds.length; i++) {
      const result = await findItem(menuItemIds[i], quantity[i]);
    }

    const result1 = await findFour(creditCardId);
    const result2 = await findUser(userId);

    const newOrder = new Order({
      userId,
      custFirst,
      custLast,
      custPhone,
      custAddress,
      restaurantId,
      creditCardId,
      lastFour,
      menuItems,
      quantity,
      prepTime,
      address,
      instructions,
      totalPaid,
    });

    newOrder
      .save()
      .then(() => res.json("Order added!"))
      .catch((err) => res.status(400).json("Error: " + err));
  };

  createOrder();
});

// Format: GET /api/orders/Order._id
// Required Fields: none
// Returns: All info on a specific order
router.route("/:id").get((req, res) => {
  Order.findById(req.params.id)
    .then((orders) => {
      processOrders(orders);
      res.json(orders);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Format: GET /api/orders/cancel/Order._id
// Required Fields: none
// Returns: All info on a specific order
router.route("/cancel/:id").get((req, res) => {
  Order.findById(req.params.id)
    .then((orders) => {
      orders.isCanceled = true;
      orders
        .save()
        .then(() => res.json("Order Cancelled."))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
