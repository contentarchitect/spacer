import SpacerResizing from "./SpacerResizing.vue"
import { DirectiveUtil } from "@contentarchitect/editor"
import Vue from "vue"

export default {
	bind (el, binding, vnode) {
		const props = {
			height: binding.value,
			targetElement: el,
			...binding.arg
		}

		const parentApp = el.__vueSpacerControl__ = new Vue({
			render (createElement) {
				return createElement(
					{
						root: vnode.context.$root,
						...SpacerResizing
					},
					{ props }
				)
			}
		}).$mount()
		vnode.context.$root.$el.prepend(parentApp.$el)

		const spacerControlApp = el.__vueSpacerControl__ = parentApp.$children[0]

		spacerControlApp.$on('changed', (e) => {
			DirectiveUtil.setValue(vnode.context, binding.expression, e);
		})

		el.addEventListener('mouseenter', spacerControlApp.show)
	}
}