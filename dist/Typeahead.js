(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("classnames"), require("ship-components-outsideclick"), require("ship-components-textinput"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "classnames", "ship-components-outsideclick", "ship-components-textinput"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("React"), require("classnames"), require("ship-components-outsideclick"), require("ship-components-textinput")) : factory(root["React"], root["classnames"], root["ship-components-outsideclick"], root["ship-components-textinput"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	/** ****************************************************************************
	 * Typeahead
	 *
	 * @author       Isaac Suttell <isaac_suttell@playstation.sony.com>
	 * @file         As the user types, show a list of options
	 ******************************************************************************/
	
	// Modules
	;
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _classnames = __webpack_require__(3);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _fuzzy = __webpack_require__(6);
	
	var _fuzzy2 = _interopRequireDefault(_fuzzy);
	
	var _shipComponentsTextinput = __webpack_require__(8);
	
	var _shipComponentsTextinput2 = _interopRequireDefault(_shipComponentsTextinput);
	
	var _shipComponentsOutsideclick = __webpack_require__(7);
	
	var _shipComponentsOutsideclick2 = _interopRequireDefault(_shipComponentsOutsideclick);
	
	var _TypeaheadList = __webpack_require__(4);
	
	var _TypeaheadList2 = _interopRequireDefault(_TypeaheadList);
	
	var _typeahead = __webpack_require__(1);
	
	var _typeahead2 = _interopRequireDefault(_typeahead);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// Components
	
	var Typeahead = (function (_React$Component) {
	  _inherits(Typeahead, _React$Component);
	
	  function Typeahead(props) {
	    _classCallCheck(this, Typeahead);
	
	    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));
	
	    _this.state = {
	      hide: true,
	      visible: _this.getResults.call(_this, props.defaultValue, props.options),
	      value: props.defaultValue,
	      selected: 0
	    };
	
	    // Ensure proper context
	    var bindFn = ['getResults', 'handleChange', 'handleSelected', 'keyEvent', 'handleKeyDown', '_onEnter', '_onUp', '_onDown', 'handleValidate'];
	    bindFn.forEach(function (fn) {
	      return _this[fn] = _this[fn].bind(_this);
	    });
	    return _this;
	  }
	
	  /**
	   * Update selection if options change
	   *
	   * @param     {Object}    nextProps
	   */
	
	  Typeahead.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	    var value = this.state.value;
	    if (nextProps.defaultValue !== this.props.defaultValue) {
	      value = nextProps.defaultValue;
	    }
	
	    // Get new results
	    var results = this.getResults(value, nextProps.options);
	
	    this.setState({
	      visible: results,
	      selected: 0
	    });
	  };
	
	  /**
	   * Search get fuzzy search results
	   *
	   * @param     {String}           value
	   * @param     {Array<string>}    options
	   * @return    {Array<object>}
	   */
	
	  Typeahead.prototype.getResults = function getResults(value, options) {
	    var results = _fuzzy2.default.filter(value || '', options, {
	      pre: '<span class=\'' + this.props.matchedClass + '\'>',
	      post: '</span>',
	      extract: this.props.extract
	    });
	
	    // If we have an exact match, move it to the top
	    var exactIndex = results.findIndex(function (result) {
	      return result.original.value === value;
	    });
	    if (exactIndex > -1) {
	      var exacted = results.splice(exactIndex, 1)[0];
	      results.unshift(exacted);
	    }
	
	    if (this.props.maxVisible && this.props.maxVisible > 0) {
	      results = results.slice(0, this.props.maxVisible);
	    }
	
	    return results;
	  };
	
	  /**
	   * Update the search results and parent
	   */
	
	  Typeahead.prototype.handleChange = function handleChange(event, callback) {
	    var _this2 = this;
	
	    var state = {
	      value: event.target.value,
	      selected: 0
	    };
	
	    // Get new results
	    state.visible = state.value.length > 0 ? this.getResults(event.target.value, this.props.options) : [];
	
	    state.hide = false;
	    if (state.visible.length === 1) {
	      state.hide = state.visible[0].original.value === event.target.value;
	    }
	
	    this.setState(state, function () {
	      if (_this2.props.onChange) {
	        _this2.props.onChange({
	          target: {
	            value: _this2.state.value
	          }
	        });
	      }
	      if (callback) {
	        callback();
	      }
	    });
	  };
	
	  /**
	    * Handle list item clicks
	    *
	    * @param     {Object}    option
	    */
	
	  Typeahead.prototype.handleSelected = function handleSelected(option, event) {
	    var _this3 = this;
	
	    event.stopPropagation();
	    if ((typeof option === 'undefined' ? 'undefined' : _typeof(option)) !== 'object') {
	      throw new TypeError('Option is not an object');
	    }
	    if (this.state.value.length === '' || this.state.visible.length === 0) {
	      return;
	    }
	    var ev = {
	      target: {
	        value: option.original.value
	      }
	    };
	
	    this.handleChange(ev, function () {
	      if (_this3.props.onSelected) {
	        _this3.props.onSelected(option, event);
	      }
	
	      var state = {
	        hide: true
	      };
	      if (_this3.props.clearOnSelect) {
	        state.value = '';
	        state.selected = 0;
	        state.visible = [];
	      }
	      _this3.setState(state);
	    });
	  };
	
	  /**
	   * Associate a function handler depending on the keypress
	   *
	   * @param     {Number}    keyCode
	   * @return    {Function}
	   */
	
	  Typeahead.prototype.keyEvent = function keyEvent(keyCode) {
	    switch (keyCode) {
	      case 'Enter':
	      case 'Tab':
	        return this._onEnter;
	      case 'ArrowDown':
	      case 'Down':
	        return this._onDown;
	      case 'ArrowUp':
	      case 'Up':
	        return this._onUp;
	      default:
	        return void 9;
	    }
	  };
	
	  /**
	   * Activate the currently selected item
	   */
	
	  Typeahead.prototype._onEnter = function _onEnter(event) {
	    if (this.state.visible[this.state.selected]) {
	      this.handleSelected(this.getSelected(), event);
	    }
	  };
	
	  Typeahead.prototype.getSelected = function getSelected() {
	    return this.state.visible[this.state.selected];
	  };
	
	  /**
	   * Event to move the selection up the list
	   */
	
	  Typeahead.prototype._onUp = function _onUp() {
	    var current = this.state.selected;
	    this.setState({
	      selected: current > 0 ? current - 1 : 0
	    });
	  };
	
	  /**
	   * Event to move the selection down the list
	   */
	
	  Typeahead.prototype._onDown = function _onDown() {
	    var current = this.state.selected;
	    var max = this.state.visible.length - 1;
	    this.setState({
	      selected: current < max ? current + 1 : max
	    });
	  };
	
	  Typeahead.prototype.stopHiding = function stopHiding() {
	    if (this.state.hide === true) {
	      this.setState({
	        hide: false
	      });
	    }
	  };
	
	  /**
	   * Call any associated key events
	   *
	   * @param     {Event}    event
	   */
	
	  Typeahead.prototype.handleKeyDown = function handleKeyDown(event) {
	    this.stopHiding();
	    var handler = this.keyEvent(event.key);
	    if (typeof handler === 'function') {
	      event.preventDefault();
	      handler.call(this, event);
	    }
	    if (this.props.onKeyDown) {
	      this.props.onKeyDown(event);
	    }
	  };
	
	  Typeahead.prototype.handleOutsideClick = function handleOutsideClick() {
	    this.setState({
	      hide: true
	    });
	  };
	
	  Typeahead.prototype.renderEmpty = function renderEmpty(classes) {
	    return _react2.default.createElement(
	      'div',
	      { className: classes },
	      _react2.default.createElement(
	        'div',
	        { className: 'typeahead--container' },
	        _react2.default.createElement(
	          'div',
	          { className: 'typeahead--input form-input' },
	          this.props.defaultValue
	        )
	      )
	    );
	  };
	
	  Typeahead.prototype.handleValidate = function handleValidate(value) {
	    if (typeof this.props.validate === 'function') {
	      return this.props.validate(value, this.getSelected());
	    }
	    return true;
	  };
	
	  /**
	   * Render
	   *
	   * @return    {Render}
	   */
	
	  Typeahead.prototype.render = function render() {
	    var classes = (0, _classnames2.default)('typeahead', this.props.className, {
	      'typeahead--editable': this.props.editable
	    });
	
	    if (!this.props.editable) {
	      return this.renderEmpty(classes);
	    }
	
	    return _react2.default.createElement(
	      'div',
	      { className: classes },
	      _react2.default.createElement(
	        _shipComponentsOutsideclick2.default,
	        { className: (0, _classnames2.default)('typeahead--container', _typeahead2.default.container),
	          onClick: this.handleOutsideClick.bind(this)
	        },
	        _react2.default.createElement(
	          'div',
	          null,
	          _react2.default.createElement(_shipComponentsTextinput2.default, {
	            className: (0, _classnames2.default)('typeahead--input', _typeahead2.default.input),
	            onChange: this.handleChange.bind(this),
	            onKeyDown: this.handleKeyDown.bind(this),
	            onBlur: this.props.onBlur,
	            onFocus: this.props.onFocus,
	            value: this.state.value,
	            validate: this.handleValidate,
	            defaultValue: this.props.defaultValue,
	            editable: true,
	            minRows: 1,
	            maxRows: 1,
	            label: this.props.placeholder
	          }),
	          this.props.isLoading ? _react2.default.createElement('span', { className: (0, _classnames2.default)('icon-refresh', _typeahead2.default.loading) }) : null
	        ),
	        _react2.default.createElement(_TypeaheadList2.default, {
	          empty: this.state.hide || this.props.isLoading ? void 0 : this.props.empty,
	          selected: this.state.selected,
	          value: this.state.value,
	          extract: this.props.extract,
	          visible: this.state.hide ? [] : this.state.visible,
	          onSelected: this.handleSelected })
	      )
	    );
	  };
	
	  return Typeahead;
	})(_react2.default.Component);
	
	Typeahead.defaultProps = {
	  isLoading: false,
	  editable: true,
	  empty: false,
	  options: [],
	  label: '',
	  defaultValue: '',
	  placeholder: '',
	  maxVisible: 5,
	  clearOnSelect: false,
	  matchedClass: 'typeahead-found',
	  extract: function extract(item) {
	    return item;
	  }
	};
	
	exports.default = Typeahead;

