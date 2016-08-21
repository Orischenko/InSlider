/**
 * Plugin Name: InSlider
 * Author: Orischenko Alexander
 * Reviewer: Mikhail Grinko
 */

'use strict';

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/**
 * class slider constructor
 */
class InSliderConstructor {
    constructor(options) {
        this._el = options.element;
        this._hasNavs = options.navigation;
        this._hasPagination = options.pagination;
        this._slideDuration = options.slideDuration;
        this._hasAutoplay = options.autoplay;
        this._autoplayDuration = options.autoplayDuration;
        this._hasParallaxContent = options.parallaxContent;
        this._hasCounter = options.counter;

        this._slides = new Slides({
            el: this._el.querySelector('.slides')
        });

        this._items = new Items({
            el: this._el.querySelectorAll('.slides > div'),
            caption: this._el.querySelectorAll('.slides .caption')
        });

        this._counter = new Counter({
            el: 0
        });

        this._counterNum = new NewCounterNum({
            el: document.createElement('div'),
            symbol: '&#92'
        });

        this._navElement = new NavElement({
            el: document.createElement('div'),
            navLeft: document.createElement('span'),
            navRight: document.createElement('span')
        });

        this._panel = new Panel({
            download: document.createElement('div'),
            author: document.createElement('div')
        });

        this._pagElement = new PagElement({
            el: document.createElement('div')
        });
    }

    /**
     * function resize slider
     */
    _setHeight() {
        let innerHeight = window.innerHeight,
            innerWidth = window.innerWidth;

        this._slides._el.style.height = innerHeight + 'px';
        this._slides._el.style.width = innerWidth + 'px';
    };

    /**
     * function item counter
     */
    _setNumCounter() {
        if ( !this._hasCounter ) return;

        this._counterNum._el.className = 'counter';
        this._el.appendChild(this._counterNum._el);
        this._counterNum._el.innerHTML = (this._counter._el + 1) + ` ${this._counterNum._symbol} ` + this._items._el.length;
        this._el.appendChild(this._counterNum._el);
    };

    /**
     * function img attribute
     */
    _setImgAttributes() {
        let elems = Array.prototype.slice.call(this._items._el),
            attr = '',
            milliseconds = 1000;

        elems.forEach(( item, i, items ) => {

            item.style.visibility = 'hidden';
            items[this._counter._el].style.visibility = 'visible';
            item.style.opacity = 0;
            items[this._counter._el].style.opacity = 1;
            item.style.transition = 'all ' + this._slideDuration/milliseconds + 's ease';


            if ( !isMobile ) {
                item.style.backgroundAttachment = 'fixed';
            }

            //take attribute in div with picture | add it to the url
            attr = item.getAttribute('data-slide');
            item.style.backgroundImage = `url(${attr})`;

            //attribute active img
            items[this._counter._el].setAttribute( 'data-slider', 'active' );

        });
    };

    /**
     * function navigation append
     */
    _setNavigation() {
        this._navElement._el.classList.add('navs');
        this._navElement._el.appendChild(this._navElement._navLeft).setAttribute( 'class', 'nav nav_left' );
        this._navElement._el.appendChild(this._navElement._navRight).setAttribute( 'class', 'nav nav_right' );

        if ( this._hasNavs ) {
            this._el.appendChild(this._navElement._el);
        }
    };

    /**
     * function navigation click
     */
    _getDirection(str) {
        let prevDirection = () => {
            this._counter._el--;

            if ( this._counter._el < 0 ) {
                this._counter._el = this._items._el.length - 1;
            }
        };

        let nextDirection = () => {
            this._counter._el++;

            if ( this._counter._el > this._items._el.length - 1 ) {
                this._counter._el = 0;
            }
        };

        if ( str === 'left' ) {
            prevDirection();
        } else {
            nextDirection();
        }

        let elems = Array.prototype.slice.call(this._items._el);

        elems.forEach(( item, i, items ) => {

            item.removeAttribute( 'data-slider', 'active' );
            items[this._counter._el].setAttribute( 'data-slider', 'active' );
            item.style.visibility = 'hidden';
            items[this._counter._el].style.visibility = 'visible';
            item.style.opacity = 0;
            items[this._counter._el].style.opacity = 1;
            this._counterNum._el.innerHTML = (this._counter._el + 1) + ` ${this._counterNum._symbol} ` + items.length;

        });
    };

    /**
     * function pagination append
     */
    _setPagination() {
        let html = '<ul>';

        for (let i = 0; i < this._items._el.length; i++) {
            html += `<li data-index='${i}'></li>`;
        }

        html += '</ul>';

        this._pagElement._el.classList.add('pagination');

        this._pagElement._el.innerHTML = html;

        if ( this._hasPagination ) {
            this._el.appendChild(this._pagElement._el);
        }
    };

