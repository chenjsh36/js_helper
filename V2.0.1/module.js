// ==UserScript==
// @name         jshelper
// @namespace    https://github.com/chenjsh36
// @version      2.0.1
// @description  a tool for watching window message and picking color
// @author       chenjsh36
// @match        http://*/*
// @grant        none
// ==/UserScript==
;(function(window, document, undefined) {


	var JSHelper = JSHelper || {};
	JSHelper.namespace = function(ns_string) {
		var parts = ns_string.split('.'),
		parent = JSHelper,
		i;
		if (parts[0] === 'JSHelper') {
			parts = parts.slice(1);
		}

		for (i = 0; i < parts.length; i+= 1) {
			if (typeof parent[parts[i]] === 'undefined') {
				parent[parts[i]] = {};
			}
			parent = parent[parts[i]];
		}
		return parent;
	};
	/*x
	JSHelper.namespace('JSHelper.utilities.array');    //命名空间
	JSHelper.utilities.array = (function(){
		...
			var obj = JSHelper.tutil.object; // 依赖声明
			var name = 'cjs';    //私有成员
			return {
					...    //定义公有方法
				}
	}());//即时函数
	*/


	JSHelper.namespace('JSHelper.events');
	JSHelper.events = (function() {
		
		Construct = function() {
			this.func = {
	            /** @type {func} addCssStyleTag
				*	parem {obj} dom
				*	parem {string} css_style
	            */
				addCssStyle: null,
	            /** @type {func} addListener
				*	parem {obj} dom
				*	parem {string} type
				*	parem {function} callback
	            */
				addListener: null,
	            /** @type {func} removeListener
				*	parem {obj} dom
				*	parem {string} type
				*	parem {function} callback
	            */
				removeListener: null,
	            /** @type {func} getInnerText
				*	parem {obj} dom
				*	return {obj} innerText
	            */
				getInnerText: null,
	            /** @type {func} return setInnerText
				*	parem {obj} dom
				*	parem {string} innerText
				*	return {obj} dom
	            */
	            setInnerText: null,
	            /** @type {func} return style value
				*	parem {obj} dom
				*	parem {string} css_name
				*	return {str} css_value
	            */
	            getStyle: null,
	            /**
	             * [createDomElement]
	             * @param  {string} dom_str 
	             * @return {obj}    HTML_dom_element
	             */
				createDom: function(dom_str) {
	                return document.createElement(dom_str);
	            },
	            /**
	             * [获取子节点]
	             * @param  {obj} dom_element
	             * @param {number} [n] [n of children 可选] 
	             * @return {array}    list of children
	             */
		        children: function(obj, n) {
		            if (arguments.length == 1) {
		                return this.sibling_(obj.firstChild);   
		            } else if (arguments.length == 2) {
		                var arr = this.func.sibling_(obj.firstChild);
		                return n >= 0 ? arr[n] : arr[arr.length + n];
		            }
		        },

	            /** [获取同级兄弟节点]
	             * @param  {obj} dom_element
	             * @return {array}    list of brother
	             */
		        siblings: function(obj) {
		            return this.sibling_((obj.parentNode||{}).firstChild, obj);
		        },
		        sibling_: function(obj, elem) {
		            var arr = [];
		            for (;obj;obj = obj.nextSibling) {
		                // nodeType == 1 是元素节点 2 属性节点 3 文本节点
		                if (obj.nodeType === 1 && obj !== elem) {
		                    arr.push(obj);
		                }
		            }
		            return arr;
		        },
				addClass: function(obj, name) {
					this.removeClass(obj, name);
					obj.className += ' ' + name;
				},
				removeClass: function(obj, name) {
					var classes = obj.className.split(/\s+/),
						indx = -1,
						i = 0,
						len = 0
						;
					for (i = 0, len = classes.length; i < len; i++) {
						if (classes[i] == name) {
							indx = i;
							i = classes.length;
						}
					}

					if (indx > -1) {
						classes.splice(indx, 1);
						obj.className = classes.join(' ');
					}
				},
				hasClass: function(obj, name) {
					return (obj.className.search("(^|\\s)" + name + "(\\s|$)") != -1);
				}
			};
			this.init();
		};


		Construct.prototype = {
			init: function() {
				this.browerSniffer();
			},
	        /**
	         * 浏览器嗅探，初始化时分支
	         * @return {obj} this
	         */
			browerSniffer: function() {
	            var style_tag = document.createElement('style'),
                	div_ = this.func.createDom('div')
                	;
	            // ////////////////init addCssStyle/////////////////////////
	                style_tag.setAttribute('type', 'text/css');
	                if(style_tag.styleSheet) {// IE
	                    this.func.addCssStyle = function(css_str) {
	                        var style_tag = document.createElement('style'),
	                            head = document.getElementsByTagName('head')[0]
	                            ;
	                        style_tag.setAttribute('type', 'text/css');
	                        style_tag.styleSheet.cssText = css_str;
	                        head.appendChild(style_tag);
	                    };
	                } else {
	                    this.func.addCssStyle = function(css_str) {
	                        var style_tag = document.createElement('style'),
	                            head = document.getElementsByTagName('head')[0],
	                        	css_node = document.createTextNode(css_str)
	                            ;
	                        style_tag.setAttribute('type', 'text/css');
	                        style_tag.appendChild(css_node);
	                        head.appendChild(style_tag);
	                    };
	                }

	            // /////////////////init addListener & removeListener///////
	                if (typeof window.addEventListener === 'function') {
	                    this.func.addListener = function(elem, type, func) {
	                        elem.addEventListener(type, func, false);
	                    };
	                    this.func.removeListener = function(elem, type, func) {
	                        elem.removeEventListener(type, func, false);
	                    };
	                } else if (typeof window.attachEvent == 'function') {
	                    this.func.addListener = function(elem, type, func) {
	                        elem.attachEvent('on' + type, func);
	                    };
	                    this.func.removeListener = function(elem, type, func) {
	                        elem.detachEvent('on' + type, func);
	                    };
	                } else {
	                    this.func.addListener = function(elem, type, func) {
	                        elem['on' + type] = func;
	                    };
	                    this.func.removeListener = function(elem,
	                        type, func) {
	                        elem['on' + type] = null;
	                    };
	                }

	            // /////////////////init get & set innerText///////////////
	                if (typeof div_.textContent == 'string') {
	                    this.func.getInnerText = function(obj, text) {
	                        return obj.textContent;
	                    };

	                    this.func.setInnerText = function(obj, text) {
	                        obj.textContent = text;
	                        return obj;
	                    };
	                    
	                } else {
	                    this.func.getInnerText = function(obj, text) {
	                        return obj.innerText;
	                    };
	                    this.func.setInnerText = function(obj, text) {
	                        obj.innerText = text;
	                        return obj;
	                    };

	                }

	            // //////////////////init getStyle ///////////////////////
	                
	                if (div_.currentStyle) {
	                    this.func.getStyle = function(obj, name) {
	                        return obj.currentStyle[name] ? obj.currentStyle[name] : obj.currentStyle.getPropertyValue(name);
	                    };
	                } else {
	                    this.func.getStyle = function(obj, name) {
	                        return window.getComputedStyle(obj, null)[name] ? window.getComputedStyle(obj, null)[name] : window.getComputedStyle(obj, null).getPropertyValue(name);
	                    };
	                }

			}
		};

		return new Construct();
	}());
	
	JSHelper.namespace('JSHelper.component');
	JSHelper.component = (function(){
		Construct = function() {
			this.namespace = 'JSHelper.component';
		};
		Construct.prototype = {
	        /**
	         * return string of styles
	         * @return {string} string of css
	         */
	        getCssStrs_: function(css_obj) {
	            var css_arr = [],
	                i,
	                len
	                ;

	            for (i in css_obj) {
	                css_arr.push(this.transformCss_(i, css_obj[i]));
	            }

	            return css_arr.join('\n'); 
	        },
	        /**
	         * transform css_obj to css_str
	         * @param  {string} name  style_name
	         * @param  {object} style style_list_obj
	         * @return {string}       css_str
	         */
	        transformCss_: function(name, style) {
	            var css_str = name + ' {',
	                end_str = '}',
	                i,
	                style_str = ''
	                ;

	            for ( i in style) {
	                style_str += i + ':' + style[i] + ';';
	            }
	            css_str += style_str + end_str;
	            return css_str;
	        }
		};
		return new Construct();
	}());
    
    /*color-picker 定义*/
    JSHelper.namespace('JSHelper.ColorPicker');
    JSHelper.ColorPicker = (function(){
	    Construct = function(container_id) {
	    	var js_events = JSHelper.events
	    		;

	        // 依赖声明
	        this.func = {
	            addCssStyle: js_events.func.addCssStyle,
	            addListener: js_events.func.addListener,
	            removeListener: js_events.func.removeListener,
	            createDom: js_events.func.createDom,
	            getInnerText: js_events.func.getInnerText,
	            setInnerText: js_events.func.setInnerText,
	            getStyle: js_events.func.getStyle
	        };
	        // 样式
	        this.css = {
	            'h2':{
	                'text-align': 'center'
	            },
	            '#js-color-picker': {
	                // 'position': 'absolute',
	                'left': '0',
	                'top': '0',
	                'right': '0',
	                'bottom': '0',
	                'width': '100%',
	                'height': '362px',
	                'padding': '12px',
	                'margin': 'auto',
	                'box-sizing': 'border-box'
	            },
	            '#js-color-picker>div': {
	                'position': 'relative',
	                'height': '100%',
	                // 'border': '1px solid #CCC'
	            },
	            '#js-color-picker>div:nth-of-type(1)': {
	                'width': '79%',
	                'margin-right': '2%',
	                'overflow': 'hidden',
	                'float': 'left',
	                'cursor': 'pointer'
	            },
	            '#js-color-picker>div:nth-of-type(2)': {
	                'width': '6%',
	                'float': 'left',
	                'position': 'relative'
	            },
	            '#js-color-picker>div:last-child': {
	                'border-width': '0',
	                'width': '30%',
	                'height': 'auto',
	                'text-align': 'right',
	                'float': 'left',
	                'margin-top': '1rem'
	            },
	            '#js-color-picker>div>input': {
	                'width': '70%',
	                'margin': '0 0 1em .2em',
	                'padding': '.3em'
	            },
	            '#js-color-picker>div>input[type="button"]:nth-of-type(2)': {
	                'margin-bottom': '5em',
	            },
	            '#js-color-picker>div>i': {
	                'position': 'absolute',
	                'pointer-events': 'none',
	            },
	            '#js-color-picker>div:first-child>i': {
	                'left': '100%',
	                'top': '0',
	                'width': '9px',
	                'height': '9px',
	                'border': '1px solid #000',
	                'border-radius': '50%',
	                'margin': '-5px 0 0 -5px',
	                'box-shadow': '0 0 1px 1px #FFF',
	                'transition': '.3s all ease'
	            },
	            '#js-color-picker>div:nth-of-type(2)>i': {
	                'left': '0',
	                'top': '0',
	                'width': '100%',
	                'height': '10px',
	                'margin-top': '-5px',
	            },
	            '#js-color-picker>div:nth-of-type(2)>i:before, #js-color-picker>div:nth-of-type(2)>i:after': {
	                'position': 'absolute',
	                'content': '""',
	                'width': '0',
	                'height': '0',
	                'border': '5px solid transparent',
	            },
	            '#js-color-picker>div:nth-of-type(2)>i:before': {
	                'left': '-5px',
	                'top': '0',
	                'border-left-color': '#000',
	            },
	            '#js-color-picker>div:nth-of-type(2)>i:after': {
	                'right': '-5px',
	                'top': '0',
	                // 'border-right-color': '#000',
	            }
	        };
	        // Dom
	        this.elem = {
	            container: null,
	            color_area: null,
	            color_belt: null,
	            color_area_cvs: null,
	            color_belt_cvs:null,
	            rgb_div_input: null,
	            hex_div_input: null,
	            color_belt_i: null,
	            color_area_i: null
	        };
	        this.init(container_id);
	        
	    };
	    Construct.prototype = {

	        init: function(container_id) {
	            // this.browerSniffer();
	            this.initCss();
	            this.initDom(container_id);
	            this.initListener();
	        },
	        /**
	         * append style tag in head 
	         * @return {string} css_str
	         */
	        initCss: function() {

	    		var js_component = JSHelper.component,//依赖声明
	    			js_events = JSHelper.events
	    			;
	            	css_str = js_component.getCssStrs_(this.css)
	            	;
	            js_events.func.addCssStyle(css_str);
	            return css_str;
	        },
	        /**
	         * init Dom tree in container which id is container_id
	         * @param  {string} container_id container_id
	         * @return {obj}              this
	         */
	        initDom: function(container_id) {
	            var createDom =  this.func.createDom,
	                binding_container = document.getElementById(container_id),
	                container = createDom('div'),

	                color_area = createDom('div'),
	                color_area_cvs = createDom('canvas'),
	                color_area_i = createDom('i'),

	                color_belt = createDom('div'),
	                color_belt_cvs = createDom('canvas'),
	                color_belt_i = createDom('i'),


	                rgb_div = createDom('div'),
	                rgb_div_input = createDom('input'),
	                rgb_div_label = createDom('label'),
	                
	                hex_div_label = createDom('label'),
	                hex_div_input = createDom('input'),
	                br = createDom('br'),
	                i, len
	                ;

	            if (container === null) {
	                container = document.getElementsByTagName('body')[0];
	            }

	            color_area.appendChild(color_area_cvs);
	            color_area.appendChild(color_area_i);
	            color_belt.appendChild(color_belt_cvs);
	            color_belt.appendChild(color_belt_i);

	            rgb_div.appendChild(rgb_div_label);
	            rgb_div.appendChild(rgb_div_input);
	            rgb_div.appendChild(br);
	            rgb_div.appendChild(hex_div_label);
	            rgb_div.appendChild(hex_div_input);

	            container.appendChild(color_area);
	            container.appendChild(color_belt);
	            container.appendChild(rgb_div);
	            binding_container.appendChild(container);

	            container.id = 'js-color-picker';
	            this.func.setInnerText(rgb_div_label, 'rgb');
	            this.func.setInnerText(hex_div_label,'#');
	            color_area_cvs.width = parseInt(this.func.getStyle(color_area, 'width'),10);
	            // color_area_cvs.width = '100%';
	            color_area_cvs.height = color_area.clientHeight;
	            color_belt_cvs.width = color_belt.clientWidth;
	            color_belt_cvs.height = color_belt.clientHeight;
	            this.elem.container = container;
	            this.elem.color_area = color_area;
	            this.elem.color_belt = color_belt;
	            this.elem.color_belt_cvs = color_belt_cvs;
	            this.elem.color_area_cvs = color_area_cvs;
	            this.elem.rgb_div_input = rgb_div_input;
	            this.elem.hex_div_input = hex_div_input;
	            this.elem.color_area_i = color_area_i;
	            this.elem.color_belt_i = color_belt_i;
	            return this;
	        },

	        drawColorBelt: function() {
	            var belt_h = this.elem.color_belt.clientHeight,
	                belt_w = this.elem.color_belt.clientWidth,
	                ctx = this.elem.color_belt_cvs.getContext('2d')
	                ;
	            while (--belt_h >= -1) {
	                ctx.beginPath();
	                ctx.strokeStyle = 'hsl(' + belt_h + ',100%,50%)';
	                ctx.moveTo(0, belt_h);
	                ctx.lineTo(belt_w, belt_h);
	                ctx.stroke();
	                ctx.closePath();
	            } 
	        },
	        addBeltListen: function() {
	            var addListener = JSHelper.events.func.addListener,
	                belt_cvs = this.elem.color_belt_cvs,
	                belt_i = this.elem.color_belt_i,
	                area_i = this.elem.color_area_i,
	                area_cvs = this.elem.color_area_cvs,
	                rgb_div_input = this.elem.rgb_div_input,
	                hex_div_input = this.elem.hex_div_input
	                ;
	            addListener(belt_cvs, 'click', redraw);
	            function redraw(event) {
	                var x = event.offsetX, 
	                    y = event.offsetY,
	                    data = this.getContext('2d').getImageData(x, y, 1, 1).data;
	                event.preventDefault();
	                event.stopPropagation();
	                drawArea(data);
	                belt_i.style.top = y + 'px';
	                area_i.style.left = area_i.style.top = 'auto';
	            }
	            function drawArea(data) {
	                var area_w = area_cvs.width,
	                    area_h = area_cvs.height,
	                    r = data[0],
	                    g = data[1],
	                    b = data[2],
	                    a = data[3],
	                    o,
	                    i = 0,
	                    j = 0,
	                    ctx = area_cvs.getContext('2d'),
	                    img_data = ctx.getImageData(0, 0, area_w, area_h),
	                    data_arr = img_data.data,
	                    arr_w = area_w * 4
	                    ;

	                for (; i < area_h; i++) {
	                    for (j = 0; j < arr_w; j += 4) {
	                        o = 255 * (area_h - i) / area_h;
	                        data_arr[i * arr_w + j] = o - (o - r * (area_h - i) / area_h) * j / arr_w | 0;
	                        data_arr[i * arr_w + j + 1] = o - (o - g * (area_h - i) / area_h) * j / arr_w | 0;
	                        data_arr[i * arr_w + j + 2] = o - (o - b * (area_h - i) / area_h) * j / arr_w | 0;
	                        data_arr[i * arr_w + j + 3] = 255;
	                        
	                    }
	                }
	                ctx.putImageData(img_data, 0,0);
	                setColor(data_arr);
	            }
	            function setColor(data) {
	                rgb_div_input.value = data[0] + ',' + data[1] + ',' + data[2];
	                hex_div_input.value = hex(data[0]) + hex(data[1]) + hex(data[2]);
	            }
	            function hex(n) {
	                return n > 16 ? n.toString(16).toUpperCase() : '0' + n.toString(16).toUpperCase(); 
	            }
	            drawArea(belt_cvs.getContext('2d').getImageData(0,0,1,1).data);
	        },
	        addAreaListen: function() {
	            var area_cvs = this.elem.color_area_cvs,
	                addListener = JSHelper.events.func.addListener,
	                area_i = this.elem.color_area_i,
	                rgb_div_input = this.elem.rgb_div_input,
	                hex_div_input = this.elem.hex_div_input
	                ;
	            addListener(area_cvs, 'click', resetColor);
	            function resetColor(e) {
	                var x = e.offsetX, y = e.offsetY;
	                e.preventDefault();
	                e.stopPropagation();
	                setColor(area_cvs.getContext('2d').getImageData(x, y, 1, 1).data);
	                area_i.style.left = x + 'px';
	                area_i.style.top = y + 'px';
	            }
	            function setColor(data) {
	                rgb_div_input.value = data[0] + ',' + data[1] + ',' + data[2];
	                hex_div_input.value = hex(data[0]) + hex(data[1]) + hex(data[2]);
	            }
	            function hex(n) {
	                return n > 16 ? n.toString(16).toUpperCase() : '0' + n.toString(16).toUpperCase(); 
	            }
	        },
	        bindDragObj: function() {
	            if (typeof DragObj === 'function') {
	                //console.log("bind ok!!!!!!!!!!!!");
	                // var area_i_drag = new DragObj(this.elem.color_area_i, {listenObj:this.elem.color_area_cvs}),
	                    // belt_i_drag = new DragObj(this.elem.color_belt_i, {listenObj:this.elem.color_belt_cvs});
	                // return {area_i_drag: area_i_drag, belt_i_drag: belt_i_drag};
	            }
	            else {
	                //console.log("not function!!!!!!!!!!");
	                return null;
	            }
	            // return true;
	        },
	        initListener: function() {
	            this.drawColorBelt();
	            this.addBeltListen();
	            this.addAreaListen();
	            this.bindDragObj();
	        }
	    };    	
	    return Construct;
    }());
    /*结束color-picker 定义*/
	
    /*拖动滑块常见定义*/
    JSHelper.namespace('JSHelper.DragObj');
    JSHelper.DragObj = (function(){
	    var DragObj = function(move_obj_id, options) { //$moveObj, $listenObj) {
	        this.defaults = {
	            left: 0,
	            top:0,
	            width:0,
	            height:0,
	            // position:"absolute",
	            position:"fixed",
	            disX: 0,                    //鼠标距离div左距离和右距离
	            disY:0
	        };
	        this.isDrag = false;
	        this.elem = move_obj_id;
	        this.init(move_obj_id, options);
	        return move_obj_id;
	    };
	    DragObj.prototype = {
	        init: function(move_obj_id, options) {
	        	this.initElem(move_obj_id, options);
	        	this.initPosition();
	        	this.bindListen();
	        },
	        initElem: function(move_obj_id, options) {
	        	var move_obj_ = document.getElementById(move_obj_id),
	        		listen_obj_ = null
	        		;
	        	if (typeof options !== 'undefined' && typeof options.listenObj === 'string') {
	        		listen_obj_ = document.getElementById(options.listenObj);
	        	} else {
	        		listen_obj_ = move_obj_;
	        	}

	        	this.elem = move_obj_;
	        	this.listenElem = listen_obj_;
	        },
	        initPosition: function() {
	            var getStyle = JSHelper.events.func.getStyle,
	            	left_ = parseInt(getStyle(this.elem, 'left') === "auto" ? 0 : getStyle(this.elem, 'left'), 10),        // 需要offsetLeft？
	                height_ = parseInt(getStyle(this.elem, 'height'), 10),
	                top_ = parseInt(getStyle(this.elem, 'top') === 'auto' ? 0 : getStyle(this.elem, 'left'), 10),
	                width_ = parseInt(getStyle(this.elem, 'width'), 10),
	                i;

	            // console.log("DragObj.init: height:" + height_ + " window_:" + width_ + " left_: " + left_ + " top_: " + top_);
	            this.defaults.left = left_ === null ? this.defaults.left : left_;
	            this.defaults.top = top_ === null ? this.defaults.top : top_;
	            this.defaults.width = width_ === null ? this.defaults.width : width_;
	            this.defaults.height = width_ === null ? this.defaults.height : height_;
	            this.elem.style.position = this.defaults.position;	        	
	        },
	        mousedown: function(thisPoint) {
	        	var that = thisPoint;
	        	return function(e) {
					var event_ = e || event;
	                that.isDrag = true;
	                that.defaults.disX = event_.clientX - that.defaults.left;
	                that.defaults.disY = event_.clientY - that.defaults.top;
	                // console.log("that.mousedown:", that.defaults.disX, that.defaults.disY, event_.clientY, that.defaults.top,that.defaults.left);
	                return false;
	        	};
	        },
	        mousemove: function(thisPoint) {
	        	var that = thisPoint;
	        	return function(e) {
	                if (that.isDrag === true) {
	                    event_ = e || event;
	                    var x = event_.clientX - that.defaults.disX,
	                        y = event_.clientY - that.defaults.disY,
	                        // window_width = document.documentElement.clientWidth - that.defaults.width,
	                        // window_height = document.documentElement.clientHeight - that.defaults.height
	                        window_width = document.body.clientWidth - that.defaults.width,
	                        window_height = document.body.clientHeight - that.defaults.height
	                        ;
	                    /*check if window height is zero*/
	                    if (window_height < 0) {
	                        window_height = document.documentElement.clientHeight - that.defaults.height;
	                        // console.log("window height is " + window_height);
	                    }
	                    /*
	                    console.log("//////////////////////////////////////////////////////");
	                    console.log("mouse positon:", event_.clientX, event_.clientY);
	                    console.log("div position:", x, y);
	                    console.log("offset : " + that.defaults.disX, that.defaults.disY);
	                    console.log("window's height and elem's height:" +document.documentElement.clientHeight, that.defaults.height);
	                    console.log(x, window_width);
	                    */
	                    x = (x < 0) ? 0 : x;
	                    x = (x > window_width) ? window_width : x;
	                    y = (y < 0) ? 0 : y;
	                    y = (y > window_height) ? window_height : y;
	                    that.defaults.left = x;
	                    that.defaults.top = y;
	                    that.elem.style.left = x + 'px';
	                    that.elem.style.top = y + 'px';
	                }
	        	};
	        },
	        mouseup: function(thisPoint) {
	        	var that = thisPoint;
	        	return function(e) {
	                if (that.isDrag === true) {
	                    that.isDrag = false;
	                }
	        	};
	        },
	        bindListen: function() {
	        	var that = this,
	        		addListener = JSHelper.events.func.addListener
	        		;
	        	addListener(this.listenElem, 'mousedown', this.mousedown(that));
				addListener(document, 'mousemove', this.mousemove(that));
	            addListener(document, 'mouseup', this.mouseup(that));
	  			return this;
	        }
	    };    	
	    return DragObj;
    }());
    /*结束拖动滑块常见定义*/

    /*插件按钮定义*/
    JSHelper.namespace('JSHelper.plugIn.HelperBtn');
    JSHelper.plugIn.HelperBtn = (function(){
	    var HelperBtn = function($container) {
	        this.css = {
	            '#js_helper_listen_obj': {
	                'width': '60px',
	                'height': '60px',
	                'position': 'absolute',
	                'background-color': '#f8f8f5',
	                'border-radius': '50%',
	                'cursor': 'move',
	                'transform':'scale(1,1)',
	                'box-shadow': '0px 0px 40px #121e44',
	                'transition':'.5s transform ease-in-out'
	            },
	            '#js_helper_listen_obj:hover': {
	                'transform':'scale(1.1,1.1)'
	            },
	            '#js_helper_move_obj': {
	                'width': '60px',
	                'height': '60px',
	                'position': 'absolute',
	                'left': '0px',
	                'top': '0px',
	                'border-radius': '50%',
	                '-webkit-user-select':'none',
	                '-moz-user-select':'none',
	                '-ms-user-select':'none',
	                'user-select':'none',
	                'z-index':'9999'
	            },
	            '#js_helper_show_btn': {
	                'width': '30px',
	                'height': '30px',
	                'position': 'absolute',
	                'left': '15px',
	                'top': '15px',
	                'border-radius': '50%',
	                'text-align': 'center',
	                'ine-height': '30px',
	                'transform':'scale(1,1)',
	                'cursor': 'pointer',
	                'background-color': '#b7c188',
	                'color':'white',
	                'box-shadow': '0px 0px 6px #AC88C1'
	            },
	            '#js_helper_show_btn:hover': {
	                'transform':'scale(1.1,1.1)'
	            },
	            '#js_helper_show_btn.active': {
	                'background-color': '#5F3B74'
	            },				
	            '.js_helper_sidebar_content_item': {
					'width': '100%',
					'display': 'none'

				},
	            '.js_helper_sidebar_content_item.active': {
					'display': 'block',
					'width': '100%'
				}

	        };
	        this.elem = {
	        	move_obj: null,
	        	listen_obj: null,
	        	show_btn: null
	        };
	        this.init($container);
	        return this;
	    };
	    HelperBtn.prototype = {
	        /**
	         * create_js_helper_btn
	         * @return {obj} return html_obj
	         */
	        init: function($container) {
	        	this.body = typeof $container === 'undefined' ? document.getElementsByTagName('html')[0] : $container;
	        	/*按钮定义*/
	            // 创建div
	            var js_component = JSHelper.component,//依赖声明
	    			js_events = JSHelper.events,
	    			move_obj = document.createElement('div'),
	                listen_obj = document.createElement('div'),
	                show_btn = document.createElement('div'),
	                that = this,
	    			body = this.body
	    			;
	    		// 设置样式
	            css_str = js_component.getCssStrs_(this.css);
	            js_events.func.addCssStyle(css_str);

	            // 设置id
	            move_obj.id='js_helper_move_obj';
	            listen_obj.id='js_helper_listen_obj';
	            show_btn.id='js_helper_show_btn';

	            // 添加
	            move_obj.appendChild(listen_obj);
	            move_obj.appendChild(show_btn);
	            body.appendChild(move_obj);

	           	this.elem.move_obj = move_obj;
	           	this.elem.listen_obj = listen_obj;
	           	this.elem.show_btn = show_btn;

	            return {move_obj:move_obj, listen_obj:listen_obj, show_btn:show_btn};
	        }
	    };
	    return HelperBtn;
    }());

    /*结束插件按钮定义*/

    JSHelper.namespace('JSHelper.plugIn.HelperSidebar');
    JSHelper.plugIn.HelperSidebar = (function(){
	    /*边栏定义*/
	    var HelperSidebar = function($container, options) {
	        this.ids_ = {
	            js_helper_sidebar:'js_helper_sidebar',
	            js_helper_sidebar_header:'js_helper_sidebar_header',
	            js_helper_sidebar_content:'js_helper_sidebar_content',
	            js_helper_sidebar_tap: 'js_helper_sidebar_tap',
	            js_helper_sidebar_nav: 'js_helper_sidebar_nav'
	        };
	        this.css = {
	            '#js_helper_sidebar': {
	                'z-index': '9998',
	                'position': 'fixed',
	                'width': '500px',
	                'height': '80%',
	                'background-color': 'rgba(100,100,100,.8)',
	                'top': '10%',
	                'left':'-500px',
	                'transition': '.5s left ease',
	                'box-shadow': 'black 0px 0px 9px'
	            },
	            '#js_helper_sidebar.active': {
	                'left':'0'
	            },
	            '#js_helper_sidebar_nav': {
	                'background-color': '#3f1320',
	                'height': '2rem'
	            },
	            '#js_helper_sidebar_tap': {
	                'margin':'0 0 0 0',
	                // 'padding':'.5rem',
	                'background-color': 'rgb(199, 219, 215)',
	                'color': '#333',
	                'overflow':'auto'
	            },
	            '#js_helper_sidebar_content': {
	                'height': 'calc(100% - 2rem)',
	                'overflow': 'auto'
	            },
	            '.js_helper_sidebar_nav': {
	                'display': 'inline-block',
	                'text-decoration': 'none',
	                'color': '#666',
	                'background-color': '#c7dbd7',
	                'padding': '0 .2rem',
	                'height':'2rem',
	                'line-height': '2rem',
	                'border-right':'1px solid #333',
	                'border-radius': '0 16px 0 0'
	            },
	            
	            'table td': {
	                'border': '1px solid #eee',
    				'border-collapse': 'collapse'
	            },
				'table': {
					'font-size': '12px',
				    'border-collapse': 'collapse',
				    'width': '100%'
				},
				'a.js_helper_sidebar_nav.active': {
					'background-color': 'rgb(199, 219, 215)',
					'color': '#333'
				},
				'a.js_helper_sidebar_nav': {
					'background-color': 'rgb(100, 100, 100)',
					'color': '#eee'
				}
	        };
	        this.skills = {
	            'windowMs': true,
	            'colorPicker': true,
	            // 'reg': true,
	            'navigatorMs':true

	        };
	        this.isShow = false;
	        this.elem = null;
	        this.body = typeof $container === 'undefined' ? document.getElementsByTagName('html')[0] : $container;
	        return this;
	    };
	    HelperSidebar.prototype = {
	        init: function() {
	            // var ifExit = document.getElementById("js_helper_sidebar");
	            // if (ifExit != null) {
	            //     ifExit.remove();
	            // }
	            var js_events = JSHelper.events,
	            	js_component = JSHelper.component,
	            	css_str = '',
	            	js_helper_sidebar = document.createElement('div'),
	                js_helper_sidebar_header = document.createElement('div'),
	                js_helper_sidebar_content = document.createElement('div'),
	                js_helper_sidebar_tap = document.createElement('div'),
	                js_helper_sidebar_nav = document.createElement('div'),
	                body = this.body,
	                that = this,
	                i,
	                len
	                ;
	            // set id
	            js_helper_sidebar.id = this.ids_.js_helper_sidebar;
	            js_helper_sidebar_header.id=this.ids_.js_helper_sidebar_header;
	            js_helper_sidebar_content.id = this.ids_.js_helper_sidebar_content;
	            js_helper_sidebar_tap.id = this.ids_.js_helper_sidebar_tap;
	            js_helper_sidebar_nav.id = this.ids_.js_helper_sidebar_nav;
	            
	            // set css\
	            css_str = js_component.getCssStrs_(this.css);
	            js_events.func.addCssStyle(css_str);

	            // append to html
	            
	            js_helper_sidebar_content.appendChild(js_helper_sidebar_tap);
	            js_helper_sidebar.appendChild(js_helper_sidebar_header);
	            js_helper_sidebar.appendChild(js_helper_sidebar_nav);
	            js_helper_sidebar.appendChild(js_helper_sidebar_content);
	            body.appendChild(js_helper_sidebar);
	            
	            // js_helper_sidebar.addEventListener("mouseover", function(){
	            //     window.onmousewheel=function(){return false;};
	            //     this.onmousewheel = function(){return true;};
	            // });
	            // js_helper_sidebar.addEventListener("mouseleave", function(){
	            //     window.onmousewheel= function(){return true;};
	            // });

	            this.elem = js_helper_sidebar;

	            this.addSkills();


	            // this.setListStyle(js_helper_sidebar, this.css.js_helper_sidebar);
	            // this.setListStyle(js_helper_sidebar_tap, this.css.js_helper_sidebar_tap);
	            // this.setListStyle(js_helper_sidebar_nav, this.css.js_helper_sidebar_nav);
	            // this.setListStyle(js_helper_sidebar_content, this.css.js_helper_sidebar_content);
	            // js_helper_sidebar_nav_a = document.getElementsByClassName('js_helper_sidebar_nav');
	            // for (i = 0, len = js_helper_sidebar_nav_a.length; i < len; i++) {
	                // this.setListStyle(js_helper_sidebar_nav_a[i],this.css.js_helper_sidebar_nav_a); 
	            // }

	            // init status
	            js_events.func.children(document.getElementById('js_helper_sidebar_nav'))[0].click();
	            return this;
	        },
	        show: function() {
	            // this.setListStyle(this.elem, this.css.js_helper_sidebar_hover);
	            this.isShow = true;
	            JSHelper.events.func.addClass(this.elem, 'active');
	        },
	        hide: function() {
	            // this.setListStyle(this.elem, this.css.js_helper_sidebar);
	            this.isShow = false;
	            JSHelper.events.func.removeClass(this.elem, 'active');
	        },
	        setListStyle: function(htmlObj, styles) {
	            var i = 0,
	                len = 0
	                ;
	            for ( i in styles) {
	                htmlObj.style[i] = styles[i];
	            }
	        },
	        status: function() {return this.isShow;},
	        stopPropagation: function(e) { 
	            e = e || window.event; 
	            if (e.stopPropagation) { 
	                e.stopPropagation();//IE以外
	            } else { 
	                e.cancelBubble = true;//IE 
	            } 
	        },
	        documentMessage: function() {
	            var cookie_ = document.cookie,
	                title_ = document.title,
	                url_ = document.URL
	            ;
	            return {
	                cookie: cookie_,
	                title: title_,
	                url: url_
	            };
	        },
	        windowMessage: function() {
	            var windowMs = {
	                "window.innerWidth": window.innerWidth,
	                "window.innerHeight": window.innerHeight,
	                "document.body.clientWidth": document.body.clientWidth, // BODY对象宽度 
	                "document.body.clientHeight": document.body.clientHeight, // BODY对象高度 
	                // "标准模式下："
	                "document.documentElement.clientWidth": document.documentElement.clientWidth, // 可见区域宽度 
	                "document.documentElement.clientHeight": document.documentElement.clientHeight, // 可见区域高度 
	                // "网页可见区域宽"
	                " document.body.offsetWidth": document.body.offsetWidth,
	                // "网页可见区域高"
	                "document.body.offsetHeight": document.body.offsetHeight,
	                // "网页正文全文宽"
	                "document.body.scrollWidth": document.body.scrollWidth,
	                // "网页正文全文高"
	                "document.body.scrollHeight": document.body.scrollHeight,
	                // "网页被卷去的高"
	                "document.body.scrollTop": document.body.scrollTop,
	                // "网页被卷去的左"
	                "document.body.scrollLeft": document.body.scrollLeft,
	                // "网页被卷去的高"
	                "document.documentElement.scrollTop": document.documentElement.scrollTop,
	                // "网页被卷去的左"
	                "document.documentElement.scrollLeft": document.documentElement.scrollLeft,
	                "window.screenY": window.screenY,//FireFox支持
	                // "网页正文部分上"
	                "window.screenTop": window.screenTop,//id safari opera chrome
	                "window.screenX": window.screenX,
	                // "网页正文部分左"
	                "window.screenLeft": window.screenLeft,
	                // "屏幕分辨率的高"
	                "window.screen.height ": window.screen.height,
	                // "屏幕分辨率的宽"
	                "window.screen.width ":  window.screen.width,
	                // "屏幕可用工作区高度"
	                "window.screen.availHeight ": window.screen.availHeight,
	                // "屏幕可用工作区宽度"
	                "window.screen.availWidth ": window.screen.availWidth 
	            };
	            return windowMs;
	        },
	        getNavigatorMs: function() {
	            var navigatorMs = {
	                'window.navigator.appCodeName': window.navigator.appCodeName,
	                'window.navigator.appName': window.navigator.appName,
	                'window.navigator.appVersion': window.navigator.appVersion
	            };
	            return navigatorMs;
	        },
	        log: function(obj) {
	            var i;
	            for (i in obj) {
	                console.log(i , obj[i]);
	            }
	        },
	        addSkills: function(){
	            var that = this;
	            if (this.skills.windowMs === true) {
	                this.repaintWindowMs();
	            }
	            if (this.skills.colorPicker === true) {
	                this.repaintColorPicker();
	            }
	            if (this.skills.reg === true) {
	                this.repaintReg();
	            }
	            if (this.skills.navigatorMs === true) {
	                this.repaintNavigator();
	            }
	            window.onresize = function() {
	                // that.init();
	                that.repaintWindowMs();
	            };

	            window.onscroll = function(event) {
	                that.repaintWindowMs();
	            };
	        },
	        repaintNavigator: function() {
	            var navigatorMs = this.getNavigatorMs(),
	                i,
	                ms_html,
	                js_helper_sidebar_content,
	                that = this
	                ;
	            this.log(navigatorMs);
	            ms_html = '<table>';
	            for (i in navigatorMs) {
	                ms_html += '<tr><td>' + i + '</td><td>' + navigatorMs[i] + '</td></tr>';
	            }
	            ms_html += '</table>';
	            var js_helper_sidebar_content_navigatorMs = document.getElementById('js_helper_sidebar_content_navigatorMs');
	            if (js_helper_sidebar_content_navigatorMs !== null) {
	                // console.log(js_helper_sidebar_content_navigatorMs);
	                js_helper_sidebar_content_navigatorMs.innerHTML = ms_html;
	            } else {
	                // nav add
	                var setInnerText = JSHelper.events.func.setInnerText,
	                	events = JSHelper.events,
	                	js_helper_sidebar_nav,
	                    siblings_nav,
	                    newNav,
	                    content_to_show,
	                    siblings_content
	                    ;

	                js_helper_sidebar_nav = document.getElementById('js_helper_sidebar_nav');
	                newNav = document.createElement('a');
	                newNav.id = 'js_helper_sidebar_nav_navigatorMs';
	                newNav.className += ' js_helper_sidebar_nav';
	                newNav.href= '##';
	                js_helper_sidebar_nav.appendChild(newNav);
	                // newNav.innerText = 'windowMs';
	                setInnerText(newNav, 'windowMs');
	                js_helper_sidebar_content_navigatorMs = document.createElement("div");
	                js_helper_sidebar_content_navigatorMs.id = 'js_helper_sidebar_content_navigatorMs';
	               	js_helper_sidebar_content_navigatorMs.className = 'js_helper_sidebar_content_item';
	                js_helper_sidebar_content = document.getElementById(this.ids_.js_helper_sidebar_tap);
	                js_helper_sidebar_content.appendChild(js_helper_sidebar_content_navigatorMs);
	                js_helper_sidebar_content_navigatorMs.innerHTML = ms_html;

	                // event listen
	                newNav.addEventListener('click', function(){
	                    events.func.addClass(this, 'active');
	                    siblings_nav = events.func.siblings(this);
	                    for (i = 0, len = siblings_nav.length; i < len; i++) {
	                        events.func.removeClass(siblings_nav[i], 'active');
	                    }

	                    content_to_show = document.getElementById(this.id.replace('nav', 'content'));
	                    siblings_content = events.func.siblings(content_to_show);
	                    events.func.addClass(content_to_show, 'active');
	                    for (i = 0, len = siblings_content.length; i < len; i++) {
	                        events.func.removeClass(siblings_content[i], 'active');
	                    }                    

	                });
	            }
	        },
	        repaintReg: function() {
	            var i,
	                ms_html,
	                js_helper_sidebar_content,
	                that = this
	                ;
	            ms_html = '<h3>reg</h3>';

	            var js_helper_sidebar_content_reg = document.getElementById('js_helper_sidebar_content_reg');
	            if (js_helper_sidebar_content_reg !== null) {
	                // console.log(js_helper_sidebar_content_reg);
	                js_helper_sidebar_content_reg.innerHTML = ms_html;
	            } else {
	                /*
	                    <div id="js_helper_sidebar_nav">
	                <a id="js_helper_sidebar_nav_reg" href="#">reg</a><a id="js_helper_sidebar_nav_reg" href="#">reg</a><a id="js_helper_sidebar_nav_reg" href="#">reg</a>

	                 */
	                // nav add
	                var setInnerText = JSHelper.events.func.setInnerText,
	                	events = JSHelper.events,
	                	js_helper_sidebar_nav,
	                    siblings_nav,
	                    newNav,
	                    content_to_show = null,
	                    siblings_content
	                    ;

	                // html 
	                js_helper_sidebar_nav = document.getElementById('js_helper_sidebar_nav');
	                newNav = document.createElement('a');
	                newNav.id = 'js_helper_sidebar_nav_reg';
	                newNav.className += ' js_helper_sidebar_nav';
	                newNav.href= '#';
	                // newNav.innerText = 'reg';
	                setInnerText(newNav, 'reg');
	                js_helper_sidebar_nav.appendChild(newNav);

	                js_helper_sidebar_content_reg = document.createElement('div');
	                js_helper_sidebar_content_reg.id = 'js_helper_sidebar_content_reg';
	               
	                js_helper_sidebar_content = document.getElementById(this.ids_.js_helper_sidebar_tap);
	                js_helper_sidebar_content.appendChild(js_helper_sidebar_content_reg);
	                js_helper_sidebar_content_reg.innerHTML = ms_html;
	            
	                // event listen
	                newNav.addEventListener('click', function(){
	                    // this.style['background-color'] = 'rgb(199, 219, 215)';
	                    // this.style.color = '#333';
	                    events.func.addClass(this, 'active');
	                    siblings_nav = that.siblings(this);
	                    for (i = 0, len = siblings_nav.length; i < len; i++) {
	                        // siblings_nav[i].style['background-color'] = 'rgb(100, 100, 100)';
	                        // siblings_nav[i].style.color = '#eee';
	                        events.func.removeClass(siblings[i], 'active');
	                    }

	                    content_to_show = document.getElementById(this.id.replace('nav', 'content'));
	                    siblings_content = that.siblings(content_to_show);
	                    content_to_show.style.display = 'block';
	                    for (i = 0, len = siblings_content.length; i < len; i++) {
	                        siblings_content[i].style.display = 'none';
	                    }                    

	                });

	            }
	        },        
	        repaintColorPicker: function() {
	            var i,
	                ms_html,
	                js_helper_sidebar_content,
	                that =this
	                ;
	            ms_html = '<h3>colorPicker</h3>';

	            var js_helper_sidebar_content_colorPicker = document.getElementById('js_helper_sidebar_content_colorPicker');
	            if (js_helper_sidebar_content_colorPicker !== null) {
	                js_helper_sidebar_content_colorPicker.innerHTML = ms_html;
	            } else {
	                /*
	                    <div id="js_helper_sidebar_nav">
	                <a id="js_helper_sidebar_nav_colorPicker" href="#">colorPicker</a><a id="js_helper_sidebar_nav_colorPicker" href="#">colorPicker</a><a id="js_helper_sidebar_nav_reg" href="#">reg</a>

	                 */
	                // nav add
	                var setInnerText = JSHelper.events.func.setInnerText,
	                	events = JSHelper.events,
	                	js_helper_sidebar_nav,
	                    siblings_nav,
	                    newNav,
	                    content_to_show,
	                    siblings_content
	                    ;

	                js_helper_sidebar_nav = document.getElementById('js_helper_sidebar_nav');
	                newNav = document.createElement('a');
	                newNav.id = 'js_helper_sidebar_nav_colorPicker';
	                newNav.href= '#';
	                newNav.className += ' js_helper_sidebar_nav';
	                // newNav.innerText = 'colorPicker';
	                setInnerText(newNav, 'colorPicker');
	                js_helper_sidebar_nav.appendChild(newNav);

	                js_helper_sidebar_content_colorPicker = document.createElement('div');
	                js_helper_sidebar_content_colorPicker.id = 'js_helper_sidebar_content_colorPicker';
	                js_helper_sidebar_content_colorPicker.className = 'js_helper_sidebar_content_item active';
	                js_helper_sidebar_content = document.getElementById(this.ids_.js_helper_sidebar_tap);
	                js_helper_sidebar_content.appendChild(js_helper_sidebar_content_colorPicker);
	                // js_helper_sidebar_content_colorPicker.innerHTML = ms_html;

	                // event listen
	                newNav.addEventListener('click', function(){
	                    // this.style['background-color'] = 'rgb(199, 219, 215)';
	                    // this.style.color = '#333';
	                    events.func.addClass(this, 'active');
	                    siblings_nav = events.func.siblings(this);
	                    for (i = 0, len = siblings_nav.length; i < len; i++) {
	                        // siblings_nav[i].style['background-color'] = 'rgb(100, 100, 100)';
	                        // siblings_nav[i].style.color = '#eee';
	                        events.func.removeClass(siblings_nav[i], 'active');
	                    }

	                    content_to_show = document.getElementById(this.id.replace('nav', 'content'));
	                    siblings_content = events.func.siblings(content_to_show);
	                    // content_to_show.style.display = 'block';
	                    events.func.addClass(content_to_show, 'active');
	                    for (i = 0, len = siblings_content.length; i < len; i++) {
	                        // siblings_content[i].style.display = 'none';
	                        events.func.removeClass(siblings_content[i], 'active');
	                    }                    

	                });
	                var bind_color_picker = new JSHelper.ColorPicker('js_helper_sidebar_content_colorPicker');
	            }
	        },
	        repaintWindowMs: function(){
	            var browerMs = this.windowMessage(),
	                i,
	                ms_html,
	                js_helper_sidebar_content,
	                that = this
	                ;
	            this.log(browerMs);
	            ms_html = '<table>';
	            for (i in browerMs) {
	                ms_html += '<tr><td>' + i + '</td><td>' + browerMs[i] + '</td></tr>';
	            }
	            ms_html += '</table>';
	            var js_helper_sidebar_content_windowMs = document.getElementById('js_helper_sidebar_content_windowMs');
	            if (js_helper_sidebar_content_windowMs !== null) {
	                // console.log(js_helper_sidebar_content_windowMs);
	                js_helper_sidebar_content_windowMs.innerHTML = ms_html;
	            } else {
	                // nav add
	                var	setInnerText = JSHelper.events.func.setInnerText,
	                	events = JSHelper.events,
	                	js_helper_sidebar_nav,
	                    siblings_nav,
	                    newNav,
	                    content_to_show,
	                    siblings_content
	                    ;

	                js_helper_sidebar_nav = document.getElementById('js_helper_sidebar_nav');
	                newNav = document.createElement('a');
	                newNav.id = 'js_helper_sidebar_nav_windowMs';
	                newNav.className += ' js_helper_sidebar_nav';
	                newNav.href= '##';
	                js_helper_sidebar_nav.appendChild(newNav);
	                // newNav.innerText = 'windowMs';
	                setInnerText(newNav, 'windowMs');
	                js_helper_sidebar_content_windowMs = document.createElement("div");
	                js_helper_sidebar_content_windowMs.id = 'js_helper_sidebar_content_windowMs';
	                js_helper_sidebar_content_windowMs.className = 'js_helper_sidebar_content_item';
	                js_helper_sidebar_content = document.getElementById(this.ids_.js_helper_sidebar_tap);
	                js_helper_sidebar_content.appendChild(js_helper_sidebar_content_windowMs);
	                js_helper_sidebar_content_windowMs.innerHTML = ms_html;

	                // event listen
	                newNav.addEventListener('click', function(){

	                    events.func.addClass(this, 'active');
	                    siblings_nav = events.func.siblings(this);
	                    for (i = 0, len = siblings_nav.length; i < len; i++) {
	                        events.func.removeClass(siblings_nav[i], 'active');
	                    }

	                    content_to_show = document.getElementById(this.id.replace('nav', 'content'));
	                    siblings_content = events.func.siblings(content_to_show);
	                    events.func.addClass(content_to_show, 'active');
	                    for (i = 0, len = siblings_content.length; i < len; i++) {
	                        events.func.removeClass(siblings_content[i], 'active');
	                    }                    

	                });
	            }
	        }
	    };
	    return HelperSidebar;
	    /*结束边栏定义*/
    }());

	var helper_btn = new JSHelper.plugIn.HelperBtn();
	var dragobj = new JSHelper.DragObj(helper_btn.elem.move_obj.id, {listenObj:helper_btn.elem.listen_obj.id});
	var js_helper_sidebar = new JSHelper.plugIn.HelperSidebar().init();
	JSHelper.events.func.addListener(helper_btn.elem.show_btn, 'click', function(event) {
		if (js_helper_sidebar.status()) {
			js_helper_sidebar.hide();
		} else {
			js_helper_sidebar.show();
		}
	});
	return {
		JSHelper: JSHelper,
		dragobj: dragobj,
		js_helper_sidebar: js_helper_sidebar
	};
})(window, document);
