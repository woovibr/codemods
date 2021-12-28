# ImportMapper

transform imports
    
## Usage

find packages/main/src -iname '*.ts' -print | xargs jscodeshift -t packages/codemod/src/importMapper/ImportMapper.ts --config importMapper.codemod.config.js
