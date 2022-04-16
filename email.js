var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Email = function (_React$Component) {
    _inherits(Email, _React$Component);

    function Email(props) {
        _classCallCheck(this, Email);

        var _this = _possibleConstructorReturn(this, (Email.__proto__ || Object.getPrototypeOf(Email)).call(this, props));

        _this.state = { read: props.read == "true" ? true : false };
        return _this;
    }

    _createClass(Email, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "email " + (this.state.read ? "" : "unread"), id: this.props.id },
                React.createElement(ReadIndicator, { read: this.state.read }),
                React.createElement(Avatar, { shortName: this.props.sender }),
                React.createElement(
                    "div",
                    { className: "email-content" },
                    React.createElement(
                        "div",
                        { className: "email-heading" },
                        React.createElement(
                            "h2",
                            null,
                            this.props.sender
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
                    )
                )
            );
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

var EmailList = function (_React$Component4) {
    _inherits(EmailList, _React$Component4);

    function EmailList(props) {
        _classCallCheck(this, EmailList);

        var _this4 = _possibleConstructorReturn(this, (EmailList.__proto__ || Object.getPrototypeOf(EmailList)).call(this, props));

        _this4.state = {
            mailElements: [],
            mailContents: [{
                "id": "2",
                "sender": "Thomas Hallon",
                "address": "thomas-hallon@redaktionen.se",
                "subject": "Mötet imorgon",
                "date": "Igår",
                "time": "15:43",
                "body": "",
                "read": "true"
            }, {
                "id": "3",
                "sender": "Fredrik Söderberg",
                "subject": "Vem skulle fixa fikat?",
                "date": "Igår",
                "time": "12:16",
                "body": "",
                "read": "true"
            }]
        };
        return _this4;
    }

    _createClass(EmailList, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this5 = this;

            setTimeout(function () {
                _this5.addEmail();
            }, 2000);
        }
    }, {
        key: "addEmail",
        value: function addEmail() {
            this.state.mailContents.unshift({
                "id": "1",
                "sender": "Anonymous",
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
                return React.createElement(Email, { key: email.id, id: email.id, sender: email.sender, date: email.date, subject: email.subject, read: email.read });
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