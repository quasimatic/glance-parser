# Glance Parser
A basic parser for Glance. 

## Install

```bash
npm install glance-parser
```

## Basic usage

In a node.js script
```javascript
var glanceParser = require('glance-parser');

var result = glanceParser.parse("scope > subject");

console.log(result)
```

Outputs
```json
 [
    [{"label": "scope", "options": []}],
    [{"label": "subject", "options": []}]
 ]
```
