const forEach = require("lodash.foreach")
function validateData(body, test) {
  const uniqueTestId = new Set()
  const uniqueVariantId = new Set()
  const testsWithMultipleAnswers = new Set()
  const variantsIdArray = []
  let count = 0
  let idNotFound = false
  let modifiedData = false
  forEach(body.answers, (answer) => {
    uniqueTestId.add(answer.testId)

    if (
      answer.variants.filter((f) => f.correct).length !== answer.variants.length
    ) {
      modifiedData = true
    }
    if (answer.variants.filter((f) => f.correct).length > 1) {
      testsWithMultipleAnswers.add(answer.testId)
    }
    forEach(answer.variants, (variant) => {
      if (variant.correct) {
        uniqueVariantId.add(variant.id)
        variantsIdArray.push(variant.id)
      }
    })
  })
  if (
    uniqueTestId.size !== body.answers.length ||
    variantsIdArray.length !== uniqueVariantId.size ||
    modifiedData
  ) {
  }

  if (
    uniqueTestId.size !== body.answers.length ||
    variantsIdArray.length !== uniqueVariantId.size ||
    modifiedData
  ) {
    return { ok: false }
  }

  forEach(test.rows[0].tests, (val, i) => {
    if (!uniqueTestId.has(val.id)) {
      idNotFound = true
    }
    if (!val.multiple) {
      if (testsWithMultipleAnswers.has(val.id)) {
        modifiedData = true
      }
    }
    forEach(val.variants, (vr) => {
      if (uniqueVariantId.has(vr.id)) {
        uniqueVariantId.delete(vr.id)
      }
    })
  })

  forEach(body.answers, (val) => {
    let allCorrect = true
    let index = test.rows[0].tests.findIndex((t) => t.id === val.testId)
    forEach(val.variants, (vr) => {
      if (index !== -1) {
        let variantIndex = test.rows[0].tests[index].variants.some(
          (v) => v.id === vr.id && !v.correct
        )

        if (test.rows[0].tests[index].multiple) {
          if (variantIndex) {
            allCorrect = false
            return
          } else {
            if (val.variants.length > 1) {
              let filetered = test.rows[0].tests[index].variants.filter(
                (v) => v.correct
              )
              let tempArray = [...filetered]
              filetered.forEach((v) => {
                if (val.variants.some((vl) => vl.id === v.id)) tempArray.pop()
              })
              if (allCorrect && tempArray.length === 0) {
                count++
              }
              allCorrect = false
              return
            }

            count++
          }
        } else {
          if (
            test.rows[0].tests[index].variants.some(
              (v) => v.id === vr.id && v.correct
            )
          ) {
            count++
          }
        }
      }
    })
  })

  if (idNotFound || uniqueVariantId.size !== 0 || modifiedData) {
    return { ok: false }
  }
  return { ok: true, data: { count } }
}

module.exports = validateData
