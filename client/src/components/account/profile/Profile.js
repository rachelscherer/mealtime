//Import libraries
import React, { Component } from "react";
import { Accordion, Card, Button } from "react-bootstrap";

//Import utilities
import TagBank from "../../../utils/Tags";
import {
  UpdateUserName,
  UpdateUserEmail,
  UpdateUserTags,
  UpdateUserPassword,
} from "../../../utils/axios/Users";

export default class Profile extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    //Each variable will store the input field values
    this.state = {
      userID: this.props.user._id,
      fName: this.props.user.firstName,
      lName: this.props.user.lastName,
      email: this.props.user.email,
      tags: this.props.user.tags,
      passwordname: "",
      emailconfirm: "",
      passwordemail: "",
      passwordcurrent: "",
      passwordnew: "",
      passwordnewconfirm: "",
      successMessageName: "",
      successMessageEmail: "",
      successMessagePassword: "",
      errorMessageName: "",
      errorMessageEmail: "",
      errorMessagePassword: "",
      errorMessageTags: "",
      successMessageTags: "",
      tagbank: TagBank,
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  //Event handlers for each form field
  onChangeFName = (e) => {
    if (this._isMounted) {
      this.setState({
        fName: e.target.value,
      });
    }
  };
  onChangeLName = (e) => {
    if (this._isMounted) {
      this.setState({
        lName: e.target.value,
      });
    }
  };
  onChangePasswordName = (e) => {
    if (this._isMounted) {
      this.setState({
        passwordname: e.target.value,
      });
    }
  };
  onChangeEmail = (e) => {
    if (this._isMounted) {
      this.setState({
        email: e.target.value,
      });
    }
  };
  onChangeEmailConfirm = (e) => {
    if (this._isMounted) {
      this.setState({
        emailconfirm: e.target.value,
      });
    }
  };
  onChangePasswordEmail = (e) => {
    if (this._isMounted) {
      this.setState({
        passwordemail: e.target.value,
      });
    }
  };
  onChangePasswordCurrent = (e) => {
    if (this._isMounted) {
      this.setState({
        passwordcurrent: e.target.value,
      });
    }
  };
  onChangePasswordNew = (e) => {
    if (this._isMounted) {
      this.setState({
        passwordnew: e.target.value,
      });
    }
  };
  onChangePasswordNewConfirm = (e) => {
    if (this._isMounted) {
      this.setState({
        passwordnewconfirm: e.target.value,
      });
    }
  };

  //Event handlers for when the user submits the forms on the page
  onSubmitName = (e) => {
    e.preventDefault();

    let pkg = {
      firstName: this.state.fName,
      lastName: this.state.lName,
      password: this.state.passwordname,
    };

    UpdateUserName(this.state.userID, pkg)
      .then(() => {
        if (this._isMounted) {
          this.setState({
            errorMessageName: "",
            successMessageName: "Successfully updated name!",
          });
        }
      })
      .catch((error) => {
        if (this._isMounted) {
          if (error.response.status === 404) {
            this.setState({
              errorMessageName:
                "404 user not found. Please refresh page and try again.",
              successMessageName: "",
            });
          } else if (error.response.status === 500) {
            this.setState({
              errorMessageName: "Error! Invalid password",
              successMessageName: "",
            });
          } else {
            this.setState({
              errorMessageName:
                "400 internal server error. Please try again later.",
              successMessageName: "",
            });
          }
        }
      });
  };

  onSubmitEmail = (e) => {
    e.preventDefault();

    if (this.validateEmail()) {
      let pkg = {
        email: this.state.email,
        password: this.state.passwordemail,
      };

      UpdateUserEmail(this.state.userID, pkg)
        .then(() => {
          if (this._isMounted) {
            this.setState({
              errorMessageEmail: "",
              successMessageEmail: "Successfully updated email!",
            });
          }
        })
        .catch((error) => {
          if (this._isMounted) {
            if (error.response.status === 404) {
              this.setState({
                errorMessageEmail:
                  "404 user not found. Please refresh page and try again.",
                successMessageEmail: "",
              });
            } else if (error.response.status === 500) {
              this.setState({
                errorMessageEmail: "Error! Invalid password",
                successMessageEmail: "",
              });
            } else {
              this.setState({
                errorMessageEmail:
                  "400 internal server error. Please try again later.",
                successMessageEmail: "",
              });
            }
          }
        });
    }
  };

  onSubmitPreferences = (e) => {
    e.preventDefault();

    let pkg = {
      tags: this.state.tags,
    };

    UpdateUserTags(this.state.userID, pkg)
      .then(() => {
        if (this._isMounted) {
          this.setState({
            errorMessageTags: "",
            successMessageTags: "Successfully updated tags!",
          });
        }
        window.location.reload(true);
      })
      .catch((error) => {
        if (this._isMounted) {
          if (error.response.status === 404) {
            this.setState({
              errorMessageTags:
                "404 user not found. Please refresh page and try again.",
              successMessageTags: "",
            });
          } else {
            this.setState({
              errorMessageTags:
                "An unexpected error has occurred. Please refresh page and try again.",
              successMessageTags: "",
            });
          }
        }
      });
  };

  onSubmitPassword = (e) => {
    e.preventDefault();

    if (this.validatePassword()) {
      let pkg = {
        oldPassword: this.state.passwordcurrent,
        newPassword: this.state.passwordnew,
      };

      UpdateUserPassword(this.state.userID, pkg)
        .then(() => {
          if (this._isMounted) {
            this.setState({
              errorMessagePassword: "",
              successMessagePassword: "Successfully updated password!",
            });
          }
        })
        .catch((error) => {
          if (this._isMounted) {
            if (error.response.status === 404) {
              this.setState({
                errorMessagePassword:
                  "404 user not found. Please refresh page and try again.",
                successMessagePassword: "",
              });
            } else if (error.response.status === 500) {
              this.setState({
                errorMessagePassword: "Error! Invalid current password",
                successMessagePassword: "",
              });
            } else {
              this.setState({
                errorMessagePassword:
                  "400 internal server error. Please try again later.",
                successMessagePassword: "",
              });
            }
          }
        });
    }
  };

  //This helper function verifies that the email address is in the format email@website.domain
  validateEmail = () => {
    //Regular expression courtesy of https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const emailVerification = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let errorMessage = "";

    if (
      !emailVerification.test(this.state.email) ||
      !emailVerification.test(this.state.emailconfirm)
    ) {
      errorMessage = "You must enter a valid email address. \n";
    }

    if (this.state.email !== this.state.emailconfirm) {
      errorMessage = errorMessage.concat("Your emails must match. \n");
    }

    if (this._isMounted) {
      if (errorMessage) {
        this.setState({
          errorMessageEmail: errorMessage,
        });
        return false;
      }
      this.setState({
        errorMessageEmail: "",
      });
      return true;
    }
    return false;
  };

  //This helper function verifies that the new password is in the correct format.
  validatePassword = () => {
    let errorMessage = "";
    const lowerCaseLetters = /[a-z]/g;
    const upperCaseLetters = /[A-Z]/g;
    const numbers = /[0-9]/g;

    if (this.state.passwordnew !== this.state.passwordnewconfirm) {
      errorMessage = errorMessage.concat("Your new passwords must match. \n");
    }
    if (this.state.passwordnew.length < 8) {
      errorMessage = errorMessage.concat(
        "Your new password must contain at least 8 characters. \n"
      );
    }
    if (!lowerCaseLetters.test(this.state.passwordnew)) {
      errorMessage = errorMessage.concat(
        "Your new password must contain lowercase letters. \n"
      );
    }
    if (!upperCaseLetters.test(this.state.passwordnew)) {
      errorMessage = errorMessage.concat(
        "Your new password must contain uppercase letters. \n"
      );
    }
    if (!numbers.test(this.state.passwordnew)) {
      errorMessage = errorMessage.concat(
        "Your new password must contain numbers. \n"
      );
    }

    if (errorMessage && this._isMounted) {
      this.setState({
        errorMessagePassword: errorMessage,
      });
      return false;
    }
    return true;
  };

  //This method adds a tag to the tag array in the state.
  addTag = (index) => {
    if (this._isMounted) {
      this.setState({
        tags: [...this.state.tags, index],
      });
    }
  };

  //This method removes a tag from the tag array in the state.
  removeTag = (i) => {
    if (this.state.tags.length > 0) {
      let tags = this.state.tags;
      let index = tags.indexOf(i);
      if (index !== -1) {
        tags.splice(index, 1);
        if (this._isMounted) {
          this.setState({
            tags: tags,
          });
        }
      }
    }
  };

  //This method obtains and styles the tag bank, applying a different style to
  //those already included in the tags
  getTagBank = () => {
    let rows = [];
    this.state.tagbank.forEach((item, i) => {
      if (!this.state.tags.includes(i)) {
        rows.push(
          <div
            key={i}
            className="ManageRestaurantTagItem"
            onClick={() => this.addTag(i)}
          >
            {item}
          </div>
        );
      } else {
        rows.push(
          <div
            key={i}
            className="ManageRestaurantTagItemSelected"
            onClick={() => this.removeTag(i)}
          >
            {item}
          </div>
        );
      }
    });
    return rows;
  };

  //This method obtains and styles the applied tags.
  getTagList = () => {
    let rows = [];
    this.state.tags.forEach((item, i) => {
      rows.push(
        <div
          key={i}
          className="ManageRestaurantTagItemSelected"
          onClick={() => this.removeTag(item)}
        >
          {this.state.tagbank[item]}
        </div>
      );
    });
    return rows;
  };

  //The method obtains the tags to display in the accordion menu
  getTagListSimple = () => {
    let rows = [];
    this.state.tags.forEach((item, i) => {
      rows.push(
        <div key={i} style={{ display: "inline" }}>
          {this.state.tagbank[item] + ", "}
        </div>
      );
    });

    //Remove the ", " off the last element in rows
    if (rows.length !== 0) {
      let newStr = rows[rows.length - 1].props.children.slice(0, -2);
      rows[rows.length - 1] = newStr;
    }
    return rows;
  };

  render() {
    const {
      fName,
      lName,
      passwordname,
      errorMessageName,
      successMessageName,
      email,
      emailconfirm,
      passwordemail,
      errorMessageEmail,
      successMessageEmail,
      errorMessageTags,
      successMessageTags,
      passwordcurrent,
      passwordnew,
      passwordnewconfirm,
      errorMessagePassword,
      successMessagePassword,
    } = this.state;

    return (
      <div>
        <h2>Profile</h2>
        <Accordion>
          <Card>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="0"
              style={{ cursor: "pointer" }}
            >
              <div className="ProfileHeaderLeft">Name:</div>
              <div className="ProfileUserInfo">
                {fName} {lName}
              </div>
              <div className="ProfileEditLink">Edit</div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <h5>Edit name</h5>
                <br />
                <form onSubmit={this.onSubmitName}>
                  <label htmlFor="fname" className="ProfileFormTest">
                    First name
                  </label>
                  <input
                    type="text"
                    name="fname"
                    value={fName}
                    onChange={this.onChangeFName}
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="lname" className="ProfileFormTest">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lname"
                    value={lName}
                    onChange={this.onChangeLName}
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="passwordname" className="ProfileFormTest">
                    Password
                  </label>
                  <input
                    type="password"
                    name="passwordname"
                    value={passwordname}
                    onChange={this.onChangePasswordName}
                    className="ProfileInputBox"
                    required
                  />
                  <div className="ProfileErrorMessage">{errorMessageName}</div>
                  <div className="ProfileSuccessMessage">
                    {successMessageName}
                  </div>
                  <Button variant="success" type="submit">
                    Update name
                  </Button>
                </form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="1"
              style={{ cursor: "pointer" }}
            >
              <div className="ProfileHeaderLeft">Email:</div>
              <div className="ProfileUserInfo">{email}</div>
              <div className="ProfileEditLink">Edit</div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <h5>Edit email</h5>
                <br />
                <form onSubmit={this.onSubmitEmail}>
                  <label htmlFor="email" className="ProfileFormTest">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={email}
                    onChange={this.onChangeEmail}
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="emailconfirm" className="ProfileFormTest">
                    Confirm email
                  </label>
                  <input
                    type="text"
                    name="emailconfirm"
                    value={emailconfirm}
                    onChange={this.onChangeEmailConfirm}
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="passwordemail" className="ProfileFormTest">
                    Password
                  </label>
                  <input
                    type="password"
                    name="passwordemail"
                    value={passwordemail}
                    onChange={this.onChangePasswordEmail}
                    className="ProfileInputBox"
                    required
                  />
                  <div className="ProfileErrorMessage">{errorMessageEmail}</div>
                  <div className="ProfileSuccessMessage">
                    {successMessageEmail}
                  </div>
                  <Button variant="success" type="submit">
                    Update email
                  </Button>
                </form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="2"
              style={{ cursor: "pointer" }}
            >
              <div className="ProfileHeaderLeft">Preferences:</div>
              <div className="ProfileUserInfo">{this.getTagListSimple()}</div>
              <div className="ProfileEditLink">Edit</div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <h5>Edit preferences</h5>
                <form onSubmit={this.onSubmitPreferences}>
                  <div className="ManageRestaurantTagComponent">
                    <div className="ManageRestaurantAppliedTags">
                      {this.getTagList()}
                      <div
                        style={{
                          color: "red",
                          display: "inline",
                          marginLeft: 10,
                        }}
                      ></div>
                    </div>
                    <div className="ManageRestaurantTagArea">
                      {this.getTagBank()}
                    </div>
                  </div>

                  <div className="ProfileErrorMessage">{errorMessageTags}</div>
                  <div className="ProfileSuccessMessage">
                    {successMessageTags}
                  </div>
                  <Button variant="success" type="submit">
                    Update preferences
                  </Button>
                </form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle
              as={Card.Header}
              eventKey="3"
              style={{ cursor: "pointer" }}
            >
              <div className="ProfileHeaderLeft">Password:</div>
              <div className="ProfileUserInfo">•••••••••••••••</div>
              <div className="ProfileEditLink">Edit</div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="3">
              <Card.Body>
                <h5>Edit password</h5>
                <br />
                <form onSubmit={this.onSubmitPassword}>
                  <label htmlFor="passwordcurrent" className="ProfileFormTest">
                    Current password
                  </label>
                  <input
                    type="password"
                    name="passwordcurrent"
                    value={passwordcurrent}
                    onChange={this.onChangePasswordCurrent}
                    className="ProfileInputBox"
                    required
                  />
                  <label htmlFor="passwordnew" className="ProfileFormTest">
                    New password
                  </label>
                  <input
                    type="password"
                    name="passwordnew"
                    value={passwordnew}
                    onChange={this.onChangePasswordNew}
                    className="ProfileInputBox"
                    required
                  />
                  <label
                    htmlFor="passwordnewconfirm"
                    className="ProfileFormTest"
                  >
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    name="passwordnewconfirm"
                    value={passwordnewconfirm}
                    onChange={this.onChangePasswordNewConfirm}
                    className="ProfileInputBox"
                    required
                  />
                  <div className="ProfileErrorMessage">
                    {errorMessagePassword}
                  </div>
                  <div className="ProfileSuccessMessage">
                    {successMessagePassword}
                  </div>
                  <Button variant="success" type="submit">
                    Update password
                  </Button>
                </form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  }
}
