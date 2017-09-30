/**
 * Plugin Name: InSlider
 * Author: Orischenko Alexander
 */

'use strict';

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/**
 * slider constructor
 */
class InSlider {
    constructor(options) {
        this._el = options.element;
        this._hasNavs = options.navigation || null;
        this._hasPagination = options.pagination || null;
        this._slideDuration = options.slideDuration;
        this._hasAutoplay = options.autoplay;
        this._autoplayDuration = options.autoplayDuration;
        this._hasParallaxContent = options.parallaxContent || null;
        this._hasCounter = options.counter;

        this._counter = new Counter({
            el: 0
        });

        this._slides = new Slides({
            el: this._el.querySelector('.slides')
        });

        this._items = new Items({
            el: this._el.querySelectorAll('.slides > div'),
            caption: this._el.querySelectorAll('.slides .caption'),
            duration: this._slideDuration,
            c: this._counter
        });

        if (this._hasCounter) {
            this._counterNum = new NewCounterNum({
                element: this._el,
                el: document.createElement('div'),
                symbol: '/',
                c: this._counter
            });
        }

        if (this._hasParallaxContent) {
            this._parallaxContent = new ParallaxContent({
                el: this._el.querySelectorAll('.slides .caption')
            });
        }

        this._panel = new Panel({
            element: this._el,
            download: document.createElement('div'),
            author: document.createElement('div')
        });

        if (this._hasPagination) {
            this._pagination = new Pagination({
                element: this._el,
                el: document.createElement('div'),
                counter: this._counterNum,
                panel: this._panel,
                c: this._counter
            });
        }

        if (this._hasNavs) {
            this._navElement = new NavElement({
                element: this._el,
                el: document.createElement('div'),
                counter: this._counterNum,
                panel: this._panel,
                pagination: this._pagination,
                c: this._counter
            });
        }

        if (this._hasAutoplay) {
            this._autoPlay = new AutoPlay({
                element: this._el,
                duration: this._autoplayDuration,
                counter: this._counterNum,
                panel: this._panel,
                pagination: this._pagination,
                c: this._counter
            });
        }
    }
}

/**
 * base component
 */
class BaseComponent{
    constructor(options) {
        this._el = options.element;
    }

    _items() {
        let items = this._element.querySelectorAll('.slides > div');
        return items;
    }

    _reloadImgAttribute() {
        let elems = Array.prototype.slice.call(this._items());

        elems.forEach(( item, i, items ) => {

            item.removeAttribute( 'data-slider', 'active' );
            items[this._counter._el].setAttribute( 'data-slider', 'active' );
            item.style.visibility = 'hidden';
            items[this._counter._el].style.visibility = 'visible';
            item.style.opacity = 0;
            items[this._counter._el].style.opacity = 1;

        });
    };

    _counterNumber() {
        this._counterElement._el.innerHTML = ( Number(this._counter._el) + 1 ) + ' / ' + this._items().length;
    }

    _clickPag() {
        let li = Array.prototype.slice.call(this._pagination._el.querySelectorAll('li'));

        li.forEach(( item, i, items ) => {

            item.removeAttribute( 'data-slider', 'active' );
            items[this._counter._el].setAttribute( 'data-slider', 'active' );

        });
    };

    //function set panel attribute
    _setAttrPanel() {
        let hrefImg, authorAttr = '';

        hrefImg = this._items()[this._counter._el].getAttribute('data-slide');
        authorAttr = this._items()[this._counter._el].getAttribute('data-author');

        this._panel._download.innerHTML = `<a href=${hrefImg} title="Download photo" download>download</a>`;
        this._panel._author.innerHTML = authorAttr;
    };
}

/**
 * component slider
 */
class Slides{
    constructor(options) {
        this._el = options.el;

        this._setHeight(options.el);

        this._resizeWindow(options.el);
    }

    //init slide height
    _setHeight(slides) {
        let innerHeight = window.innerHeight,
            innerWidth = window.innerWidth;

        this._el.style.height = innerHeight + 'px';
        this._el.style.width = innerWidth + 'px';
    };

    //resize window
    _resizeWindow(slides) {
        window.addEventListener('resize', this._setHeight.bind(this));
    }
}

/**
 * component items
 */
class Items extends BaseComponent{
    constructor(options) {
        super(options);

        this._el = options.el;

        this._caption = options.caption;

        this._duration = options.duration;

        this._counter = options.c;

        this._setImgAttribute();
    }

