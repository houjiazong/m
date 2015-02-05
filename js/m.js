/**
 * m
 * jQuery Library v0.1
 *
 * 基于jQuery的基础库，封装一些常用的方法
 *
 * @Author houjiazong <houjiazong@gmail.com> M丶
 * @Date 2014-11-17
 *
 * https://github.com/houjiazong/m.git
 */

(function($, window, document, undefined) {
	'use strict';
	var version = '0.1',
		$window = $(window);

	function m() {};

	/**
	 * throttle 管道节流，用于防止scroll, mouseover等频繁调用
	 * @param  {Function} fn      执行的方法
	 * @param  {Integer}  delay   延时
	 * @return {Function}         节流方法
	 */
	m.throttle = function(fn, delay) {
		var timer = null;
		return function() {
			var self = this,
				args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function() {
				fn.apply(self, args);
			}, delay);
		};
	};

	/**
	 * imgLoad 图片加载
	 * @param  {String}   url      图片地址
	 * @param  {Function} callback 加载完成后的回调方法
	 */
	m.imgLoad = function(url, callback) {
		var image = new Image();
		image.src = url;
		if(image.readyState) {
			image.onreadystatechange = function() {
				if (image.readyState === 'loaded' || iamge.readyState === 'complete') {
					image.onreadystatechange = null;
					callback(image.width, image.height);
				}
			};
		} else {
			image.onload = function() {
				if (image.complete) {
					callback(image.width, image.height);
				}
			};
		}
	};

	/**
	 * random 获取随机数，如果传一个参数，则该参数为最大数。最小数为0
	 * @param  {Integer} min 最小数
	 * @param  {Integer} max 最大数
	 * @return {Integer}     随机数结果
	 */
	m.random = function(min, max) {
		if (!max) {
			max = min;
			min = 0;
		}
		return min + Math.floor(Math.random() * (max - min + 1));
	};

	/**
	 * 设置cookie和获取cookie
	 * @param  {String} name    cookie名字
	 * @param  {String} value   cookie值
	 * @param  {Object} options 配置
	 * @return {String}         只传入cookie名的时候返回值
	 */
	m.cookie = function(name, value, options) {
		if (typeof value !== undefined) {
			options = options || {};
			if (value === null) {
				value = '';
				options = $.extend({}, options);
				options.expires = -1;
			}

			var expires = '';

			if (options.expires && (typeof options.expires === 'number' || options.expires.toUTCString)) {
				var date;
				if (typeof options.expires === 'number') {
					date = new Date();
					date.setTime(date.getTime() + (options.expires * 864e+5));
				} else {
					date = options.expires;
				}
				expires = '; expires=' + date.toUTCString();
			}
			var path = options.path ? '; path=' + (options.path) : '; path=/';
			var domain = options.domain ? '; domain=' + (options.domain) : '';
			var secure = options.secure ? '; secure' : '';
			document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		} else {
			var cookieValue = null;
			if (document.cookie && document.cookie !== '') {
				var cookies = document.cookie.split(';');
				for (var i = 0; i < cookies.length; i++) {
					var cookie = $.trim(cookies[i]);
					if (cookie.substring(0, name.length + 1) === (name + '=')) {
						cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
						break;
					}
				}
			}
			return cookieValue;
		}
	};

	/**
	 * removeCookie 删除cookie
	 * @param  {String} key cookie名字
	 */
	m.removeCookie = function(key) {
		m.cookie(key, '', {expires: -1});
	};

	/**
	 * lazyLoad 图片延迟加载
	 * @param  {String} container 运行上下文，容器
	 */
	m.lazyLoad = function(container) {
		var placeholder = 'data:image/gif;base64,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',
			data_attribute = 'llimg',
			effect = 'fadeIn',
			effect_speed = 600,
			threshold = 0;

		var $container,
			$elements;

		// 将container转为jQuery对象,并获取所有图片
		if (container === undefined || container === window) {
			$container = $window;
			$elements = $('[data-' + data_attribute +']');
		} else {
			$container = $(container);
			$elements = $('[data-' + data_attribute +']', container);
		}

		if (!$elements.length) return;

		function update() {
			$elements.each(function() {
				var $this = $(this);

				if (!$this.is(':visible')) return;
				if (abovethetop($this) || leftofbegin($this)) {
					// 什么都不做
				} else if (!belowthefold($this) && !rightoffold($this)) {
					$this.trigger('appear');
				}
			});
		};

		$elements.each(function(){
			var self = this;
			var $self = $(self);

			self.loaded = false;

			// 判断图片url是否为空，如果为空，替换为placeholder
			if ($self.attr('src') === undefined || $self.attr('src') === false) {
				if ($self.is('img')) {
					$self.attr('src', placeholder);
				}
			}

			// 注册图片事件处理程序
			$self.one('appear', function() {
				if (!this.loaded) {
					var image = new Image();
					$(image).on('load', function() {
						var original = $self.attr('data-' + data_attribute);
						$self.hide();
						if ($self.is('img')) {
							$self.attr('src', original);
						} else {
							$self.css('background-image', 'url(' + original + ')');
						}
						$self[effect](effect_speed);
						self.loaded = true;
					}).attr('src', $self.attr('data-' + data_attribute));
				}
			});

		});

		$container.on('scroll', m.throttle(update, 100));
		$(function() {
			update();
		});

		/**
		 * belowthefold 向下滚动，判断待加载元素是否到达可视区域
		 * @param  {Object} $element 元素对象
		 * @return {Boolean}
		 */
		function belowthefold($element) {
			var fold;

			if (container === undefined || container === window) {
				fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
			} else {
				fold = $container.offset().top + $container.height();
			}

			return fold <= $element.offset().top - threshold;
		};

		/**
		 * rightoffold 向右滚动，判断待加载元素是否到达可视区域
		 * @param  {Object} $element 元素对象
		 * @return {Boolean}
		 */
		function rightoffold($element) {
			var fold;

			if (container === undefined || container === window) {
				fold = $window.width() + $window.scrollLeft();
			} else {
				fold = $container.offset().left + $container.width();
			}

			return fold <= $element.offset().left - threshold;
		};

		/**
		 * abovethetop 向上滚动
		 * @param  {Object} $element 元素对象
		 * @return {Boolean}
		 */
		function abovethetop($element) {
			var fold;

			if (container === undefined || container === window) {
				fold = $window.scrollTop();
			} else {
				fold = $container.offset().top;
			}

			return fold >= $element.offset().top + threshold  + $element.height();
		};

		/**
		 * abovethetop 向左滚动
		 * @param  {Object} $element 元素对象
		 * @return {Boolean}
		 */
		function leftofbegin($element) {
			var fold;

			if (container === undefined || container === window) {
				fold = $window.scrollLeft();
			} else {
				fold = $container.offset().left;
			}

			return fold >= $element.offset().left + threshold + $element.width();
		};
	};

	/**
	 * countDown 倒计时
	 * @param  {Date} endTime    结束时间
	 * @param  {Function} onChange   时间变化回调
	 * @param  {Function} onComplete 倒计时结束回调
	 */
	m.countDown = function(endTime, onChange, onComplete) {
		var timer = null,
			_second = 1000,
			_minute = _second * 60,
			_hour = _minute * 60,
			_day = _hour * 24;

		function tick() {
			var nowTime = new Date(),
				leftTime = new Date(endTime).getTime() - nowTime.getTime();	// 计算剩余时间

			var resultTime = getFormatTime(leftTime);

			if (leftTime <= 0) {
				clearTimeout(timer);
				if (onComplete !== undefined && typeof onComplete === 'function') {
					onComplete(resultTime[0], resultTime[1], resultTime[2], resultTime[3]);
				}
			} else {
				if (onChange !== undefined && typeof onChange === 'function') {
					onChange(resultTime[0], resultTime[1], resultTime[2], resultTime[3]);
				}
				timer = setTimeout(function() {
					tick();
				}, 1000);
			}
		};

		/**
		 * getFormatTime 计算并格式化
		 * @param  {Integer} leftTime 剩余时间
		 * @return {Array}          计算后的值
		 */
		function getFormatTime(leftTime) {
			var day = Math.floor(leftTime / _day),
				hour = Math.floor((leftTime % _day) / _hour),
				minute = Math.floor((leftTime % _hour) / _minute),
				second = Math.floor((leftTime % _minute) / _second);
			day = day < 10 ? '0' + day : day;
			hour = hour < 10 ? '0' + hour : hour;
			minute = minute < 10 ? '0' + minute : minute;
			second = second < 10 ? '0' + second : second;
			return [day, hour, minute, second];
		}

		tick();
	};

	window.m = m;
})($, window, document);