    /**
     * function pagination click
     */
    _setPaginationClick() {
        let li = Array.prototype.slice.call(this._pagElement._el.querySelectorAll('li'));

        let checkActiveClass = () => {
            for ( var i = 0; i < li.length; i++ ) {
                li[i].removeAttribute('data-slider', 'active');
            }
        };

        li.forEach(( item, i, items ) => {

            item.removeAttribute( 'data-slider', 'active' );
            items[this._counter._el].setAttribute( 'data-slider', 'active' );

            item.addEventListener('click', ( event ) => {
                    if ( item.closest('[data-slider="active"]') ) return;

                    checkActiveClass();
                    event.target.setAttribute( 'data-slider', 'active' );
                    this._counter._el = event.target.getAttribute( 'data-index') - 1;
                    this._getDirection();
                    this._getImgAttributes();
                }
            );

        });
    };

    /**
     * function autoplay slider
     */
    _setAutoplay() {
        if ( !this._hasAutoplay ) return;

        setInterval( () => {
            this._getDirection('right');
            this._getImgAttributes();
            this._setPaginationClick();
        }, this._autoplayDuration);
    };

    /**
     * function append top panel
     */
    _setTopPanel() {
        let topPanelBtns = document.createElement('div');

        topPanelBtns.className = 'top_panel_btns';
        this._panel._download.className = 'download';
        this._panel._author.className = 'author';

        topPanelBtns.appendChild(this._panel._author);
        topPanelBtns.appendChild(this._panel._download);
        this._el.appendChild(topPanelBtns);
    };

    /**
     * function get attribute img
     */
    _getImgAttributes() {
        let hrefImg, authorAttr, captionAttr, flexAlign, textAlign = '';

        hrefImg = this._items._el[this._counter._el].getAttribute('data-slide');
        authorAttr = this._items._el[this._counter._el].getAttribute('data-author');

        this._panel._download.innerHTML = `<a href=${hrefImg} title="Download photo" download>download</a>`;
        this._panel._author.innerHTML = authorAttr;

        captionAttr = this._items._caption[this._counter._el].getAttribute('data-alignment');

        //align-items
        switch (captionAttr) {
            case 'left' :
                flexAlign = 'flex-start';
                textAlign = 'left';
                break;
            case 'right' :
                flexAlign = 'flex-end';
                textAlign = 'right';
                break;
            case 'center' :
            default :
                flexAlign = 'center';
                textAlign = 'center';
                break;
        }

        this._items._caption[this._counter._el].style.alignItems = flexAlign;
        this._items._caption[this._counter._el].style.textAlign = textAlign;
    };

    /**
     * function opacity on scroll
     */
    _getParallaxContent() {
        let variation = 200,
            scrollTop = window.pageYOffset,
            windowHeight = window.innerHeight,
            calc = 1-(scrollTop / (windowHeight - variation));

        if ( !this._hasParallaxContent ) return;

        this._navElement._el.style.transform = 'translate3d(0, ' + (scrollTop / 2 + 'px') + ' , 0)';

        let elems = Array.prototype.slice.call(this._items._caption);

        elems.forEach( ( item ) => {

            item.style.opacity = Math.min(Math.max(calc.toFixed(2), 0), 1);
            item.style.transform = 'translate3d(0, ' + (scrollTop / 2 + 'px') + ' , 0)';

        });
    };

    /**
     * public method
     */
    init() {
        this._setHeight();
        this._setNumCounter();
        this._setImgAttributes();
        this._setNavigation();
        this._setPagination();
        this._setTopPanel();
        this._getImgAttributes();
        this._setAutoplay();
        this._setPaginationClick();

        let leftClick = () => {
            this._getDirection('left');
            this._getImgAttributes();
            this._setPaginationClick();
        };

        let rightClick = () => {
            this._getDirection('right');
            this._getImgAttributes();
            this._setPaginationClick();
        };

        let resizeWindow = () => {
            this._setHeight();
        };

        let scrollWindow = () => {
            this._getParallaxContent();
        };

        this._navElement._navLeft.addEventListener('click', leftClick);
        this._navElement._navRight.addEventListener('click', rightClick);

        window.addEventListener('resize', resizeWindow);

        window.addEventListener('scroll', scrollWindow);

        console.log( 'Slider init' );
    };
}

class Slides {
    constructor(options) {
        this._el = options.el;
    }
}

class Items {
    constructor(options) {
        this._el = options.el;
        this._caption = options.caption;
    }
}

class NewCounterNum {
    constructor(options) {
        this._el = options.el;
        this._symbol = options.symbol;
    }
}

class NavElement {
    constructor(options) {
        this._el = options.el;
        this._navLeft = options.navLeft;
        this._navRight = options.navRight;
    }
}

class Counter {
    constructor(options) {
        this._el = options.el;
    }
}

class Panel {
    constructor(options) {
        this._download = options.download;
        this._author = options.author;
    }
}

class PagElement {
    constructor(options) {
        this._el = options.el;
    }
}

new InSliderConstructor({
    element: document.querySelector('#inslider'),
    navigation: true,
    pagination: true,
    slideDuration: 1500,
    autoplay: false,
    autoplayDuration: 6000,
    parallaxContent: true,
    counter: true
}).init();