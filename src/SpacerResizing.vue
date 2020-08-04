<template>
	<div
		class="spacer"
		:style="{ height: dataHeight+'px' }"
		style="display: none"
	>
		<transition name="fade">
			<div v-if="resizing" class="spacer-height">{{ dataHeight }}px</div>
		</transition>

		<div
			class="spacer-handle"
			@mousedown="spacerMousedownHandler"
			@mouseleave="!resizing && hide()"
		>
		</div>
	</div>
</template>

<script>
import { Util, ClickOutside } from "@contentarchitect/editor"

export default {
	directives: { ClickOutside },
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
		this.$root = this.$options.root
	},
	methods: {
		show () {
			Object.assign(this.$el.style, {
				width: this.targetElement.offsetWidth + "px",
				height: this.targetElement.offsetHeight + "px",
				transform: 'none'
			})
			this.$el.style.removeProperty('display');

			const { diffX: x, diffY: y } = Util.matchTransformMatrix({
				a: this.$el,
				b: this.targetElement
			});

			Object.assign(this.$el.style, {
				transform: Util.transformStyle({ x, y })
			});
		},
		hide () {
			this.$el.style.removeProperty('transform')
			this.$el.style.setProperty('display', 'none')
		},
		spacerMousedownHandler (e) {
			document.body.style.setProperty('cursor', 'n-resize');
			this.startPosition = e.pageY;
			this.startHeight = this.$el.offsetHeight;
			this.resizing = true;

			window.addEventListener("mousemove", this.resizeHandler)
			window.addEventListener("mouseup", this.endResizeHandler)
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
			})

			this.setHeight(height)
		},
		endResizeHandler () {
			document.body.style.removeProperty('cursor');
			this.resizing = false;

			window.removeEventListener("mousemove", this.resizeHandler)
			window.removeEventListener("mouseup", this.endResizeHandler);
		},
		setHeight (value) {
			this.dataHeight = value
			this.$emit('changed', value)
		}
	}
}
</script>

<style scoped>
.spacer {
	position: absolute;
	display: flex;
	flex-direction: column;
	z-index: 3;
	pointer-events: none;
}

.spacer-height {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	user-select: none;
}

.spacer-handle {
	margin-top: auto;
	height: 20px;
	cursor: n-resize;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	pointer-events: all;
}

.spacer-handle::before,
.spacer-handle::after {
	content: "";
	width: 30px;
	height: 1px;
	background: #121212;
	margin: 0 auto;
	display: block;
}

.spacer-handle::after {
  margin-top: 2px;
}
</style>