(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/owl-carousel/lib/owl.carousel.js                                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/**                                                                                                                  // 1
 * Owl carousel                                                                                                      // 2
 * @version 2.0.0                                                                                                    // 3
 * @author Bartosz Wojciechowski                                                                                     // 4
 * @license The MIT License (MIT)                                                                                    // 5
 * @todo Lazy Load Icon                                                                                              // 6
 * @todo prevent animationend bubling                                                                                // 7
 * @todo itemsScaleUp                                                                                                // 8
 * @todo Test Zepto                                                                                                  // 9
 * @todo stagePadding calculate wrong active classes                                                                 // 10
 */                                                                                                                  // 11
;(function($, window, document, undefined) {                                                                         // 12
                                                                                                                     // 13
	var defaults, item, dom, width, num, pos, drag, speed, state, e;                                                    // 14
                                                                                                                     // 15
	/**                                                                                                                 // 16
	 * Default options for the carousel.                                                                                // 17
	 * @private                                                                                                         // 18
	 * @todo Better as public member of `Owl`                                                                           // 19
	 */                                                                                                                 // 20
	defaults = {                                                                                                        // 21
		items: 3,                                                                                                          // 22
		loop: false,                                                                                                       // 23
		center: false,                                                                                                     // 24
                                                                                                                     // 25
		mouseDrag: true,                                                                                                   // 26
		touchDrag: true,                                                                                                   // 27
		pullDrag: true,                                                                                                    // 28
		freeDrag: false,                                                                                                   // 29
                                                                                                                     // 30
		margin: 0,                                                                                                         // 31
		stagePadding: 0,                                                                                                   // 32
                                                                                                                     // 33
		merge: false,                                                                                                      // 34
		mergeFit: true,                                                                                                    // 35
		autoWidth: false,                                                                                                  // 36
                                                                                                                     // 37
		startPosition: 0,                                                                                                  // 38
                                                                                                                     // 39
		smartSpeed: 250,                                                                                                   // 40
		fluidSpeed: false,                                                                                                 // 41
		dragEndSpeed: false,                                                                                               // 42
                                                                                                                     // 43
		responsive: {},                                                                                                    // 44
		responsiveRefreshRate: 200,                                                                                        // 45
		responsiveBaseElement: window,                                                                                     // 46
		responsiveClass: false,                                                                                            // 47
                                                                                                                     // 48
		fallbackEasing: 'swing',                                                                                           // 49
                                                                                                                     // 50
		info: false,                                                                                                       // 51
                                                                                                                     // 52
		nestedItemSelector: false,                                                                                         // 53
		itemElement: 'div',                                                                                                // 54
		stageElement: 'div',                                                                                               // 55
                                                                                                                     // 56
		// Classes and Names                                                                                               // 57
		themeClass: 'owl-theme',                                                                                           // 58
		baseClass: 'owl-carousel',                                                                                         // 59
		itemClass: 'owl-item',                                                                                             // 60
		centerClass: 'center',                                                                                             // 61
		activeClass: 'active'                                                                                              // 62
	};                                                                                                                  // 63
                                                                                                                     // 64
	/**                                                                                                                 // 65
	 * Template for the data of each item respectively its DOM element.                                                 // 66
	 * @private                                                                                                         // 67
	 */                                                                                                                 // 68
	item = {                                                                                                            // 69
		index: false,                                                                                                      // 70
		indexAbs: false,                                                                                                   // 71
		posLeft: false,                                                                                                    // 72
		clone: false,                                                                                                      // 73
		active: false,                                                                                                     // 74
		loaded: false,                                                                                                     // 75
		lazyLoad: false,                                                                                                   // 76
		current: false,                                                                                                    // 77
		width: false,                                                                                                      // 78
		center: false,                                                                                                     // 79
		page: false,                                                                                                       // 80
		hasVideo: false,                                                                                                   // 81
		playVideo: false                                                                                                   // 82
	};                                                                                                                  // 83
                                                                                                                     // 84
	/**                                                                                                                 // 85
	 * Template for the references to DOM elements, those with `$` sign are `jQuery` objects.                           // 86
	 * @private                                                                                                         // 87
	 */                                                                                                                 // 88
	dom = {                                                                                                             // 89
		el: null, // main element                                                                                          // 90
		$el: null, // jQuery main element                                                                                  // 91
		stage: null, // stage                                                                                              // 92
		$stage: null, // jQuery stage                                                                                      // 93
		oStage: null, // outer stage                                                                                       // 94
		$oStage: null, // $ outer stage                                                                                    // 95
		$items: null, // all items, clones and originals included                                                          // 96
		$oItems: null, // original items                                                                                   // 97
		$cItems: null, // cloned items only                                                                                // 98
		$content: null                                                                                                     // 99
	};                                                                                                                  // 100
                                                                                                                     // 101
	/**                                                                                                                 // 102
	 * Template for the widths of some elements.                                                                        // 103
	 * @private                                                                                                         // 104
	 */                                                                                                                 // 105
	width = {                                                                                                           // 106
		el: 0,                                                                                                             // 107
		stage: 0,                                                                                                          // 108
		item: 0,                                                                                                           // 109
		prevWindow: 0,                                                                                                     // 110
		cloneLast: 0                                                                                                       // 111
	};                                                                                                                  // 112
                                                                                                                     // 113
	/**                                                                                                                 // 114
	 * Template for counting to some properties.                                                                        // 115
	 * @private                                                                                                         // 116
	 */                                                                                                                 // 117
	num = {                                                                                                             // 118
		items: 0,                                                                                                          // 119
		oItems: 0,                                                                                                         // 120
		cItems: 0,                                                                                                         // 121
		active: 0,                                                                                                         // 122
		merged: []                                                                                                         // 123
	};                                                                                                                  // 124
                                                                                                                     // 125
	/**                                                                                                                 // 126
	 * Template for some informations about the position.                                                               // 127
	 * @private                                                                                                         // 128
	 */                                                                                                                 // 129
	pos = {                                                                                                             // 130
		start: 0,                                                                                                          // 131
		max: 0,                                                                                                            // 132
		maxValue: 0,                                                                                                       // 133
		prev: 0,                                                                                                           // 134
		current: 0,                                                                                                        // 135
		currentAbs: 0,                                                                                                     // 136
		stage: 0,                                                                                                          // 137
		items: [],                                                                                                         // 138
		lsCurrent: 0                                                                                                       // 139
	};                                                                                                                  // 140
                                                                                                                     // 141
	/**                                                                                                                 // 142
	 * Template for status information about drag and touch events.                                                     // 143
	 * @private                                                                                                         // 144
	 */                                                                                                                 // 145
	drag = {                                                                                                            // 146
		start: 0,                                                                                                          // 147
		startX: 0,                                                                                                         // 148
		startY: 0,                                                                                                         // 149
		current: 0,                                                                                                        // 150
		currentX: 0,                                                                                                       // 151
		currentY: 0,                                                                                                       // 152
		offsetX: 0,                                                                                                        // 153
		offsetY: 0,                                                                                                        // 154
		distance: null,                                                                                                    // 155
		startTime: 0,                                                                                                      // 156
		endTime: 0,                                                                                                        // 157
		updatedX: 0,                                                                                                       // 158
		targetEl: null                                                                                                     // 159
	};                                                                                                                  // 160
                                                                                                                     // 161
	/**                                                                                                                 // 162
	 * Template for some speed informations.                                                                            // 163
	 * @private                                                                                                         // 164
	 */                                                                                                                 // 165
	speed = {                                                                                                           // 166
		onDragEnd: 300,                                                                                                    // 167
		css2speed: 0                                                                                                       // 168
	};                                                                                                                  // 169
                                                                                                                     // 170
	/**                                                                                                                 // 171
	 * Template for some status informations.                                                                           // 172
	 * @private                                                                                                         // 173
	 */                                                                                                                 // 174
	state = {                                                                                                           // 175
		isTouch: false,                                                                                                    // 176
		isScrolling: false,                                                                                                // 177
		isSwiping: false,                                                                                                  // 178
		direction: false,                                                                                                  // 179
		inMotion: false                                                                                                    // 180
	};                                                                                                                  // 181
                                                                                                                     // 182
	/**                                                                                                                 // 183
	 * Event functions references.                                                                                      // 184
	 * @private                                                                                                         // 185
	 */                                                                                                                 // 186
	e = {                                                                                                               // 187
		_onDragStart: null,                                                                                                // 188
		_onDragMove: null,                                                                                                 // 189
		_onDragEnd: null,                                                                                                  // 190
		_transitionEnd: null,                                                                                              // 191
		_resizer: null,                                                                                                    // 192
		_responsiveCall: null,                                                                                             // 193
		_goToLoop: null,                                                                                                   // 194
		_checkVisibile: null                                                                                               // 195
	};                                                                                                                  // 196
                                                                                                                     // 197
	/**                                                                                                                 // 198
	 * Creates a carousel.                                                                                              // 199
	 * @class The Owl Carousel.                                                                                         // 200
	 * @public                                                                                                          // 201
	 * @param {HTMLElement|jQuery} element - The element to create the carousel for.                                    // 202
	 * @param {Object} [options] - The options                                                                          // 203
	 */                                                                                                                 // 204
	function Owl(element, options) {                                                                                    // 205
                                                                                                                     // 206
		// add basic Owl information to dom element                                                                        // 207
		element.owlCarousel = {                                                                                            // 208
			'name': 'Owl Carousel',                                                                                           // 209
			'author': 'Bartosz Wojciechowski',                                                                                // 210
			'version': '2.0.0-beta.2.1'                                                                                       // 211
		};                                                                                                                 // 212
                                                                                                                     // 213
		/**                                                                                                                // 214
		 * Current settings for the carousel.                                                                              // 215
		 * @protected                                                                                                      // 216
		 */                                                                                                                // 217
		this.options = $.extend({}, defaults, options);                                                                    // 218
                                                                                                                     // 219
		/**                                                                                                                // 220
		 * @protected                                                                                                      // 221
		 * @todo Must be dosumented.                                                                                       // 222
		 */                                                                                                                // 223
		this._options = $.extend({}, defaults, this.options);                                                              // 224
                                                                                                                     // 225
		/**                                                                                                                // 226
		 * Template for the data of each item.                                                                             // 227
		 * @protected                                                                                                      // 228
		 */                                                                                                                // 229
		this.itemData = $.extend({}, item);                                                                                // 230
                                                                                                                     // 231
		/**                                                                                                                // 232
		 * Contains references to DOM elements, those with `$` sign are `jQuery` objects.                                  // 233
		 * @protected                                                                                                      // 234
		 */                                                                                                                // 235
		this.dom = $.extend({}, dom);                                                                                      // 236
                                                                                                                     // 237
		/**                                                                                                                // 238
		 * Caches the widths of some elements.                                                                             // 239
		 * @protected                                                                                                      // 240
		 */                                                                                                                // 241
		this.width = $.extend({}, width);                                                                                  // 242
                                                                                                                     // 243
		/**                                                                                                                // 244
		 * Caches some count informations.                                                                                 // 245
		 * @protected                                                                                                      // 246
		 */                                                                                                                // 247
		this.num = $.extend({}, num);                                                                                      // 248
                                                                                                                     // 249
		/**                                                                                                                // 250
		 * Caches some position informations.                                                                              // 251
		 * @protected                                                                                                      // 252
		 */                                                                                                                // 253
		this.pos = $.extend({}, pos);                                                                                      // 254
                                                                                                                     // 255
		/**                                                                                                                // 256
		 * Caches informations about drag and touch events.                                                                // 257
		 */                                                                                                                // 258
		this.drag = $.extend({}, drag);                                                                                    // 259
                                                                                                                     // 260
		/**                                                                                                                // 261
		 * Caches some speed settings.                                                                                     // 262
		 * @protected                                                                                                      // 263
		 */                                                                                                                // 264
		this.speed = $.extend({}, speed);                                                                                  // 265
                                                                                                                     // 266
		/**                                                                                                                // 267
		 * Caches some status informations.                                                                                // 268
		 * @protected                                                                                                      // 269
		 */                                                                                                                // 270
		this.state = $.extend({}, state);                                                                                  // 271
                                                                                                                     // 272
		/**                                                                                                                // 273
		 * @protected                                                                                                      // 274
		 * @todo Must be documented                                                                                        // 275
		 */                                                                                                                // 276
		this.e = $.extend({}, e);                                                                                          // 277
                                                                                                                     // 278
		/**                                                                                                                // 279
		 * References to the running plugins of this carousel.                                                             // 280
		 * @protected                                                                                                      // 281
		 */                                                                                                                // 282
		this.plugins = {};                                                                                                 // 283
                                                                                                                     // 284
		/**                                                                                                                // 285
		 * Currently suppressed events to prevent them from beeing retriggered.                                            // 286
		 * @protected                                                                                                      // 287
		 * @see `addTriggerableEvents()`                                                                                   // 288
		 */                                                                                                                // 289
		this.suppressedEvents = {};                                                                                        // 290
                                                                                                                     // 291
		this.dom.el = element;                                                                                             // 292
		this.dom.$el = $(element);                                                                                         // 293
                                                                                                                     // 294
		for (var plugin in Owl.Plugins) {                                                                                  // 295
			this.plugins[plugin] = new Owl.Plugins[plugin](this);                                                             // 296
		}                                                                                                                  // 297
                                                                                                                     // 298
		this.init();                                                                                                       // 299
	}                                                                                                                   // 300
                                                                                                                     // 301
	/**                                                                                                                 // 302
	 * Contains all registered plugins.                                                                                 // 303
	 * @public                                                                                                          // 304
	 */                                                                                                                 // 305
	Owl.Plugins = {};                                                                                                   // 306
                                                                                                                     // 307
	/**                                                                                                                 // 308
	 * Initializes the carousel.                                                                                        // 309
	 * @protected                                                                                                       // 310
	 */                                                                                                                 // 311
	Owl.prototype.init = function() {                                                                                   // 312
                                                                                                                     // 313
		this.trigger('initialize');                                                                                        // 314
                                                                                                                     // 315
		// Add base class                                                                                                  // 316
		if (!this.dom.$el.hasClass(this.options.baseClass)) {                                                              // 317
			this.dom.$el.addClass(this.options.baseClass);                                                                    // 318
		}                                                                                                                  // 319
                                                                                                                     // 320
		// Add theme class                                                                                                 // 321
		if (!this.dom.$el.hasClass(this.options.themeClass)) {                                                             // 322
			this.dom.$el.addClass(this.options.themeClass);                                                                   // 323
		}                                                                                                                  // 324
                                                                                                                     // 325
		// Add theme class                                                                                                 // 326
		if (this.options.rtl) {                                                                                            // 327
			this.dom.$el.addClass('owl-rtl');                                                                                 // 328
		}                                                                                                                  // 329
                                                                                                                     // 330
		// Check support                                                                                                   // 331
		this.browserSupport();                                                                                             // 332
                                                                                                                     // 333
		// Sort responsive items in array                                                                                  // 334
		this.sortOptions();                                                                                                // 335
                                                                                                                     // 336
		// Update options.items on given size                                                                              // 337
		this.setResponsiveOptions();                                                                                       // 338
                                                                                                                     // 339
		if (this.options.autoWidth && this.state.imagesLoaded !== true) {                                                  // 340
			var imgs, nestedSelector, width;                                                                                  // 341
			imgs = this.dom.$el.find('img');                                                                                  // 342
			nestedSelector = this.options.nestedItemSelector ? '.' + this.options.nestedItemSelector : undefined;             // 343
			width = this.dom.$el.children(nestedSelector).width();                                                            // 344
                                                                                                                     // 345
			if (imgs.length && width <= 0) {                                                                                  // 346
				this.preloadAutoWidthImages(imgs);                                                                               // 347
				return false;                                                                                                    // 348
			}                                                                                                                 // 349
		}                                                                                                                  // 350
                                                                                                                     // 351
		// Get and store window width                                                                                      // 352
		// iOS safari likes to trigger unnecessary resize event                                                            // 353
		this.width.prevWindow = this.windowWidth();                                                                        // 354
                                                                                                                     // 355
		// create stage object                                                                                             // 356
		this.createStage();                                                                                                // 357
                                                                                                                     // 358
		// Append local content                                                                                            // 359
		this.fetchContent();                                                                                               // 360
                                                                                                                     // 361
		// attach generic events                                                                                           // 362
		this.eventsCall();                                                                                                 // 363
                                                                                                                     // 364
		// attach generic events                                                                                           // 365
		this.internalEvents();                                                                                             // 366
                                                                                                                     // 367
		this.dom.$el.addClass('owl-loading');                                                                              // 368
		this.refresh(true);                                                                                                // 369
		this.dom.$el.removeClass('owl-loading').addClass('owl-loaded');                                                    // 370
                                                                                                                     // 371
		this.trigger('initialized');                                                                                       // 372
                                                                                                                     // 373
		// attach custom control events                                                                                    // 374
		this.addTriggerableEvents();                                                                                       // 375
	};                                                                                                                  // 376
                                                                                                                     // 377
	/**                                                                                                                 // 378
	 * Sorts responsive sizes.                                                                                          // 379
	 * @protected                                                                                                       // 380
	 */                                                                                                                 // 381
	Owl.prototype.sortOptions = function() {                                                                            // 382
                                                                                                                     // 383
		var resOpt, keys = [], i, j, k;                                                                                    // 384
                                                                                                                     // 385
		resOpt = this.options.responsive;                                                                                  // 386
		this.responsiveSorted = {};                                                                                        // 387
                                                                                                                     // 388
		for (i in resOpt) {                                                                                                // 389
			keys.push(i);                                                                                                     // 390
		}                                                                                                                  // 391
                                                                                                                     // 392
		keys = keys.sort(function(a, b) {                                                                                  // 393
			return a - b;                                                                                                     // 394
		});                                                                                                                // 395
                                                                                                                     // 396
		for (j = 0; j < keys.length; j++) {                                                                                // 397
			k = keys[j];                                                                                                      // 398
			this.responsiveSorted[k] = resOpt[k];                                                                             // 399
		}                                                                                                                  // 400
                                                                                                                     // 401
	};                                                                                                                  // 402
                                                                                                                     // 403
	/**                                                                                                                 // 404
	 * Sets responsive options.                                                                                         // 405
	 * @protected                                                                                                       // 406
	 */                                                                                                                 // 407
	Owl.prototype.setResponsiveOptions = function() {                                                                   // 408
		if (this.options.responsive === false) {                                                                           // 409
			return false;                                                                                                     // 410
		}                                                                                                                  // 411
                                                                                                                     // 412
		var width, i, j, k, minWidth;                                                                                      // 413
                                                                                                                     // 414
		width = this.windowWidth();                                                                                        // 415
		resOpt = this.options.responsive;                                                                                  // 416
                                                                                                                     // 417
		// overwrite non resposnive options                                                                                // 418
		for (k in this._options) {                                                                                         // 419
			if (k !== 'responsive') {                                                                                         // 420
				this.options[k] = this._options[k];                                                                              // 421
			}                                                                                                                 // 422
		}                                                                                                                  // 423
                                                                                                                     // 424
		// find responsive width                                                                                           // 425
		for (i in this.responsiveSorted) {                                                                                 // 426
			if (i <= width) {                                                                                                 // 427
				minWidth = i;                                                                                                    // 428
				// set responsive options                                                                                        // 429
				for (j in this.responsiveSorted[minWidth]) {                                                                     // 430
					this.options[j] = this.responsiveSorted[minWidth][j];                                                           // 431
				}                                                                                                                // 432
                                                                                                                     // 433
			}                                                                                                                 // 434
		}                                                                                                                  // 435
		this.num.breakpoint = minWidth;                                                                                    // 436
                                                                                                                     // 437
		// Responsive Class                                                                                                // 438
		if (this.options.responsiveClass) {                                                                                // 439
			this.dom.$el.attr('class', function(i, c) {                                                                       // 440
				return c.replace(/\b owl-responsive-\S+/g, '');                                                                  // 441
			}).addClass('owl-responsive-' + minWidth);                                                                        // 442
		}                                                                                                                  // 443
	};                                                                                                                  // 444
                                                                                                                     // 445
	/**                                                                                                                 // 446
	 * Updates option logic if necessery.                                                                               // 447
	 * @protected                                                                                                       // 448
	 */                                                                                                                 // 449
	Owl.prototype.optionsLogic = function() {                                                                           // 450
		// Toggle Center class                                                                                             // 451
		this.dom.$el.toggleClass('owl-center', this.options.center);                                                       // 452
                                                                                                                     // 453
		// if items number is less than in body                                                                            // 454
		if (this.options.loop && this.num.oItems < this.options.items) {                                                   // 455
			this.options.loop = false;                                                                                        // 456
		}                                                                                                                  // 457
                                                                                                                     // 458
		if (this.options.autoWidth) {                                                                                      // 459
			this.options.stagePadding = false;                                                                                // 460
			this.options.merge = false;                                                                                       // 461
		}                                                                                                                  // 462
	};                                                                                                                  // 463
                                                                                                                     // 464
	/**                                                                                                                 // 465
	 * Creates stage and outer-stage elements.                                                                          // 466
	 * @protected                                                                                                       // 467
	 */                                                                                                                 // 468
	Owl.prototype.createStage = function() {                                                                            // 469
		var oStage = document.createElement('div'),                                                                        // 470
			stage = document.createElement(this.options.stageElement);                                                        // 471
                                                                                                                     // 472
		oStage.className = 'owl-stage-outer';                                                                              // 473
		stage.className = 'owl-stage';                                                                                     // 474
                                                                                                                     // 475
		oStage.appendChild(stage);                                                                                         // 476
		this.dom.el.appendChild(oStage);                                                                                   // 477
                                                                                                                     // 478
		this.dom.oStage = oStage;                                                                                          // 479
		this.dom.$oStage = $(oStage);                                                                                      // 480
		this.dom.stage = stage;                                                                                            // 481
		this.dom.$stage = $(stage);                                                                                        // 482
                                                                                                                     // 483
		oStage = null;                                                                                                     // 484
		stage = null;                                                                                                      // 485
	};                                                                                                                  // 486
                                                                                                                     // 487
	/**                                                                                                                 // 488
	 * Creates an item container.                                                                                       // 489
	 * @protected                                                                                                       // 490
	 * @returns {jQuery} - The item container.                                                                          // 491
	 */                                                                                                                 // 492
	Owl.prototype.createItemContainer = function() {                                                                    // 493
		var item = document.createElement(this.options.itemElement);                                                       // 494
		item.className = this.options.itemClass;                                                                           // 495
		return $(item);                                                                                                    // 496
	};                                                                                                                  // 497
                                                                                                                     // 498
	/**                                                                                                                 // 499
	 * Fetches the content.                                                                                             // 500
	 * @protected                                                                                                       // 501
	 */                                                                                                                 // 502
	Owl.prototype.fetchContent = function(extContent) {                                                                 // 503
		if (extContent) {                                                                                                  // 504
			this.dom.$content = (extContent instanceof jQuery) ? extContent : $(extContent);                                  // 505
		} else if (this.options.nestedItemSelector) {                                                                      // 506
			this.dom.$content = this.dom.$el.find('.' + this.options.nestedItemSelector).not('.owl-stage-outer');             // 507
		} else {                                                                                                           // 508
			this.dom.$content = this.dom.$el.children().not('.owl-stage-outer');                                              // 509
		}                                                                                                                  // 510
		// content length                                                                                                  // 511
		this.num.oItems = this.dom.$content.length;                                                                        // 512
                                                                                                                     // 513
		// init Structure                                                                                                  // 514
		if (this.num.oItems !== 0) {                                                                                       // 515
			this.initStructure();                                                                                             // 516
		}                                                                                                                  // 517
	};                                                                                                                  // 518
                                                                                                                     // 519
	/**                                                                                                                 // 520
	 * Initializes the content struture.                                                                                // 521
	 * @protected                                                                                                       // 522
	 */                                                                                                                 // 523
	Owl.prototype.initStructure = function() {                                                                          // 524
		this.createNormalStructure();                                                                                      // 525
	};                                                                                                                  // 526
                                                                                                                     // 527
	/**                                                                                                                 // 528
	 * Creates small/mid weight content structure.                                                                      // 529
	 * @protected                                                                                                       // 530
	 * @todo This results in a poor performance,                                                                        // 531
	 * but this is due to the approach of completely                                                                    // 532
	 * rebuild the existing DOM tree from scratch,                                                                      // 533
	 * rather to use them. The effort to implement                                                                      // 534
	 * this with a good performance, while maintaining                                                                  // 535
	 * the original approach is disproportionate.                                                                       // 536
	 */                                                                                                                 // 537
	Owl.prototype.createNormalStructure = function() {                                                                  // 538
		var i, $item;                                                                                                      // 539
		for (i = 0; i < this.num.oItems; i++) {                                                                            // 540
			$item = this.createItemContainer();                                                                               // 541
			this.initializeItemContainer($item, this.dom.$content[i]);                                                        // 542
			this.dom.$stage.append($item);                                                                                    // 543
		}                                                                                                                  // 544
		this.dom.$content = null;                                                                                          // 545
	};                                                                                                                  // 546
                                                                                                                     // 547
	/**                                                                                                                 // 548
	 * Creates custom content structure.                                                                                // 549
	 * @protected                                                                                                       // 550
	 */                                                                                                                 // 551
	Owl.prototype.createCustomStructure = function(howManyItems) {                                                      // 552
		var i, $item;                                                                                                      // 553
		for (i = 0; i < howManyItems; i++) {                                                                               // 554
			$item = this.createItemContainer();                                                                               // 555
			this.createItemContainerData($item);                                                                              // 556
			this.dom.$stage.append($item);                                                                                    // 557
		}                                                                                                                  // 558
	};                                                                                                                  // 559
                                                                                                                     // 560
	/**                                                                                                                 // 561
	 * Initializes item container with provided content.                                                                // 562
	 * @protected                                                                                                       // 563
	 * @param {jQuery} item - The item that has to be filled.                                                           // 564
	 * @param {HTMLElement|jQuery|string} content - The content that fills the item.                                    // 565
	 */                                                                                                                 // 566
	Owl.prototype.initializeItemContainer = function(item, content) {                                                   // 567
		this.trigger('change', { property: { name: 'item', value: item } });                                               // 568
                                                                                                                     // 569
		this.createItemContainerData(item);                                                                                // 570
		item.append(content);                                                                                              // 571
                                                                                                                     // 572
		this.trigger('changed', { property: { name: 'item', value: item } });                                              // 573
	};                                                                                                                  // 574
                                                                                                                     // 575
	/**                                                                                                                 // 576
	 * Creates item container data.                                                                                     // 577
	 * @protected                                                                                                       // 578
	 * @param {jQuery} item - The item for which the data are to be set.                                                // 579
	 * @param {jQuery} [source] - The item whose data are to be copied.                                                 // 580
	 */                                                                                                                 // 581
	Owl.prototype.createItemContainerData = function(item, source) {                                                    // 582
		var data = $.extend({}, this.itemData);                                                                            // 583
                                                                                                                     // 584
		if (source) {                                                                                                      // 585
			$.extend(data, source.data('owl-item'));                                                                          // 586
		}                                                                                                                  // 587
                                                                                                                     // 588
		item.data('owl-item', data);                                                                                       // 589
	};                                                                                                                  // 590
                                                                                                                     // 591
	/**                                                                                                                 // 592
	 * Clones an item container.                                                                                        // 593
	 * @protected                                                                                                       // 594
	 * @param {jQuery} item - The item to clone.                                                                        // 595
	 * @returns {jQuery} - The cloned item.                                                                             // 596
	 */                                                                                                                 // 597
	Owl.prototype.cloneItemContainer = function(item) {                                                                 // 598
		var $clone = item.clone(true, true).addClass('cloned');                                                            // 599
		// somehow data references the same object                                                                         // 600
		this.createItemContainerData($clone, $clone);                                                                      // 601
		$clone.data('owl-item').clone = true;                                                                              // 602
		return $clone;                                                                                                     // 603
	};                                                                                                                  // 604
                                                                                                                     // 605
	/**                                                                                                                 // 606
	 * Updates original items index data.                                                                               // 607
	 * @protected                                                                                                       // 608
	 */                                                                                                                 // 609
	Owl.prototype.updateLocalContent = function() {                                                                     // 610
                                                                                                                     // 611
		var k, item;                                                                                                       // 612
                                                                                                                     // 613
		this.dom.$oItems = this.dom.$stage.find('.' + this.options.itemClass).filter(function() {                          // 614
			return $(this).data('owl-item').clone === false;                                                                  // 615
		});                                                                                                                // 616
                                                                                                                     // 617
		this.num.oItems = this.dom.$oItems.length;                                                                         // 618
		// update index on original items                                                                                  // 619
                                                                                                                     // 620
		for (k = 0; k < this.num.oItems; k++) {                                                                            // 621
			item = this.dom.$oItems.eq(k);                                                                                    // 622
			item.data('owl-item').index = k;                                                                                  // 623
		}                                                                                                                  // 624
	};                                                                                                                  // 625
                                                                                                                     // 626
	/**                                                                                                                 // 627
	 * Creates clones for infinity loop.                                                                                // 628
	 * @protected                                                                                                       // 629
	 */                                                                                                                 // 630
	Owl.prototype.loopClone = function() {                                                                              // 631
		if (!this.options.loop || this.num.oItems < this.options.items) {                                                  // 632
			return false;                                                                                                     // 633
		}                                                                                                                  // 634
                                                                                                                     // 635
		var append, prepend, i,                                                                                            // 636
			items = this.options.items,                                                                                       // 637
			last = this.num.oItems - 1;                                                                                       // 638
                                                                                                                     // 639
		// if neighbour margin then add one more duplicat                                                                  // 640
		if (this.options.stagePadding && this.options.items === 1) {                                                       // 641
			items += 1;                                                                                                       // 642
		}                                                                                                                  // 643
		this.num.cItems = items * 2;                                                                                       // 644
                                                                                                                     // 645
		for (i = 0; i < items; i++) {                                                                                      // 646
			append = this.cloneItemContainer(this.dom.$oItems.eq(i));                                                         // 647
			prepend = this.cloneItemContainer(this.dom.$oItems.eq(last - i));                                                 // 648
                                                                                                                     // 649
			this.dom.$stage.append(append);                                                                                   // 650
			this.dom.$stage.prepend(prepend);                                                                                 // 651
		}                                                                                                                  // 652
                                                                                                                     // 653
		this.dom.$cItems = this.dom.$stage.find('.' + this.options.itemClass).filter(function() {                          // 654
			return $(this).data('owl-item').clone === true;                                                                   // 655
		});                                                                                                                // 656
	};                                                                                                                  // 657
                                                                                                                     // 658
	/**                                                                                                                 // 659
	 * Update cloned elements.                                                                                          // 660
	 * @protected                                                                                                       // 661
	 */                                                                                                                 // 662
	Owl.prototype.reClone = function() {                                                                                // 663
		// remove cloned items                                                                                             // 664
		if (this.dom.$cItems !== null) { // && (this.num.oItems !== 0 &&                                                   // 665
			// this.num.oItems <=                                                                                             // 666
			// this.options.items)){                                                                                          // 667
			this.dom.$cItems.remove();                                                                                        // 668
			this.dom.$cItems = null;                                                                                          // 669
			this.num.cItems = 0;                                                                                              // 670
		}                                                                                                                  // 671
                                                                                                                     // 672
		if (!this.options.loop) {                                                                                          // 673
			return;                                                                                                           // 674
		}                                                                                                                  // 675
		// generete new elements                                                                                           // 676
		this.loopClone();                                                                                                  // 677
	};                                                                                                                  // 678
                                                                                                                     // 679
	/**                                                                                                                 // 680
	 * Updates all items index data.                                                                                    // 681
	 * @protected                                                                                                       // 682
	 */                                                                                                                 // 683
	Owl.prototype.calculate = function() {                                                                              // 684
                                                                                                                     // 685
		var i, j, elMinusMargin, dist, allItems, iWidth,  mergeNumber,  posLeft = 0, fullWidth = 0;                        // 686
                                                                                                                     // 687
		// element width minus neighbour                                                                                   // 688
		this.width.el = this.dom.$el.width() - (this.options.stagePadding * 2);                                            // 689
                                                                                                                     // 690
		// to check                                                                                                        // 691
		this.width.view = this.dom.$el.width();                                                                            // 692
                                                                                                                     // 693
		// calculate width minus addition margins                                                                          // 694
		elMinusMargin = this.width.el - (this.options.margin * (this.options.items === 1 ? 0 : this.options.items - 1));   // 695
                                                                                                                     // 696
		// calculate element width and item width                                                                          // 697
		this.width.el = this.width.el + this.options.margin;                                                               // 698
		this.width.item = ((elMinusMargin / this.options.items) + this.options.margin).toFixed(3);                         // 699
                                                                                                                     // 700
		this.dom.$items = this.dom.$stage.find('.owl-item');                                                               // 701
		this.num.items = this.dom.$items.length;                                                                           // 702
                                                                                                                     // 703
		// change to autoWidths                                                                                            // 704
		if (this.options.autoWidth) {                                                                                      // 705
			this.dom.$items.css('width', '');                                                                                 // 706
		}                                                                                                                  // 707
                                                                                                                     // 708
		// Set grid array                                                                                                  // 709
		this.pos.items = [];                                                                                               // 710
		this.num.merged = [];                                                                                              // 711
                                                                                                                     // 712
		// item distances                                                                                                  // 713
		if (this.options.rtl) {                                                                                            // 714
			dist = this.options.center ? -((this.width.el) / 2) : 0;                                                          // 715
		} else {                                                                                                           // 716
			dist = this.options.center ? (this.width.el) / 2 : 0;                                                             // 717
		}                                                                                                                  // 718
                                                                                                                     // 719
		this.width.mergeStage = 0;                                                                                         // 720
                                                                                                                     // 721
		// Calculate items positions                                                                                       // 722
		for (i = 0; i < this.num.items; i++) {                                                                             // 723
                                                                                                                     // 724
			// check merged items                                                                                             // 725
                                                                                                                     // 726
			if (this.options.merge) {                                                                                         // 727
				mergeNumber = this.dom.$items.eq(i).find('[data-merge]').attr('data-merge') || 1;                                // 728
				if (this.options.mergeFit && mergeNumber > this.options.items) {                                                 // 729
					mergeNumber = this.options.items;                                                                               // 730
				}                                                                                                                // 731
				this.num.merged.push(parseInt(mergeNumber));                                                                     // 732
				this.width.mergeStage += this.width.item * this.num.merged[i];                                                   // 733
			} else {                                                                                                          // 734
				this.num.merged.push(1);                                                                                         // 735
			}                                                                                                                 // 736
                                                                                                                     // 737
			iWidth = this.width.item * this.num.merged[i];                                                                    // 738
                                                                                                                     // 739
			// autoWidth item size                                                                                            // 740
			if (this.options.autoWidth) {                                                                                     // 741
				iWidth = this.dom.$items.eq(i).width() + this.options.margin;                                                    // 742
				if (this.options.rtl) {                                                                                          // 743
					this.dom.$items[i].style.marginLeft = this.options.margin + 'px';                                               // 744
				} else {                                                                                                         // 745
					this.dom.$items[i].style.marginRight = this.options.margin + 'px';                                              // 746
				}                                                                                                                // 747
                                                                                                                     // 748
			}                                                                                                                 // 749
			// push item position into array                                                                                  // 750
			this.pos.items.push(dist);                                                                                        // 751
                                                                                                                     // 752
			// update item data                                                                                               // 753
			this.dom.$items.eq(i).data('owl-item').posLeft = posLeft;                                                         // 754
			this.dom.$items.eq(i).data('owl-item').width = iWidth;                                                            // 755
                                                                                                                     // 756
			// dist starts from middle of stage if center                                                                     // 757
			// posLeft always starts from 0                                                                                   // 758
			if (this.options.rtl) {                                                                                           // 759
				dist += iWidth;                                                                                                  // 760
				posLeft += iWidth;                                                                                               // 761
			} else {                                                                                                          // 762
				dist -= iWidth;                                                                                                  // 763
				posLeft -= iWidth;                                                                                               // 764
			}                                                                                                                 // 765
                                                                                                                     // 766
			fullWidth -= Math.abs(iWidth);                                                                                    // 767
                                                                                                                     // 768
			// update position if center                                                                                      // 769
			if (this.options.center) {                                                                                        // 770
				this.pos.items[i] = !this.options.rtl ? this.pos.items[i] - (iWidth / 2) : this.pos.items[i]                     // 771
					+ (iWidth / 2);                                                                                                 // 772
			}                                                                                                                 // 773
		}                                                                                                                  // 774
                                                                                                                     // 775
		if (this.options.autoWidth) {                                                                                      // 776
			this.width.stage = this.options.center ? Math.abs(fullWidth) : Math.abs(dist);                                    // 777
		} else {                                                                                                           // 778
			this.width.stage = Math.abs(fullWidth);                                                                           // 779
		}                                                                                                                  // 780
                                                                                                                     // 781
		// update indexAbs on all items                                                                                    // 782
		allItems = this.num.oItems + this.num.cItems;                                                                      // 783
                                                                                                                     // 784
		for (j = 0; j < allItems; j++) {                                                                                   // 785
			this.dom.$items.eq(j).data('owl-item').indexAbs = j;                                                              // 786
		}                                                                                                                  // 787
                                                                                                                     // 788
		// Set Min and Max                                                                                                 // 789
		this.setMinMax();                                                                                                  // 790
                                                                                                                     // 791
		// Recalculate grid                                                                                                // 792
		this.setSizes();                                                                                                   // 793
	};                                                                                                                  // 794
                                                                                                                     // 795
	/**                                                                                                                 // 796
	 * Updates original items boundaries.                                                                               // 797
	 * @protected                                                                                                       // 798
	 */                                                                                                                 // 799
	Owl.prototype.setMinMax = function() {                                                                              // 800
                                                                                                                     // 801
		var i, minimum, revert;                                                                                            // 802
                                                                                                                     // 803
		// set Min                                                                                                         // 804
		minimum = this.dom.$oItems.eq(0).data('owl-item').indexAbs;                                                        // 805
		this.pos.min = 0;                                                                                                  // 806
		this.pos.minValue = this.pos.items[minimum];                                                                       // 807
                                                                                                                     // 808
		// set max position                                                                                                // 809
		if (!this.options.loop) {                                                                                          // 810
			this.pos.max = this.num.oItems - 1;                                                                               // 811
		}                                                                                                                  // 812
                                                                                                                     // 813
		if (this.options.loop) {                                                                                           // 814
			this.pos.max = this.num.oItems + this.options.items;                                                              // 815
		}                                                                                                                  // 816
                                                                                                                     // 817
		if (!this.options.loop && !this.options.center) {                                                                  // 818
			this.pos.max = this.num.oItems - this.options.items;                                                              // 819
		}                                                                                                                  // 820
                                                                                                                     // 821
		if (this.options.loop && this.options.center) {                                                                    // 822
			this.pos.max = this.num.oItems + this.options.items;                                                              // 823
		}                                                                                                                  // 824
                                                                                                                     // 825
		// set max value                                                                                                   // 826
		this.pos.maxValue = this.pos.items[this.pos.max];                                                                  // 827
                                                                                                                     // 828
		// Max for autoWidth content                                                                                       // 829
		if ((!this.options.loop && !this.options.center && this.options.autoWidth)                                         // 830
			|| (this.options.merge && !this.options.center)) {                                                                // 831
			revert = this.options.rtl ? 1 : -1;                                                                               // 832
			for (i = 0; i < this.pos.items.length; i++) {                                                                     // 833
				if ((this.pos.items[i] * revert) < this.width.stage - this.width.el) {                                           // 834
					this.pos.max = i + 1;                                                                                           // 835
				}                                                                                                                // 836
			}                                                                                                                 // 837
			this.pos.maxValue = this.options.rtl ? this.width.stage - this.width.el                                           // 838
				: -(this.width.stage - this.width.el);                                                                           // 839
			this.pos.items[this.pos.max] = this.pos.maxValue;                                                                 // 840
		}                                                                                                                  // 841
                                                                                                                     // 842
		// Set loop boundries                                                                                              // 843
		if (this.options.center) {                                                                                         // 844
			this.pos.loop = this.pos.items[0] - this.pos.items[this.num.oItems];                                              // 845
		} else {                                                                                                           // 846
			this.pos.loop = -this.pos.items[this.num.oItems];                                                                 // 847
		}                                                                                                                  // 848
                                                                                                                     // 849
		// if is less items                                                                                                // 850
		if (this.num.oItems < this.options.items && !this.options.center) {                                                // 851
			this.pos.max = 0;                                                                                                 // 852
			this.pos.maxValue = this.pos.items[0];                                                                            // 853
		}                                                                                                                  // 854
	};                                                                                                                  // 855
                                                                                                                     // 856
	/**                                                                                                                 // 857
	 * Set sizes on elements from `collectData`.                                                                        // 858
	 * @protected                                                                                                       // 859
	 * @todo CRAZY FIX!!! Doublecheck this!                                                                             // 860
	 */                                                                                                                 // 861
	Owl.prototype.setSizes = function() {                                                                               // 862
                                                                                                                     // 863
		// show neighbours                                                                                                 // 864
		if (this.options.stagePadding !== false) {                                                                         // 865
			this.dom.oStage.style.paddingLeft = this.options.stagePadding + 'px';                                             // 866
			this.dom.oStage.style.paddingRight = this.options.stagePadding + 'px';                                            // 867
		}                                                                                                                  // 868
                                                                                                                     // 869
		// if(this.width.stagePrev > this.width.stage){                                                                    // 870
		if (this.options.rtl) {                                                                                            // 871
			window.setTimeout($.proxy(function() {                                                                            // 872
				this.dom.stage.style.width = this.width.stage + 'px';                                                            // 873
			}, this), 0);                                                                                                     // 874
		} else {                                                                                                           // 875
			this.dom.stage.style.width = this.width.stage + 'px';                                                             // 876
		}                                                                                                                  // 877
                                                                                                                     // 878
		for (var i = 0; i < this.num.items; i++) {                                                                         // 879
                                                                                                                     // 880
			// Set items width                                                                                                // 881
			if (!this.options.autoWidth) {                                                                                    // 882
				this.dom.$items[i].style.width = this.width.item - (this.options.margin) + 'px';                                 // 883
			}                                                                                                                 // 884
			// add margin                                                                                                     // 885
			if (this.options.rtl) {                                                                                           // 886
				this.dom.$items[i].style.marginLeft = this.options.margin + 'px';                                                // 887
			} else {                                                                                                          // 888
				this.dom.$items[i].style.marginRight = this.options.margin + 'px';                                               // 889
			}                                                                                                                 // 890
                                                                                                                     // 891
			if (this.num.merged[i] !== 1 && !this.options.autoWidth) {                                                        // 892
				this.dom.$items[i].style.width = (this.width.item * this.num.merged[i]) - (this.options.margin) + 'px';          // 893
			}                                                                                                                 // 894
		}                                                                                                                  // 895
                                                                                                                     // 896
		// save prev stage size                                                                                            // 897
		this.width.stagePrev = this.width.stage;                                                                           // 898
	};                                                                                                                  // 899
                                                                                                                     // 900
	/**                                                                                                                 // 901
	 * Updates all data by calling `refresh`.                                                                           // 902
	 * @protected                                                                                                       // 903
	 */                                                                                                                 // 904
	Owl.prototype.responsive = function() {                                                                             // 905
                                                                                                                     // 906
		if (!this.num.oItems) {                                                                                            // 907
			return false;                                                                                                     // 908
		}                                                                                                                  // 909
		// If El width hasnt change then stop responsive                                                                   // 910
		var elChanged = this.isElWidthChanged();                                                                           // 911
		if (!elChanged) {                                                                                                  // 912
			return false;                                                                                                     // 913
		}                                                                                                                  // 914
                                                                                                                     // 915
		if (this.trigger('resize').isDefaultPrevented()) {                                                                 // 916
			return false;                                                                                                     // 917
		}                                                                                                                  // 918
                                                                                                                     // 919
		this.state.responsive = true;                                                                                      // 920
		this.refresh();                                                                                                    // 921
		this.state.responsive = false;                                                                                     // 922
                                                                                                                     // 923
		this.trigger('resized');                                                                                           // 924
	};                                                                                                                  // 925
                                                                                                                     // 926
	/**                                                                                                                 // 927
	 * Refreshes the carousel primarily for adaptive purposes.                                                          // 928
	 * @public                                                                                                          // 929
	 */                                                                                                                 // 930
	Owl.prototype.refresh = function(init) {                                                                            // 931
                                                                                                                     // 932
		this.trigger('refresh');                                                                                           // 933
                                                                                                                     // 934
		// Update Options for given width                                                                                  // 935
		this.setResponsiveOptions();                                                                                       // 936
                                                                                                                     // 937
		// update info about local content                                                                                 // 938
		this.updateLocalContent();                                                                                         // 939
                                                                                                                     // 940
		// udpate options                                                                                                  // 941
		this.optionsLogic();                                                                                               // 942
                                                                                                                     // 943
		// if no items then stop                                                                                           // 944
		if (this.num.oItems === 0) {                                                                                       // 945
			return false;                                                                                                     // 946
		}                                                                                                                  // 947
                                                                                                                     // 948
		// Hide and Show methods helps here to set a proper widths.                                                        // 949
		// This prevents Scrollbar to be calculated in stage width                                                         // 950
		this.dom.$stage.addClass('owl-refresh');                                                                           // 951
                                                                                                                     // 952
		// Remove clones and generate new ones                                                                             // 953
		this.reClone();                                                                                                    // 954
                                                                                                                     // 955
		// calculate                                                                                                       // 956
		this.calculate();                                                                                                  // 957
                                                                                                                     // 958
		// aaaand show.                                                                                                    // 959
		this.dom.$stage.removeClass('owl-refresh');                                                                        // 960
                                                                                                                     // 961
		if (init) {                                                                                                        // 962
			this.initPosition();                                                                                              // 963
		} else {                                                                                                           // 964
			this.jumpTo(this.pos.current, false); // fix that                                                                 // 965
		}                                                                                                                  // 966
                                                                                                                     // 967
		this.state.orientation = window.orientation;                                                                       // 968
                                                                                                                     // 969
		this.watchVisibility();                                                                                            // 970
                                                                                                                     // 971
		this.trigger('refreshed');                                                                                         // 972
	};                                                                                                                  // 973
                                                                                                                     // 974
	/**                                                                                                                 // 975
	 * Updates information about current state of items (visibile, hidden, active, etc.).                               // 976
	 * @protected                                                                                                       // 977
	 */                                                                                                                 // 978
	Owl.prototype.updateActiveItems = function() {                                                                      // 979
		this.trigger('change', { property: { name: 'items', value: this.dom.$items } });                                   // 980
                                                                                                                     // 981
		var i, j, item, ipos, iwidth, outsideView, foundCurrent;                                                           // 982
                                                                                                                     // 983
		// clear states                                                                                                    // 984
		for (i = 0; i < this.num.items; i++) {                                                                             // 985
			this.dom.$items.eq(i).data('owl-item').active = false;                                                            // 986
			this.dom.$items.eq(i).data('owl-item').current = false;                                                           // 987
			this.dom.$items.eq(i).removeClass(this.options.activeClass).removeClass(this.options.centerClass);                // 988
		}                                                                                                                  // 989
                                                                                                                     // 990
		this.num.active = 0;                                                                                               // 991
		padding = this.options.stagePadding * 2;                                                                           // 992
		stageX = this.pos.stage + padding;                                                                                 // 993
		view = this.options.rtl ? this.width.view : -this.width.view;                                                      // 994
                                                                                                                     // 995
		for (j = 0; j < this.num.items; j++) {                                                                             // 996
                                                                                                                     // 997
			item = this.dom.$items.eq(j);                                                                                     // 998
			ipos = item.data('owl-item').posLeft;                                                                             // 999
			iwidth = item.data('owl-item').width;                                                                             // 1000
			outsideView = this.options.rtl ? ipos - iwidth - padding : ipos - iwidth + padding;                               // 1001
                                                                                                                     // 1002
			if ((this.op(ipos, '<=', stageX) && (this.op(ipos, '>', stageX + view)))                                          // 1003
				|| (this.op(outsideView, '<', stageX) && this.op(outsideView, '>', stageX + view))) {                            // 1004
                                                                                                                     // 1005
				this.num.active++;                                                                                               // 1006
                                                                                                                     // 1007
				if (this.options.freeDrag && !foundCurrent) {                                                                    // 1008
					foundCurrent = true;                                                                                            // 1009
					this.pos.current = item.data('owl-item').index;                                                                 // 1010
					this.pos.currentAbs = item.data('owl-item').indexAbs;                                                           // 1011
				}                                                                                                                // 1012
                                                                                                                     // 1013
				item.data('owl-item').active = true;                                                                             // 1014
				item.data('owl-item').current = true;                                                                            // 1015
				item.addClass(this.options.activeClass);                                                                         // 1016
                                                                                                                     // 1017
				if (!this.options.lazyLoad) {                                                                                    // 1018
					item.data('owl-item').loaded = true;                                                                            // 1019
				}                                                                                                                // 1020
				if (this.options.loop) {                                                                                         // 1021
					this.updateClonedItemsState(item.data('owl-item').index);                                                       // 1022
				}                                                                                                                // 1023
			}                                                                                                                 // 1024
		}                                                                                                                  // 1025
                                                                                                                     // 1026
		if (this.options.center) {                                                                                         // 1027
			this.dom.$items.eq(this.pos.currentAbs).addClass(this.options.centerClass).data('owl-item').center = true;        // 1028
		}                                                                                                                  // 1029
		this.trigger('changed', { property: { name: 'items', value: this.dom.$items } });                                  // 1030
	};                                                                                                                  // 1031
                                                                                                                     // 1032
	/**                                                                                                                 // 1033
	 * Sets current state on sibilings items for center.                                                                // 1034
	 * @protected                                                                                                       // 1035
	 */                                                                                                                 // 1036
	Owl.prototype.updateClonedItemsState = function(activeIndex) {                                                      // 1037
                                                                                                                     // 1038
		// find cloned center                                                                                              // 1039
		var center, $el, i;                                                                                                // 1040
		if (this.options.center) {                                                                                         // 1041
			center = this.dom.$items.eq(this.pos.currentAbs).data('owl-item').index;                                          // 1042
		}                                                                                                                  // 1043
                                                                                                                     // 1044
		for (i = 0; i < this.num.items; i++) {                                                                             // 1045
			$el = this.dom.$items.eq(i);                                                                                      // 1046
			if ($el.data('owl-item').index === activeIndex) {                                                                 // 1047
				$el.data('owl-item').current = true;                                                                             // 1048
				if ($el.data('owl-item').index === center) {                                                                     // 1049
					$el.addClass(this.options.centerClass);                                                                         // 1050
				}                                                                                                                // 1051
			}                                                                                                                 // 1052
		}                                                                                                                  // 1053
	};                                                                                                                  // 1054
                                                                                                                     // 1055
	/**                                                                                                                 // 1056
	 * Save internal event references and add event based functions.                                                    // 1057
	 * @protected                                                                                                       // 1058
	 */                                                                                                                 // 1059
	Owl.prototype.eventsCall = function() {                                                                             // 1060
		// Save events references                                                                                          // 1061
		this.e._onDragStart = $.proxy(function(e) {                                                                        // 1062
			this.onDragStart(e);                                                                                              // 1063
		}, this);                                                                                                          // 1064
		this.e._onDragMove = $.proxy(function(e) {                                                                         // 1065
			this.onDragMove(e);                                                                                               // 1066
		}, this);                                                                                                          // 1067
		this.e._onDragEnd = $.proxy(function(e) {                                                                          // 1068
			this.onDragEnd(e);                                                                                                // 1069
		}, this);                                                                                                          // 1070
		this.e._transitionEnd = $.proxy(function(e) {                                                                      // 1071
			this.transitionEnd(e);                                                                                            // 1072
		}, this);                                                                                                          // 1073
		this.e._resizer = $.proxy(function() {                                                                             // 1074
			this.responsiveTimer();                                                                                           // 1075
		}, this);                                                                                                          // 1076
		this.e._responsiveCall = $.proxy(function() {                                                                      // 1077
			this.responsive();                                                                                                // 1078
		}, this);                                                                                                          // 1079
		this.e._preventClick = $.proxy(function(e) {                                                                       // 1080
			this.preventClick(e);                                                                                             // 1081
		}, this);                                                                                                          // 1082
	};                                                                                                                  // 1083
                                                                                                                     // 1084
	/**                                                                                                                 // 1085
	 * Checks window `resize` event.                                                                                    // 1086
	 * @protected                                                                                                       // 1087
	 */                                                                                                                 // 1088
	Owl.prototype.responsiveTimer = function() {                                                                        // 1089
		if (this.windowWidth() === this.width.prevWindow) {                                                                // 1090
			return false;                                                                                                     // 1091
		}                                                                                                                  // 1092
		window.clearTimeout(this.resizeTimer);                                                                             // 1093
                                                                                                                     // 1094
		this.resizeTimer = window.setTimeout(this.e._responsiveCall, this.options.responsiveRefreshRate);                  // 1095
		this.width.prevWindow = this.windowWidth();                                                                        // 1096
	};                                                                                                                  // 1097
                                                                                                                     // 1098
	/**                                                                                                                 // 1099
	 * Checks for touch/mouse drag options and add necessery event handlers.                                            // 1100
	 * @protected                                                                                                       // 1101
	 */                                                                                                                 // 1102
	Owl.prototype.internalEvents = function() {                                                                         // 1103
		var isTouch = isTouchSupport(),                                                                                    // 1104
			isTouchIE = isTouchSupportIE();                                                                                   // 1105
                                                                                                                     // 1106
		if (isTouch && !isTouchIE) {                                                                                       // 1107
			this.dragType = [ 'touchstart', 'touchmove', 'touchend', 'touchcancel' ];                                         // 1108
		} else if (isTouch && isTouchIE) {                                                                                 // 1109
			this.dragType = [ 'MSPointerDown', 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel' ];                           // 1110
		} else {                                                                                                           // 1111
			this.dragType = [ 'mousedown', 'mousemove', 'mouseup' ];                                                          // 1112
		}                                                                                                                  // 1113
                                                                                                                     // 1114
		if ((isTouch || isTouchIE) && this.options.touchDrag) {                                                            // 1115
			// touch cancel event                                                                                             // 1116
			this.on(document, this.dragType[3], this.e._onDragEnd);                                                           // 1117
                                                                                                                     // 1118
		} else {                                                                                                           // 1119
			// firefox startdrag fix - addeventlistener doesnt work here :/                                                   // 1120
			this.dom.$stage.on('dragstart', function() {                                                                      // 1121
				return false;                                                                                                    // 1122
			});                                                                                                               // 1123
                                                                                                                     // 1124
			if (this.options.mouseDrag) {                                                                                     // 1125
				// disable text select                                                                                           // 1126
				this.dom.stage.onselectstart = function() {                                                                      // 1127
					return false;                                                                                                   // 1128
				};                                                                                                               // 1129
			} else {                                                                                                          // 1130
				// enable text select                                                                                            // 1131
				this.dom.$el.addClass('owl-text-select-on');                                                                     // 1132
			}                                                                                                                 // 1133
		}                                                                                                                  // 1134
                                                                                                                     // 1135
		// Catch transitionEnd event                                                                                       // 1136
		if (this.transitionEndVendor) {                                                                                    // 1137
			this.on(this.dom.stage, this.transitionEndVendor, this.e._transitionEnd, false);                                  // 1138
		}                                                                                                                  // 1139
                                                                                                                     // 1140
		// Responsive                                                                                                      // 1141
		if (this.options.responsive !== false) {                                                                           // 1142
			this.on(window, 'resize', this.e._resizer, false);                                                                // 1143
		}                                                                                                                  // 1144
                                                                                                                     // 1145
		this.dragEvents();                                                                                                 // 1146
	};                                                                                                                  // 1147
                                                                                                                     // 1148
	/**                                                                                                                 // 1149
	 * Triggers event handlers for drag events.                                                                         // 1150
	 * @protected                                                                                                       // 1151
	 */                                                                                                                 // 1152
	Owl.prototype.dragEvents = function() {                                                                             // 1153
                                                                                                                     // 1154
		if (this.options.touchDrag && (this.dragType[0] === 'touchstart' || this.dragType[0] === 'MSPointerDown')) {       // 1155
			this.on(this.dom.stage, this.dragType[0], this.e._onDragStart, false);                                            // 1156
		} else if (this.options.mouseDrag && this.dragType[0] === 'mousedown') {                                           // 1157
			this.on(this.dom.stage, this.dragType[0], this.e._onDragStart, false);                                            // 1158
		} else {                                                                                                           // 1159
			this.off(this.dom.stage, this.dragType[0], this.e._onDragStart);                                                  // 1160
		}                                                                                                                  // 1161
	};                                                                                                                  // 1162
                                                                                                                     // 1163
	/**                                                                                                                 // 1164
	 * Handles touchstart/mousedown event.                                                                              // 1165
	 * @protected                                                                                                       // 1166
	 * @param {Event} event - The event arguments.                                                                      // 1167
	 */                                                                                                                 // 1168
	Owl.prototype.onDragStart = function(event) {                                                                       // 1169
		var ev, isTouchEvent, pageX, pageY, animatedPos;                                                                   // 1170
                                                                                                                     // 1171
		ev = event.originalEvent || event || window.event;                                                                 // 1172
                                                                                                                     // 1173
		// prevent right click                                                                                             // 1174
		if (ev.which === 3) {                                                                                              // 1175
			return false;                                                                                                     // 1176
		}                                                                                                                  // 1177
                                                                                                                     // 1178
		if (this.dragType[0] === 'mousedown') {                                                                            // 1179
			this.dom.$stage.addClass('owl-grab');                                                                             // 1180
		}                                                                                                                  // 1181
                                                                                                                     // 1182
		this.trigger('drag');                                                                                              // 1183
		this.drag.startTime = new Date().getTime();                                                                        // 1184
		this.setSpeed(0);                                                                                                  // 1185
		this.state.isTouch = true;                                                                                         // 1186
		this.state.isScrolling = false;                                                                                    // 1187
		this.state.isSwiping = false;                                                                                      // 1188
		this.drag.distance = 0;                                                                                            // 1189
                                                                                                                     // 1190
		// if is 'touchstart'                                                                                              // 1191
		isTouchEvent = ev.type === 'touchstart';                                                                           // 1192
		pageX = isTouchEvent ? event.targetTouches[0].pageX : (ev.pageX || ev.clientX);                                    // 1193
		pageY = isTouchEvent ? event.targetTouches[0].pageY : (ev.pageY || ev.clientY);                                    // 1194
                                                                                                                     // 1195
		// get stage position left                                                                                         // 1196
		this.drag.offsetX = this.dom.$stage.position().left - this.options.stagePadding;                                   // 1197
		this.drag.offsetY = this.dom.$stage.position().top;                                                                // 1198
                                                                                                                     // 1199
		if (this.options.rtl) {                                                                                            // 1200
			this.drag.offsetX = this.dom.$stage.position().left + this.width.stage - this.width.el                            // 1201
				+ this.options.margin;                                                                                           // 1202
		}                                                                                                                  // 1203
                                                                                                                     // 1204
		// catch position // ie to fix                                                                                     // 1205
		if (this.state.inMotion && this.support3d) {                                                                       // 1206
			animatedPos = this.getTransformProperty();                                                                        // 1207
			this.drag.offsetX = animatedPos;                                                                                  // 1208
			this.animStage(animatedPos);                                                                                      // 1209
		} else if (this.state.inMotion && !this.support3d) {                                                               // 1210
			this.state.inMotion = false;                                                                                      // 1211
			return false;                                                                                                     // 1212
		}                                                                                                                  // 1213
                                                                                                                     // 1214
		this.drag.startX = pageX - this.drag.offsetX;                                                                      // 1215
		this.drag.startY = pageY - this.drag.offsetY;                                                                      // 1216
                                                                                                                     // 1217
		this.drag.start = pageX - this.drag.startX;                                                                        // 1218
		this.drag.targetEl = ev.target || ev.srcElement;                                                                   // 1219
		this.drag.updatedX = this.drag.start;                                                                              // 1220
                                                                                                                     // 1221
		// to do/check                                                                                                     // 1222
		// prevent links and images dragging;                                                                              // 1223
		if (this.drag.targetEl.tagName === "IMG" || this.drag.targetEl.tagName === "A") {                                  // 1224
			this.drag.targetEl.draggable = false;                                                                             // 1225
		}                                                                                                                  // 1226
                                                                                                                     // 1227
		this.on(document, this.dragType[1], this.e._onDragMove, false);                                                    // 1228
		this.on(document, this.dragType[2], this.e._onDragEnd, false);                                                     // 1229
	};                                                                                                                  // 1230
                                                                                                                     // 1231
	/**                                                                                                                 // 1232
	 * Handles the touchmove/mousemove events.                                                                          // 1233
	 * @protected                                                                                                       // 1234
	 * @param {Event} event - The event arguments.                                                                      // 1235
	 */                                                                                                                 // 1236
	Owl.prototype.onDragMove = function(event) {                                                                        // 1237
		var ev, isTouchEvent, pageX, pageY, minValue, maxValue, pull;                                                      // 1238
                                                                                                                     // 1239
		if (!this.state.isTouch) {                                                                                         // 1240
			return;                                                                                                           // 1241
		}                                                                                                                  // 1242
                                                                                                                     // 1243
		if (this.state.isScrolling) {                                                                                      // 1244
			return;                                                                                                           // 1245
		}                                                                                                                  // 1246
                                                                                                                     // 1247
		ev = event.originalEvent || event || window.event;                                                                 // 1248
                                                                                                                     // 1249
		// if is 'touchstart'                                                                                              // 1250
		isTouchEvent = ev.type == 'touchmove';                                                                             // 1251
		pageX = isTouchEvent ? ev.targetTouches[0].pageX : (ev.pageX || ev.clientX);                                       // 1252
		pageY = isTouchEvent ? ev.targetTouches[0].pageY : (ev.pageY || ev.clientY);                                       // 1253
                                                                                                                     // 1254
		// Drag Direction                                                                                                  // 1255
		this.drag.currentX = pageX - this.drag.startX;                                                                     // 1256
		this.drag.currentY = pageY - this.drag.startY;                                                                     // 1257
		this.drag.distance = this.drag.currentX - this.drag.offsetX;                                                       // 1258
                                                                                                                     // 1259
		// Check move direction                                                                                            // 1260
		if (this.drag.distance < 0) {                                                                                      // 1261
			this.state.direction = this.options.rtl ? 'right' : 'left';                                                       // 1262
		} else if (this.drag.distance > 0) {                                                                               // 1263
			this.state.direction = this.options.rtl ? 'left' : 'right';                                                       // 1264
		}                                                                                                                  // 1265
		// Loop                                                                                                            // 1266
		if (this.options.loop) {                                                                                           // 1267
			if (this.op(this.drag.currentX, '>', this.pos.minValue) && this.state.direction === 'right') {                    // 1268
				this.drag.currentX -= this.pos.loop;                                                                             // 1269
			} else if (this.op(this.drag.currentX, '<', this.pos.maxValue) && this.state.direction === 'left') {              // 1270
				this.drag.currentX += this.pos.loop;                                                                             // 1271
			}                                                                                                                 // 1272
		} else {                                                                                                           // 1273
			// pull                                                                                                           // 1274
			minValue = this.options.rtl ? this.pos.maxValue : this.pos.minValue;                                              // 1275
			maxValue = this.options.rtl ? this.pos.minValue : this.pos.maxValue;                                              // 1276
			pull = this.options.pullDrag ? this.drag.distance / 5 : 0;                                                        // 1277
			this.drag.currentX = Math.max(Math.min(this.drag.currentX, minValue + pull), maxValue + pull);                    // 1278
		}                                                                                                                  // 1279
                                                                                                                     // 1280
		// Lock browser if swiping horizontal                                                                              // 1281
                                                                                                                     // 1282
		if ((this.drag.distance > 8 || this.drag.distance < -8)) {                                                         // 1283
			if (ev.preventDefault !== undefined) {                                                                            // 1284
				ev.preventDefault();                                                                                             // 1285
			} else {                                                                                                          // 1286
				ev.returnValue = false;                                                                                          // 1287
			}                                                                                                                 // 1288
			this.state.isSwiping = true;                                                                                      // 1289
		}                                                                                                                  // 1290
                                                                                                                     // 1291
		this.drag.updatedX = this.drag.currentX;                                                                           // 1292
                                                                                                                     // 1293
		// Lock Owl if scrolling                                                                                           // 1294
		if ((this.drag.currentY > 16 || this.drag.currentY < -16) && this.state.isSwiping === false) {                     // 1295
			this.state.isScrolling = true;                                                                                    // 1296
			this.drag.updatedX = this.drag.start;                                                                             // 1297
		}                                                                                                                  // 1298
                                                                                                                     // 1299
		this.animStage(this.drag.updatedX);                                                                                // 1300
	};                                                                                                                  // 1301
                                                                                                                     // 1302
	/**                                                                                                                 // 1303
	 * Handles the touchend/mouseup events.                                                                             // 1304
	 * @protected                                                                                                       // 1305
	 */                                                                                                                 // 1306
	Owl.prototype.onDragEnd = function() {                                                                              // 1307
		var compareTimes, distanceAbs, closest;                                                                            // 1308
                                                                                                                     // 1309
		if (!this.state.isTouch) {                                                                                         // 1310
			return;                                                                                                           // 1311
		}                                                                                                                  // 1312
		if (this.dragType[0] === 'mousedown') {                                                                            // 1313
			this.dom.$stage.removeClass('owl-grab');                                                                          // 1314
		}                                                                                                                  // 1315
                                                                                                                     // 1316
		this.trigger('dragged');                                                                                           // 1317
                                                                                                                     // 1318
		// prevent links and images dragging;                                                                              // 1319
		this.drag.targetEl.removeAttribute("draggable");                                                                   // 1320
                                                                                                                     // 1321
		// remove drag event listeners                                                                                     // 1322
                                                                                                                     // 1323
		this.state.isTouch = false;                                                                                        // 1324
		this.state.isScrolling = false;                                                                                    // 1325
		this.state.isSwiping = false;                                                                                      // 1326
                                                                                                                     // 1327
		// to check                                                                                                        // 1328
		if (this.drag.distance === 0 && this.state.inMotion !== true) {                                                    // 1329
			this.state.inMotion = false;                                                                                      // 1330
			return false;                                                                                                     // 1331
		}                                                                                                                  // 1332
                                                                                                                     // 1333
		// prevent clicks while scrolling                                                                                  // 1334
                                                                                                                     // 1335
		this.drag.endTime = new Date().getTime();                                                                          // 1336
		compareTimes = this.drag.endTime - this.drag.startTime;                                                            // 1337
		distanceAbs = Math.abs(this.drag.distance);                                                                        // 1338
                                                                                                                     // 1339
		// to test                                                                                                         // 1340
		if (distanceAbs > 3 || compareTimes > 300) {                                                                       // 1341
			this.removeClick(this.drag.targetEl);                                                                             // 1342
		}                                                                                                                  // 1343
                                                                                                                     // 1344
		closest = this.closest(this.drag.updatedX);                                                                        // 1345
                                                                                                                     // 1346
		this.setSpeed(this.options.dragEndSpeed, false, true);                                                             // 1347
		this.animStage(this.pos.items[closest]);                                                                           // 1348
                                                                                                                     // 1349
		// if pullDrag is off then fire transitionEnd event manually when stick                                            // 1350
		// to border                                                                                                       // 1351
		if (!this.options.pullDrag && this.drag.updatedX === this.pos.items[closest]) {                                    // 1352
			this.transitionEnd();                                                                                             // 1353
		}                                                                                                                  // 1354
                                                                                                                     // 1355
		this.drag.distance = 0;                                                                                            // 1356
                                                                                                                     // 1357
		this.off(document, this.dragType[1], this.e._onDragMove);                                                          // 1358
		this.off(document, this.dragType[2], this.e._onDragEnd);                                                           // 1359
	};                                                                                                                  // 1360
                                                                                                                     // 1361
	/**                                                                                                                 // 1362
	 * Attaches `preventClick` to disable link while swipping.                                                          // 1363
	 * @protected                                                                                                       // 1364
	 * @param {HTMLElement} [target] - The target of the `click` event.                                                 // 1365
	 */                                                                                                                 // 1366
	Owl.prototype.removeClick = function(target) {                                                                      // 1367
		this.drag.targetEl = target;                                                                                       // 1368
		$(target).on('click.preventClick', this.e._preventClick);                                                          // 1369
		// to make sure click is removed:                                                                                  // 1370
		window.setTimeout(function() {                                                                                     // 1371
			$(target).off('click.preventClick');                                                                              // 1372
		}, 300);                                                                                                           // 1373
	};                                                                                                                  // 1374
                                                                                                                     // 1375
	/**                                                                                                                 // 1376
	 * Suppresses click event.                                                                                          // 1377
	 * @protected                                                                                                       // 1378
	 * @param {Event} ev - The event arguments.                                                                         // 1379
	 */                                                                                                                 // 1380
	Owl.prototype.preventClick = function(ev) {                                                                         // 1381
		if (ev.preventDefault) {                                                                                           // 1382
			ev.preventDefault();                                                                                              // 1383
		} else {                                                                                                           // 1384
			ev.returnValue = false;                                                                                           // 1385
		}                                                                                                                  // 1386
		if (ev.stopPropagation) {                                                                                          // 1387
			ev.stopPropagation();                                                                                             // 1388
		}                                                                                                                  // 1389
		$(ev.target).off('click.preventClick');                                                                            // 1390
	};                                                                                                                  // 1391
                                                                                                                     // 1392
	/**                                                                                                                 // 1393
	 * Catches stage position while animate (only CSS3).                                                                // 1394
	 * @protected                                                                                                       // 1395
	 * @returns                                                                                                         // 1396
	 */                                                                                                                 // 1397
	Owl.prototype.getTransformProperty = function() {                                                                   // 1398
		var transform, matrix3d;                                                                                           // 1399
                                                                                                                     // 1400
		transform = window.getComputedStyle(this.dom.stage, null).getPropertyValue(this.vendorName + 'transform');         // 1401
		// var transform = this.dom.$stage.css(this.vendorName + 'transform')                                              // 1402
		transform = transform.replace(/matrix(3d)?\(|\)/g, '').split(',');                                                 // 1403
		matrix3d = transform.length === 16;                                                                                // 1404
                                                                                                                     // 1405
		return matrix3d !== true ? transform[4] : transform[12];                                                           // 1406
	};                                                                                                                  // 1407
                                                                                                                     // 1408
	/**                                                                                                                 // 1409
	 * Gets closest item index for a coordinate.                                                                        // 1410
	 * @protected                                                                                                       // 1411
	 * @param {Number} x - The coordinate on the x axis in pixel.                                                       // 1412
	 * @return {Number} - The item's index.                                                                             // 1413
	 */                                                                                                                 // 1414
	Owl.prototype.closest = function(x) {                                                                               // 1415
		var newX = 0, pull = 30, i;                                                                                        // 1416
                                                                                                                     // 1417
		if (!this.options.freeDrag) {                                                                                      // 1418
			// Check closest item                                                                                             // 1419
			for (i = 0; i < this.num.items; i++) {                                                                            // 1420
				if (x > this.pos.items[i] - pull && x < this.pos.items[i] + pull) {                                              // 1421
					newX = i;                                                                                                       // 1422
				} else if (this.op(x, '<', this.pos.items[i])                                                                    // 1423
					&& this.op(x, '>', this.pos.items[i + 1 || this.pos.items[i] - this.width.el])) {                               // 1424
					newX = this.state.direction === 'left' ? i + 1 : i;                                                             // 1425
				}                                                                                                                // 1426
			}                                                                                                                 // 1427
		}                                                                                                                  // 1428
		// non loop boundries                                                                                              // 1429
		if (!this.options.loop) {                                                                                          // 1430
			if (this.op(x, '>', this.pos.minValue)) {                                                                         // 1431
				newX = x = this.pos.min;                                                                                         // 1432
			} else if (this.op(x, '<', this.pos.maxValue)) {                                                                  // 1433
				newX = x = this.pos.max;                                                                                         // 1434
			}                                                                                                                 // 1435
		}                                                                                                                  // 1436
                                                                                                                     // 1437
		if (!this.options.freeDrag) {                                                                                      // 1438
			// set positions                                                                                                  // 1439
			this.pos.currentAbs = newX;                                                                                       // 1440
			this.pos.current = this.dom.$items.eq(newX).data('owl-item').index;                                               // 1441
		} else {                                                                                                           // 1442
			return x;                                                                                                         // 1443
		}                                                                                                                  // 1444
                                                                                                                     // 1445
		return newX;                                                                                                       // 1446
	};                                                                                                                  // 1447
                                                                                                                     // 1448
	/**                                                                                                                 // 1449
	 * Animates stage position (both css3/css2).                                                                        // 1450
	 * @protected                                                                                                       // 1451
	 * @param {Number} pos - The curent position in pixels.                                                             // 1452
	 * @param {Boolean} bypassEvent - Wether the animation end event should be triggered or not.                        // 1453
	 */                                                                                                                 // 1454
	Owl.prototype.animStage = function(pos, bypassEvent) {                                                              // 1455
                                                                                                                     // 1456
		if (pos !== this.pos.stage && bypassEvent !== true){                                                               // 1457
			this.trigger('translate');                                                                                        // 1458
			this.state.inMotion = true;                                                                                       // 1459
		}                                                                                                                  // 1460
                                                                                                                     // 1461
		var posX = this.pos.stage = pos, style = this.dom.stage.style;                                                     // 1462
                                                                                                                     // 1463
		if (this.support3d) {                                                                                              // 1464
			translate = 'translate3d(' + posX + 'px' + ',0px, 0px)';                                                          // 1465
			style[this.transformVendor] = translate;                                                                          // 1466
		} else if (this.state.isTouch) {                                                                                   // 1467
			style.left = posX + 'px';                                                                                         // 1468
		} else {                                                                                                           // 1469
			this.dom.$stage.animate({                                                                                         // 1470
				left: posX                                                                                                       // 1471
			}, this.speed.css2speed, this.options.fallbackEasing, $.proxy(function() {                                        // 1472
				if (this.state.inMotion) {                                                                                       // 1473
					this.transitionEnd();                                                                                           // 1474
				}                                                                                                                // 1475
			}, this));                                                                                                        // 1476
		}                                                                                                                  // 1477
                                                                                                                     // 1478
		this.onChange();                                                                                                   // 1479
	};                                                                                                                  // 1480
                                                                                                                     // 1481
	/**                                                                                                                 // 1482
	 * Updates the current position.                                                                                    // 1483
	 * @protected                                                                                                       // 1484
	 * @param {Number} position - The new position.                                                                     // 1485
	 */                                                                                                                 // 1486
	Owl.prototype.updatePosition = function(position) {                                                                 // 1487
		if (this.num.oItems === 0 || position === undefined) {                                                             // 1488
			return false;                                                                                                     // 1489
		}                                                                                                                  // 1490
                                                                                                                     // 1491
		this.pos.prev = this.pos.currentAbs;                                                                               // 1492
                                                                                                                     // 1493
		if (!this.state.revert && !this.options.loop) {                                                                    // 1494
			position = position > this.pos.max ? this.pos.max : (position <= 0 ? 0 : position);                               // 1495
		} else if (!this.state.revert) {                                                                                   // 1496
			position = position >= this.num.oItems ? this.num.oItems - 1 : position;                                          // 1497
		}                                                                                                                  // 1498
                                                                                                                     // 1499
		var event = this.trigger('change', { property: { name: 'position', value: position } });                           // 1500
                                                                                                                     // 1501
		position = event.data ? event.data : position;                                                                     // 1502
                                                                                                                     // 1503
		if (this.state.revert) {                                                                                           // 1504
			this.pos.current = this.dom.$items.eq(position).data('owl-item').index;                                           // 1505
			this.pos.currentAbs = position;                                                                                   // 1506
		} else {                                                                                                           // 1507
			this.pos.current = this.dom.$oItems.eq(position).data('owl-item').index;                                          // 1508
			this.pos.currentAbs = this.dom.$oItems.eq(position).data('owl-item').indexAbs;                                    // 1509
		}                                                                                                                  // 1510
                                                                                                                     // 1511
		this.trigger('changed', { property: { name: 'position', value: position } });                                      // 1512
	};                                                                                                                  // 1513
                                                                                                                     // 1514
	/**                                                                                                                 // 1515
	 * Sets the animation speed.                                                                                        // 1516
	 * @protected                                                                                                       // 1517
	 * @param {Number} speed - The animation speed in milliseconds.                                                     // 1518
	 * @param {Number} [pos] - The next position, used to calculate `smartSpeed`                                        // 1519
	 * @param {Boolean} [drag] - Wether the `smartSpeed` should be disabled or not.                                     // 1520
	 */                                                                                                                 // 1521
	Owl.prototype.setSpeed = function(speed, pos, drag) {                                                               // 1522
		var s = speed, nextPos = pos, diff, style;                                                                         // 1523
                                                                                                                     // 1524
		if ((s === false && s !== 0 && drag !== true) || s === undefined) {                                                // 1525
                                                                                                                     // 1526
			// Double check this                                                                                              // 1527
			// var nextPx = this.pos.items[nextPos];                                                                          // 1528
			// var currPx = this.pos.stage                                                                                    // 1529
			// var diff = Math.abs(nextPx-currPx);                                                                            // 1530
			// var s = diff/1                                                                                                 // 1531
			// if(s>1000){                                                                                                    // 1532
			// s = 1000;                                                                                                      // 1533
			// }                                                                                                              // 1534
                                                                                                                     // 1535
			diff = Math.abs(nextPos - this.pos.prev);                                                                         // 1536
			diff = diff === 0 ? 1 : diff;                                                                                     // 1537
			if (diff > 6) {                                                                                                   // 1538
				diff = 6;                                                                                                        // 1539
			}                                                                                                                 // 1540
			s = diff * this.options.smartSpeed;                                                                               // 1541
		}                                                                                                                  // 1542
                                                                                                                     // 1543
		if (s === false && drag === true) {                                                                                // 1544
			s = this.options.smartSpeed;                                                                                      // 1545
		}                                                                                                                  // 1546
                                                                                                                     // 1547
		if (s === 0) {                                                                                                     // 1548
			s = 0;                                                                                                            // 1549
		}                                                                                                                  // 1550
                                                                                                                     // 1551
		if (this.support3d) {                                                                                              // 1552
			style = this.dom.stage.style;                                                                                     // 1553
			style.webkitTransitionDuration = style.MsTransitionDuration = style.msTransitionDuration = style.MozTransitionDuration = style.OTransitionDuration = style.transitionDuration = (s / 1000)
				+ 's';                                                                                                           // 1555
		} else {                                                                                                           // 1556
			this.speed.css2speed = s;                                                                                         // 1557
		}                                                                                                                  // 1558
		this.speed.current = s;                                                                                            // 1559
		return s;                                                                                                          // 1560
	};                                                                                                                  // 1561
                                                                                                                     // 1562
	/**                                                                                                                 // 1563
	 * Jumps to a specified position without animating.                                                                 // 1564
	 * @protected                                                                                                       // 1565
	 * @param {Number} pos - The position to jump to.                                                                   // 1566
	 * @param {Boolean} bypassEvent - Wether the animation end event shoudl be triggered or not.                        // 1567
	 */                                                                                                                 // 1568
	Owl.prototype.jumpTo = function(pos, bypassEvent) {                                                                 // 1569
		this.updatePosition(pos);                                                                                          // 1570
		this.setSpeed(0);                                                                                                  // 1571
		this.animStage(this.pos.items[this.pos.currentAbs], bypassEvent);                                                  // 1572
	};                                                                                                                  // 1573
                                                                                                                     // 1574
	/**                                                                                                                 // 1575
	 * Slides to the specified item.                                                                                    // 1576
	 * @public                                                                                                          // 1577
	 * @param {Number} position - The position of the item.                                                             // 1578
	 * @param {Number} [speed] - The time in milliseconds for the transition.                                           // 1579
	 */                                                                                                                 // 1580
	Owl.prototype.to = function(position, speed) {                                                                      // 1581
		if (this.options.loop) {                                                                                           // 1582
			var distance = position - this.pos.current,                                                                       // 1583
				revert = this.pos.currentAbs,                                                                                    // 1584
				before = this.pos.currentAbs,                                                                                    // 1585
				after = this.pos.currentAbs + distance,                                                                          // 1586
				direction = before - after < 0 ? true : false;                                                                   // 1587
                                                                                                                     // 1588
			this.state.revert = true;                                                                                         // 1589
                                                                                                                     // 1590
			if (after < this.options.items && direction === false) {                                                          // 1591
				this.state.bypass = true;                                                                                        // 1592
				revert = this.num.items - (this.options.items - before) - this.options.items;                                    // 1593
				this.jumpTo(revert, true);                                                                                       // 1594
			} else if (after >= this.num.items - this.options.items && direction === true) {                                  // 1595
				this.state.bypass = true;                                                                                        // 1596
				revert = before - this.num.oItems;                                                                               // 1597
				this.jumpTo(revert, true);                                                                                       // 1598
			}                                                                                                                 // 1599
			window.clearTimeout(this.e._goToLoop);                                                                            // 1600
			this.e._goToLoop = window.setTimeout($.proxy(function() {                                                         // 1601
				this.state.bypass = false;                                                                                       // 1602
				this.updatePosition(revert + distance);                                                                          // 1603
				this.setSpeed(speed, this.pos.currentAbs);                                                                       // 1604
				this.animStage(this.pos.items[this.pos.currentAbs]);                                                             // 1605
				this.state.revert = false;                                                                                       // 1606
			}, this), 30);                                                                                                    // 1607
		} else {                                                                                                           // 1608
			this.updatePosition(position);                                                                                    // 1609
			this.setSpeed(speed, this.pos.currentAbs);                                                                        // 1610
			this.animStage(this.pos.items[this.pos.currentAbs]);                                                              // 1611
		}                                                                                                                  // 1612
	};                                                                                                                  // 1613
                                                                                                                     // 1614
	/**                                                                                                                 // 1615
	 * Slides to the next item.                                                                                         // 1616
	 * @public                                                                                                          // 1617
	 * @param {Number} [speed=false] - The time in milliseconds for the transition.                                     // 1618
	 */                                                                                                                 // 1619
	Owl.prototype.next = function(speed) {                                                                              // 1620
		speed = speed || false;                                                                                            // 1621
		this.to(this.pos.current + 1, speed);                                                                              // 1622
	};                                                                                                                  // 1623
                                                                                                                     // 1624
	/**                                                                                                                 // 1625
	 * Slides to the previous item.                                                                                     // 1626
	 * @public                                                                                                          // 1627
	 * @param {Number} [speed=false] - The time in milliseconds for the transition.                                     // 1628
	 */                                                                                                                 // 1629
	Owl.prototype.prev = function(speed) {                                                                              // 1630
		speed = speed || false;                                                                                            // 1631
		this.to(this.pos.current - 1, speed);                                                                              // 1632
	};                                                                                                                  // 1633
                                                                                                                     // 1634
	/**                                                                                                                 // 1635
	 * Initializes the current position.                                                                                // 1636
	 * @protected                                                                                                       // 1637
	 */                                                                                                                 // 1638
	Owl.prototype.initPosition = function() {                                                                           // 1639
		if (!this.dom.$oItems) {                                                                                           // 1640
			return false;                                                                                                     // 1641
		}                                                                                                                  // 1642
                                                                                                                     // 1643
		var position = this.options.startPosition,                                                                         // 1644
			event = this.trigger('change', { property: { name: 'position', value: position } });                              // 1645
                                                                                                                     // 1646
		position = event.data || position;                                                                                 // 1647
                                                                                                                     // 1648
		if (typeof position !== 'number' || !this.options.center) {                                                        // 1649
			position = 0;                                                                                                     // 1650
		}                                                                                                                  // 1651
                                                                                                                     // 1652
		this.dom.oStage.scrollLeft = 0;                                                                                    // 1653
		this.jumpTo(position, true);                                                                                       // 1654
                                                                                                                     // 1655
		this.trigger('changed', { property: { name: 'position', value: position } });                                      // 1656
	};                                                                                                                  // 1657
                                                                                                                     // 1658
	/**                                                                                                                 // 1659
	 * Handles the end of an animation.                                                                                 // 1660
	 * @protected                                                                                                       // 1661
	 * @param {Event} event - The event arguments.                                                                      // 1662
	 */                                                                                                                 // 1663
	Owl.prototype.transitionEnd = function(event) {                                                                     // 1664
                                                                                                                     // 1665
		// if css2 animation then event object is undefined                                                                // 1666
		if (event !== undefined) {                                                                                         // 1667
			event.stopPropagation();                                                                                          // 1668
                                                                                                                     // 1669
			// Catch only owl-stage transitionEnd event                                                                       // 1670
			var eventTarget = event.target || event.srcElement || event.originalTarget;                                       // 1671
			if (eventTarget !== this.dom.stage) {                                                                             // 1672
				return false;                                                                                                    // 1673
			}                                                                                                                 // 1674
		}                                                                                                                  // 1675
                                                                                                                     // 1676
		this.state.inMotion = false;                                                                                       // 1677
		this.trigger('translated');                                                                                        // 1678
	};                                                                                                                  // 1679
                                                                                                                     // 1680
	/**                                                                                                                 // 1681
	 * Checks if element width has changed                                                                              // 1682
	 * @protected                                                                                                       // 1683
	 * @returns {Booelan}                                                                                               // 1684
	 */                                                                                                                 // 1685
	Owl.prototype.isElWidthChanged = function() {                                                                       // 1686
		var newElWidth = this.dom.$el.width() - this.options.stagePadding, // to                                           // 1687
		// check                                                                                                           // 1688
		prevElWidth = this.width.el + this.options.margin;                                                                 // 1689
		return newElWidth !== prevElWidth;                                                                                 // 1690
	};                                                                                                                  // 1691
                                                                                                                     // 1692
	/**                                                                                                                 // 1693
	 * Gets `window`/`responsiveBaseElement` width.                                                                     // 1694
	 * @protected                                                                                                       // 1695
	 * @return {Number} - The width in pixel.                                                                           // 1696
	 */                                                                                                                 // 1697
	Owl.prototype.windowWidth = function() {                                                                            // 1698
		if (this.options.responsiveBaseElement !== window) {                                                               // 1699
			this.width.window = $(this.options.responsiveBaseElement).width();                                                // 1700
		} else if (window.innerWidth) {                                                                                    // 1701
			this.width.window = window.innerWidth;                                                                            // 1702
		} else if (document.documentElement && document.documentElement.clientWidth) {                                     // 1703
			this.width.window = document.documentElement.clientWidth;                                                         // 1704
		}                                                                                                                  // 1705
		return this.width.window;                                                                                          // 1706
	};                                                                                                                  // 1707
                                                                                                                     // 1708
	/**                                                                                                                 // 1709
	 * Replaces the current content.                                                                                    // 1710
	 * @public                                                                                                          // 1711
	 * @param {HTMLElement|jQuery|String} content - The new content.                                                    // 1712
	 */                                                                                                                 // 1713
	Owl.prototype.insertContent = function(content) {                                                                   // 1714
		this.dom.$stage.empty();                                                                                           // 1715
		this.fetchContent(content);                                                                                        // 1716
		this.refresh();                                                                                                    // 1717
	};                                                                                                                  // 1718
                                                                                                                     // 1719
	/**                                                                                                                 // 1720
	 * Adds an item.                                                                                                    // 1721
	 * @public                                                                                                          // 1722
	 * @param {HTMLElement|jQuery|String} content - The item content to add.                                            // 1723
	 * @param {Number} [position=0] - The position at which to insert the item.                                         // 1724
	 */                                                                                                                 // 1725
	Owl.prototype.addItem = function(content, position) {                                                               // 1726
		var $item = this.createItemContainer();                                                                            // 1727
                                                                                                                     // 1728
		position = position || 0;                                                                                          // 1729
		// wrap content                                                                                                    // 1730
		this.initializeItemContainer($item, content);                                                                      // 1731
		// if carousel is empty then append item                                                                           // 1732
		if (this.dom.$oItems.length === 0) {                                                                               // 1733
			this.dom.$stage.append($item);                                                                                    // 1734
		} else {                                                                                                           // 1735
			// append item                                                                                                    // 1736
			if (pos !== -1) {                                                                                                 // 1737
				this.dom.$oItems.eq(position).before($item);                                                                     // 1738
			} else {                                                                                                          // 1739
				this.dom.$oItems.eq(position).after($item);                                                                      // 1740
			}                                                                                                                 // 1741
		}                                                                                                                  // 1742
		// update and calculate carousel                                                                                   // 1743
		this.refresh();                                                                                                    // 1744
	};                                                                                                                  // 1745
                                                                                                                     // 1746
	/**                                                                                                                 // 1747
	 * Removes an item.                                                                                                 // 1748
	 * @public                                                                                                          // 1749
	 * @param {Number} pos - The position of the item.                                                                  // 1750
	 */                                                                                                                 // 1751
	Owl.prototype.removeItem = function(pos) {                                                                          // 1752
		this.dom.$oItems.eq(pos).remove();                                                                                 // 1753
		this.refresh();                                                                                                    // 1754
	};                                                                                                                  // 1755
                                                                                                                     // 1756
	/**                                                                                                                 // 1757
	 * Adds triggerable events.                                                                                         // 1758
	 * @protected                                                                                                       // 1759
	 */                                                                                                                 // 1760
	Owl.prototype.addTriggerableEvents = function() {                                                                   // 1761
		var handler = $.proxy(function(callback, event) {                                                                  // 1762
			return $.proxy(function() {                                                                                       // 1763
				this.suppressedEvents[event] = true;                                                                             // 1764
				callback.apply(this, [].slice.call(arguments, 1));                                                               // 1765
				delete this.suppressedEvents[event];                                                                             // 1766
			}, this);                                                                                                         // 1767
		}, this);                                                                                                          // 1768
                                                                                                                     // 1769
		$.each({                                                                                                           // 1770
			'next': this.next,                                                                                                // 1771
			'prev': this.prev,                                                                                                // 1772
			'to': this.to,                                                                                                    // 1773
			'destroy': this.destroy,                                                                                          // 1774
			'refresh': this.refresh,                                                                                          // 1775
			'replace': this.insertContent,                                                                                    // 1776
			'add': this.addItem,                                                                                              // 1777
			'remove': this.removeItem                                                                                         // 1778
		}, $.proxy(function(event, callback) {                                                                             // 1779
			this.dom.$el.on(event + '.owl.carousel', handler(callback, event + '.owl.carousel'));                             // 1780
		}, this));                                                                                                         // 1781
                                                                                                                     // 1782
	};                                                                                                                  // 1783
                                                                                                                     // 1784
	/**                                                                                                                 // 1785
	 * Watches the visibility of the carousel element.                                                                  // 1786
	 * @protected                                                                                                       // 1787
	 */                                                                                                                 // 1788
	Owl.prototype.watchVisibility = function() {                                                                        // 1789
                                                                                                                     // 1790
		// test on zepto                                                                                                   // 1791
		if (!isElVisible(this.dom.el)) {                                                                                   // 1792
			this.dom.$el.addClass('owl-hidden');                                                                              // 1793
			window.clearInterval(this.e._checkVisibile);                                                                      // 1794
			this.e._checkVisibile = window.setInterval($.proxy(checkVisible, this), 500);                                     // 1795
		}                                                                                                                  // 1796
                                                                                                                     // 1797
		function isElVisible(el) {                                                                                         // 1798
			return el.offsetWidth > 0 && el.offsetHeight > 0;                                                                 // 1799
		}                                                                                                                  // 1800
                                                                                                                     // 1801
		function checkVisible() {                                                                                          // 1802
			if (isElVisible(this.dom.el)) {                                                                                   // 1803
				this.dom.$el.removeClass('owl-hidden');                                                                          // 1804
				this.refresh();                                                                                                  // 1805
				window.clearInterval(this.e._checkVisibile);                                                                     // 1806
			}                                                                                                                 // 1807
		}                                                                                                                  // 1808
	};                                                                                                                  // 1809
                                                                                                                     // 1810
	/**                                                                                                                 // 1811
	 * Handles changes of the carousel.                                                                                 // 1812
	 * @proteted                                                                                                        // 1813
	 */                                                                                                                 // 1814
	Owl.prototype.onChange = function() {                                                                               // 1815
		if (this.state.isTouch || this.state.bypass) {                                                                     // 1816
			return;                                                                                                           // 1817
		}                                                                                                                  // 1818
                                                                                                                     // 1819
		this.updateActiveItems();                                                                                          // 1820
		this.storeInfo();                                                                                                  // 1821
	};                                                                                                                  // 1822
                                                                                                                     // 1823
	/**                                                                                                                 // 1824
	 * Store basic information about current states.                                                                    // 1825
	 * @protected                                                                                                       // 1826
	 */                                                                                                                 // 1827
	Owl.prototype.storeInfo = function() {                                                                              // 1828
		this.info = {                                                                                                      // 1829
			items: this.options.items,                                                                                        // 1830
			allItems: this.num.oItems,                                                                                        // 1831
			currentPosition: this.pos.current,                                                                                // 1832
			currentPage: this.pos.currentPage,                                                                                // 1833
			allPages: this.num.allPages,                                                                                      // 1834
			windowWidth: this.width.window,                                                                                   // 1835
			elWidth: this.width.el,                                                                                           // 1836
			breakpoint: this.num.breakpoint                                                                                   // 1837
		};                                                                                                                 // 1838
                                                                                                                     // 1839
		if (typeof this.options.info === 'function') {                                                                     // 1840
			this.options.info.apply(this, [ this.info, this.dom.el ]);                                                        // 1841
		}                                                                                                                  // 1842
	};                                                                                                                  // 1843
                                                                                                                     // 1844
	/**                                                                                                                 // 1845
	 * Preloads images with auto width.                                                                                 // 1846
	 * @protected                                                                                                       // 1847
	 * @todo Still to test                                                                                              // 1848
	 */                                                                                                                 // 1849
	Owl.prototype.preloadAutoWidthImages = function(imgs) {                                                             // 1850
		var loaded, that, $el, img;                                                                                        // 1851
                                                                                                                     // 1852
		loaded = 0;                                                                                                        // 1853
		that = this;                                                                                                       // 1854
		imgs.each(function(i, el) {                                                                                        // 1855
			$el = $(el);                                                                                                      // 1856
			img = new Image();                                                                                                // 1857
                                                                                                                     // 1858
			img.onload = function() {                                                                                         // 1859
				loaded++;                                                                                                        // 1860
				$el.attr('src', img.src);                                                                                        // 1861
				$el.css('opacity', 1);                                                                                           // 1862
				if (loaded >= imgs.length) {                                                                                     // 1863
					that.state.imagesLoaded = true;                                                                                 // 1864
					that.init();                                                                                                    // 1865
				}                                                                                                                // 1866
			};                                                                                                                // 1867
                                                                                                                     // 1868
			img.src = $el.attr('src') || $el.attr('data-src') || $el.attr('data-src-retina');                                 // 1869
		});                                                                                                                // 1870
	};                                                                                                                  // 1871
                                                                                                                     // 1872
	/**                                                                                                                 // 1873
	 * Destroys the carousel.                                                                                           // 1874
	 * @public                                                                                                          // 1875
	 */                                                                                                                 // 1876
	Owl.prototype.destroy = function() {                                                                                // 1877
                                                                                                                     // 1878
		if (this.dom.$el.hasClass(this.options.themeClass)) {                                                              // 1879
			this.dom.$el.removeClass(this.options.themeClass);                                                                // 1880
		}                                                                                                                  // 1881
                                                                                                                     // 1882
		if (this.options.responsive !== false) {                                                                           // 1883
			this.off(window, 'resize', this.e._resizer);                                                                      // 1884
		}                                                                                                                  // 1885
                                                                                                                     // 1886
		if (this.transitionEndVendor) {                                                                                    // 1887
			this.off(this.dom.stage, this.transitionEndVendor, this.e._transitionEnd);                                        // 1888
		}                                                                                                                  // 1889
                                                                                                                     // 1890
		for ( var i in this.plugins) {                                                                                     // 1891
			this.plugins[i].destroy();                                                                                        // 1892
		}                                                                                                                  // 1893
                                                                                                                     // 1894
		if (this.options.mouseDrag || this.options.touchDrag) {                                                            // 1895
			this.off(this.dom.stage, this.dragType[0], this.e._onDragStart);                                                  // 1896
			if (this.options.mouseDrag) {                                                                                     // 1897
				this.off(document, this.dragType[3], this.e._onDragStart);                                                       // 1898
			}                                                                                                                 // 1899
			if (this.options.mouseDrag) {                                                                                     // 1900
				this.dom.$stage.off('dragstart', function() {                                                                    // 1901
					return false;                                                                                                   // 1902
				});                                                                                                              // 1903
				this.dom.stage.onselectstart = function() {                                                                      // 1904
				};                                                                                                               // 1905
			}                                                                                                                 // 1906
		}                                                                                                                  // 1907
                                                                                                                     // 1908
		// Remove event handlers in the ".owl.carousel" namespace                                                          // 1909
		this.dom.$el.off('.owl');                                                                                          // 1910
                                                                                                                     // 1911
		if (this.dom.$cItems !== null) {                                                                                   // 1912
			this.dom.$cItems.remove();                                                                                        // 1913
		}                                                                                                                  // 1914
		this.e = null;                                                                                                     // 1915
		this.dom.$el.data('owlCarousel', null);                                                                            // 1916
		delete this.dom.el.owlCarousel;                                                                                    // 1917
                                                                                                                     // 1918
		this.dom.$stage.unwrap();                                                                                          // 1919
		this.dom.$items.unwrap();                                                                                          // 1920
		this.dom.$items.contents().unwrap();                                                                               // 1921
		this.dom = null;                                                                                                   // 1922
	};                                                                                                                  // 1923
                                                                                                                     // 1924
	/**                                                                                                                 // 1925
	 * Operators to calculate right-to-left and left-to-right.                                                          // 1926
	 * @protected                                                                                                       // 1927
	 * @param {Number} [a] - The left side operand.                                                                     // 1928
	 * @param {String} [o] - The operator.                                                                              // 1929
	 * @param {Number} [b] - The right side operand.                                                                    // 1930
	 */                                                                                                                 // 1931
	Owl.prototype.op = function(a, o, b) {                                                                              // 1932
		var rtl = this.options.rtl;                                                                                        // 1933
		switch (o) {                                                                                                       // 1934
		case '<':                                                                                                          // 1935
			return rtl ? a > b : a < b;                                                                                       // 1936
		case '>':                                                                                                          // 1937
			return rtl ? a < b : a > b;                                                                                       // 1938
		case '>=':                                                                                                         // 1939
			return rtl ? a <= b : a >= b;                                                                                     // 1940
		case '<=':                                                                                                         // 1941
			return rtl ? a >= b : a <= b;                                                                                     // 1942
		default:                                                                                                           // 1943
			break;                                                                                                            // 1944
		}                                                                                                                  // 1945
	};                                                                                                                  // 1946
                                                                                                                     // 1947
	/**                                                                                                                 // 1948
	 * Attaches to an internal event.                                                                                   // 1949
	 * @protected                                                                                                       // 1950
	 * @param {HTMLElement} element - The event source.                                                                 // 1951
	 * @param {String} event - The event name.                                                                          // 1952
	 * @param {Function} listener - The event handler to attach.                                                        // 1953
	 * @param {Boolean} capture - Wether the event should be handled at the capturing phase or not.                     // 1954
	 */                                                                                                                 // 1955
	Owl.prototype.on = function(element, event, listener, capture) {                                                    // 1956
		if (element.addEventListener) {                                                                                    // 1957
			element.addEventListener(event, listener, capture);                                                               // 1958
		} else if (element.attachEvent) {                                                                                  // 1959
			element.attachEvent('on' + event, listener);                                                                      // 1960
		}                                                                                                                  // 1961
	};                                                                                                                  // 1962
                                                                                                                     // 1963
	/**                                                                                                                 // 1964
	 * Detaches from an internal event.                                                                                 // 1965
	 * @protected                                                                                                       // 1966
	 * @param {HTMLElement} element - The event source.                                                                 // 1967
	 * @param {String} event - The event name.                                                                          // 1968
	 * @param {Function} listener - The attached event handler to detach.                                               // 1969
	 * @param {Boolean} capture - Wether the attached event handler was registered as a capturing listener or not.      // 1970
	 */                                                                                                                 // 1971
	Owl.prototype.off = function(element, event, listener, capture) {                                                   // 1972
		if (element.removeEventListener) {                                                                                 // 1973
			element.removeEventListener(event, listener, capture);                                                            // 1974
		} else if (element.detachEvent) {                                                                                  // 1975
			element.detachEvent('on' + event, listener);                                                                      // 1976
		}                                                                                                                  // 1977
	};                                                                                                                  // 1978
                                                                                                                     // 1979
	/**                                                                                                                 // 1980
	 * Triggers an public event.                                                                                        // 1981
	 * @protected                                                                                                       // 1982
	 * @param {String} name - The event name.                                                                           // 1983
	 * @param {*} [data=null] - The event data.                                                                         // 1984
	 * @param {String} [namespace=.owl.carousel] - The event namespace.                                                 // 1985
	 * @returns {Event} - The event arguments.                                                                          // 1986
	 */                                                                                                                 // 1987
	Owl.prototype.trigger = function(name, data, namespace) {                                                           // 1988
		var status = {                                                                                                     // 1989
			item: { count: this.num.oItems, index: this.pos.current }                                                         // 1990
		}, handler = $.camelCase(                                                                                          // 1991
			$.grep([ 'on', name, namespace ],                                                                                 // 1992
			function(v) { return v }).join('-').toLowerCase()                                                                 // 1993
		), event = $.Event(                                                                                                // 1994
			[ name, 'owl', namespace || 'carousel' ].join('.').toLowerCase(),                                                 // 1995
			$.extend(status, data)                                                                                            // 1996
		);                                                                                                                 // 1997
                                                                                                                     // 1998
		$.each(this.plugins, function(name, plugin) {                                                                      // 1999
			if (plugin.onTrigger) {                                                                                           // 2000
				plugin.onTrigger(event);                                                                                         // 2001
			}                                                                                                                 // 2002
		});                                                                                                                // 2003
                                                                                                                     // 2004
		if (!this.suppressedEvents[event.type]) {                                                                          // 2005
			this.dom.$el.trigger(event);                                                                                      // 2006
		}                                                                                                                  // 2007
                                                                                                                     // 2008
		if (typeof this.options[handler] === 'function') {                                                                 // 2009
			this.options[handler].apply(this, event);                                                                         // 2010
		}                                                                                                                  // 2011
                                                                                                                     // 2012
		return event;                                                                                                      // 2013
	};                                                                                                                  // 2014
                                                                                                                     // 2015
	/**                                                                                                                 // 2016
	 * Checks the availability of some browser features.                                                                // 2017
	 * @protected                                                                                                       // 2018
	 */                                                                                                                 // 2019
	Owl.prototype.browserSupport = function() {                                                                         // 2020
		this.support3d = isPerspective();                                                                                  // 2021
                                                                                                                     // 2022
		if (this.support3d) {                                                                                              // 2023
			this.transformVendor = isTransform();                                                                             // 2024
                                                                                                                     // 2025
			// take transitionend event name by detecting transition                                                          // 2026
			var endVendors = [ 'transitionend', 'webkitTransitionEnd', 'transitionend', 'oTransitionEnd' ];                   // 2027
			this.transitionEndVendor = endVendors[isTransition()];                                                            // 2028
                                                                                                                     // 2029
			// take vendor name from transform name                                                                           // 2030
			this.vendorName = this.transformVendor.replace(/Transform/i, '');                                                 // 2031
			this.vendorName = this.vendorName !== '' ? '-' + this.vendorName.toLowerCase() + '-' : '';                        // 2032
		}                                                                                                                  // 2033
                                                                                                                     // 2034
		this.state.orientation = window.orientation;                                                                       // 2035
	};                                                                                                                  // 2036
                                                                                                                     // 2037
	/**                                                                                                                 // 2038
	 * Checks for CSS support.                                                                                          // 2039
	 * @private                                                                                                         // 2040
	 * @param {Array} array - The CSS properties to check for.                                                          // 2041
	 * @returns {Array} - Contains the supported CSS property name and its index or `false`.                            // 2042
	 */                                                                                                                 // 2043
	function isStyleSupported(array) {                                                                                  // 2044
		var p, s, fake = document.createElement('div'), list = array;                                                      // 2045
		for (p in list) {                                                                                                  // 2046
			s = list[p];                                                                                                      // 2047
			if (typeof fake.style[s] !== 'undefined') {                                                                       // 2048
				fake = null;                                                                                                     // 2049
				return [ s, p ];                                                                                                 // 2050
			}                                                                                                                 // 2051
		}                                                                                                                  // 2052
		return [ false ];                                                                                                  // 2053
	}                                                                                                                   // 2054
                                                                                                                     // 2055
	/**                                                                                                                 // 2056
	 * Checks for CSS transition support.                                                                               // 2057
	 * @private                                                                                                         // 2058
	 * @todo Realy bad design                                                                                           // 2059
	 * @returns {Number}                                                                                                // 2060
	 */                                                                                                                 // 2061
	function isTransition() {                                                                                           // 2062
		return isStyleSupported([ 'transition', 'WebkitTransition', 'MozTransition', 'OTransition' ])[1];                  // 2063
	}                                                                                                                   // 2064
                                                                                                                     // 2065
	/**                                                                                                                 // 2066
	 * Checks for CSS transform support.                                                                                // 2067
	 * @private                                                                                                         // 2068
	 * @returns {String} The supported property name or false.                                                          // 2069
	 */                                                                                                                 // 2070
	function isTransform() {                                                                                            // 2071
		return isStyleSupported([ 'transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform' ])[0];       // 2072
	}                                                                                                                   // 2073
                                                                                                                     // 2074
	/**                                                                                                                 // 2075
	 * Checks for CSS perspective support.                                                                              // 2076
	 * @private                                                                                                         // 2077
	 * @returns {String} The supported property name or false.                                                          // 2078
	 */                                                                                                                 // 2079
	function isPerspective() {                                                                                          // 2080
		return isStyleSupported([ 'perspective', 'webkitPerspective', 'MozPerspective', 'OPerspective', 'MsPerspective' ])[0];
	}                                                                                                                   // 2082
                                                                                                                     // 2083
	/**                                                                                                                 // 2084
	 * Checks wether touch is supported or not.                                                                         // 2085
	 * @private                                                                                                         // 2086
	 * @returns {Boolean}                                                                                               // 2087
	 */                                                                                                                 // 2088
	function isTouchSupport() {                                                                                         // 2089
		return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);                                                 // 2090
	}                                                                                                                   // 2091
                                                                                                                     // 2092
	/**                                                                                                                 // 2093
	 * Checks wether touch is supported or not for IE.                                                                  // 2094
	 * @private                                                                                                         // 2095
	 * @returns {Boolean}                                                                                               // 2096
	 */                                                                                                                 // 2097
	function isTouchSupportIE() {                                                                                       // 2098
		return window.navigator.msPointerEnabled;                                                                          // 2099
	}                                                                                                                   // 2100
                                                                                                                     // 2101
	/**                                                                                                                 // 2102
	 * The jQuery Plugin for the Owl Carousel                                                                           // 2103
	 * @public                                                                                                          // 2104
	 */                                                                                                                 // 2105
	$.fn.owlCarousel = function(options) {                                                                              // 2106
		return this.each(function() {                                                                                      // 2107
			if (!$(this).data('owlCarousel')) {                                                                               // 2108
				$(this).data('owlCarousel', new Owl(this, options));                                                             // 2109
			}                                                                                                                 // 2110
		});                                                                                                                // 2111
	};                                                                                                                  // 2112
                                                                                                                     // 2113
	/**                                                                                                                 // 2114
	 * The constructor for the jQuery Plugin                                                                            // 2115
	 * @public                                                                                                          // 2116
	 */                                                                                                                 // 2117
	$.fn.owlCarousel.Constructor = Owl;                                                                                 // 2118
                                                                                                                     // 2119
})(window.Zepto || window.jQuery, window, document);                                                                 // 2120
                                                                                                                     // 2121
/**                                                                                                                  // 2122
 * LazyLoad Plugin                                                                                                   // 2123
 * @version 2.0.0                                                                                                    // 2124
 * @author Bartosz Wojciechowski                                                                                     // 2125
 * @license The MIT License (MIT)                                                                                    // 2126
 */                                                                                                                  // 2127
;(function($, window, document, undefined) {                                                                         // 2128
                                                                                                                     // 2129
	/**                                                                                                                 // 2130
	 * Creates the lazy load plugin.                                                                                    // 2131
	 * @class The Lazy Load Plugin                                                                                      // 2132
	 * @param {Owl} scope - The Owl Carousel                                                                            // 2133
	 */                                                                                                                 // 2134
	LazyLoad = function(scope) {                                                                                        // 2135
		this.owl = scope;                                                                                                  // 2136
		this.owl.options = $.extend({}, LazyLoad.Defaults, this.owl.options);                                              // 2137
                                                                                                                     // 2138
		if (!this.owl.options.lazyLoad) {                                                                                  // 2139
			return;                                                                                                           // 2140
		}                                                                                                                  // 2141
                                                                                                                     // 2142
		this.handlers = {                                                                                                  // 2143
			'changed.owl.carousel': $.proxy(function(e) {                                                                     // 2144
				if (e.property.name == 'items' && e.property.value && !e.property.value.is(':empty')) {                          // 2145
					this.check();                                                                                                   // 2146
				}                                                                                                                // 2147
			}, this)                                                                                                          // 2148
		};                                                                                                                 // 2149
                                                                                                                     // 2150
		this.owl.dom.$el.on(this.handlers);                                                                                // 2151
	};                                                                                                                  // 2152
                                                                                                                     // 2153
	/**                                                                                                                 // 2154
	 * Default options.                                                                                                 // 2155
	 * @public                                                                                                          // 2156
	 */                                                                                                                 // 2157
	LazyLoad.Defaults = {                                                                                               // 2158
		lazyLoad: false                                                                                                    // 2159
	};                                                                                                                  // 2160
                                                                                                                     // 2161
	/**                                                                                                                 // 2162
	 * Checks all items and if necessary, calls `preload`.                                                              // 2163
	 * @protected                                                                                                       // 2164
	 */                                                                                                                 // 2165
	LazyLoad.prototype.check = function() {                                                                             // 2166
		var attr = window.devicePixelRatio > 1 ? 'data-src-retina' : 'data-src',                                           // 2167
			src, img, i, $item;                                                                                               // 2168
                                                                                                                     // 2169
		for (i = 0; i < this.owl.num.items; i++) {                                                                         // 2170
			$item = this.owl.dom.$items.eq(i);                                                                                // 2171
                                                                                                                     // 2172
			if ($item.data('owl-item').current === true && $item.data('owl-item').loaded === false) {                         // 2173
				img = $item.find('.owl-lazy');                                                                                   // 2174
				src = img.attr(attr);                                                                                            // 2175
				src = src || img.attr('data-src');                                                                               // 2176
				if (src) {                                                                                                       // 2177
					img.css('opacity', '0');                                                                                        // 2178
					this.preload(img, $item);                                                                                       // 2179
				}                                                                                                                // 2180
			}                                                                                                                 // 2181
		}                                                                                                                  // 2182
	};                                                                                                                  // 2183
                                                                                                                     // 2184
	/**                                                                                                                 // 2185
	 * Preloads the images of an item.                                                                                  // 2186
	 * @protected                                                                                                       // 2187
	 * @param {jQuery} images - The images to load.                                                                     // 2188
	 * @param {jQuery} $item - The item for which the images are loaded.                                                // 2189
	 */                                                                                                                 // 2190
	LazyLoad.prototype.preload = function(images, $item) {                                                              // 2191
		var $el, img, srcType;                                                                                             // 2192
                                                                                                                     // 2193
		images.each($.proxy(function(i, el) {                                                                              // 2194
                                                                                                                     // 2195
			this.owl.trigger('load', null, 'lazy');                                                                           // 2196
                                                                                                                     // 2197
			$el = $(el);                                                                                                      // 2198
			img = new Image();                                                                                                // 2199
			srcType = window.devicePixelRatio > 1 ? $el.attr('data-src-retina') : $el.attr('data-src');                       // 2200
			srcType = srcType || $el.attr('data-src');                                                                        // 2201
                                                                                                                     // 2202
			img.onload = $.proxy(function() {                                                                                 // 2203
				$item.data('owl-item').loaded = true;                                                                            // 2204
				if ($el.is('img')) {                                                                                             // 2205
					$el.attr('src', img.src);                                                                                       // 2206
				} else {                                                                                                         // 2207
					$el.css('background-image', 'url(' + img.src + ')');                                                            // 2208
				}                                                                                                                // 2209
                                                                                                                     // 2210
				$el.css('opacity', 1);                                                                                           // 2211
				this.owl.trigger('loaded', null, 'lazy');                                                                        // 2212
			}, this);                                                                                                         // 2213
			img.src = srcType;                                                                                                // 2214
		}, this));                                                                                                         // 2215
	};                                                                                                                  // 2216
                                                                                                                     // 2217
	/**                                                                                                                 // 2218
	 * Destroys the plugin.                                                                                             // 2219
	 * @public                                                                                                          // 2220
	 */                                                                                                                 // 2221
	LazyLoad.prototype.destroy = function() {                                                                           // 2222
		var handler, property;                                                                                             // 2223
                                                                                                                     // 2224
		for (handler in this.handlers) {                                                                                   // 2225
			this.owl.dom.$el.off(handler, this.handlers[handler]);                                                            // 2226
		}                                                                                                                  // 2227
		for (property in Object.getOwnPropertyNames(this)) {                                                               // 2228
			typeof this[property] != 'function' && (this[property] = null);                                                   // 2229
		}                                                                                                                  // 2230
	};                                                                                                                  // 2231
                                                                                                                     // 2232
	$.fn.owlCarousel.Constructor.Plugins.lazyLoad = LazyLoad;                                                           // 2233
                                                                                                                     // 2234
})(window.Zepto || window.jQuery, window, document);                                                                 // 2235
                                                                                                                     // 2236
/**                                                                                                                  // 2237
 * AutoHeight Plugin                                                                                                 // 2238
 * @version 2.0.0                                                                                                    // 2239
 * @author Bartosz Wojciechowski                                                                                     // 2240
 * @license The MIT License (MIT)                                                                                    // 2241
 */                                                                                                                  // 2242
;(function($, window, document, undefined) {                                                                         // 2243
                                                                                                                     // 2244
	/**                                                                                                                 // 2245
	 * Creates the auto height plugin.                                                                                  // 2246
	 * @class The Auto Height Plugin                                                                                    // 2247
	 * @param {Owl} scope - The Owl Carousel                                                                            // 2248
	 */                                                                                                                 // 2249
	AutoHeight = function(scope) {                                                                                      // 2250
		this.owl = scope;                                                                                                  // 2251
		this.owl.options = $.extend({}, AutoHeight.Defaults, this.owl.options);                                            // 2252
                                                                                                                     // 2253
		this.handlers = {                                                                                                  // 2254
			'refreshed.owl.carousel changed.owl.carousel': $.proxy(function() {                                               // 2255
				if (this.owl.options.autoHeight) {                                                                               // 2256
					this.setHeight();                                                                                               // 2257
				}                                                                                                                // 2258
			}, this)                                                                                                          // 2259
		};                                                                                                                 // 2260
                                                                                                                     // 2261
		this.owl.dom.$el.on(this.handlers);                                                                                // 2262
	};                                                                                                                  // 2263
                                                                                                                     // 2264
	/**                                                                                                                 // 2265
	 * Default options.                                                                                                 // 2266
	 * @public                                                                                                          // 2267
	 */                                                                                                                 // 2268
	AutoHeight.Defaults = {                                                                                             // 2269
		autoHeight: false,                                                                                                 // 2270
		autoHeightClass: 'owl-height'                                                                                      // 2271
	};                                                                                                                  // 2272
                                                                                                                     // 2273
	/**                                                                                                                 // 2274
	 *                                                                                                                  // 2275
	 * @param {Boolean} callback - Whether                                                                              // 2276
	 * @returns {Boolean}                                                                                               // 2277
	 */                                                                                                                 // 2278
	AutoHeight.prototype.setHeight = function() {                                                                       // 2279
		var loaded = this.owl.dom.$items.eq(this.owl.pos.currentAbs),                                                      // 2280
			stage = this.owl.dom.$oStage,                                                                                     // 2281
			iterations = 0,                                                                                                   // 2282
			isLoaded;                                                                                                         // 2283
                                                                                                                     // 2284
		if (!this.owl.dom.$oStage.hasClass(this.owl.options.autoHeightClass)) {                                            // 2285
			this.owl.dom.$oStage.addClass(this.owl.options.autoHeightClass);                                                  // 2286
		}                                                                                                                  // 2287
                                                                                                                     // 2288
		isLoaded = window.setInterval(function() {                                                                         // 2289
			iterations += 1;                                                                                                  // 2290
			if (loaded.data('owl-item').loaded) {                                                                             // 2291
				stage.height(loaded.height() + 'px');                                                                            // 2292
				clearInterval(isLoaded);                                                                                         // 2293
			} else if (iterations === 500) {                                                                                  // 2294
				clearInterval(isLoaded);                                                                                         // 2295
			}                                                                                                                 // 2296
		}, 100);                                                                                                           // 2297
                                                                                                                     // 2298
	};                                                                                                                  // 2299
                                                                                                                     // 2300
	AutoHeight.prototype.destroy = function() {                                                                         // 2301
		var handler, property;                                                                                             // 2302
                                                                                                                     // 2303
		for (handler in this.handlers) {                                                                                   // 2304
			this.owl.dom.$el.off(handler, this.handlers[handler]);                                                            // 2305
		}                                                                                                                  // 2306
		for (property in Object.getOwnPropertyNames(this)) {                                                               // 2307
			typeof this[property] != 'function' && (this[property] = null);                                                   // 2308
		}                                                                                                                  // 2309
	};                                                                                                                  // 2310
                                                                                                                     // 2311
	$.fn.owlCarousel.Constructor.Plugins.autoHeight = AutoHeight;                                                       // 2312
                                                                                                                     // 2313
})(window.Zepto || window.jQuery, window, document);                                                                 // 2314
                                                                                                                     // 2315
/**                                                                                                                  // 2316
 * Video Plugin                                                                                                      // 2317
 * @version 2.0.0                                                                                                    // 2318
 * @author Bartosz Wojciechowski                                                                                     // 2319
 * @license The MIT License (MIT)                                                                                    // 2320
 */                                                                                                                  // 2321
;(function($, window, document, undefined) {                                                                         // 2322
                                                                                                                     // 2323
	/**                                                                                                                 // 2324
	 * Creates the video plugin.                                                                                        // 2325
	 * @class The Video Plugin                                                                                          // 2326
	 * @param {Owl} scope - The Owl Carousel                                                                            // 2327
	 */                                                                                                                 // 2328
	Video = function(scope) {                                                                                           // 2329
		this.owl = scope;                                                                                                  // 2330
		this.owl.options = $.extend({}, Video.Defaults, this.owl.options);                                                 // 2331
                                                                                                                     // 2332
		this.handlers = {                                                                                                  // 2333
			'resize.owl.carousel': $.proxy(function(e) {                                                                      // 2334
				if (this.owl.options.video && !this.isInFullScreen()) {                                                          // 2335
					e.preventDefault();                                                                                             // 2336
				}                                                                                                                // 2337
			}, this),                                                                                                         // 2338
			'refresh.owl.carousel changed.owl.carousel': $.proxy(function(e) {                                                // 2339
				if (this.owl.state.videoPlay) {                                                                                  // 2340
					this.stopVideo();                                                                                               // 2341
				}                                                                                                                // 2342
			}, this),                                                                                                         // 2343
			'refresh.owl.carousel refreshed.owl.carousel': $.proxy(function(e) {                                              // 2344
				if (!this.owl.options.video) {                                                                                   // 2345
					return false;                                                                                                   // 2346
				}                                                                                                                // 2347
				this.refreshing = e.type == 'refresh';                                                                           // 2348
			}, this),                                                                                                         // 2349
			'changed.owl.carousel': $.proxy(function(e) {                                                                     // 2350
				if (this.refreshing && e.property.name == 'items' && e.property.value && !e.property.value.is(':empty')) {       // 2351
					this.checkVideoLinks();                                                                                         // 2352
				}                                                                                                                // 2353
			}, this)                                                                                                          // 2354
		};                                                                                                                 // 2355
                                                                                                                     // 2356
		this.owl.dom.$el.on(this.handlers);                                                                                // 2357
                                                                                                                     // 2358
		this.owl.dom.$el.on('click.owl.video', '.owl-video-play-icon', $.proxy(function(e) {                               // 2359
			this.playVideo(e);                                                                                                // 2360
		}, this));                                                                                                         // 2361
	};                                                                                                                  // 2362
                                                                                                                     // 2363
	/**                                                                                                                 // 2364
	 * Default options.                                                                                                 // 2365
	 * @public                                                                                                          // 2366
	 */                                                                                                                 // 2367
	Video.Defaults = {                                                                                                  // 2368
		video: false,                                                                                                      // 2369
		videoHeight: false,                                                                                                // 2370
		videoWidth: false                                                                                                  // 2371
	};                                                                                                                  // 2372
                                                                                                                     // 2373
	/**                                                                                                                 // 2374
	 * Checks if for any videos links exists.                                                                           // 2375
	 * @protected                                                                                                       // 2376
	 */                                                                                                                 // 2377
	Video.prototype.checkVideoLinks = function() {                                                                      // 2378
		var videoEl, item, i;                                                                                              // 2379
                                                                                                                     // 2380
		for (i = 0; i < this.owl.num.items; i++) {                                                                         // 2381
                                                                                                                     // 2382
			item = this.owl.dom.$items.eq(i);                                                                                 // 2383
			if (item.data('owl-item').hasVideo) {                                                                             // 2384
				continue;                                                                                                        // 2385
			}                                                                                                                 // 2386
                                                                                                                     // 2387
			videoEl = item.find('.owl-video');                                                                                // 2388
			if (videoEl.length) {                                                                                             // 2389
				this.owl.state.hasVideos = true;                                                                                 // 2390
				this.owl.dom.$items.eq(i).data('owl-item').hasVideo = true;                                                      // 2391
				videoEl.css('display', 'none');                                                                                  // 2392
				this.getVideoInfo(videoEl, item);                                                                                // 2393
			}                                                                                                                 // 2394
		}                                                                                                                  // 2395
	};                                                                                                                  // 2396
                                                                                                                     // 2397
	/**                                                                                                                 // 2398
	 * Gets the video ID and the type (YouTube/Vimeo only).                                                             // 2399
	 * @protected                                                                                                       // 2400
	 * @param {jQuery} videoEl - The element containing the video data.                                                 // 2401
	 * @param {jQuery} item - The item containing the video.                                                            // 2402
	 */                                                                                                                 // 2403
	Video.prototype.getVideoInfo = function(videoEl, item) {                                                            // 2404
                                                                                                                     // 2405
		var info, type, id, dimensions,                                                                                    // 2406
			vimeoId = videoEl.data('vimeo-id'),                                                                               // 2407
			youTubeId = videoEl.data('youtube-id'),                                                                           // 2408
			width = videoEl.data('width') || this.owl.options.videoWidth,                                                     // 2409
			height = videoEl.data('height') || this.owl.options.videoHeight,                                                  // 2410
			url = videoEl.attr('href');                                                                                       // 2411
                                                                                                                     // 2412
		if (vimeoId) {                                                                                                     // 2413
			type = 'vimeo';                                                                                                   // 2414
			id = vimeoId;                                                                                                     // 2415
		} else if (youTubeId) {                                                                                            // 2416
			type = 'youtube';                                                                                                 // 2417
			id = youTubeId;                                                                                                   // 2418
		} else if (url) {                                                                                                  // 2419
			id = url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);
                                                                                                                     // 2421
			if (id[3].indexOf('youtu') > -1) {                                                                                // 2422
				type = 'youtube';                                                                                                // 2423
			} else if (id[3].indexOf('vimeo') > -1) {                                                                         // 2424
				type = 'vimeo';                                                                                                  // 2425
			}                                                                                                                 // 2426
			id = id[6];                                                                                                       // 2427
		} else {                                                                                                           // 2428
			throw new Error('Missing video link.');                                                                           // 2429
		}                                                                                                                  // 2430
                                                                                                                     // 2431
		item.data('owl-item').videoType = type;                                                                            // 2432
		item.data('owl-item').videoId = id;                                                                                // 2433
		item.data('owl-item').videoWidth = width;                                                                          // 2434
		item.data('owl-item').videoHeight = height;                                                                        // 2435
                                                                                                                     // 2436
		info = {                                                                                                           // 2437
			type: type,                                                                                                       // 2438
			id: id                                                                                                            // 2439
		};                                                                                                                 // 2440
                                                                                                                     // 2441
		// Check dimensions                                                                                                // 2442
		dimensions = width && height ? 'style="width:' + width + 'px;height:' + height + 'px;"' : '';                      // 2443
                                                                                                                     // 2444
		// wrap video content into owl-video-wrapper div                                                                   // 2445
		videoEl.wrap('<div class="owl-video-wrapper"' + dimensions + '></div>');                                           // 2446
                                                                                                                     // 2447
		this.createVideoTn(videoEl, info);                                                                                 // 2448
	};                                                                                                                  // 2449
                                                                                                                     // 2450
	/**                                                                                                                 // 2451
	 * Creates video thumbnail.                                                                                         // 2452
	 * @protected                                                                                                       // 2453
	 * @param {jQuery} videoEl - The element containing the video data.                                                 // 2454
	 * @param {Object} info - The video info object.                                                                    // 2455
	 * @see `getVideoInfo`                                                                                              // 2456
	 */                                                                                                                 // 2457
	Video.prototype.createVideoTn = function(videoEl, info) {                                                           // 2458
                                                                                                                     // 2459
		var tnLink, icon, path,                                                                                            // 2460
			customTn = videoEl.find('img'),                                                                                   // 2461
			srcType = 'src',                                                                                                  // 2462
			lazyClass = '',                                                                                                   // 2463
			that = this.owl;                                                                                                  // 2464
                                                                                                                     // 2465
		if (this.owl.options.lazyLoad) {                                                                                   // 2466
			srcType = 'data-src';                                                                                             // 2467
			lazyClass = 'owl-lazy';                                                                                           // 2468
		}                                                                                                                  // 2469
                                                                                                                     // 2470
		// Custom thumbnail                                                                                                // 2471
                                                                                                                     // 2472
		if (customTn.length) {                                                                                             // 2473
			addThumbnail(customTn.attr(srcType));                                                                             // 2474
			customTn.remove();                                                                                                // 2475
			return false;                                                                                                     // 2476
		}                                                                                                                  // 2477
                                                                                                                     // 2478
		function addThumbnail(tnPath) {                                                                                    // 2479
			icon = '<div class="owl-video-play-icon"></div>';                                                                 // 2480
                                                                                                                     // 2481
			if (that.options.lazyLoad) {                                                                                      // 2482
				tnLink = '<div class="owl-video-tn ' + lazyClass + '" ' + srcType + '="' + tnPath + '"></div>';                  // 2483
			} else {                                                                                                          // 2484
				tnLink = '<div class="owl-video-tn" style="opacity:1;background-image:url(' + tnPath + ')"></div>';              // 2485
			}                                                                                                                 // 2486
			videoEl.after(tnLink);                                                                                            // 2487
			videoEl.after(icon);                                                                                              // 2488
		}                                                                                                                  // 2489
                                                                                                                     // 2490
		if (info.type === 'youtube') {                                                                                     // 2491
			path = "http://img.youtube.com/vi/" + info.id + "/hqdefault.jpg";                                                 // 2492
			addThumbnail(path);                                                                                               // 2493
		} else if (info.type === 'vimeo') {                                                                                // 2494
			$.ajax({                                                                                                          // 2495
				type: 'GET',                                                                                                     // 2496
				url: 'http://vimeo.com/api/v2/video/' + info.id + '.json',                                                       // 2497
				jsonp: 'callback',                                                                                               // 2498
				dataType: 'jsonp',                                                                                               // 2499
				success: function(data) {                                                                                        // 2500
					path = data[0].thumbnail_large;                                                                                 // 2501
					addThumbnail(path);                                                                                             // 2502
					if (that.options.loop) {                                                                                        // 2503
						that.updateActiveItems();                                                                                      // 2504
					}                                                                                                               // 2505
				}                                                                                                                // 2506
			});                                                                                                               // 2507
		}                                                                                                                  // 2508
	};                                                                                                                  // 2509
                                                                                                                     // 2510
	/**                                                                                                                 // 2511
	 * Stops the current video.                                                                                         // 2512
	 * @public                                                                                                          // 2513
	 */                                                                                                                 // 2514
	Video.prototype.stopVideo = function() {                                                                            // 2515
		this.owl.trigger('stop', null, 'video');                                                                           // 2516
		var item = this.owl.dom.$items.eq(this.owl.state.videoPlayIndex);                                                  // 2517
		item.find('.owl-video-frame').remove();                                                                            // 2518
		item.removeClass('owl-video-playing');                                                                             // 2519
		this.owl.state.videoPlay = false;                                                                                  // 2520
	};                                                                                                                  // 2521
                                                                                                                     // 2522
	/**                                                                                                                 // 2523
	 * Starts the current video.                                                                                        // 2524
	 * @public                                                                                                          // 2525
	 * @param {Event} ev - The event arguments.                                                                         // 2526
	 */                                                                                                                 // 2527
	Video.prototype.playVideo = function(ev) {                                                                          // 2528
		this.owl.trigger('play', null, 'video');                                                                           // 2529
                                                                                                                     // 2530
		if (this.owl.state.videoPlay) {                                                                                    // 2531
			this.stopVideo();                                                                                                 // 2532
		}                                                                                                                  // 2533
		var videoLink, videoWrap, videoType,                                                                               // 2534
			target = $(ev.target || ev.srcElement),                                                                           // 2535
			item = target.closest('.' + this.owl.options.itemClass);                                                          // 2536
                                                                                                                     // 2537
		videoType = item.data('owl-item').videoType, id = item.data('owl-item').videoId, width = item                      // 2538
			.data('owl-item').videoWidth                                                                                      // 2539
			|| Math.floor(item.data('owl-item').width - this.owl.options.margin), height = item.data('owl-item').videoHeight  // 2540
			|| this.owl.dom.$stage.height();                                                                                  // 2541
                                                                                                                     // 2542
		if (videoType === 'youtube') {                                                                                     // 2543
			videoLink = "<iframe width=\"" + width + "\" height=\"" + height + "\" src=\"http://www.youtube.com/embed/"       // 2544
				+ id + "?autoplay=1&v=" + id + "\" frameborder=\"0\" allowfullscreen></iframe>";                                 // 2545
		} else if (videoType === 'vimeo') {                                                                                // 2546
			videoLink = '<iframe src="http://player.vimeo.com/video/' + id + '?autoplay=1" width="' + width                   // 2547
				+ '" height="' + height                                                                                          // 2548
				+ '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';                        // 2549
		}                                                                                                                  // 2550
                                                                                                                     // 2551
		item.addClass('owl-video-playing');                                                                                // 2552
		this.owl.state.videoPlay = true;                                                                                   // 2553
		this.owl.state.videoPlayIndex = item.data('owl-item').indexAbs;                                                    // 2554
                                                                                                                     // 2555
		videoWrap = $('<div style="height:' + height + 'px; width:' + width + 'px" class="owl-video-frame">'               // 2556
			+ videoLink + '</div>');                                                                                          // 2557
		target.after(videoWrap);                                                                                           // 2558
	};                                                                                                                  // 2559
                                                                                                                     // 2560
	/**                                                                                                                 // 2561
	 * Checks whether an video is currently in full screen mode or not.                                                 // 2562
	 * @protected                                                                                                       // 2563
	 * @returns {Boolean}                                                                                               // 2564
	 */                                                                                                                 // 2565
	Video.prototype.isInFullScreen = function() {                                                                       // 2566
                                                                                                                     // 2567
		// if Vimeo Fullscreen mode                                                                                        // 2568
		var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement                                // 2569
			|| document.webkitFullscreenElement;                                                                              // 2570
		if (fullscreenElement) {                                                                                           // 2571
			if ($(fullscreenElement.parentNode).hasClass('owl-video-frame')) {                                                // 2572
				this.owl.setSpeed(0);                                                                                            // 2573
				this.owl.state.isFullScreen = true;                                                                              // 2574
			}                                                                                                                 // 2575
		}                                                                                                                  // 2576
                                                                                                                     // 2577
		if (fullscreenElement && this.owl.state.isFullScreen && this.owl.state.videoPlay) {                                // 2578
			return false;                                                                                                     // 2579
		}                                                                                                                  // 2580
                                                                                                                     // 2581
		// Comming back from fullscreen                                                                                    // 2582
		if (this.owl.state.isFullScreen) {                                                                                 // 2583
			this.owl.state.isFullScreen = false;                                                                              // 2584
			return false;                                                                                                     // 2585
		}                                                                                                                  // 2586
                                                                                                                     // 2587
		// check full screen mode and window orientation                                                                   // 2588
		if (this.owl.state.videoPlay) {                                                                                    // 2589
			if (this.owl.state.orientation !== window.orientation) {                                                          // 2590
				this.owl.state.orientation = window.orientation;                                                                 // 2591
				return false;                                                                                                    // 2592
			}                                                                                                                 // 2593
		}                                                                                                                  // 2594
		return true;                                                                                                       // 2595
	};                                                                                                                  // 2596
                                                                                                                     // 2597
	/**                                                                                                                 // 2598
	 * Destroys the plugin.                                                                                             // 2599
	 */                                                                                                                 // 2600
	Video.prototype.destroy = function() {                                                                              // 2601
		var handler, property;                                                                                             // 2602
                                                                                                                     // 2603
		this.owl.dom.$el.off('click.owl.video');                                                                           // 2604
                                                                                                                     // 2605
		for (handler in this.handlers) {                                                                                   // 2606
			this.owl.dom.$el.off(handler, this.handlers[handler]);                                                            // 2607
		}                                                                                                                  // 2608
		for (property in Object.getOwnPropertyNames(this)) {                                                               // 2609
			typeof this[property] != 'function' && (this[property] = null);                                                   // 2610
		}                                                                                                                  // 2611
	};                                                                                                                  // 2612
                                                                                                                     // 2613
	$.fn.owlCarousel.Constructor.Plugins.video = Video;                                                                 // 2614
                                                                                                                     // 2615
})(window.Zepto || window.jQuery, window, document);                                                                 // 2616
                                                                                                                     // 2617
