function isCorrect(list,test,variant){
    return list.length ? list.some(answer => answer.testId === test.id && answer.variants.some(v=> v.id === variant.id)):false
}
export default isCorrect