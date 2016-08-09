/**
 * Plugin Name: InSlider
 * Author: Orischenko Alexander
 * Reviewers: Mikhail Grinko
 */

'use strict';

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/**
 * function constructor
 */
function InSliderConstructor(navArrow) {
    this.navArrow = navArrow;
}

/**
 * create DOM element
 * privat variables
 */
InSliderConstructor.slider = document.querySelector('#inslider');
InSliderConstructor.slides = InSliderConstructor.slider.querySelector('.slides');
InSliderConstructor.items = InSliderConstructor.slider.querySelectorAll('.slides > div');
InSliderConstructor.counter = 0;
InSliderConstructor.counterNum = document.createElement('div');
InSliderConstructor.attr = '';
InSliderConstructor.navs = document.createElement('div');
InSliderConstructor.navLeft = document.createElement('span');
InSliderConstructor.navRight = document.createElement('span');
InSliderConstructor.topPanelBtns = document.createElement('div');
InSliderConstructor.download = document.createElement('div');
InSliderConstructor.author = document.createElement('div');
InSliderConstructor.caption = InSliderConstructor.slider.querySelectorAll('.slides .caption');
InSliderConstructor.hrefImg = '';
InSliderConstructor.authorAttr = '';
InSliderConstructor.captionAttr = '';
InSliderConstructor.flexAlign = '';
InSliderConstructor.textAlign = '';

/**
 * function resize slider
 */
InSliderConstructor.prototype._setHeight = function () {
    let innerHeight = window.innerHeight,
        innerWidth = window.innerWidth;

    if (isMobile) {
        innerHeight = 487;
    }

    InSliderConstructor.slides.style.height = innerHeight + 'px';
    InSliderConstructor.slides.style.width = innerWidth + 'px';
};

/**
 * function item counter
 */
InSliderConstructor.prototype._numCounter = function () {
    InSliderConstructor.counterNum.className = 'counter';
    InSliderConstructor.slider.appendChild(InSliderConstructor.counterNum);
    InSliderConstructor.counterNum.innerHTML = (InSliderConstructor.counter + 1) + ' &#92 ' + InSliderConstructor.items.length;
    InSliderConstructor.slider.appendChild(InSliderConstructor.counterNum);
};

/**
 * function img attribute
 */
InSliderConstructor.prototype._attributes = function () {
    let elems = Array.prototype.slice.call(InSliderConstructor.items);

    elems.forEach(function( item, i, items ) {

        items[i].style.visibility = 'hidden';
        items[InSliderConstructor.counter].style.visibility = 'visible';
        items[i].style.opacity = 0;
        items[InSliderConstructor.counter].style.opacity = 1;

        if (!isMobile) {
            items[i].style.backgroundAttachment = 'fixed';
        }

        //take attribute in div with picture | add it to the url
        InSliderConstructor.attr = items[i].getAttribute('data-slide');
        items[i].style.backgroundImage = 'url(' + InSliderConstructor.attr + ')';

        //attribute active img
        items[InSliderConstructor.counter].setAttribute( 'data-slider', 'active' );

    });
};

/**
 * function navigation click
 */
InSliderConstructor.prototype._direction = function (str) {
    if (str === 'left') {
        InSliderConstructor.counter--;

        if (InSliderConstructor.counter < 0) {
            InSliderConstructor.counter = InSliderConstructor.items.length - 1;
        }
    }else {
        InSliderConstructor.counter++;

        if (InSliderConstructor.counter > InSliderConstructor.items.length - 1) {
            InSliderConstructor.counter = 0;
        }
    }

    let elems = Array.prototype.slice.call(InSliderConstructor.items);

    elems.forEach(function( item, i, items ) {

        items[i].removeAttribute( 'data-slider', 'active' );
        items[InSliderConstructor.counter].setAttribute( 'data-slider', 'active' );
        items[i].style.visibility = 'hidden';
        items[InSliderConstructor.counter].style.visibility = 'visible';
        items[i].style.opacity = 0;
        items[InSliderConstructor.counter].style.opacity = 1;
        InSliderConstructor.counterNum.innerHTML = (InSliderConstructor.counter + 1) + ' &#92 ' + items.length;

    });
};

