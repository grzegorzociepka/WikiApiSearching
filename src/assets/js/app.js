/*
* PLUGINS
*/
//import "babel-polyfill"; // uncomment if you need IE11 or iOS support
import slick from 'slick-carousel';
import 'slick-carousel/slick/slick.css';
import Foundation from 'foundation-sites';
import { default as swal } from 'sweetalert2'
require('@fancyapps/fancybox/dist/jquery.fancybox.css');
const fancybox = require('@fancyapps/fancybox');

import is from '!imports-loader?define=>undefined!is_js';
/*
* APP
*/
const App = {
    isTouch () {
        return is.mobile() || is.tablet();
    },
    getGoogleMapsApiKey (){
        return window.googleMapsApiKey || ''
    },
    startFastClick () {
        if ('touchAction' in document.body.style) {
            document.body.style.touchAction = 'manipulation';
        } else {
            require.ensure(['fastclick'], (require) => {
                const FastClick = require('fastclick');

                window.addEventListener('load', () => {
                    FastClick.attach(document.body);
                });
            }, 'fastclick');
        }
    },
    initialize (){
        $('.fancybox').fancybox();
        $(document).foundation();
    },
    initMap (){
        const key = (this.getGoogleMapsApiKey() !== '') ? '?key=' + this.getGoogleMapsApiKey() : '';
        const findMap = document.getElementsByClassName('gmap');
        const scriptUrl = "http://maps.google.com/maps/api/js" + key;

        const loadMap = function(){
            for (let i = findMap.length - 1; i >= 0; i--) {
                let myMap = findMap[i];

                let center = new google.maps.LatLng(myMap.getAttribute('data-lat'), myMap.getAttribute('data-lon'));
                let zoom  = parseInt(myMap.getAttribute('data-zoom')) || 13;

                let map = new google.maps.Map(myMap, {
                    zoom,
                    center,
                    disableDefaultUI: false,
                    draggable: !App.isTouch(),
                    scrollwheel: false
                });

                let markerOptions = {
                    map: map,
                //  icon: 'assets/img/point.png',
                    position: center
                };

                let marker = new google.maps.Marker(markerOptions);
            }
        };
        if (findMap.length) {
            const s = document.createElement( 'script' );
            s.setAttribute( 'src', scriptUrl );
            s.onload=loadMap;
            document.body.appendChild( s );
        }
    },
    showMessage(...args){
        swal(...args);
    },
    init (){
        document.addEventListener('DOMContentLoaded', () => {
            this.startFastClick();  
            this.initialize();
            this.initMap();
        }, false);

        window.onload = () => {
        };

        window.onresize = () => {

        };
    }
}
window.showMessage = App.showMessage;
App.init();