/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin
	module.exports = {"container":"typeahead--container","list":"typeahead--list","item":"typeahead--item","selected":"typeahead--selected","found":"typeahead--found","loading":"typeahead--loading","spin":"typeahead--spin"};

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	/** ****************************************************************************
	 * Typeahead List
	 *
	 * @author       Isaac Suttell <isaac_suttell@playstation.sony.com>
	 * @file         Shows a list of options when a user types
	 ******************************************************************************/
	
	// Modules
	;
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _classnames = __webpack_require__(3);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _TypeaheadOption = __webpack_require__(5);
	
	var _TypeaheadOption2 = _interopRequireDefault(_TypeaheadOption);
	
	var _typeahead = __webpack_require__(1);
	
	var _typeahead2 = _interopRequireDefault(_typeahead);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	// Components
	
	var TypeaheadList = (function (_React$Component) {
	  _inherits(TypeaheadList, _React$Component);
	
	  function TypeaheadList() {
	    _classCallCheck(this, TypeaheadList);
	
	    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
	  }
	
	  /**
	   * Render list by order of score
	   */
	
	  TypeaheadList.prototype.render = function render() {
	    var _this2 = this;
	
	    if (!this.props.value || this.props.visible instanceof Array !== true) {
	      // Nothing to filter by yet
	      return null;
	    } else if (this.props.visible.length === 0 && this.props.empty !== false) {
	      // Can't find anything
	      return _react2.default.createElement(
	        'ul',
	        { className: (0, _classnames2.default)('typeahead--list', _typeahead2.default.list) },
	        _react2.default.createElement(_TypeaheadOption2.default, { empty: this.props.empty })
	      );
	    }
	
	    return _react2.default.createElement(
	      'ul',
	      { className: (0, _classnames2.default)('typeahead--list', _typeahead2.default.list) },
	      this.props.visible.filter(function (item) {
	        return item && item.score && item.original;
	      }).sort(function (a, b) {
	        return b.score - a.score;
	      }).map(function (option, index) {
	        var key = _this2.props.extract(option.original);
	        return _react2.default.createElement(_TypeaheadOption2.default, {
	          key: key,
	          selected: _this2.props.selected === index,
	          option: option,
	          onClick: _this2.props.onSelected.bind(null, option) });
	      })
	    );
	  };
	
	  return TypeaheadList;
	})(_react2.default.Component);
	
	/**
	 * Defaults
	 * @static
	 * @type {Object}
	 */
	
	exports.default = TypeaheadList;
	TypeaheadList.defaultProps = {
	  empty: false,
	  visible: [],
	  onSelected: function onSelected() {}
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _classnames = __webpack_require__(3);
	
	var _classnames2 = _interopRequireDefault(_classnames);
	
	var _typeahead = __webpack_require__(1);
	
	var _typeahead2 = _interopRequireDefault(_typeahead);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var TypeaheadOption = (function (_React$Component) {
	  _inherits(TypeaheadOption, _React$Component);
	
	  function TypeaheadOption() {
	    _classCallCheck(this, TypeaheadOption);
	
	    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
	  }
	
	  /**
	   * Render
	   * @return    {React}
	   */
	
	  TypeaheadOption.prototype.render = function render() {
	    var classes = (0, _classnames2.default)('typeahead--item', _typeahead2.default.item, _defineProperty({
	      'typeahead--selected': this.props.selected
	    }, _typeahead2.default.selected, this.props.selected));
	
	    if (this.props.empty) {
	      return _react2.default.createElement(
	        'li',
	        { className: classes },
	        typeof this.props.empty === 'string' ? this.props.empty : 'No Results...'
	      );
	    }
	
	    return _react2.default.createElement('li', {
	      className: classes,
	      onClick: this.props.onClick
	      /* eslint-disable */
	      , dangerouslySetInnerHTML: { __html: this.props.option.string }
	      /* eslint-enable */ });
	  };
	
	  return TypeaheadOption;
	})(_react2.default.Component);
	
	exports.default = TypeaheadOption;
	
	TypeaheadOption.defaultProps = {
	  empty: false,
	  option: {
	    original: '',
	    string: ''
	  }
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Fuzzy
	 * https://github.com/myork/fuzzy
	 *
	 * Copyright (c) 2012 Matt York
	 * Licensed under the MIT license.
	 */
	
	(function() {
	
	var root = this;
	
	var fuzzy = {};
	
	// Use in node or in browser
	if (true) {
	  module.exports = fuzzy;
	} else {
	  root.fuzzy = fuzzy;
	}
	
	// Return all elements of `array` that have a fuzzy
	// match against `pattern`.
	fuzzy.simpleFilter = function(pattern, array) {
	  return array.filter(function(string) {
	    return fuzzy.test(pattern, string);
	  });
	};
	
	// Does `pattern` fuzzy match `string`?
	fuzzy.test = function(pattern, string) {
	  return fuzzy.match(pattern, string) !== null;
	};
	
	// If `pattern` matches `string`, wrap each matching character
	// in `opts.pre` and `opts.post`. If no match, return null
	fuzzy.match = function(pattern, string, opts) {
	  opts = opts || {};
	  var patternIdx = 0
	    , result = []
	    , len = string.length
	    , totalScore = 0
	    , currScore = 0
	    // prefix
	    , pre = opts.pre || ''
	    // suffix
	    , post = opts.post || ''
	    // String to compare against. This might be a lowercase version of the
	    // raw string
	    , compareString =  opts.caseSensitive && string || string.toLowerCase()
	    , ch, compareChar;
	
	  pattern = opts.caseSensitive && pattern || pattern.toLowerCase();
	
	  // For each character in the string, either add it to the result
	  // or wrap in template if it's the next string in the pattern
	  for(var idx = 0; idx < len; idx++) {
	    ch = string[idx];
	    if(compareString[idx] === pattern[patternIdx]) {
	      ch = pre + ch + post;
	      patternIdx += 1;
	
	      // consecutive characters should increase the score more than linearly
	      currScore += 1 + currScore;
	    } else {
	      currScore = 0;
	    }
	    totalScore += currScore;
	    result[result.length] = ch;
	  }
	
	  // return rendered string if we have a match for every char
	  if(patternIdx === pattern.length) {
	    return {rendered: result.join(''), score: totalScore};
	  }
	
	  return null;
	};
	
	// The normal entry point. Filters `arr` for matches against `pattern`.
	// It returns an array with matching values of the type:
	//
	//     [{
	//         string:   '<b>lah' // The rendered string
	//       , index:    2        // The index of the element in `arr`
	//       , original: 'blah'   // The original element in `arr`
	//     }]
	//
	// `opts` is an optional argument bag. Details:
	//
	//    opts = {
	//        // string to put before a matching character
	//        pre:     '<b>'
	//
	//        // string to put after matching character
	//      , post:    '</b>'
	//
	//        // Optional function. Input is an entry in the given arr`,
	//        // output should be the string to test `pattern` against.
	//        // In this example, if `arr = [{crying: 'koala'}]` we would return
	//        // 'koala'.
	//      , extract: function(arg) { return arg.crying; }
	//    }
	fuzzy.filter = function(pattern, arr, opts) {
	  opts = opts || {};
	  return arr
	    .reduce(function(prev, element, idx, arr) {
	      var str = element;
	      if(opts.extract) {
	        str = opts.extract(element);
	      }
	      var rendered = fuzzy.match(pattern, str, opts);
	      if(rendered != null) {
	        prev[prev.length] = {
	            string: rendered.rendered
	          , score: rendered.score
	          , index: idx
	          , original: element
	        };
	      }
	      return prev;
	    }, [])
	
	    // Sort by score. Browsers are inconsistent wrt stable/unstable
	    // sorting, so force stable by using the index in the case of tie.
	    // See http://ofb.net/~sethml/is-sort-stable.html
	    .sort(function(a,b) {
	      var compare = b.score - a.score;
	      if(compare) return compare;
	      return a.index - b.index;
	    });
	};
	
	
	}());
	


/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=Typeahead.js.map