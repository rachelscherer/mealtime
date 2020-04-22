//Import libraries
import React, { Component } from "react";
import { Link } from "react-router-dom";
//import axios from "axios";
import _ from "lodash";

//Import components
import Navbar from "../../components/nav/Navbar";
import MenuItemComponent from "../../components/restaurant/menuitem-component.js";
import GetLogin from "../../utils/GetLogin";
import Footer from "../footer/Footer";
import MenuItemOverlay from "./menuitemoverlay";

//Import utilities
import GetRestaurantData from "../../utils/restaurants/GetRestaurantData";
import MenuItems from "../../utils/restaurants/MenuItems";

//Import assets
import DisplayPrice from "../../assets/displayprice/DisplayPrice";
import DisplayRating from "../../assets/displayrating/DisplayRating";
import RestaurantImagePlaceholder from "./restaurantimageplaceholder.png";
import Loader from "../../assets/loader/Loader";

//Import utilities
import { getFromStorage } from "../../utils/storage";

//Import stylesheet
import "./Restaurant.css";

export default class Restaurant extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    //Search the URL for an ID, then store it as a state variable
    const query = new URLSearchParams(this.props.location.search);
    const id = query.get("id");

    this.state = {
      isPageLoaded: false,
      id: id,
      menuItems: [],
      restaurant: [],
      itemSelection: [],
      itemSelectionMade: false,
      menuItemsInBag: [],
      menuItemsInBagLoaded: false,
      restaurantInBag: [],
      restaurantInBagLoaded: false,
    };
  }

  //Get the restaurant data and the menu item associated with the restaurant
  componentDidMount() {
    this._isMounted = true;

    if (this.state.id !== "") {
      GetRestaurantData(this.state.id)
        .then((response) => {
          this.setState({
            restaurant: response.data,
            isPageLoaded: true,
          });
        })
        .catch(() => {
          this.setState({ restaurant: null, isPageLoaded: true });
        });
    } else {
      this.setState({ restaurant: null, isPageLoaded: true });
    }

    MenuItems(this.state.id)
      .then((response) => {
        const groupedByCategory = _.groupBy(
          response.data,
          (menuitem) => menuitem.category
        );
        this.setState({ menuItems: groupedByCategory });
      })
      .catch(() => {
        this.setState({ menuItems: null });
      });

    //Get "user" and "isUserLoaded" from the GetLogin utility
    GetLogin()
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            isUserLoaded: true,
            user: response,
          });
        }
      })
      .catch(() => {
        if (this._isMounted) {
          this.setState({
            isUserLoaded: true,
          });
        }
      });

    //Initialize the value of menuItemsInBag to whatever is in storage
    let menuItemArray = getFromStorage("shoppingbag");
    if (menuItemArray !== null) {
      this.setState({
        menuItemsInBag: menuItemArray.menuItems,
        menuItemsInBagLoaded: true,
      });
    } else {
      this.setState({
        menuItemsInBagLoaded: true,
      });
    }

    let restaurantInBagArray = getFromStorage("restaurant");
    if (restaurantInBagArray !== null) {
      this.setState({
        restaurantInBag: restaurantInBagArray,
        restaurantInBagLoaded: true,
      });
    } else {
      this.setState({
        restaurantInBagLoaded: true,
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    document.body.style.overflow = "unset";
  }

  cancelPopUp = () => {
    document.body.style.overflow = "unset";
    this.setState({
      itemSelection: [],
      itemSelectionMade: false,
    });
  };

  renderPopUp = (menuitem) => {
    document.body.style.overflow = "hidden";
    this.setState({
      itemSelection: menuitem,
      itemSelectionMade: true,
    });
  };

  //This method return each menu item associated with a particular category.
  getMenuItems = (categoryArray) => {
    return categoryArray.map((currentMenuItem) => {
      return (
        <MenuItemComponent
          key={currentMenuItem._id}
          menuItem={currentMenuItem}
          renderPopUp={this.renderPopUp}
        />
      );
    });
  };

  //This method returns each category associated with the restaurant
  getMenuItemCategories = () => {
    if (this.state.menuItems) {
      return Object.entries(this.state.menuItems).map((key) => {
        return (
          <div key={key[0] + " div"} style={{ width: "100%" }}>
            <div className="RestaurantFilters" key={key[0]}>
              <h4 style={{ fontWeight: "bold" }}>{key[0]}</h4>
            </div>
            {this.getMenuItems(key[1])}
          </div>
        );
      });
    } else {
      return <Loader />;
    }
  };

  //This updates the bag to include the menuitem added in the
  //menuitemoverlay component
  addToBag = (menuItems) => {
    this.setState({
      menuItemsInBag: menuItems,
    });
  };

  addRestaurantToBag = (restaurant) => {
    this.setState({
      restaurantInBag: restaurant,
    });
  };

  removeMenuItem = (index) => {
    let menuItems = this.state.menuItemsInBag;
    menuItems.splice(index, 1);
    this.setState({
      menuItemsInBag: menuItems,
    });

    if (menuItems.length === 0) {
      this.setState({
        restaurantInBag: [],
      });
    }
  };

  render() {
    if (
      this.state.isPageLoaded &&
      this.state.isUserLoaded &&
      this.state.menuItemsInBagLoaded &&
      this.state.restaurantInBagLoaded
    ) {
      if (this.state.restaurant) {
        return (
          <div>
            {this.state.itemSelectionMade && (
              <MenuItemOverlay
                menuItem={this.state.itemSelection}
                cancelPopUp={this.cancelPopUp}
                addToBag={this.addToBag}
                addRestaurantToBag={this.addRestaurantToBag}
                restaurant={this.state.restaurant}
              />
            )}
            <Navbar
              user={this.state.user}
              menuItems={this.state.menuItemsInBag}
              restaurant={this.state.restaurantInBag}
              removeMenuItem={this.removeMenuItem}
            />
            <div className="RestaurantContainer">
              <div className="RestaurantTitleContainer">
                <img
                  src={
                    "https://mealtimebucket.s3-us-west-1.amazonaws.com/" +
                    this.state.restaurant._id +
                    "/small.png"
                  }
                  onError={(e) => {
                    e.target.setAttribute("src", RestaurantImagePlaceholder);
                    e.target.onerror = null;
                  }}
                  className="RestaurantImage"
                  alt=""
                />
                <h2 className="RestaurantName">{this.state.restaurant.name}</h2>
                <h5>{this.state.restaurant.address}</h5>
              </div>
              <hr />
              <div className="RestaurantFlexContainer">
                <div className="RestaurantRating">
                  <DisplayRating rating={this.state.restaurant.rating} />
                </div>
                <div className="RestaurantPrice">
                  <DisplayPrice price={this.state.restaurant.price} />
                </div>
                <div className="RestaurantDistance">xx.xx miles</div>
              </div>
            </div>
            <div className="RestaurantItemContainer">
              <div className="RestaurantContainer">
                <div className="RestaurantMenuCollection">
                  {this.getMenuItemCategories()}
                </div>
              </div>
            </div>
            <Footer />
          </div>
        );
      } else {
        return (
          <div>
            <Navbar
              user={this.state.user}
              menuItems={this.state.menuItemsInBag}
              restaurant={this.state.restaurantInBag}
              removeMenuItem={this.state.removeMenuItem}
            />
            <br />
            <br />
            <h3>Oops</h3>
            <br />
            <p>
              We weren't able to find the restaurant you are looking for. Sorry
              about that!
            </p>
            <p>
              Click <Link to="/search">here</Link> to return to your search.
            </p>
          </div>
        );
      }
    } else {
      return <Loader />;
    }
  }
}
