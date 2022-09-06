function colorCheck(answers,test,variant){
    return test.multiple ? (answers.some(answer => answer.testId === test.id && test.variants.some(tv=> tv.id === variant.id && tv.correct))  
    ? "lime" : 
    answers.some(answer => answer.testId === test.id && answer.variants.some(v=> v.id !== variant.id && variant.correct))  
    ? "red"   : 
    answers.some(answer => answer.testId === test.id && answer.variants.some(v=> v.id === variant.id && !variant.correct)) ? "red" :"") :

    answers.some(answer => answer.testId === test.id && answer.variants.some(v=> v.id === variant.id && variant.correct))
    ? "lime": answers.some(answer => answer.testId === test.id && answer.variants.some(v=> v.id === variant.id && !variant.correct))
    ? "red":  answers.some(answer => answer.testId === test.id && test.variants.some(tv=> tv.id === variant.id && tv.correct) )
    ? "lime": ""
}

export default colorCheck