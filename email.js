var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Email = function (_React$Component) {
    _inherits(Email, _React$Component);

    function Email(props) {
        _classCallCheck(this, Email);

        var _this = _possibleConstructorReturn(this, (Email.__proto__ || Object.getPrototypeOf(Email)).call(this, props));

        _this.state = {
            read: false
        };
        _this.showEmail = _this.showEmail.bind(_this);
        return _this;
    }

    _createClass(Email, [{
        key: "markRead",
        value: function markRead() {
            if (!this.state.read) this.setState({ read: true });
        }
    }, {
        key: "showEmail",
        value: function showEmail() {
            this.markRead();
            var id = this.props.id;
            console.log(id);
        }
    }, {
        key: "render",
        value: function render() {
            var email = React.createElement(
                "div",
                { className: "email " + (this.state.read ? "" : "unread"), id: this.props.id, onClick: this.showEmail },
                React.createElement(ReadIndicator, { read: this.state.read }),
                React.createElement(Avatar, { shortName: this.props.sender.firstName }),
                React.createElement(
                    "div",
                    { className: "email-content" },
                    React.createElement(
                        "div",
                        { className: "email-heading" },
                        React.createElement(
                            "h2",
                            null,
                            this.props.sender.firstName,
                            " ",
                            this.props.sender.lastName
                        ),
                        React.createElement(EmailDate, { date: this.props.date })
                    ),
                    React.createElement(
                        "div",
                        { className: "email-body" },
                        React.createElement(
                            "h3",
                            null,
                            this.props.subject
                        )
                    ),
                    this.props.detail == "true" && React.createElement(
                        "div",
                        null,
                        React.createElement(Addresses, { address: this.props.address })
                    )
                )
            );

            return email;
        }
    }]);

    return Email;
}(React.Component);

var Avatar = function (_React$Component2) {
    _inherits(Avatar, _React$Component2);

    function Avatar(props) {
        _classCallCheck(this, Avatar);

        var _this2 = _possibleConstructorReturn(this, (Avatar.__proto__ || Object.getPrototypeOf(Avatar)).call(this, props));

        _this2.state = {
            shortName: props.shortName.charAt(0).toUpperCase(),
            color: Math.floor(Math.random() * 16777215).toString(16)
        };
        return _this2;
    }

    _createClass(Avatar, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "avatar", style: { backgroundColor: '#' + this.state.color } },
                React.createElement(
                    "span",
                    null,
                    this.state.shortName
                )
            );
        }
    }]);

    return Avatar;
}(React.Component);

var ReadIndicator = function (_React$Component3) {
    _inherits(ReadIndicator, _React$Component3);

    function ReadIndicator(props) {
        _classCallCheck(this, ReadIndicator);

        return _possibleConstructorReturn(this, (ReadIndicator.__proto__ || Object.getPrototypeOf(ReadIndicator)).call(this, props));
    }

    _createClass(ReadIndicator, [{
        key: "render",
        value: function render() {
            return React.createElement("div", { className: "read-indicator", style: { backgroundColor: this.props.read ? "lightgray" : "blue" } });
        }
    }]);

    return ReadIndicator;
}(React.Component);

function EmailDate(props) {
    return React.createElement(
        "p",
        null,
        props.date
    );
}

var Addresses = function (_React$Component4) {
    _inherits(Addresses, _React$Component4);

    function Addresses(props) {
        _classCallCheck(this, Addresses);

        return _possibleConstructorReturn(this, (Addresses.__proto__ || Object.getPrototypeOf(Addresses)).call(this, props));
    }

    _createClass(Addresses, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "adresses" },
                React.createElement(
                    "p",
                    null,
                    "Fr\xE5n: ",
                    this.props.address
                ),
                React.createElement(
                    "p",
                    null,
                    "Till: namn@redaktionen.se"
                )
            );
        }
    }]);

    return Addresses;
}(React.Component);

var EmailText = function (_React$Component5) {
    _inherits(EmailText, _React$Component5);

    function EmailText(props) {
        _classCallCheck(this, EmailText);

        return _possibleConstructorReturn(this, (EmailText.__proto__ || Object.getPrototypeOf(EmailText)).call(this, props));
    }

    _createClass(EmailText, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "email-text" },
                React.createElement(
                    "p",
                    null,
                    "Namn"
                ),
                React.createElement(
                    "p",
                    null,
                    "Ingen verkar f\xF6rst\xE5 vad som sker. Barnen kan se, de vet mycket er."
                ),
                React.createElement(
                    "p",
                    null,
                    "Vi gl\xF6mmer n\xE4r tiden g\xE5r. \xC4r vi noga kan vi se."
                ),
                React.createElement(
                    "p",
                    null,
                    "Staden har m\xE5nga hemligheter som verkar ha ett eget liv i sig."
                ),
                React.createElement(
                    "p",
                    null,
                    "Jag har varit i fara. Det beh\xF6vs andra v\xE4ga att kommunicera f\xF6r att du ska f\xF6rst\xE5."
                ),
                React.createElement(
                    "a",
                    { href: "site.html" },
                    "https://kommunicerasakert.se"
                )
            );
        }
    }]);

    return EmailText;
}(React.Component);

var EmailList = function (_React$Component6) {
    _inherits(EmailList, _React$Component6);

    function EmailList(props) {
        _classCallCheck(this, EmailList);

        var _this6 = _possibleConstructorReturn(this, (EmailList.__proto__ || Object.getPrototypeOf(EmailList)).call(this, props));

        _this6.state = {
            mailElements: [],
            mailContents: [{
                "id": 2,
                "sender": { firstName: "Thomas", lastName: "Hallon" },
                "address": "thomas-hallon@redaktionen.se",
                "subject": "Mötet imorgon",
                "date": "Igår",
                "time": "15:43",
                "body": "",
                "read": true
            }, {
                "id": 3,
                "sender": { firstName: "Fredrik", lastName: "Söderberg" },
                "address": "fredrik-soderberg@redaktionen.se",
                "subject": "Vem skulle fixa fikat?",
                "date": "Igår",
                "time": "12:16",
                "body": "",
                "read": true
            }]
        };
        return _this6;
    }

    _createClass(EmailList, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this7 = this;

            setTimeout(function () {
                _this7.addEmail();
            }, 2000);
        }
    }, {
        key: "addEmail",
        value: function addEmail() {
            this.state.mailContents.unshift({
                "id": 1,
                "sender": { "firstName": "Anonymous", "lastName": "" },
                "address": "",
                "subject": "Jag vet",
                "date": "7e April",
                "time": "11:05",
                "body": "",
                "read": "false"
            });
            var newList = this.state.mailContents;
            this.setState({ mailContents: newList });
        }
    }, {
        key: "render",
        value: function render() {
            this.state.mailElements = this.state.mailContents.map(function (email) {
                return React.createElement(Email, {
                    detail: "false",
                    key: email.id,
                    id: email.id,
                    sender: email.sender,
                    date: email.date,
                    subject: email.subject,
                    read: email.read,
                    address: email.address
                });
            });

            return React.createElement(
                "div",
                { id: "email-list" },
                this.state.mailElements
            );
        }
    }]);

    return EmailList;
}(React.Component);

ReactDOM.render(React.createElement(EmailList, null), document.getElementById("main"));