# Default Export to Named Import codemod

Transforms this:

```jsx
import EVENTS from '../../events';
```
    
 to
 
 ```jsx
import { EVENTS } from '../../events'; 
```

## Usage

find packages/main/src -iname '*.ts' -print | xargs jscodeshift -t packages/codemod/src/defaultToNamedImport/DefaultToNamedImport.ts