    _setImgAttribute() {
        let elems = Array.prototype.slice.call(this._el),
            attr = '',
            milliseconds = 1000;

        elems.forEach(( item, i, items ) => {

            item.style.visibility = 'hidden';
            items[this._counter._el].style.visibility = 'visible';
            item.style.opacity = 0;
            items[this._counter._el].style.opacity = 1;
            item.style.transition = 'all ' + this._duration/milliseconds + 's ease';


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
}

/**
 * component parallax
 */
class ParallaxContent {
    constructor(options) {
        this._el = options.el;

        this._setParallaxContent();

        this._scrollWindow();
    }

    //function parallax
    _setParallaxContent() {
        let variation = 200,
            scrollTop = window.pageYOffset,
            windowHeight = window.innerHeight,
            calc = 1-(scrollTop / (windowHeight - variation));

        let elems = Array.prototype.slice.call(this._el);

        elems.forEach( ( item ) => {

            item.style.opacity = Math.min(Math.max(calc.toFixed(2), 0), 1);
            item.style.transform = 'translate3d(0, ' + (scrollTop / 2 + 'px') + ' , 0)';

        });
    };

    //function onscroll
    _scrollWindow() {
        window.addEventListener('scroll', this._setParallaxContent.bind(this));
    };
}

/**
 * component bottom counter
 */
class NewCounterNum extends BaseComponent{
    constructor(options) {
        super(options);

        this._element = options.element;

        this._el = options.el;

        this._symbol = options.symbol;

        this._counter = options.c;

        this._append();
    }

    _append() {
        this._el.className = 'counter';
        this._el.innerHTML = (this._counter._el + 1) + ' / ' + this._items().length;
        this._element.appendChild(this._el);
    }
}

/**
 * component navigation
 */
class NavElement extends BaseComponent{
    constructor(options) {
        super(options);

        this._element = options.element;

        this._el = options.el;

        this._counterElement = options.counter;

        this._panel = options.panel;

        this._pagination = options.pagination;

        this._counter = options.c;

        this._setNavigation();

        this._setAttrPanel();

        this._click();

        this._scrollWindow();
    }

    _setNavigation() {
        let navLeft = document.createElement('span'),
            navRight = navLeft.cloneNode(true);

        this._el.classList.add('navs');

        this._el.appendChild(navLeft).setAttribute( 'class', 'nav nav_left' );
        this._el.appendChild(navRight).setAttribute( 'class', 'nav nav_right' );

        this._element.appendChild(this._el);
    };

    _click() {
        this._el.addEventListener('click', this._getClosest.bind(this));
    };

    //function delegate navigation
    _getClosest() {
        if(event.target.closest('.nav_left')) {
            this._counter._el--;

            if ( this._counter._el < 0 ) {
                this._counter._el = this._items().length - 1;
            }

        } else if (event.target.closest('.nav_right')) {
            this._counter._el++;

            if ( this._counter._el > this._items().length - 1 ) {
                this._counter._el = 0;
            }
        }

        this._reloadImgAttribute();
        this._counterNumber();
        this._setAttrPanel();
        this._clickPag();
    };

    //function parallax navigation
    _setParallaxNavs() {
        let scrollTop = window.pageYOffset;

        this._el.style.transform = 'translate3d(0, ' + (scrollTop / 2 + 'px') + ' , 0)';
    };

    //function onscroll
    _scrollWindow() {
        window.addEventListener('scroll', this._setParallaxNavs.bind(this));
    };
}

/**
 * component pagination
 */
class Pagination extends BaseComponent{
    constructor(options) {
        super(options);

        this._element = options.element;

        this._el = options.el;

        this._counterElement = options.counter;

        this._panel = options.panel;

        this._counter = options.c;

        this._setPagination();

        this._setPaginationClick();

        this._setAttrPanel();
    }

    _setPagination() {
        let html = '<ul>';

        for (let i = 0; i < this._items().length; i++) {
            html += `<li data-index='${i}'></li>`;
        }

        html += '</ul>';

        this._el.classList.add('pagination');

        this._el.innerHTML = html;

        this._element.appendChild(this._el);
    };

    _setPaginationClick() {
        let li = Array.prototype.slice.call(this._el.querySelectorAll('li'));

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
                this._counter._el = event.target.getAttribute( 'data-index');  //-1
                this._reloadImgAttribute();
                this._setAttrPanel();
                this._counterNumber();
            });
        });
    };
}

/**
 * component counter
 */
class Counter {
    constructor(options) {
        this._el = options.el;
    }
}

/**
 * component header panel
 */
class Panel {
    constructor(options) {
        this._element = options.element;

        this._download = options.download;

        this._author = options.author;

        this._setTopPanel();
    }

    _setTopPanel() {
        let topPanelBtns = document.createElement('div');

        topPanelBtns.className = 'top_panel_btns';
        this._download.className = 'download';
        this._author.className = 'author';

        topPanelBtns.appendChild(this._author);
        topPanelBtns.appendChild(this._download);
        this._element.appendChild(topPanelBtns);
    };
}

/**
 * component autoplay
 */
class AutoPlay extends BaseComponent{
    constructor(options) {
        super(options);

        this._element = options.element;

        this._duration = options.duration;

        this._counterElement = options.counter;

        this._panel = options.panel;

        this._pagination = options.pagination;

        this._counter = options.c;

       this._setAutoplay();
    }

    _setAutoplay() {

        setInterval( () => {
            this._counter._el++;

            if ( this._counter._el > this._items().length - 1 ) {
                this._counter._el = 0;
            }

            this._reloadImgAttribute();
            this._counterNumber();
            this._setAttrPanel();
            this._clickPag();

        }, this._duration);
    };
}

new InSlider({
    element: document.querySelector('#inslider'),
    navigation: true,
    pagination: true,
    slideDuration: 1500,
    autoplay: false,
    autoplayDuration: 6000,
    parallaxContent: true,
    counter: true
});