<template>
    <css-grid :columns="['50px', '1fr']" gap="8px 0">
        <css-grid-item>Height</css-grid-item>
        <css-grid-item>
            <ca-input v-model="value.height" type="number" :max="value.constructor.settings.maxHeight" :min="value.constructor.settings.minHeight" />
        </css-grid-item>
    </css-grid>
</template>

<script>
import { CssGrid, CssGridItem, CaInput } from "@contentarchitect/editor"

export default {
    components: { CssGrid, CssGridItem, CaInput },
    props: ['value'],
}
</script>

<style>

</style>