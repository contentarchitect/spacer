<template>
	<div :style="{ height: value.height + 'px' }" v-resize:[resizeSettings]="value.height">
	</div>
</template>

<script>
import ResizeDirective from "./ResizeDirective.js"

export default {
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
}
</script>