/**                                                                                                                  // 2618
 * Animate Plugin                                                                                                    // 2619
 * @version 2.0.0                                                                                                    // 2620
 * @author Bartosz Wojciechowski                                                                                     // 2621
 * @license The MIT License (MIT)                                                                                    // 2622
 */                                                                                                                  // 2623
;(function($, window, document, undefined) {                                                                         // 2624
                                                                                                                     // 2625
	/**                                                                                                                 // 2626
	 * Creates the animate plugin.                                                                                      // 2627
	 * @class The Navigation Plugin                                                                                     // 2628
	 * @param {Owl} scope - The Owl Carousel                                                                            // 2629
	 */                                                                                                                 // 2630
	Animate = function(scope) {                                                                                         // 2631
		this.owl = scope;                                                                                                  // 2632
		this.owl.options = $.extend({}, Animate.Defaults, this.owl.options);                                               // 2633
		this.swapping = true;                                                                                              // 2634
                                                                                                                     // 2635
		if (!this.owl.options.animateIn && !this.owl.options.animateOut) {                                                 // 2636
			return;                                                                                                           // 2637
		}                                                                                                                  // 2638
                                                                                                                     // 2639
		this.handlers = {                                                                                                  // 2640
			'drag.owl.carousel dragged.owl.carousel translated.owl.carousel': $.proxy(function(e) {                           // 2641
				this.swapping = e.type == 'translated';                                                                          // 2642
			}, this),                                                                                                         // 2643
			'translate.owl.carousel': $.proxy(function(e) {                                                                   // 2644
				if (this.swapping) {                                                                                             // 2645
					this.swap();                                                                                                    // 2646
				}                                                                                                                // 2647
			}, this)                                                                                                          // 2648
		};                                                                                                                 // 2649
                                                                                                                     // 2650
		this.owl.dom.$el.on(this.handlers);                                                                                // 2651
	};                                                                                                                  // 2652
                                                                                                                     // 2653
	/**                                                                                                                 // 2654
	 * Default options.                                                                                                 // 2655
	 * @public                                                                                                          // 2656
	 */                                                                                                                 // 2657
	Animate.Defaults = {                                                                                                // 2658
		animateOut: false,                                                                                                 // 2659
		animateIn: false                                                                                                   // 2660
	};                                                                                                                  // 2661
                                                                                                                     // 2662
	/**                                                                                                                 // 2663
	 * Toggles the animation classes whenever an translations starts.                                                   // 2664
	 * @protected                                                                                                       // 2665
	 * @returns {Boolean|undefined}                                                                                     // 2666
	 */                                                                                                                 // 2667
	Animate.prototype.swap = function() {                                                                               // 2668
                                                                                                                     // 2669
		if (this.owl.options.items !== 1 || !this.owl.support3d) {                                                         // 2670
			return false;                                                                                                     // 2671
		}                                                                                                                  // 2672
                                                                                                                     // 2673
		this.owl.setSpeed(0);                                                                                              // 2674
                                                                                                                     // 2675
		var pos, tIn, tOut, that,                                                                                          // 2676
			prevItem = this.owl.dom.$items.eq(this.owl.pos.prev),                                                             // 2677
			prevPos = Math.abs(prevItem.data('owl-item').width) * this.owl.pos.prev,                                          // 2678
			currentItem = this.owl.dom.$items.eq(this.owl.pos.currentAbs),                                                    // 2679
			currentPos = Math.abs(currentItem.data('owl-item').width) * this.owl.pos.currentAbs;                              // 2680
                                                                                                                     // 2681
		if (this.owl.pos.currentAbs === this.owl.pos.prev) {                                                               // 2682
			return false;                                                                                                     // 2683
		}                                                                                                                  // 2684
                                                                                                                     // 2685
		pos = currentPos - prevPos;                                                                                        // 2686
		tIn = this.owl.options.animateIn;                                                                                  // 2687
		tOut = this.owl.options.animateOut;                                                                                // 2688
		that = this.owl;                                                                                                   // 2689
                                                                                                                     // 2690
		removeStyles = function() {                                                                                        // 2691
			$(this).css({                                                                                                     // 2692
				'left': ''                                                                                                       // 2693
			}).removeClass('animated owl-animated-out owl-animated-in').removeClass(tIn).removeClass(tOut);                   // 2694
                                                                                                                     // 2695
			that.transitionEnd();                                                                                             // 2696
		};                                                                                                                 // 2697
                                                                                                                     // 2698
		if (tOut) {                                                                                                        // 2699
			prevItem.css({                                                                                                    // 2700
				'left': pos + 'px'                                                                                               // 2701
			}).addClass('animated owl-animated-out ' + tOut).one(                                                             // 2702
				'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', removeStyles);                   // 2703
		}                                                                                                                  // 2704
                                                                                                                     // 2705
		if (tIn) {                                                                                                         // 2706
			currentItem.addClass('animated owl-animated-in ' + tIn).one(                                                      // 2707
				'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', removeStyles);                   // 2708
		}                                                                                                                  // 2709
	};                                                                                                                  // 2710
                                                                                                                     // 2711
	/**                                                                                                                 // 2712
	 * Destroys the plugin.                                                                                             // 2713
	 * @public                                                                                                          // 2714
	 */                                                                                                                 // 2715
	Animate.prototype.destroy = function() {                                                                            // 2716
		var handler, property;                                                                                             // 2717
                                                                                                                     // 2718
		for (handler in this.handlers) {                                                                                   // 2719
			this.owl.dom.$el.off(handler, this.handlers[handler]);                                                            // 2720
		}                                                                                                                  // 2721
		for (property in Object.getOwnPropertyNames(this)) {                                                               // 2722
			typeof this[property] != 'function' && (this[property] = null);                                                   // 2723
		}                                                                                                                  // 2724
	};                                                                                                                  // 2725
                                                                                                                     // 2726
	$.fn.owlCarousel.Constructor.Plugins.animate = Animate;                                                             // 2727
                                                                                                                     // 2728
})(window.Zepto || window.jQuery, window, document);                                                                 // 2729
                                                                                                                     // 2730
