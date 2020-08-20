'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _objectSpread = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
var _inheritsLoose = _interopDefault(require('@babel/runtime/helpers/inheritsLoose'));
var _assertThisInitialized = _interopDefault(require('@babel/runtime/helpers/assertThisInitialized'));
var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));

var CANCEL_DISTANCE_ON_SCROLL = 20;
var defaultStyles = {
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    zIndex: 9990,
    transition: "all .2s ease-out"
  },
  sidebar: {
    zIndex: 9992,
    position: "absolute",
    top: 0,
    bottom: 0,
    transition: "transform .2s ease-out",
    WebkitTransition: "-webkit-transform .2s ease-out",
    willChange: "transform",
    overflowY: "auto",
    backgroundColor: "white"
  },
  overlayContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    transition: "left .2s ease-out, right .2s ease-out"
  },
  overlay: {
    zIndex: 9991,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    visibility: "hidden",
    transition: "opacity .2s ease-out, visibility .2s ease-out",
    backgroundColor: "rgba(0,0,0,.3)"
  },
  dragHandle: {
    zIndex: 9991,
    position: "fixed",
    top: 0,
    bottom: 0
  }
};

var Sidebar =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Sidebar, _Component);

  function Sidebar(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.state = {
      // the detected width of the sidebar in pixels
      sidebarWidth: props.defaultSidebarWidth,
      // keep track of touching params
      touchIdentifier: null,
      touchStartX: null,
      touchCurrentX: null,
      // if touch is supported by the browser
      dragSupported: false
    };
    _this.overlayClicked = _this.overlayClicked.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onTouchStart = _this.onTouchStart.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onTouchMove = _this.onTouchMove.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onTouchEnd = _this.onTouchEnd.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onScroll = _this.onScroll.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.saveSidebarRef = _this.saveSidebarRef.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  var _proto = Sidebar.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var isIos = /iPad|iPhone|iPod/.test(navigator ? navigator.userAgent : "");
    this.setState({
      dragSupported: typeof window === "object" && "ontouchstart" in window && !isIos
    });
    this.saveSidebarWidth();
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    // filter out the updates when we're touching
    if (!this.isTouching()) {
      this.saveSidebarWidth();
    }
  };

  _proto.onTouchStart = function onTouchStart(ev) {
    // filter out if a user starts swiping with a second finger
    if (!this.isTouching()) {
      var touch = ev.targetTouches[0];
      this.setState({
        touchIdentifier: touch.identifier,
        touchStartX: touch.clientX,
        touchCurrentX: touch.clientX
      });
    }
  };

  _proto.onTouchMove = function onTouchMove(ev) {
    if (this.isTouching()) {
      for (var ind = 0; ind < ev.targetTouches.length; ind++) {
        // we only care about the finger that we are tracking
        if (ev.targetTouches[ind].identifier === this.state.touchIdentifier) {
          this.setState({
            touchCurrentX: ev.targetTouches[ind].clientX
          });
          break;
        }
      }
    }
  };

  _proto.onTouchEnd = function onTouchEnd() {
    if (this.isTouching()) {
      // trigger a change to open if sidebar has been dragged beyond dragToggleDistance
      var touchWidth = this.touchSidebarWidth();

      if (this.props.open && touchWidth < this.state.sidebarWidth - this.props.dragToggleDistance || !this.props.open && touchWidth > this.props.dragToggleDistance) {
        this.props.onSetOpen(!this.props.open);
      }

      this.setState({
        touchIdentifier: null,
        touchStartX: null,
        touchCurrentX: null
      });
    }
  }; // This logic helps us prevents the user from sliding the sidebar horizontally
  // while scrolling the sidebar vertically. When a scroll event comes in, we're
  // cancelling the ongoing gesture if it did not move horizontally much.


  _proto.onScroll = function onScroll() {
    if (this.isTouching() && this.inCancelDistanceOnScroll()) {
      this.setState({
        touchIdentifier: null,
        touchStartX: null,
        touchCurrentX: null
      });
    }
  }; // True if the on going gesture X distance is less than the cancel distance


  _proto.inCancelDistanceOnScroll = function inCancelDistanceOnScroll() {
    var cancelDistanceOnScroll;

    if (this.props.pullRight) {
      cancelDistanceOnScroll = Math.abs(this.state.touchCurrentX - this.state.touchStartX) < CANCEL_DISTANCE_ON_SCROLL;
    } else {
      cancelDistanceOnScroll = Math.abs(this.state.touchStartX - this.state.touchCurrentX) < CANCEL_DISTANCE_ON_SCROLL;
    }

    return cancelDistanceOnScroll;
  };

  _proto.isTouching = function isTouching() {
    return this.state.touchIdentifier !== null;
  };

  _proto.overlayClicked = function overlayClicked() {
    if (this.props.open) {
      this.props.onSetOpen(false);
    }
  };

  _proto.saveSidebarWidth = function saveSidebarWidth() {
    var width = this.sidebar.offsetWidth;

    if (width !== this.state.sidebarWidth) {
      this.setState({
        sidebarWidth: width
      });
    }
  };

  _proto.saveSidebarRef = function saveSidebarRef(node) {
    this.sidebar = node;
  }; // calculate the sidebarWidth based on current touch info


  _proto.touchSidebarWidth = function touchSidebarWidth() {
    // if the sidebar is open and start point of drag is inside the sidebar
    // we will only drag the distance they moved their finger
    // otherwise we will move the sidebar to be below the finger.
    if (this.props.pullRight) {
      if (this.props.open && window.innerWidth - this.state.touchStartX < this.state.sidebarWidth) {
        if (this.state.touchCurrentX > this.state.touchStartX) {
          return this.state.sidebarWidth + this.state.touchStartX - this.state.touchCurrentX;
        }

        return this.state.sidebarWidth;
      }

      return Math.min(window.innerWidth - this.state.touchCurrentX, this.state.sidebarWidth);
    }

    if (this.props.open && this.state.touchStartX < this.state.sidebarWidth) {
      if (this.state.touchCurrentX > this.state.touchStartX) {
        return this.state.sidebarWidth;
      }

      return this.state.sidebarWidth - this.state.touchStartX + this.state.touchCurrentX;
    }

    return Math.min(this.state.touchCurrentX, this.state.sidebarWidth);
  };

  _proto.render = function render() {
    var sidebarStyle = _objectSpread({}, defaultStyles.sidebar, this.props.styles.sidebar);

    var overlayContentStyle = _objectSpread({}, defaultStyles.overlayContent, this.props.styles.overlayContent);

    var overlayStyle = _objectSpread({}, defaultStyles.overlay, this.props.styles.overlay);

    var useTouch = this.state.dragSupported && this.props.touch;
    var isTouching = this.isTouching();
    var rootProps = {
      className: this.props.rootClassName,
      style: _objectSpread({}, defaultStyles.root, this.props.styles.root, {
        visibility: !this.props.open && "hidden"
      }),
      role: "navigation",
      id: this.props.rootId
    };
    var dragHandle;
    var hasBoxShadow = this.props.shadow && (isTouching || this.props.open || this.props.docked); // sidebarStyle right/left

    if (this.props.pullRight) {
      sidebarStyle.right = 0;
      sidebarStyle.transform = "translateX(100%)";
      sidebarStyle.WebkitTransform = "translateX(100%)";

      if (hasBoxShadow) {
        sidebarStyle.boxShadow = "-2px 2px 4px rgba(0, 0, 0, 0.15)";
      }
    } else {
      sidebarStyle.left = 0;
      sidebarStyle.transform = "translateX(-100%)";
      sidebarStyle.WebkitTransform = "translateX(-100%)";

      if (hasBoxShadow) {
        sidebarStyle.boxShadow = "2px 2px 4px rgba(0, 0, 0, 0.15)";
      }
    }

    if (isTouching) {
      var percentage = this.touchSidebarWidth() / this.state.sidebarWidth; // slide open to what we dragged

      if (this.props.pullRight) {
        sidebarStyle.transform = "translateX(" + (1 - percentage) * 100 + "%)";
        sidebarStyle.WebkitTransform = "translateX(" + (1 - percentage) * 100 + "%)";
      } else {
        sidebarStyle.transform = "translateX(-" + (1 - percentage) * 100 + "%)";
        sidebarStyle.WebkitTransform = "translateX(-" + (1 - percentage) * 100 + "%)";
      } // fade overlay to match distance of drag


      overlayStyle.opacity = percentage;
      overlayStyle.visibility = "visible";
    } else if (this.props.docked) {
      // show sidebar
      if (this.state.sidebarWidth !== 0) {
        sidebarStyle.transform = "translateX(0%)";
        sidebarStyle.WebkitTransform = "translateX(0%)";
      } // make space on the left/right side of the content for the sidebar


      if (this.props.pullRight) {
        overlayContentStyle.right = this.state.sidebarWidth + "px";
      } else {
        overlayContentStyle.left = this.state.sidebarWidth + "px";
      }
    } else if (this.props.open) {
      // slide open sidebar
      sidebarStyle.transform = "translateX(0%)";
      sidebarStyle.WebkitTransform = "translateX(0%)"; // show overlay

      overlayStyle.opacity = 1;
      overlayStyle.visibility = "visible";
    }

    if (isTouching || !this.props.transitions) {
      sidebarStyle.transition = "none";
      sidebarStyle.WebkitTransition = "none";
      overlayContentStyle.transition = "none";
      overlayStyle.transition = "none";
    }

    if (useTouch) {
      if (this.props.open) {
        rootProps.onTouchStart = this.onTouchStart;
        rootProps.onTouchMove = this.onTouchMove;
        rootProps.onTouchEnd = this.onTouchEnd;
        rootProps.onTouchCancel = this.onTouchEnd;
        rootProps.onScroll = this.onScroll;
      } else {
        var dragHandleStyle = _objectSpread({}, defaultStyles.dragHandle, this.props.styles.dragHandle);

        dragHandleStyle.width = this.props.touchHandleWidth; // dragHandleStyle right/left

        if (this.props.pullRight) {
          dragHandleStyle.right = 0;
        } else {
          dragHandleStyle.left = 0;
        }

        dragHandle = React__default.createElement("div", {
          style: dragHandleStyle,
          onTouchStart: this.onTouchStart,
          onTouchMove: this.onTouchMove,
          onTouchEnd: this.onTouchEnd,
          onTouchCancel: this.onTouchEnd
        });
      }
    }

    document.body.style.overflow = this.props.open ? "hidden" : "initial";
    return React__default.createElement("div", rootProps, React__default.createElement("div", {
      className: this.props.sidebarClassName,
      style: sidebarStyle,
      ref: this.saveSidebarRef,
      id: this.props.sidebarId
    }, this.props.children), React__default.createElement("div", {
      className: this.props.overlayClassName,
      style: overlayStyle,
      onClick: this.overlayClicked,
      id: this.props.overlayId
    }), React__default.createElement("div", {
      className: this.props.overlayContentClassName,
      style: overlayContentStyle,
      id: this.props.overlayContentId
    }, dragHandle, this.props.overlayContent));
  };

  return Sidebar;
}(React.Component);

