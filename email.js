var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';

var Email = function (_Component) {
    _inherits(Email, _Component);

    function Email() {
        _classCallCheck(this, Email);

        return _possibleConstructorReturn(this, (Email.__proto__ || Object.getPrototypeOf(Email)).apply(this, arguments));
    }

    _createClass(Email, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { 'class': 'email', id: 'email-1' },
                React.createElement(
                    'div',
                    { 'class': 'avatar' },
                    React.createElement(
                        'span',
                        null,
                        'A'
                    )
                ),
                React.createElement(
                    'div',
                    { 'class': 'email-content' },
                    React.createElement(
                        'div',
                        { 'class': 'email-heading' },
                        React.createElement(
                            'h2',
                            null,
                            'Anonymous'
                        ),
                        React.createElement(
                            'p',
                            null,
                            'Nu'
                        )
                    ),
                    React.createElement(
                        'div',
                        { 'class': 'email-body' },
                        React.createElement(
                            'h3',
                            null,
                            'Jag vet'
                        )
                    )
                )
            );
        }
    }]);

    return Email;
}(Component);

ReactDOM.render(React.createElement(Email, null), document.getElementById('root'));