/**                                                                                                                  // 2731
 * Autoplay Plugin                                                                                                   // 2732
 * @version 2.0.0                                                                                                    // 2733
 * @author Bartosz Wojciechowski                                                                                     // 2734
 * @license The MIT License (MIT)                                                                                    // 2735
 */                                                                                                                  // 2736
;(function($, window, document, undefined) {                                                                         // 2737
                                                                                                                     // 2738
	/**                                                                                                                 // 2739
	 * Creates the autoplay plugin.                                                                                     // 2740
	 * @class The Autoplay Plugin                                                                                       // 2741
	 * @param {Owl} scope - The Owl Carousel                                                                            // 2742
	 */                                                                                                                 // 2743
	Autoplay = function(scope) {                                                                                        // 2744
		this.owl = scope;                                                                                                  // 2745
		this.owl.options = $.extend({}, Autoplay.Defaults, this.owl.options);                                              // 2746
                                                                                                                     // 2747
		this.handlers = {                                                                                                  // 2748
			'translated.owl.carousel refreshed.owl.carousel': $.proxy(function() {                                            // 2749
				this.autoplay();                                                                                                 // 2750
			}, this),                                                                                                         // 2751
			'play.owl.autoplay': $.proxy(function(e, t, s) {                                                                  // 2752
				this.play(t, s);                                                                                                 // 2753
			}, this),                                                                                                         // 2754
			'stop.owl.autoplay': $.proxy(function() {                                                                         // 2755
				this.stop();                                                                                                     // 2756
			}, this),                                                                                                         // 2757
			'mouseover.owl.autoplay': $.proxy(function() {                                                                    // 2758
				if (this.owl.options.autoplayHoverPause) {                                                                       // 2759
					this.pause();                                                                                                   // 2760
				}                                                                                                                // 2761
			}, this),                                                                                                         // 2762
			'mouseleave.owl.autoplay': $.proxy(function() {                                                                   // 2763
				if (this.owl.options.autoplayHoverPause) {                                                                       // 2764
					this.autoplay();                                                                                                // 2765
				}                                                                                                                // 2766
			}, this)                                                                                                          // 2767
		};                                                                                                                 // 2768
                                                                                                                     // 2769
		this.owl.dom.$el.on(this.handlers);                                                                                // 2770
	};                                                                                                                  // 2771
                                                                                                                     // 2772
	/**                                                                                                                 // 2773
	 * Default options.                                                                                                 // 2774
	 * @public                                                                                                          // 2775
	 */                                                                                                                 // 2776
	Autoplay.Defaults = {                                                                                               // 2777
		autoplay: false,                                                                                                   // 2778
		autoplayTimeout: 5000,                                                                                             // 2779
		autoplayHoverPause: false,                                                                                         // 2780
		autoplaySpeed: false                                                                                               // 2781
	};                                                                                                                  // 2782
                                                                                                                     // 2783
	/**                                                                                                                 // 2784
	 * @protected                                                                                                       // 2785
	 * @todo Must be documented.                                                                                        // 2786
	 */                                                                                                                 // 2787
	Autoplay.prototype.autoplay = function() {                                                                          // 2788
		if (this.owl.options.autoplay && !this.owl.state.videoPlay) {                                                      // 2789
			window.clearInterval(this.apInterval);                                                                            // 2790
                                                                                                                     // 2791
			this.apInterval = window.setInterval($.proxy(function() {                                                         // 2792
				this.play();                                                                                                     // 2793
			}, this), this.owl.options.autoplayTimeout);                                                                      // 2794
		} else {                                                                                                           // 2795
			window.clearInterval(this.apInterval);                                                                            // 2796
			this.autoplayState = false;                                                                                       // 2797
		}                                                                                                                  // 2798
	};                                                                                                                  // 2799
                                                                                                                     // 2800
	/**                                                                                                                 // 2801
	 * Starts the autoplay.                                                                                             // 2802
	 * @public                                                                                                          // 2803
	 * @param {Number} [timeout] - ...                                                                                  // 2804
	 * @param {Number} [speed] - ...                                                                                    // 2805
	 * @returns {Boolean|undefined} - ...                                                                               // 2806
	 * @todo Must be documented.                                                                                        // 2807
	 */                                                                                                                 // 2808
	Autoplay.prototype.play = function(timeout, speed) {                                                                // 2809
		// if tab is inactive - doesnt work in <IE10                                                                       // 2810
		if (document.hidden === true) {                                                                                    // 2811
			return false;                                                                                                     // 2812
		}                                                                                                                  // 2813
                                                                                                                     // 2814
		// overwrite default options (custom options are always priority)                                                  // 2815
		if (!this.owl.options.autoplay) {                                                                                  // 2816
			this.owl._options.autoplay = this.owl.options.autoplay = true;                                                    // 2817
			this.owl._options.autoplayTimeout = this.owl.options.autoplayTimeout = timeout                                    // 2818
				|| this.owl.options.autoplayTimeout || 4000;                                                                     // 2819
			this.owl._options.autoplaySpeed = speed || this.owl.options.autoplaySpeed;                                        // 2820
		}                                                                                                                  // 2821
                                                                                                                     // 2822
		if (this.owl.options.autoplay === false || this.owl.state.isTouch || this.owl.state.isScrolling                    // 2823
			|| this.owl.state.isSwiping || this.owl.state.inMotion) {                                                         // 2824
			window.clearInterval(this.apInterval);                                                                            // 2825
			return false;                                                                                                     // 2826
		}                                                                                                                  // 2827
                                                                                                                     // 2828
		if (!this.owl.options.loop && this.owl.pos.current >= this.owl.pos.max) {                                          // 2829
			window.clearInterval(this.e._autoplay);                                                                           // 2830
			this.owl.to(0);                                                                                                   // 2831
		} else {                                                                                                           // 2832
			this.owl.next(this.owl.options.autoplaySpeed);                                                                    // 2833
		}                                                                                                                  // 2834
		this.autoplayState = true;                                                                                         // 2835
	};                                                                                                                  // 2836
                                                                                                                     // 2837
	/**                                                                                                                 // 2838
	 * Stops the autoplay.                                                                                              // 2839
	 * @public                                                                                                          // 2840
	 */                                                                                                                 // 2841
	Autoplay.prototype.stop = function() {                                                                              // 2842
		this.owl._options.autoplay = this.owl.options.autoplay = false;                                                    // 2843
		this.autoplayState = false;                                                                                        // 2844
		window.clearInterval(this.apInterval);                                                                             // 2845
	};                                                                                                                  // 2846
                                                                                                                     // 2847
	/**                                                                                                                 // 2848
	 * Pauses the autoplay.                                                                                             // 2849
	 * @public                                                                                                          // 2850
	 */                                                                                                                 // 2851
	Autoplay.prototype.pause = function() {                                                                             // 2852
		window.clearInterval(this.apInterval);                                                                             // 2853
	};                                                                                                                  // 2854
                                                                                                                     // 2855
	/**                                                                                                                 // 2856
	 * Destroys the plugin.                                                                                             // 2857
	 */                                                                                                                 // 2858
	Autoplay.prototype.destroy = function() {                                                                           // 2859
		var handler, property;                                                                                             // 2860
                                                                                                                     // 2861
		window.clearInterval(this.apInterval);                                                                             // 2862
                                                                                                                     // 2863
		for (handler in this.handlers) {                                                                                   // 2864
			this.owl.dom.$el.off(handler, this.handlers[handler]);                                                            // 2865
		}                                                                                                                  // 2866
		for (property in Object.getOwnPropertyNames(this)) {                                                               // 2867
			typeof this[property] != 'function' && (this[property] = null);                                                   // 2868
		}                                                                                                                  // 2869
	};                                                                                                                  // 2870
                                                                                                                     // 2871
	$.fn.owlCarousel.Constructor.Plugins.autoplay = Autoplay;                                                           // 2872
                                                                                                                     // 2873
})(window.Zepto || window.jQuery, window, document);                                                                 // 2874
                                                                                                                     // 2875
