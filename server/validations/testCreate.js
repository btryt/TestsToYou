const forEach = require("lodash.foreach")
function validateData(body){
    const uniqueTestId = new Set()
    const testsWithCorrectAnswer = new Set()
    const uniqueVariantId = new Set()
    const variantsIdArray = []
    let modifiedData = false
    forEach(body.tests,(test)=>{
      uniqueTestId.add(test.id)

      if(!test.multiple){
        if(test.variants.filter(f=> f.correct).length > 1){
          modifiedData = true
        }
      }
      if(test.multiple){
        if(test.variants.filter(f=> f.correct).length < 2){
          modifiedData = true
        }
      }
      forEach(test.variants,(variant)=>{
        if(variant.correct){
          testsWithCorrectAnswer.add(test.id)
          variantsIdArray.push(variant.id)
          uniqueVariantId.add(variant.id)
        }
      })
    })
    if(uniqueTestId.size !== body.tests.length || testsWithCorrectAnswer.size !== body.tests.length || variantsIdArray.length !== uniqueVariantId.size || modifiedData){
      return {ok:false}
    }
    return {ok:true}

}

module.exports = validateData