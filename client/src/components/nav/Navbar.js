//Import libraries
import React, { Component } from "react";
import {
  Navbar,
  Nav,
  Button,
  ButtonToolbar,
  NavDropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";

//Import assets
import ShoppingBagIcon from "./shoppingbag.png";

//Import stylesheets
import "./Navbar.css";

export default class NavBar extends Component {
  constructor(props) {
    super(props);

    if (window.innerWidth < 1024) {
      this.state = {
        mobileview: true,
        numMenuItems: 0,
      };
    } else {
      this.state = {
        mobileview: false,
        numMenuItems: 0,
      };
    }
  }

  //This method sets mobileview to true if the window has
  //a width of less than 1024
  getMobileView = () => {
    if (window.innerWidth < 1024) {
      this.setState({ mobileview: true });
    } else {
      this.setState({ mobileview: false });
    }
  };

  //Add an event lister to call getMobileView when the window is resized
  componentDidMount() {
    window.addEventListener("resize", this.getMobileView, false);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.getMobileView);
  }

  //This method renders a navbar with different contents depending on whether
  //or not a user is logged in, and if the user is a restaurant owner.
  getLogin = () => {
    if (!this.props.user) {
      return (
        <React.Fragment>
          <Nav.Link as={Link} to="/">
            <div className="linkstyle" style={{ paddingTop: 0 }}>
              MealTime
            </div>
          </Nav.Link>
          <div className="navzone">
            <input
              type="text"
              name="address"
              className="navbox"
              placeholder="Enter your address..."
              style={{ color: "black" }}
            />
            <Link to="/search">
              <Button className="navgo" variant="danger">
                >
              </Button>
            </Link>
          </div>
          <Navbar.Collapse className="justify-content-end">
            <ButtonToolbar>
              <Nav.Link as={Link} to="/login">
                <div className="linkstyle">Log In</div>
              </Nav.Link>
              <Nav.Link as={Link} to="/register">
                <div className="registerbutton">Register</div>
              </Nav.Link>
            </ButtonToolbar>
          </Navbar.Collapse>
        </React.Fragment>
      );
    } else {
      const { isOwner, firstName, address } = this.props.user;
      return (
        <React.Fragment>
          <Nav.Link as={Link} to="/feed">
            <div className="linkstyle" style={{ paddingTop: 0 }}>
              MealTime
            </div>
          </Nav.Link>
          <div className="navzone">
            <input
              type="text"
              name="address"
              className="navbox"
              defaultValue={address}
              placeholder="Enter your address..."
            />
            <Link to="/search">
              <Button className="navgo" variant="danger">
                >
              </Button>
            </Link>
          </div>
          <Navbar.Collapse className="justify-content-end">
            <ButtonToolbar>
              <NavDropdown
                title={
                  <span style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                    Welcome, {firstName}!
                  </span>
                }
                id="nav-dropdown"
                alignRight
                className="NavSettingsTitle"
              >
                {isOwner && (
                  <NavDropdown.Item href="/manage/restaurants">
                    <div className="NavSettingsDropdown">
                      Manage Restaurants
                    </div>
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item href="/account/profile">
                  <div className="NavSettingsDropdown">Settings</div>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/logout">
                  <div className="NavLogoutDropdown">Logout</div>
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title={
                  <div style={{ display: "inline-block" }}>
                    <img
                      src={ShoppingBagIcon}
                      style={{
                        width: 25,
                        marginTop: -7,
                      }}
                      alt=""
                    />
                    {this.state.numMenuItems > 0 && (
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          backgroundColor: "red",
                          color: "white",
                          position: "absolute",
                          borderRadius: "50%",
                          top: 20,
                          right: 23,
                          fontSize: "0.8em",
                        }}
                      >
                        {this.state.numMenuItems}
                      </div>
                    )}
                  </div>
                }
                alignRight
              >
                <div style={{ width: 300, height: 250, padding: 15 }}>
                  You have nothing in your bag. Please add an item to make an
                  order.
                </div>
              </NavDropdown>
            </ButtonToolbar>
          </Navbar.Collapse>
        </React.Fragment>
      );
    }
  };

  //If mobileview is false, then the navbar will stick to the top of the page.
  render() {
    return (
      <div>
        <Navbar
          fixed={this.state.mobileview ? "" : "top"}
          style={{ backgroundColor: "#2b1d0e" }}
          className="navheader"
        >
          {this.getLogin()}
        </Navbar>
        <div className={this.state.mobileview ? "" : "navspacer"} />
      </div>
    );
  }
}