process.env.NODE_ENV !== "production" ? Sidebar.propTypes = {
  // main content to render in side bar
  children: PropTypes.node.isRequired,
  // styles
  styles: PropTypes.shape({
    root: PropTypes.object,
    sidebar: PropTypes.object,
    overlayContent: PropTypes.object,
    overlay: PropTypes.object,
    dragHandle: PropTypes.object
  }),
  // root component optional class
  rootClassName: PropTypes.string,
  // sidebar optional class
  sidebarClassName: PropTypes.string,
  // content optional class
  overlayContentClassName: PropTypes.string,
  // overlay optional class
  overlayClassName: PropTypes.string,
  // sidebar content to render
  sidebar: PropTypes.node.isRequired,
  // boolean if sidebar should be docked
  docked: PropTypes.bool,
  // boolean if sidebar should slide open
  open: PropTypes.bool,
  // boolean if transitions should be disabled
  transitions: PropTypes.bool,
  // boolean if touch gestures are enabled
  touch: PropTypes.bool,
  // max distance from the edge we can start touching
  touchHandleWidth: PropTypes.number,
  // Place the sidebar on the right
  pullRight: PropTypes.bool,
  // Enable/Disable sidebar shadow
  shadow: PropTypes.bool,
  // distance we have to drag the sidebar to toggle open state
  dragToggleDistance: PropTypes.number,
  // callback called when the overlay is clicked
  onSetOpen: PropTypes.func,
  // Initial sidebar width when page loads
  defaultSidebarWidth: PropTypes.number,
  // root component optional id
  rootId: PropTypes.string,
  // sidebar optional id
  sidebarId: PropTypes.string,
  // content optional id
  overlayContentId: PropTypes.string,
  // overlay optional id
  overlayId: PropTypes.string
} : void 0;
Sidebar.defaultProps = {
  docked: false,
  open: false,
  transitions: true,
  touch: true,
  touchHandleWidth: 20,
  pullRight: false,
  shadow: true,
  dragToggleDistance: 30,
  onSetOpen: function onSetOpen() {},
  styles: {},
  defaultSidebarWidth: 0
};

module.exports = Sidebar;