/**                                                                                                                  // 2876
 * Navigation Plugin                                                                                                 // 2877
 * @version 2.0.0                                                                                                    // 2878
 * @author Artus Kolanowski                                                                                          // 2879
 * @license The MIT License (MIT)                                                                                    // 2880
 */                                                                                                                  // 2881
;(function($, window, document, undefined) {                                                                         // 2882
	'use strict';                                                                                                       // 2883
                                                                                                                     // 2884
	/**                                                                                                                 // 2885
	 * Creates the animate plugin.                                                                                      // 2886
	 * @class The Navigation Plugin                                                                                     // 2887
	 * @param {Owl} carousel - The Owl Carousel.                                                                        // 2888
	 */                                                                                                                 // 2889
	var Navigation = function(carousel) {                                                                               // 2890
		// define members                                                                                                  // 2891
		this.core = carousel;                                                                                              // 2892
		this.core.options = $.extend({}, Navigation.Defaults, this.core.options);                                          // 2893
		this.refreshing = false;                                                                                           // 2894
		this.initialized = false;                                                                                          // 2895
		this.page = null;                                                                                                  // 2896
		this.pages = [];                                                                                                   // 2897
		this.controls = {};                                                                                                // 2898
		this.template = null;                                                                                              // 2899
		this.$element = this.core.dom.$el;                                                                                 // 2900
                                                                                                                     // 2901
		// check plugin is enabled                                                                                         // 2902
		if (!this.core.options.nav && !this.core.options.dots) {                                                           // 2903
			return false;                                                                                                     // 2904
		}                                                                                                                  // 2905
                                                                                                                     // 2906
		// define the event handlers                                                                                       // 2907
		this.handlers = {                                                                                                  // 2908
			'initialized.owl.carousel': $.proxy(function() {                                                                  // 2909
				if (!this.initialized) {                                                                                         // 2910
					this.initialize();                                                                                              // 2911
				}                                                                                                                // 2912
			}, this),                                                                                                         // 2913
			'changed.owl.carousel': $.proxy(function(e) {                                                                     // 2914
				if (e.property.name == 'items' && this.initialized) {                                                            // 2915
					this.update();                                                                                                  // 2916
				}                                                                                                                // 2917
				if (this.filling) {                                                                                              // 2918
					e.property.value.data('owl-item').dot                                                                           // 2919
						= $(':first-child', e.property.value).find('[data-dot]').andSelf().data('dot');                                // 2920
				}                                                                                                                // 2921
			}, this),                                                                                                         // 2922
			'change.owl.carousel': $.proxy(function(e) {                                                                      // 2923
				if (e.property.name == 'position' && !this.core.state.revert                                                     // 2924
					&& !this.core.options.loop && this.core.options.navRewind) {                                                    // 2925
					var position = this.core.pos;                                                                                   // 2926
					e.data = e.property.value > position.max                                                                        // 2927
						? position.current >= position.max ? position.min : position.max                                               // 2928
						: e.property.value < 0 ? position.max : e.property.value;                                                      // 2929
				}                                                                                                                // 2930
				this.filling                                                                                                     // 2931
					= this.core.options.dotsData && e.property.name == 'item' && e.property.value && e.property.value.is(':empty'); // 2932
			}, this),                                                                                                         // 2933
			'refresh.owl.carousel refreshed.owl.carousel': $.proxy(function(e) {                                              // 2934
				this.refreshing = e.type == 'refresh';                                                                           // 2935
			}, this),                                                                                                         // 2936
			'refreshed.owl.carousel': $.proxy(function() {                                                                    // 2937
				if (this.initialized) {                                                                                          // 2938
					this.refresh();                                                                                                 // 2939
				}                                                                                                                // 2940
			}, this)                                                                                                          // 2941
		};                                                                                                                 // 2942
                                                                                                                     // 2943
		// register the event handlers                                                                                     // 2944
		this.$element.on(this.handlers);                                                                                   // 2945
	}                                                                                                                   // 2946
                                                                                                                     // 2947
	/**                                                                                                                 // 2948
	 * Default options.                                                                                                 // 2949
	 * @public                                                                                                          // 2950
	 * @todo Rename `slideBy` to `navBy`                                                                                // 2951
	 */                                                                                                                 // 2952
	Navigation.Defaults = {                                                                                             // 2953
		nav: false,                                                                                                        // 2954
		navRewind: true,                                                                                                   // 2955
		navText: [ 'prev', 'next' ],                                                                                       // 2956
		navSpeed: false,                                                                                                   // 2957
		navElement: 'div',                                                                                                 // 2958
		navContainer: false,                                                                                               // 2959
		navContainerClass: 'owl-nav',                                                                                      // 2960
		navClass: [ 'owl-prev', 'owl-next' ],                                                                              // 2961
		slideBy: 1,                                                                                                        // 2962
		dotClass: 'owl-dot',                                                                                               // 2963
		dotsClass: 'owl-dots',                                                                                             // 2964
		dots: true,                                                                                                        // 2965
		dotsEach: false,                                                                                                   // 2966
		dotData: false,                                                                                                    // 2967
		dotsSpeed: false,                                                                                                  // 2968
		dotsContainer: false,                                                                                              // 2969
		controlsClass: 'owl-controls'                                                                                      // 2970
	}                                                                                                                   // 2971
                                                                                                                     // 2972
	/**                                                                                                                 // 2973
	 * Initializes the plugin.                                                                                          // 2974
	 * @protected                                                                                                       // 2975
	 */                                                                                                                 // 2976
	Navigation.prototype.initialize = function() {                                                                      // 2977
		var $container,                                                                                                    // 2978
			options = this.core.options;                                                                                      // 2979
                                                                                                                     // 2980
		// refresh internal data                                                                                           // 2981
		this.refresh();                                                                                                    // 2982
                                                                                                                     // 2983
		// create the indicator template                                                                                   // 2984
		if (!options.dotsData) {                                                                                           // 2985
			this.template = $('<div>')                                                                                        // 2986
				.addClass(options.dotClass)                                                                                      // 2987
				.append($('<span>'))                                                                                             // 2988
				.prop('outerHTML');                                                                                              // 2989
		}                                                                                                                  // 2990
                                                                                                                     // 2991
		// create controls container if needed                                                                             // 2992
		if (!options.navContainer || !options.dotsContainer) {                                                             // 2993
			this.controls.$container = $('<div>')                                                                             // 2994
				.addClass(options.controlsClass)                                                                                 // 2995
				.appendTo(this.$element);                                                                                        // 2996
		}                                                                                                                  // 2997
                                                                                                                     // 2998
		// create DOM structure for absolute navigation                                                                    // 2999
		if (options.dots) {                                                                                                // 3000
			this.$indicators = options.dotsContainer ? $(options.dotsContainer)                                               // 3001
				: $('<div>').addClass(options.dotsClass).appendTo(this.controls.$container);                                     // 3002
                                                                                                                     // 3003
			this.$indicators.on(this.core.dragType[2], 'div', $.proxy(function(e) {                                           // 3004
				var index = $(e.target).parent().is(this.$indicators)                                                            // 3005
					? $(e.target).index() : $(e.target).parent().index();                                                           // 3006
                                                                                                                     // 3007
				e.preventDefault();                                                                                              // 3008
                                                                                                                     // 3009
				this.core.to(                                                                                                    // 3010
					this.pages[index].start,                                                                                        // 3011
					options.dotsSpeed                                                                                               // 3012
				);                                                                                                               // 3013
			}, this));                                                                                                        // 3014
		}                                                                                                                  // 3015
                                                                                                                     // 3016
		// create DOM structure for relative navigation                                                                    // 3017
		if (options.nav) {                                                                                                 // 3018
			$container = options.navContainer ? $(options.navContainer)                                                       // 3019
				: $('<div>').addClass(options.navContainerClass).prependTo(this.controls.$container);                            // 3020
                                                                                                                     // 3021
			this.controls.$next = $('<' + options.navElement + '>');                                                          // 3022
			this.controls.$previous = this.controls.$next.clone();                                                            // 3023
                                                                                                                     // 3024
			this.controls.$previous                                                                                           // 3025
				.addClass(options.navClass[0])                                                                                   // 3026
				.text(options.navText[0])                                                                                        // 3027
				.prependTo($container)                                                                                           // 3028
				.on(this.core.dragType[2], $.proxy(function(e) {                                                                 // 3029
					this.core.to(this.core.pos.current - options.slideBy);                                                          // 3030
				}, this));                                                                                                       // 3031
			this.controls.$next                                                                                               // 3032
				.addClass(options.navClass[1])                                                                                   // 3033
				.text(options.navText[1])                                                                                        // 3034
				.appendTo($container)                                                                                            // 3035
				.on(this.core.dragType[2], $.proxy(function(e) {                                                                 // 3036
					this.core.to(this.core.pos.current + options.slideBy);                                                          // 3037
				}, this));                                                                                                       // 3038
		}                                                                                                                  // 3039
                                                                                                                     // 3040
		// update the created DOM structures                                                                               // 3041
		this.update();                                                                                                     // 3042
                                                                                                                     // 3043
		this.initialized = true;                                                                                           // 3044
	}                                                                                                                   // 3045
                                                                                                                     // 3046
	/**                                                                                                                 // 3047
	 * Destroys the plugin.                                                                                             // 3048
	 * @protected                                                                                                       // 3049
	 */                                                                                                                 // 3050
	Navigation.prototype.destroy = function() {                                                                         // 3051
		var handler, control, property;                                                                                    // 3052
                                                                                                                     // 3053
		for (handler in this.handlers) {                                                                                   // 3054
			this.$element.off(handler, this.handlers[handler]);                                                               // 3055
		}                                                                                                                  // 3056
		for (control in this.controls) {                                                                                   // 3057
			this.controls[control].remove();                                                                                  // 3058
		}                                                                                                                  // 3059
		for (property in Object.getOwnPropertyNames(this)) {                                                               // 3060
			typeof this[property] != 'function' && (this[property] = null);                                                   // 3061
		}                                                                                                                  // 3062
	}                                                                                                                   // 3063
                                                                                                                     // 3064
	/**                                                                                                                 // 3065
	 * Refreshes the internal data of the plugin.                                                                       // 3066
	 * @protected                                                                                                       // 3067
	 */                                                                                                                 // 3068
	Navigation.prototype.refresh = function() {                                                                         // 3069
		var i, j, k,                                                                                                       // 3070
			options = this.core.options,                                                                                      // 3071
			lower = this.core.num.cItems / 2,                                                                                 // 3072
			upper = this.core.num.items - lower,                                                                              // 3073
			items = this.core.num.oItems,                                                                                     // 3074
			size = options.center || options.autoWidth || options.dotData                                                     // 3075
				? 1 : options.dotsEach || options.items;                                                                         // 3076
                                                                                                                     // 3077
		if (options.nav) {                                                                                                 // 3078
			options.navRewind = items > options.items || options.center;                                                      // 3079
                                                                                                                     // 3080
			if (options.slideBy && options.slideBy === 'page') {                                                              // 3081
				options.slideBy = options.items;                                                                                 // 3082
			} else {                                                                                                          // 3083
				options.slideBy = Math.min(options.slideBy, options.items);                                                      // 3084
			}                                                                                                                 // 3085
		}                                                                                                                  // 3086
                                                                                                                     // 3087
		if (options.dots) {                                                                                                // 3088
			this.pages = [];                                                                                                  // 3089
                                                                                                                     // 3090
			for (i = lower, j = 0, k = 0; i < upper; i++) {                                                                   // 3091
				if (j >= size || j === 0) {                                                                                      // 3092
					this.pages.push({                                                                                               // 3093
						start: i - lower,                                                                                              // 3094
						end: i - lower + size - 1                                                                                      // 3095
					});                                                                                                             // 3096
					j = 0, ++k;                                                                                                     // 3097
				}                                                                                                                // 3098
				j += this.core.num.merged[i];                                                                                    // 3099
			}                                                                                                                 // 3100
		}                                                                                                                  // 3101
	}                                                                                                                   // 3102
                                                                                                                     // 3103
	/**                                                                                                                 // 3104
	 * Updates the DOM structures of the plugin.                                                                        // 3105
	 * @protected                                                                                                       // 3106
	 */                                                                                                                 // 3107
	Navigation.prototype.update = function() {                                                                          // 3108
		var difference, i, html = '',                                                                                      // 3109
			options = this.core.options,                                                                                      // 3110
			$items = this.core.dom.$oItems,                                                                                   // 3111
			index = this.core.pos.current;                                                                                    // 3112
                                                                                                                     // 3113
		if (options.nav && !options.loop && !options.navRewind) {                                                          // 3114
			this.controls.$previous.toggleClass('disabled', index <= 0);                                                      // 3115
			this.controls.$next.toggleClass('disabled', index >= this.core.pos.max);                                          // 3116
		}                                                                                                                  // 3117
                                                                                                                     // 3118
		if (options.dots) {                                                                                                // 3119
			difference = this.pages.length - this.$indicators.children().length;                                              // 3120
                                                                                                                     // 3121
			this.page = $.grep(this.pages, function(o) {                                                                      // 3122
				return o.start <= index && o.end >= index;                                                                       // 3123
			}).pop();                                                                                                         // 3124
                                                                                                                     // 3125
			if (difference > 0) {                                                                                             // 3126
				for (i = 0; i < Math.abs(difference); i++) {                                                                     // 3127
					html += options.dotData ? $items.eq(i).data('owl-item').dot : this.template;                                    // 3128
				}                                                                                                                // 3129
				this.$indicators.append(html);                                                                                   // 3130
			} else if (difference < 0) {                                                                                      // 3131
				this.$indicators.children().slice(difference).remove();                                                          // 3132
			}                                                                                                                 // 3133
                                                                                                                     // 3134
			this.$indicators.find('.active').removeClass('active');                                                           // 3135
			this.$indicators.children().eq(this.pages.indexOf(this.page) % $items.length).addClass('active');                 // 3136
		}                                                                                                                  // 3137
	}                                                                                                                   // 3138
                                                                                                                     // 3139
	/**                                                                                                                 // 3140
	 * Extends event data.                                                                                              // 3141
	 * @protected                                                                                                       // 3142
	 * @param {Event} event - The event object which gets thrown.                                                       // 3143
	 */                                                                                                                 // 3144
	Navigation.prototype.onTrigger = function(event) {                                                                  // 3145
		var options = this.core.options;                                                                                   // 3146
                                                                                                                     // 3147
		event.page = {                                                                                                     // 3148
			index: this.pages.indexOf(this.page),                                                                             // 3149
			count: this.pages.length,                                                                                         // 3150
			size: options.center || options.autoWidth || options.dotData                                                      // 3151
				? 1 : options.dotsEach || options.items                                                                          // 3152
		};                                                                                                                 // 3153
	}                                                                                                                   // 3154
                                                                                                                     // 3155
	$.fn.owlCarousel.Constructor.Plugins.Navigation = Navigation;                                                       // 3156
                                                                                                                     // 3157
})(window.Zepto || window.jQuery, window, document);                                                                 // 3158
                                                                                                                     // 3159