/**
 * function navigation append
 */
InSliderConstructor.prototype._navigation = function () {
    InSliderConstructor.navs.setAttribute( 'class', 'navs' );
    InSliderConstructor.navs.appendChild(InSliderConstructor.navLeft).setAttribute( 'class', 'nav nav_left' );
    InSliderConstructor.navs.appendChild(InSliderConstructor.navRight).setAttribute( 'class', 'nav nav_right' );

    if (this.navArrow === true) {
        InSliderConstructor.slider.appendChild(InSliderConstructor.navs);
    }
};

/**
 * function append top panel
 */
InSliderConstructor.prototype._topPanel = function () {
    InSliderConstructor.topPanelBtns.className = 'top_panel_btns';
    InSliderConstructor.download.className = 'download';
    InSliderConstructor.author.className = 'author';

    InSliderConstructor.topPanelBtns.appendChild(InSliderConstructor.author);
    InSliderConstructor.topPanelBtns.appendChild(InSliderConstructor.download);
    InSliderConstructor.slider.appendChild(InSliderConstructor.topPanelBtns);
};

/**
 * function get attribute img
 */
InSliderConstructor.prototype._getAttributeImg = function () {
    InSliderConstructor.hrefImg = InSliderConstructor.items[InSliderConstructor.counter].getAttribute('data-slide');
    InSliderConstructor.authorAttr = InSliderConstructor.items[InSliderConstructor.counter].getAttribute('data-author');
    InSliderConstructor.download.innerHTML = '<a href=' + InSliderConstructor.hrefImg + ' title="Download photo" download>download</a>';
    InSliderConstructor.author.innerHTML = InSliderConstructor.authorAttr;
    InSliderConstructor.captionAttr = InSliderConstructor.caption[InSliderConstructor.counter].getAttribute('data-alignment');

    //align-items
    switch (InSliderConstructor.captionAttr) {
        case 'left' :
            InSliderConstructor.flexAlign = 'flex-start';
            InSliderConstructor.textAlign = 'left';
            break;
        case 'right' :
            InSliderConstructor.flexAlign = 'flex-end';
            InSliderConstructor.textAlign = 'right';
            break;
        case 'center' :
            InSliderConstructor.flexAlign = 'center';
            InSliderConstructor.textAlign = 'center';
            break;
        default :
            InSliderConstructor.flexAlign = 'center';
            InSliderConstructor.textAlign = 'center';
    }

    InSliderConstructor.caption[InSliderConstructor.counter].style.alignItems = InSliderConstructor.flexAlign;
    InSliderConstructor.caption[InSliderConstructor.counter].style.textAlign = InSliderConstructor.textAlign;
};

/**
 * function opacity on scroll
 */
InSliderConstructor.prototype._getOpacity = function () {
    let variation = 200,
        scrollTop = window.pageYOffset,
        windowHeight = window.innerHeight,
        calc = 1-(scrollTop / (windowHeight - variation));

    InSliderConstructor.navs.style.transform = 'translate3d(0, ' + (scrollTop/2 + 'px') + ' , 0)';

    let elems = Array.prototype.slice.call(InSliderConstructor.caption);

    elems.forEach(function( item, i, caption ) {

        caption[i].style.opacity = Math.min(Math.max(calc.toFixed(2), 0), 1);
        caption[i].style.transform = 'translate3d(0, ' + (scrollTop/2 + 'px') + ' , 0)';

    });
};

/**
 * public method
 */
InSliderConstructor.prototype.init = function () {
    this._setHeight();
    this._numCounter();
    this._attributes();
    this._navigation();
    this._topPanel();
    this._getAttributeImg();

    InSliderConstructor.navLeft.onclick = function() {
        this._direction('left');
        this._getAttributeImg();
    }.bind(this);

    InSliderConstructor.navRight.onclick = function() {
        this._direction('right');
        this._getAttributeImg();
    }.bind(this);

    window.onresize = function(){
        this._setHeight();
    }.bind(this);

    window.onscroll = function() {
        this._getOpacity();
    }.bind(this);

    console.log( 'Slider init' );
};

let inSlider = new InSliderConstructor(true);
inSlider.init();



