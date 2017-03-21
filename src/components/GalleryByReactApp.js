'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../styles/main.scss');

//获取图片信息
var imageDatas = require('../data/imageDatas.json');

//利用自执行函数，将图片信息转成图片URL
imageDatas = (function genImageURL(imageDatasArr) {
    for (var i = 0, j = imageDatasArr.length; i < j; i++) {
        var singleImageData = imageDatasArr[i];

        singleImageData.imageURL = require('../images/' + singleImageData.fileName);

        imageDatasArr[i] = singleImageData;
    }

    return imageDatasArr;
})(imageDatas);


var GalleryByReactApp = React.createClass({
    render: function () {
        return (
            <div className="main">
                <ReactTransitionGroup transitionName="fade">
                    <section className="stage">
                        <section className="img-sec"></section>
                        <nav className="controller-nav"></nav>
                    </section>
                </ReactTransitionGroup>
            </div>
        );
    }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
