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
var getJSON = require('get-json');


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

let counter = 0;

$(".btn").click(function(){
        counter = 0;
    })

var test = function(){
    
    $("#input").change(function(){
        goWiki($("#input").val());
    });

   function goWiki(term){
        counter = counter + 1;
        if(counter < 11){
           let SearchLink = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=";
           let url = SearchLink + term;
           getJSON(url, gotData);
        }
        //let term = $("#input").val();
        
   }

   function gotData(error, response){
        let Content = "https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=";
        let len = response[1].length;
        
        let index = Math.floor((Math.random() * len));
        let title = response[1][index];
        if(title!= null){
            title = title.replace(/\s+/g, "_");
        }
        else{
            title = "unicorn";
        }
        let WikiLink = response[3][index];
        let url = Content + title;

        $(".items").append('<tr><td>'+title+'</td><td><a href="'+WikiLink+'">Click!</a></td></tr>');

        getJSON(url, gotSearch);
   }

   function gotSearch(error, response){
    
    let page = response.query.pages;

    let PageId = Object.keys(response.query.pages)[0];
    let content = page[PageId].revisions[0]['*'];
    let title = page[PageId].title;
    let ArrayWords = title.split(" ");
    let AW = ArrayWords[Math.floor(Math.random()*ArrayWords.length)];
    //console.log(AW);    
    var Regex = new RegExp(AW);
    var words = content.match(Regex);
    
    var word = words[Math.floor(Math.random()*words.length)];
    console.log(word);
    goWiki(word);
   }

}
test();