/**                                                                                                                  // 3160
 * Hash Plugin                                                                                                       // 3161
 * @version 2.0.0                                                                                                    // 3162
 * @author Artus Kolanowski                                                                                          // 3163
 * @license The MIT License (MIT)                                                                                    // 3164
 */                                                                                                                  // 3165
;(function($, window, document, undefined) {                                                                         // 3166
	'use strict';                                                                                                       // 3167
                                                                                                                     // 3168
	/**                                                                                                                 // 3169
	 * Creates the hash plugin.                                                                                         // 3170
	 * @class The Hash Plugin                                                                                           // 3171
	 * @param {Owl} carousel - The Owl Carousel                                                                         // 3172
	 */                                                                                                                 // 3173
	var Hash = function(carousel) {                                                                                     // 3174
		// define members                                                                                                  // 3175
		this.carousel = carousel;                                                                                          // 3176
		this.options = $.extend({}, Hash.Defaults, this.carousel.options);                                                 // 3177
		this.hashes = {};                                                                                                  // 3178
		this.$element = this.carousel.dom.$el;                                                                             // 3179
                                                                                                                     // 3180
		// check plugin is enabled                                                                                         // 3181
		if (!this.options.URLhashListener) {                                                                               // 3182
			return false;                                                                                                     // 3183
		}                                                                                                                  // 3184
                                                                                                                     // 3185
		// defines event handlers                                                                                          // 3186
		this.handlers = {                                                                                                  // 3187
			'initialized.owl.carousel': $.proxy(function() {                                                                  // 3188
				if (window.location.hash.substring(1)) {                                                                         // 3189
					$(window).trigger('hashchange.owl.navigation');                                                                 // 3190
				}                                                                                                                // 3191
			}, this),                                                                                                         // 3192
			'changed.owl.carousel': $.proxy(function(e) {                                                                     // 3193
				if (this.filling) {                                                                                              // 3194
					e.property.value.data('owl-item').hash                                                                          // 3195
						= $(':first-child', e.property.value).find('[data-hash]').andSelf().data('hash');                              // 3196
					this.hashes[e.property.value.data('owl-item').hash] = e.property.value;                                         // 3197
				}                                                                                                                // 3198
			}, this),                                                                                                         // 3199
			'change.owl.carousel': $.proxy(function(e) {                                                                      // 3200
				if (e.property.name == 'position' && e.property.value == 'URLHash') {                                            // 3201
					e.data = this.hashes[window.location.hash.substring(1)];                                                        // 3202
				}                                                                                                                // 3203
				this.filling = e.property.name == 'item' && e.property.value && e.property.value.is(':empty');                   // 3204
			}, this),                                                                                                         // 3205
		};                                                                                                                 // 3206
                                                                                                                     // 3207
		// register the event handlers                                                                                     // 3208
		this.$element.on(this.handlers);                                                                                   // 3209
                                                                                                                     // 3210
		// register event listener for hash navigation                                                                     // 3211
		$(window).on('hashchange.owl.navigation', $.proxy(function() {                                                     // 3212
			var hash = window.location.hash.substring(1),                                                                     // 3213
				position = this.hashes[hash] && this.hashes[hash].index() || 0;                                                  // 3214
                                                                                                                     // 3215
			if (!hash) {                                                                                                      // 3216
				return false;                                                                                                    // 3217
			}                                                                                                                 // 3218
                                                                                                                     // 3219
			this.carousel.dom.oStage.scrollLeft = 0;                                                                          // 3220
			this.carousel.to(position);                                                                                       // 3221
		}, this));                                                                                                         // 3222
	}                                                                                                                   // 3223
                                                                                                                     // 3224
	/**                                                                                                                 // 3225
	 * Default options.                                                                                                 // 3226
	 * @public                                                                                                          // 3227
	 */                                                                                                                 // 3228
	Hash.Defaults = {                                                                                                   // 3229
		URLhashListener: false                                                                                             // 3230
	}                                                                                                                   // 3231
                                                                                                                     // 3232
	/**                                                                                                                 // 3233
	 * Destroys the plugin.                                                                                             // 3234
	 * @public                                                                                                          // 3235
	 */                                                                                                                 // 3236
	Hash.prototype.destroy = function() {                                                                               // 3237
		var handler, property;                                                                                             // 3238
                                                                                                                     // 3239
		$(window).off('hashchange.owl.navigation');                                                                        // 3240
                                                                                                                     // 3241
		for (handler in this.handlers) {                                                                                   // 3242
			this.owl.dom.$el.off(handler, this.handlers[handler]);                                                            // 3243
		}                                                                                                                  // 3244
		for (property in Object.getOwnPropertyNames(this)) {                                                               // 3245
			typeof this[property] != 'function' && (this[property] = null);                                                   // 3246
		}                                                                                                                  // 3247
	}                                                                                                                   // 3248
                                                                                                                     // 3249
	$.fn.owlCarousel.Constructor.Plugins.Hash = Hash;                                                                   // 3250
                                                                                                                     // 3251
})(window.Zepto || window.jQuery, window, document);                                                                 // 3252
                                                                                                                     // 3253
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
