(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@contentarchitect/editor'), require('vue')) :
	typeof define === 'function' && define.amd ? define(['@contentarchitect/editor', 'vue'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Spacer = factory(global.ContentArchitect, global.Vue));
}(this, (function (editor, Vue) { 'use strict';

	Vue = Vue && Object.prototype.hasOwnProperty.call(Vue, 'default') ? Vue['default'] : Vue;

	//

	var script = {
		directives: { ClickOutside: editor.ClickOutside },
		props: {
			height: {
				type: Number,
				required: true
			},
			maxHeight: {
				type: Number,
				default: Number.POSITIVE_INFINITY
			},
			minHeight: {
				type: Number,
				default: 10
			},
			targetElement: {}
		},
		data () {
			return {
				resizing: false,
				startPosition: 0,
				startHeight: 0,
				dataHeight: this.height,
			}
		},
		beforeCreate () {
			this.$root = this.$options.root;
		},
		methods: {
			show () {
				Object.assign(this.$el.style, {
					width: this.targetElement.offsetWidth + "px",
					height: this.targetElement.offsetHeight + "px",
					transform: 'none'
				});
				this.$el.style.removeProperty('display');

				const { diffX: x, diffY: y } = editor.Util.matchTransformMatrix({
					a: this.$el,
					b: this.targetElement
				});

				Object.assign(this.$el.style, {
					transform: editor.Util.transformStyle({ x, y })
				});
			},
			hide () {
				this.$el.style.removeProperty('transform');
				this.$el.style.setProperty('display', 'none');
			},
			spacerMousedownHandler (e) {
				document.body.style.setProperty('cursor', 'n-resize');
				this.startPosition = e.pageY;
				this.startHeight = this.$el.offsetHeight;
				this.resizing = true;

				window.addEventListener("mousemove", this.resizeHandler);
				window.addEventListener("mouseup", this.endResizeHandler);
			},
			resizeHandler (e) {
				let height = this.startHeight + e.pageY - this.startPosition;
				
				if (height < this.minHeight) {
					height = this.minHeight;
				}

				if (height > this.maxHeight) {
					height = this.maxHeight;
				}

				Object.assign(this.$el.style, {
					height: height + 'px'
				});

				this.setHeight(height);
			},
			endResizeHandler () {
				document.body.style.removeProperty('cursor');
				this.resizing = false;

				window.removeEventListener("mousemove", this.resizeHandler);
				window.removeEventListener("mouseup", this.endResizeHandler);
			},
			setHeight (value) {
				this.dataHeight = value;
				this.$emit('changed', value);
			}
		}
	};

	function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
	    if (typeof shadowMode !== 'boolean') {
	        createInjectorSSR = createInjector;
	        createInjector = shadowMode;
	        shadowMode = false;
	    }
	    // Vue.extend constructor export interop.
	    const options = typeof script === 'function' ? script.options : script;
	    // render functions
	    if (template && template.render) {
	        options.render = template.render;
	        options.staticRenderFns = template.staticRenderFns;
	        options._compiled = true;
	        // functional template
	        if (isFunctionalTemplate) {
	            options.functional = true;
	        }
	    }
	    // scopedId
	    if (scopeId) {
	        options._scopeId = scopeId;
	    }
	    let hook;
	    if (moduleIdentifier) {
	        // server build
	        hook = function (context) {
	            // 2.3 injection
	            context =
	                context || // cached call
	                    (this.$vnode && this.$vnode.ssrContext) || // stateful
	                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
	            // 2.2 with runInNewContext: true
	            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
	                context = __VUE_SSR_CONTEXT__;
	            }
	            // inject component styles
	            if (style) {
	                style.call(this, createInjectorSSR(context));
	            }
	            // register component module identifier for async chunk inference
	            if (context && context._registeredComponents) {
	                context._registeredComponents.add(moduleIdentifier);
	            }
	        };
	        // used by ssr in case component is cached and beforeCreate
	        // never gets called
	        options._ssrRegister = hook;
	    }
	    else if (style) {
	        hook = shadowMode
	            ? function (context) {
	                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
	            }
	            : function (context) {
	                style.call(this, createInjector(context));
	            };
	    }
	    if (hook) {
	        if (options.functional) {
	            // register for functional component in vue file
	            const originalRender = options.render;
	            options.render = function renderWithStyleInjection(h, context) {
	                hook.call(context);
	                return originalRender(h, context);
	            };
	        }
	        else {
	            // inject component registration as beforeCreate hook
	            const existing = options.beforeCreate;
	            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
	        }
	    }
	    return script;
	}

	function createInjector(context, shadowRoot) {
	    return (id, style) => addStyle(style, shadowRoot);
	}
	function createStyleElement(shadowRoot) {
	    var styleElement = document.createElement('style');
	    styleElement.type = 'text/css';
	    shadowRoot.appendChild(styleElement);
	    return styleElement;
	}
	function addStyle(css, shadowRoot) {
	    const styleElement = createStyleElement(shadowRoot);
	    if (css.media)
	        styleElement.setAttribute('media', css.media);
	    if ('styleSheet' in styleElement) {
	        styleElement.styleSheet.cssText = css.source;
	    }
	    else {
	        while (styleElement.firstChild) {
	            styleElement.removeChild(styleElement.firstChild);
	        }
	        styleElement.appendChild(document.createTextNode(css.source));
	    }
	}

	/* script */
	const __vue_script__ = script;

	/* template */
	var __vue_render__ = function() {
	  var _vm = this;
	  var _h = _vm.$createElement;
	  var _c = _vm._self._c || _h;
	  return _c(
	    "div",
	    {
	      staticClass: "spacer",
	      staticStyle: { display: "none" },
	      style: { height: _vm.dataHeight + "px" }
	    },
	    [
	      _c("transition", { attrs: { name: "fade" } }, [
	        _vm.resizing
	          ? _c("div", { staticClass: "spacer-height" }, [
	              _vm._v(_vm._s(_vm.dataHeight) + "px")
	            ])
	          : _vm._e()
	      ]),
	      _vm._v(" "),
	      _c("div", {
	        staticClass: "spacer-handle",
	        on: {
	          mousedown: _vm.spacerMousedownHandler,
	          mouseleave: function($event) {
	            !_vm.resizing && _vm.hide();
	          }
	        }
	      })
	    ],
	    1
	  )
	};
	var __vue_staticRenderFns__ = [];
	__vue_render__._withStripped = true;

	  /* style */
	  const __vue_inject_styles__ = function (inject) {
	    if (!inject) return
	    inject("data-v-7cc7747c_0", { source: "\n.spacer[data-v-7cc7747c] {\n\tposition: absolute;\n\tdisplay: flex;\n\tflex-direction: column;\n\tz-index: 3;\n\tpointer-events: none;\n}\n.spacer-height[data-v-7cc7747c] {\n\tflex: 1;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\tuser-select: none;\n}\n.spacer-handle[data-v-7cc7747c] {\n\tmargin-top: auto;\n\theight: 20px;\n\tcursor: n-resize;\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n\tpointer-events: all;\n}\n.spacer-handle[data-v-7cc7747c]::before,\n.spacer-handle[data-v-7cc7747c]::after {\n\tcontent: \"\";\n\twidth: 30px;\n\theight: 1px;\n\tbackground: #121212;\n\tmargin: 0 auto;\n\tdisplay: block;\n}\n.spacer-handle[data-v-7cc7747c]::after {\n  margin-top: 2px;\n}\n", map: {"version":3,"sources":["/mnt/d/projects/@contentarchitect/spacer/src/SpacerResizing.vue"],"names":[],"mappings":";AAkHA;CACA,kBAAA;CACA,aAAA;CACA,sBAAA;CACA,UAAA;CACA,oBAAA;AACA;AAEA;CACA,OAAA;CACA,aAAA;CACA,mBAAA;CACA,uBAAA;CACA,iBAAA;AACA;AAEA;CACA,gBAAA;CACA,YAAA;CACA,gBAAA;CACA,aAAA;CACA,sBAAA;CACA,uBAAA;CACA,mBAAA;CACA,mBAAA;AACA;AAEA;;CAEA,WAAA;CACA,WAAA;CACA,WAAA;CACA,mBAAA;CACA,cAAA;CACA,cAAA;AACA;AAEA;EACA,eAAA;AACA","file":"SpacerResizing.vue","sourcesContent":["<template>\n\t<div\n\t\tclass=\"spacer\"\n\t\t:style=\"{ height: dataHeight+'px' }\"\n\t\tstyle=\"display: none\"\n\t>\n\t\t<transition name=\"fade\">\n\t\t\t<div v-if=\"resizing\" class=\"spacer-height\">{{ dataHeight }}px</div>\n\t\t</transition>\n\n\t\t<div\n\t\t\tclass=\"spacer-handle\"\n\t\t\t@mousedown=\"spacerMousedownHandler\"\n\t\t\t@mouseleave=\"!resizing && hide()\"\n\t\t>\n\t\t</div>\n\t</div>\n</template>\n\n<script>\nimport { Util, ClickOutside } from \"@contentarchitect/editor\"\n\nexport default {\n\tdirectives: { ClickOutside },\n\tprops: {\n\t\theight: {\n\t\t\ttype: Number,\n\t\t\trequired: true\n\t\t},\n\t\tmaxHeight: {\n\t\t\ttype: Number,\n\t\t\tdefault: Number.POSITIVE_INFINITY\n\t\t},\n\t\tminHeight: {\n\t\t\ttype: Number,\n\t\t\tdefault: 10\n\t\t},\n\t\ttargetElement: {}\n\t},\n\tdata () {\n\t\treturn {\n\t\t\tresizing: false,\n\t\t\tstartPosition: 0,\n\t\t\tstartHeight: 0,\n\t\t\tdataHeight: this.height,\n\t\t}\n\t},\n\tbeforeCreate () {\n\t\tthis.$root = this.$options.root\n\t},\n\tmethods: {\n\t\tshow () {\n\t\t\tObject.assign(this.$el.style, {\n\t\t\t\twidth: this.targetElement.offsetWidth + \"px\",\n\t\t\t\theight: this.targetElement.offsetHeight + \"px\",\n\t\t\t\ttransform: 'none'\n\t\t\t})\n\t\t\tthis.$el.style.removeProperty('display');\n\n\t\t\tconst { diffX: x, diffY: y } = Util.matchTransformMatrix({\n\t\t\t\ta: this.$el,\n\t\t\t\tb: this.targetElement\n\t\t\t});\n\n\t\t\tObject.assign(this.$el.style, {\n\t\t\t\ttransform: Util.transformStyle({ x, y })\n\t\t\t});\n\t\t},\n\t\thide () {\n\t\t\tthis.$el.style.removeProperty('transform')\n\t\t\tthis.$el.style.setProperty('display', 'none')\n\t\t},\n\t\tspacerMousedownHandler (e) {\n\t\t\tdocument.body.style.setProperty('cursor', 'n-resize');\n\t\t\tthis.startPosition = e.pageY;\n\t\t\tthis.startHeight = this.$el.offsetHeight;\n\t\t\tthis.resizing = true;\n\n\t\t\twindow.addEventListener(\"mousemove\", this.resizeHandler)\n\t\t\twindow.addEventListener(\"mouseup\", this.endResizeHandler)\n\t\t},\n\t\tresizeHandler (e) {\n\t\t\tlet height = this.startHeight + e.pageY - this.startPosition;\n\t\t\t\n\t\t\tif (height < this.minHeight) {\n\t\t\t\theight = this.minHeight;\n\t\t\t}\n\n\t\t\tif (height > this.maxHeight) {\n\t\t\t\theight = this.maxHeight;\n\t\t\t}\n\n\t\t\tObject.assign(this.$el.style, {\n\t\t\t\theight: height + 'px'\n\t\t\t})\n\n\t\t\tthis.setHeight(height)\n\t\t},\n\t\tendResizeHandler () {\n\t\t\tdocument.body.style.removeProperty('cursor');\n\t\t\tthis.resizing = false;\n\n\t\t\twindow.removeEventListener(\"mousemove\", this.resizeHandler)\n\t\t\twindow.removeEventListener(\"mouseup\", this.endResizeHandler);\n\t\t},\n\t\tsetHeight (value) {\n\t\t\tthis.dataHeight = value\n\t\t\tthis.$emit('changed', value)\n\t\t}\n\t}\n}\n</script>\n\n<style scoped>\n.spacer {\n\tposition: absolute;\n\tdisplay: flex;\n\tflex-direction: column;\n\tz-index: 3;\n\tpointer-events: none;\n}\n\n.spacer-height {\n\tflex: 1;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\tuser-select: none;\n}\n\n.spacer-handle {\n\tmargin-top: auto;\n\theight: 20px;\n\tcursor: n-resize;\n\tdisplay: flex;\n\tflex-direction: column;\n\tjustify-content: center;\n\talign-items: center;\n\tpointer-events: all;\n}\n\n.spacer-handle::before,\n.spacer-handle::after {\n\tcontent: \"\";\n\twidth: 30px;\n\theight: 1px;\n\tbackground: #121212;\n\tmargin: 0 auto;\n\tdisplay: block;\n}\n\n.spacer-handle::after {\n  margin-top: 2px;\n}\n</style>"]}, media: undefined });

	  };
	  /* scoped */
	  const __vue_scope_id__ = "data-v-7cc7747c";
	  /* module identifier */
	  const __vue_module_identifier__ = undefined;
	  /* functional template */
	  const __vue_is_functional_template__ = false;

	  
	  const __vue_component__ = /*#__PURE__*/normalizeComponent(
	    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
	    __vue_inject_styles__,
	    __vue_script__,
	    __vue_scope_id__,
	    __vue_is_functional_template__,
	    __vue_module_identifier__,
	    true,
	    undefined,
	    undefined,
	    createInjector
	  );

	var ResizeDirective = {
		bind (el, binding, vnode) {
			const props = {
				height: binding.value,
				targetElement: el,
				...binding.arg
			};

			const parentApp = el.__vueSpacerControl__ = new Vue({
				render (createElement) {
					return createElement(
						{
							root: vnode.context.$root,
							...__vue_component__
						},
						{ props }
					)
				}
			}).$mount();
			vnode.context.$root.$el.prepend(parentApp.$el);

			const spacerControlApp = el.__vueSpacerControl__ = parentApp.$children[0];

			spacerControlApp.$on('changed', (e) => {
				editor.DirectiveUtil.setValue(vnode.context, binding.expression, e);
			});

			el.addEventListener('mouseenter', spacerControlApp.show);
		}
	};

	//

	var script$1 = {
		props: ['value'],
		directives: { Resize: ResizeDirective },
		data () {
			return {
				resizeSettings: {
					minHeight: this.value.constructor.settings.minHeight,
					maxHeight: this.value.constructor.settings.maxHeight,
				}
			}
		}
	};

	/* script */
	const __vue_script__$1 = script$1;

	/* template */
	var __vue_render__$1 = function() {
	  var _vm = this;
	  var _h = _vm.$createElement;
	  var _c = _vm._self._c || _h;
	  return _c("div", {
	    directives: [
	      {
	        name: "resize",
	        rawName: "v-resize:[resizeSettings]",
	        value: _vm.value.height,
	        expression: "value.height",
	        arg: _vm.resizeSettings
	      }
	    ],
	    style: { height: _vm.value.height + "px" }
	  })
	};
	var __vue_staticRenderFns__$1 = [];
	__vue_render__$1._withStripped = true;

	  /* style */
	  const __vue_inject_styles__$1 = undefined;
	  /* scoped */
	  const __vue_scope_id__$1 = undefined;
	  /* module identifier */
	  const __vue_module_identifier__$1 = undefined;
	  /* functional template */
	  const __vue_is_functional_template__$1 = false;
	  /* style inject */
	  
	  /* style inject SSR */
	  
	  /* style inject shadow dom */
	  

	  
	  const __vue_component__$1 = /*#__PURE__*/normalizeComponent(
	    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
	    __vue_inject_styles__$1,
	    __vue_script__$1,
	    __vue_scope_id__$1,
	    __vue_is_functional_template__$1,
	    __vue_module_identifier__$1,
	    true,
	    undefined,
	    undefined,
	    undefined
	  );

	//

	var script$2 = {
	    components: { CssGrid: editor.CssGrid, CssGridItem: editor.CssGridItem, CaInput: editor.CaInput },
	    props: ['value'],
	};

	/* script */
	const __vue_script__$2 = script$2;

	/* template */
	var __vue_render__$2 = function() {
	  var _vm = this;
	  var _h = _vm.$createElement;
	  var _c = _vm._self._c || _h;
	  return _c(
	    "css-grid",
	    { attrs: { columns: ["50px", "1fr"], gap: "8px 0" } },
	    [
	      _c("css-grid-item", [_vm._v("Height")]),
	      _vm._v(" "),
	      _c(
	        "css-grid-item",
	        [
	          _c("ca-input", {
	            attrs: {
	              type: "number",
	              max: _vm.value.constructor.settings.maxHeight,
	              min: _vm.value.constructor.settings.minHeight
	            },
	            model: {
	              value: _vm.value.height,
	              callback: function($$v) {
	                _vm.$set(_vm.value, "height", $$v);
	              },
	              expression: "value.height"
	            }
	          })
	        ],
	        1
	      )
	    ],
	    1
	  )
	};
	var __vue_staticRenderFns__$2 = [];
	__vue_render__$2._withStripped = true;

	  /* style */
	  const __vue_inject_styles__$2 = function (inject) {
	    if (!inject) return
	    inject("data-v-59c5216b_0", { source: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", map: {"version":3,"sources":[],"names":[],"mappings":"","file":"settings.vue"}, media: undefined });

	  };
	  /* scoped */
	  const __vue_scope_id__$2 = undefined;
	  /* module identifier */
	  const __vue_module_identifier__$2 = undefined;
	  /* functional template */
	  const __vue_is_functional_template__$2 = false;

	  
	  const __vue_component__$2 = /*#__PURE__*/normalizeComponent(
	    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
	    __vue_inject_styles__$2,
	    __vue_script__$2,
	    __vue_scope_id__$2,
	    __vue_is_functional_template__$2,
	    __vue_module_identifier__$2,
	    true,
	    undefined,
	    undefined,
	    createInjector
	  );

	var icon = { render: function () { var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","height":"24","width":"24"}},[_c('path',{attrs:{"fill":"none","d":"M0 0h24v24H0z"}}),_c('path',{attrs:{"d":"M13 6.99h3L12 3 8 6.99h3v10.02H8L12 21l4-3.99h-3z"}})]) } };

	class Spacer extends editor.Block {
		static get viewComponent () {
			return __vue_component__$1;
		}

		static get settingsComponent () {
			return __vue_component__$2;
		}

		static get icon () {
			return icon;
		}

		static defaultData () {
			return {
				height: 80
			}
		}

		static defaultSettings = {
			minHeight: 20,
			maxHeight: 200
		}

		toHTML () {
			return `<div style="height: ${this.height}px"></div>`;
		}
		
		static serializeFromHTML (html) {
			let height = 0,
				cssString = html.getElementsByTagName("div")[0].getAttribute("style");
			

			function css2obj (css) {
				const result = {},
					  attributes = css.split(';');

				attributes.forEach(attr => {
					const [key, value] = attr.split(':');
					result[key.trim()] = value.trim();
				});

				return result;
			}

			height = css2obj(cssString)["height"];
			height = Number(/\d+/.exec(height)[0]);

			return {
				height
			}
		}
	}

	return Spacer;

})));
