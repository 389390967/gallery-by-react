'use strict';

var React = require('react/addons');

// CSS
require('normalize.css');
require('../styles/main.scss');

//获取图片信息
var imageDatas = require('../data/imageDatas.json');

//定义一个自执行函数，利用图片信息中的fileName，生成图片的URL信息，并将其添加到图片信息中
imageDatas = (function genImageURL(imageDatasArr) {
    for (var i = 0, j = imageDatasArr.length; i < j; i++) {
        var singleImageData = imageDatasArr[i];

        singleImageData.imageURL = require('../images/' + singleImageData.fileName);

        imageDatasArr[i] = singleImageData;
    }

    return imageDatasArr;
})(imageDatas);


//图片组件<ImgFigure />
var ImgFigure = React.createClass({
    render: function () {
        //声明一个样式对象
        var styleObj = {};

        if (this.props.arrange.pos) {
            styleObj = this.props.arrange.pos;
        }

        return (
            <figure className="img-figure" style={styleObj}>
                /*--组件<ImgFigure />有数据后,我们就是可以使用this获取数据--*/
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                </figcaption>
            </figure>
        );
    }
});

//获取区间中的一个随机值
function getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
}

//最大的组件<GalleryByReactApp />
var GalleryByReactApp = React.createClass({

    //给组件<GalleryByReactApp />设一个常量的key Constant,用来存储排布可取值范围
    Constant: {
        centerPos: {//中心图片的位置点，先初始化为0
            left: 0,
            top: 0
        },
        hPosRange: {//左侧区域和右侧区域图片的位置点范围
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
        },
        vPosRange: {//上侧区域图片的位置点范围
            x: [0, 0],
            topY: [0, 0]
        }
    },

    //重新布局所有图片,参数centerIndex 指定那个图片居中
    rearrange: function (centerIndex) {
        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            leftSecX = hPosRange.leftSecX,
            rightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeX = vPosRange.x,
            vPosRangeTopY = vPosRange.topY,

        //声明一个数组用来存储布局上侧图片的状态信息
            imgsArrangeTopArr = [],

        //上侧图片的个数，放0个或者1个
            topImgNum = Math.ceil(Math.random() * 2),

        //用来标记我们布局在上侧区域的图片是在数组的那个地方取出的，先赋值为0
            topImgSpliceIndex = 0,

        //创建一个数组对象用来存放居中图片的状态信息,利用splice取得居中的图片
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        //首先居中centerIndex图片
        imgsArrangeCenterArr[0].pos = centerPos;

        //取出要布局在上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        imgsArrangeTopArr.forEach(function (value, index) {
            imgsArrangeTopArr[index].pos = {
                top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
            };
        });

        //布局左右两侧的图片
        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            var hPosRangeLORX = null;

            if (i < k) {
                hPosRangeLORX = leftSecX;
            } else {
                hPosRangeLORX = rightSecX;
            }

            imgsArrangeArr[i].pos = {
                top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
            };
        }

        //位置信息都处理完后，重新合并回来
        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        //设置state，这样子可以触发组件的重新渲染
        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });

        //End随机布局的值生成完
    },

    //大管家组件<GalleryByReactApp />要管理每一张图片<ImgFigure />和每一个操作按钮的状态
    //每当state变化，视图就会重新渲染
    getInitialState: function () {
        return {
            //用一个数组来存储多个图片的状态
            imgsArrangeArr: [
                //每个数组元素，我们都认为它是状态对象，其中包含位置信息等
                /*{
                 pos:{
                 left:0,
                 top:0
                 }
                 }*/
            ]
        };
    },

    //组件加载以后为每张图片计算其位置的取值范围（初始化Constant中所有常量真正的应该有的值）
    componentDidMount: function () {

        //首先获取舞台的大小
        var stageDOM = React.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);

        //获取图片的框imgFigure的大小
        var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);

        //计算中心图片的位置点
        this.Constant.centerPos = {
            top: halfStageH - halfImgH,
            left: halfStageW - halfImgW
        };

        //左侧区域和右侧区域图片的位置点范围
        this.Constant.hPosRange.leftSecX[0] = 0 - halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = 0 - halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        //上侧区域图片的位置点范围
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;
        this.Constant.vPosRange.topY[0] = 0 - halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

        //调用rearrange来排布图片，参数0指定第一张图片居中
        this.rearrange(0);
    },

    render: function () {
        /*
         * 管理者设计模式，我们把<GalleryByReactApp />这个React组件看成大管家
         * 由它掌控一切的数据和数据之间的状态切换
         *
         * */

        //声明两个list用来包含一系列的图片组件<ImgFigure />和控制组件
        var imgFigures = [],
            controllerUnits = [];

        //遍历imageDatas数组，用其中的图片信息来填充组件<ImgFigure />
        imageDatas.forEach(function (value, index) {

            if (!this.state.imgsArrangeArr[index]) {//this.state.imgsArrangeArr[index]是空的就初始话它
                //初始化imgsArrangeArr数组
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    }
                };
            }

            //利用组件data属性把相关信息传进组件<ImgFigure />，然后把组件<ImgFigure />插入到imgFigures数组中
            //随机布局的值生成完后，在调用<ImgFigure />的时候给添加一个属性arrange，然后把信息传递进来
            imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]}/>);
        }.bind(this));


        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
