# Spacer

Spacer is a block for ContentArchitect editor. It is used to create spaces between the blocks. 


## Properties
- Editor side rendering (no need JS on viewing)
- Custom styles with class options

## Installation
### 1st Method
`npm i -D @contentarchitect/spacer` or `yarn add @contentarchitect/spacer`

after:

```js
import Spacer from "@contentarchitect/spacer"
ContentArchitect.Blocks.register(Spacer)
```

### 2nd Method
On you page:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@contentarchitect/editor/dist/ContentArchitect.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@contentarchitect/spacer/src/theme.extract.css">

<content-architect>
	<div data-block="Spacer">
		<div style="height: 120px"></div>
	</div>
</content-architect>

<script src="https://cdn.jsdelivr.net/npm/vue@2"></script>
<script src="https://cdn.jsdelivr.net/npm/@contentarchitect/editor"></script>
<script src="https://cdn.jsdelivr.net/npm/@contentarchitect/spacer"></script>

<script>
ContentArchitect.Blocks.register(Spacer)
</script>
```


### 3rd Method
Use bundler.

